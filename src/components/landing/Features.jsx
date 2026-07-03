import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTableList,
  faBolt,
  faUserPen,
  faPuzzlePiece,
} from '@fortawesome/free-solid-svg-icons'

const features = [
  {
    icon: faTableList,
    title: 'Track every application',
    description: 'Company, role, status, dates, recruiter email, notes — one dashboard. Auto-flags anything stale after 10 days.',
    tag: 'Dashboard',
  },
  {
    icon: faBolt,
    title: 'AI-generated follow-ups',
    description: 'Generates a formal email draft and a shorter LinkedIn message per application. Falls back to a solid template if the AI call fails — never breaks in a demo.',
    tag: 'AI',
  },
  {
    icon: faUserPen,
    title: 'Answer generator',
    description: 'Paste a job posting and its application questions — get tailored answers grounded in your actual profile and skills, not generic filler.',
    tag: 'AI',
  },
  {
    icon: faPuzzlePiece,
    title: 'Chrome extension',
    description: 'A floating button auto-appears on LinkedIn, Indeed, Internshala, Greenhouse, and Lever. Scrapes company and role, editable before saving. No separate sign-in — reads your existing session.',
    tag: 'Extension',
  },
]

const tagColors = {
  Dashboard: 'bg-blue-50 text-blue-600',
  AI: 'bg-indigo-50 text-indigo-600',
  Extension: 'bg-emerald-50 text-emerald-600',
}

export default function Features() {
  return (
    <section id="features" className="max-w-5xl mx-auto px-6 py-20 border-t border-[#E0DDD5]">
      <div className="mb-12">
        <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-2">Features</p>
        <h2 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">
          Everything from application to offer
        </h2>
        <p className="text-gray-400 text-sm mt-2 max-w-lg">
          Tracks where you applied, reminds you to follow up, writes your emails, and answers your application questions — all from one place.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {features.map((f) => (
          <div key={f.title} className="bg-white border border-[#E0DDD5] rounded-2xl p-6 hover:border-indigo-200 hover:shadow-sm transition group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-100 transition">
                <FontAwesomeIcon icon={f.icon} className="w-4 h-4" />
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${tagColors[f.tag]}`}>
                {f.tag}
              </span>
            </div>
            <h3 className="font-semibold text-[#1A1A1A] mb-1">{f.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}