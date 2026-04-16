export const launchPricingLogic = {
  services: {
    regularClean: {
      pricing: {
        "1-1": { weekly: 49, fortnightly: 50, monthly: 55 },
        "2-1": { weekly: 59, fortnightly: 60, monthly: 65 },
        "3-1": { weekly: 69, fortnightly: 70, monthly: 75 },
        "3-2": { weekly: 79, fortnightly: 80, monthly: 85 },
        "4-2": { weekly: 89, fortnightly: 90, monthly: 95 },
        "5-3": { weekly: 109, fortnightly: 110, monthly: 115 }
      },
      durationHours: {
        "1-1": 2.5,
        "2-1": 3.0,
        "3-1": 3.5,
        "3-2": 4.0,
        "4-2": 4.5,
        "5-3": 5.5
      },
      payoutRatePerHour: {
        weekly: 16,
        fortnightly: 16,
        monthly: 16.5
      },
      maintainedOnly: true,
      firstCleanRouting: "if_not_maintained_route_to_one_off_or_deep"
    },
    oneOffClean: {
      pricing: {
        "1-1": 59,
        "2-1": 69,
        "3-1": 79,
        "3-2": 89,
        "4-2": 99,
        "5-3": 119
      },
      durationHours: {
        "1-1": 2.75,
        "2-1": 3.25,
        "3-1": 3.75,
        "3-2": 4.25,
        "4-2": 4.75,
        "5-3": 5.75
      },
      payoutRatePerHour: 17,
      conditionUplift: {
        standard: 0,
        heavy: 0.15,
        neglected: "route_to_deep"
      }
    },
    deepClean: {
      pricing: {
        "1-1": 115,
        "2-1": 139,
        "3-1": 165,
        "3-2": 189,
        "4-2": 219,
        "5-3": 269
      },
      durationHours: {
        "1-1": 4.5,
        "2-1": 5.5,
        "3-1": 6.5,
        "3-2": 7.5,
        "4-2": 8.5,
        "5-3": 10.5
      },
      payoutRatePerHour: 18,
      conditionUplift: {
        heavy: 0.15,
        severe: 0.30,
        specialist: "manual_review"
      }
    },
    endOfTenancy: {
      pricing: {
        "studio-1": 175,
        "1-1": 205,
        "2-1": 260,
        "2-2": 295,
        "3-1": 325,
        "3-2": 355,
        "4-2": 395,
        "5-3": 465
      },
      labourHours: {
        "studio-1": 6,
        "1-1": 7,
        "2-1": 9.5,
        "2-2": 11,
        "3-1": 12,
        "3-2": 13,
        "4-2": 15,
        "5-3": 18
      },
      payoutRatePerHour: 18,
      manualReviewFlags: [
        "nicotine_staining",
        "mould_treatment",
        "rubbish_removal",
        "severe_pet_hair",
        "biohazard",
        "flea_treatment",
        "post_build_dust",
        "high_clutter_furnished_home"
      ]
    }
  },
  addOns: {
    oven: { customerPrice: 25, extraHours: 0.75, cleanerPayout: 18 },
    fridge: { customerPrice: 12, extraHours: 0.33, cleanerPayout: 8 },
    interiorWindowsSmall: { customerPrice: 15, extraHours: 0.5, cleanerPayout: 10 },
    interiorWindowsMedium: { customerPrice: 25, extraHours: 0.75, cleanerPayout: 17 },
    interiorWindowsLarge: { customerPrice: 35, extraHours: 1.0, cleanerPayout: 24 },
    bedChangePerBed: { customerPrice: 6, extraHours: 0.17, cleanerPayout: 4 }
  },
  supplies: {
    customerProvides: { customerPrice: 0, cleanerPayout: 0 },
    cleanerProducts: {
      small: { customerPrice: 5, cleanerPayout: 4 },
      medium: { customerPrice: 7, cleanerPayout: 6 },
      large: { customerPrice: 9, cleanerPayout: 8 }
    },
    cleanerFullKit: {
      small: { customerPrice: 12, cleanerPayout: 10 },
      medium: { customerPrice: 15, cleanerPayout: 13 },
      large: { customerPrice: 18, cleanerPayout: 16 }
    }
  },
  extraBathroomRule: {
    regularClean: { customerUplift: 10, extraHours: 0.5, cleanerPayoutUplift: 7 },
    oneOffClean: { customerUplift: 10, extraHours: 0.5, cleanerPayoutUplift: 7 },
    deepClean: { customerUplift: 20, extraHours: 0.75, cleanerPayoutUplift: 14 },
    endOfTenancy: { customerUplift: 30, extraHours: 1.0, cleanerPayoutUplift: 18 }
  },
  bookingRules: {
    minimumLeadTimeHours: 24,
    maxInstantBookBedrooms: 5,
    maxInstantBookBathrooms: 3,
    sameDayLaunchEnabled: false,
    sundayLaunchEnabled: false
  },
  cancellations: {
    over24Hours: { customerFeeRate: 0, cleanerPayoutRateOfFee: 0 },
    between12And24Hours: { customerFeeRate: 0.25, cleanerPayoutRateOfFee: 0.4 },
    under12HoursOrNoShow: { customerFeeRate: 0.5, cleanerPayoutRateOfFee: 0.5 }
  }
} as const;
