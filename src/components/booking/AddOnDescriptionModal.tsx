import { Card } from '../common/Card';
import { AddOn } from '../../types/booking';

interface AddOnDescriptionModalProps {
  addOn: AddOn;
  onClose: () => void;
}

const ADD_ON_DESCRIPTIONS: Record<AddOn, { title: string; description: string; icon: string; includes: string[] }> = {
  oven: {
    title: 'Oven Clean',
    icon: '🔥',
    description: 'A deep clean of your oven, including the interior, exterior, and glass door.',
    includes: [
      'Interior deep clean',
      'Remove baked-on residue',
      'Clean glass door thoroughly',
      'Exterior wipe down',
      'Racks and trays cleaned',
    ],
  },
  fridge: {
    title: 'Fridge Clean',
    icon: '❄️',
    description: 'Professional cleaning of your fridge to ensure food safety and freshness.',
    includes: [
      'Empty and sanitize all shelves',
      'Clean interior walls',
      'Defrost and clean freezer',
      'Clean seals and gaskets',
      'Wipe down exterior',
    ],
  },
  windows: {
    title: 'Interior Windows',
    icon: '🪟',
    description: 'Comprehensive cleaning of all interior windows and window frames.',
    includes: [
      'Clean all window panes',
      'Wipe frames and sills',
      'Clean blinds/curtain rails',
      'Polish glass to shine',
      'Streak-free finish',
    ],
  },
  bedchange: {
    title: 'Bed Change',
    icon: '🛏️',
    description: 'Fresh bed linen change and mattress airing for a clean, fresh bed.',
    includes: [
      'Strip and replace bed linens',
      'Air mattress',
      'Fluff pillows',
      'Wash and fold used linens',
      'Tucked corners for neat finish',
    ],
  },
  productspack: {
    title: 'Products Pack',
    icon: '🧴',
    description: 'Premium eco-friendly cleaning products used during your service.',
    includes: [
      'Included in the price',
      'Eco-friendly formula',
      'Safe for all surfaces',
      'Professional grade supplies',
      'No harsh chemicals',
    ],
  },
  fullkit: {
    title: 'Full Kit',
    icon: '🧰',
    description: 'Complete supply of all equipment and products needed for a comprehensive clean.',
    includes: [
      'All cleaning solutions',
      'Microfiber cloths & mops',
      'Vacuum and carpet tools',
      'Bathroom supplies',
      'Window squeegee & tools',
      'Disinfectants and air fresheners',
    ],
  },
};

export function AddOnDescriptionModal({ addOn, onClose }: AddOnDescriptionModalProps) {
  const addOnInfo = ADD_ON_DESCRIPTIONS[addOn];

  if (!addOnInfo) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-lg">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{addOnInfo.icon}</span>
              <h2 className="text-2xl font-bold text-slate-900">{addOnInfo.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700 text-2xl"
            >
              ✕
            </button>
          </div>

          <p className="text-slate-700 mb-6">{addOnInfo.description}</p>

          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-slate-900 mb-3">What's Included:</h3>
            <ul className="space-y-2">
              {addOnInfo.includes.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <span className="text-brand-600 font-bold mt-0.5">✓</span>
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors"
          >
            Got it, thanks!
          </button>
        </Card>
      </div>
    </>
  );
}
