import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGoogle,
  faChrome,
} from '@fortawesome/free-brands-svg-icons'
import {
  faClipboardList,
  faWandMagicSparkles,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons'

const steps = [
  {
    icon: faGoogle,
    title: 'Sign in with Google',
    description: 'No separate account to create. One click and your dashboard is ready.',
  },
  {
    icon: faChrome,
    title: 'Save jobs from anywhere',
    description: 'Use the Chrome extension on LinkedIn, Indeed, Internshala, and more — or add manually.',
  },
  {
    icon: faClipboardList,
    title: 'Build your profile',
    description: 'Add your skills, bio, and resume. This is what personalizes your AI output.',
  },
  {
    icon: faWandMagicSparkles,
    title: 'Generate and follow up',
    description: 'Draft follow-up emails, LinkedIn messages, and application answers in seconds.',
  },
  {
    icon: faPaperPlane,
    title: 'Send and track',
    description: 'Update statuses as you hear back. The dashboard shows your full pipeline at a glance.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="max-w-5xl mx-auto px-6 py-20 border-t border-[#E0DDD5]">
      <div className="mb-12">
        <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-2">How it works</p>
        <h2 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">From job listing to follow-up email in minutes</h2>
      </div>
      <div className="relative">
        {/* connector line */}
        <div className="hidden md:block absolute top-5 left-5 right-5 h-px bg-[#E0DDD5] z-0" />
        <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-6 relative z-10">
          {steps.map((s, i) => (
            <div key={s.title} className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E0DDD5] flex items-center justify-center text-indigo-500 shadow-sm">
                <FontAwesomeIcon icon={s.icon} className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-indigo-400 mb-0.5">Step {i + 1}</p>
                <h3 className="font-semibold text-[#1A1A1A] text-sm">{s.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed mt-1">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}