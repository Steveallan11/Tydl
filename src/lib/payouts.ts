import { supabase } from './supabase';
import { getPayoutsByStatus, createCleanerPayout, addPayoutItem, updateCleanerPayoutStatus } from './supabase';

interface WeeklyPayoutSummary {
  cleanerId: string;
  cleanerName: string;
  totalJobs: number;
  totalAmount: number;
  jobDetails: Array<{
    bookingId: string;
    jobFinancialsId: string;
    customerName: string;
    serviceType: string;
    payout: number;
    actualDuration: number;
  }>;
}

/**
 * Generate weekly payouts for all cleaners
 * Run this every Friday evening automatically
 */
export async function generateWeeklyPayouts(): Promise<WeeklyPayoutSummary[]> {
  try {
    const payoutSummaries: WeeklyPayoutSummary[] = [];

    // Get all completed jobs from this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { data: completedJobs, error: jobsError } = await supabase
      .from('bookings')
      .select(`
        id,
        cleaner_id,
        customer_id,
        status,
        service_type,
        scheduled_date,
        scheduled_time,
        total_price,
        customer:customers(first_name, last_name),
        job_financials:job_financials(
          id,
          customer_payment,
          cleaner_payout
        ),
        time_entries:time_entries(
          actual_duration,
          actual_start_time,
          actual_end_time
        )
      `)
      .eq('status', 'completed')
      .gte('updated_at', weekAgo.toISOString())
      .order('cleaner_id');

    if (jobsError) throw jobsError;

    // Group jobs by cleaner
    const jobsByCleanerId: Record<string, any[]> = {};
    completedJobs?.forEach(job => {
      if (job.cleaner_id) {
        if (!jobsByCleanerId[job.cleaner_id]) {
          jobsByCleanerId[job.cleaner_id] = [];
        }
        jobsByCleanerId[job.cleaner_id].push(job);
      }
    });

    // Generate payout for each cleaner
    for (const [cleanerId, jobs] of Object.entries(jobsByCleanerId)) {
      const totalAmount = jobs.reduce((sum, job) => {
        return sum + (job.job_financials?.[0]?.cleaner_payout || 0);
      }, 0);

      // Get cleaner name
      const { data: cleaner } = await supabase
        .from('cleaners')
        .select('first_name, last_name')
        .eq('id', cleanerId)
        .single();

      const cleanerName = cleaner ? `${cleaner.first_name} ${cleaner.last_name}` : 'Unknown';

      // Create payout batch
      const payoutPeriodStart = weekAgo.toISOString().split('T')[0];
      const payoutPeriodEnd = new Date().toISOString().split('T')[0];

      const payout = await createCleanerPayout(cleanerId, {
        payout_period_start: payoutPeriodStart,
        payout_period_end: payoutPeriodEnd,
        total_amount: totalAmount,
        num_jobs: jobs.length,
      });

      // Add each job as a payout item
      for (const job of jobs) {
        const jobFinancialsId = job.job_financials?.[0]?.id;
        if (jobFinancialsId) {
          await addPayoutItem(payout.id, {
            booking_id: job.id,
            job_financials_id: jobFinancialsId,
            amount: job.job_financials[0].cleaner_payout,
          });
        }
      }

      // Build summary
      payoutSummaries.push({
        cleanerId,
        cleanerName,
        totalJobs: jobs.length,
        totalAmount,
        jobDetails: jobs.map(job => ({
          bookingId: job.id,
          jobFinancialsId: job.job_financials?.[0]?.id || '',
          customerName: `${job.customer.first_name} ${job.customer.last_name}`,
          serviceType: job.service_type,
          payout: job.job_financials?.[0]?.cleaner_payout || 0,
          actualDuration: job.time_entries?.[0]?.actual_duration || 0,
        })),
      });
    }

    return payoutSummaries;
  } catch (error: any) {
    console.error('Error generating weekly payouts:', error);
    throw error;
  }
}

/**
 * Get pending payouts for admin approval
 */
export async function getPendingPayouts() {
  try {
    const payouts = await getPayoutsByStatus('pending');

    return payouts?.map(payout => ({
      id: payout.id,
      cleanerId: payout.cleaner_id,
      periodStart: payout.payout_period_start,
      periodEnd: payout.payout_period_end,
      totalAmount: payout.total_amount,
      numJobs: payout.num_jobs,
      status: payout.status,
      createdAt: payout.created_at,
    })) || [];
  } catch (error: any) {
    console.error('Error getting pending payouts:', error);
    return [];
  }
}

/**
 * Approve a payout batch (admin action)
 */
export async function approvePayout(payoutId: string): Promise<boolean> {
  try {
    await updateCleanerPayoutStatus(payoutId, 'approved');
    return true;
  } catch (error: any) {
    console.error('Error approving payout:', error);
    return false;
  }
}

/**
 * Mark payout as processed (after manual transfer)
 */
export async function markPayoutProcessed(payoutId: string, referenceNumber: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('cleaner_payouts')
      .update({
        status: 'processed',
        processed_date: new Date().toISOString(),
        reference_number: referenceNumber,
      })
      .eq('id', payoutId);

    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error marking payout as processed:', error);
    return false;
  }
}

/**
 * Generate manual transfer list for bank transfers
 */
export async function generateTransferList(payoutIds: string[]) {
  try {
    const { data: payouts, error } = await supabase
      .from('cleaner_payouts')
      .select(`
        id,
        cleaner_id,
        total_amount,
        payout_period_start,
        payout_period_end,
        cleaner:cleaners(
          id,
          first_name,
          last_name,
          email
        ),
        cleaner_bank_details:cleaner_bank_details(
          account_holder_name,
          sort_code,
          account_number
        )
      `)
      .in('id', payoutIds)
      .eq('status', 'approved');

    if (error) throw error;

    // Format as transfer CSV
    const transfers = payouts?.map(payout => ({
      cleanerName: `${payout.cleaner.first_name} ${payout.cleaner.last_name}`,
      amount: payout.total_amount,
      sortCode: payout.cleaner_bank_details?.[0]?.sort_code || '',
      accountNumber: payout.cleaner_bank_details?.[0]?.account_number || '',
      accountHolder: payout.cleaner_bank_details?.[0]?.account_holder_name || '',
      reference: `TYDL-${payout.id.slice(0, 8).toUpperCase()}`,
      period: `${payout.payout_period_start} to ${payout.payout_period_end}`,
    })) || [];

    return transfers;
  } catch (error: any) {
    console.error('Error generating transfer list:', error);
    return [];
  }
}

/**
 * Export payouts as CSV for spreadsheet
 */
export function exportPayoutsAsCSV(payouts: WeeklyPayoutSummary[]): string {
  const headers = ['Cleaner', 'Total Amount', 'Jobs Count', 'Period'];
  const rows = payouts.map(p => [p.cleanerName, `£${p.totalAmount.toFixed(2)}`, p.totalJobs, '']);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  return csv;
}

/**
 * Schedule weekly payout generation (Friday 6 PM)
 * Note: This should be set up in a backend cron job
 */
export function scheduleWeeklyPayouts() {
  // This is a placeholder - actual scheduling would be done server-side
  console.log(
    'Weekly payout generation should be scheduled via server-side cron job'
  );
  console.log('Recommended: Run generateWeeklyPayouts() every Friday at 6 PM UTC');
}
