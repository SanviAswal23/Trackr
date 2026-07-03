import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation, faCircleCheck } from '@fortawesome/free-solid-svg-icons'

export default function Hero({ onLogin }) {
  const mockApps = [
    { company: 'Notion', role: 'Frontend Intern', status: 'Interview', days: 5, color: 'bg-yellow-100 text-yellow-800' },
    { company: 'Figma', role: 'Product Design Intern', status: 'Applied', days: 14, color: 'bg-blue-100 text-blue-800', flag: true },
    { company: 'Linear', role: 'Software Intern', status: 'Offer', days: 22, color: 'bg-green-100 text-green-800' },
  ]

  return (
    <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 grid md:grid-cols-2 gap-12 items-center">
      <div className="space-y-7">
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          AI-powered job tracking
        </div>
        <h1 className="text-[2.6rem] font-bold leading-[1.15] tracking-tight text-[#1A1A1A]">
          Stop losing track of<br />
          <span className="text-indigo-500">where you applied.</span>
        </h1>
        <p className="text-gray-500 text-base leading-relaxed">
          Track applications, auto-flag stale ones, generate follow-up emails and LinkedIn messages, and answer application questions — all from one place.
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={onLogin}
            className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-neutral-800 transition"
          >
            <GoogleIcon />
            Sign in with Google
          </button>
          <span className="text-xs text-gray-400">Free · No credit card</span>
        </div>
        <div className="flex gap-5 pt-2">
          {[
            { icon: faCircleCheck, label: 'Chrome extension included' },
            { icon: faCircleCheck, label: 'Answer generator' },
            { icon: faCircleCheck, label: 'AI follow-ups' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-xs text-gray-400">
              <FontAwesomeIcon icon={item.icon} className="text-indigo-400 w-3 h-3" />
              {item.label}
            </div>
          ))}
        </div>
      </div>

      <div className="hidden md:block">
        <div className="bg-white border border-[#E0DDD5] rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-[#F7F6F2] border-b border-[#E0DDD5] px-4 py-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-600">My Applications</span>
            <div className="flex gap-3 text-xs">
              <span className="text-gray-400">3 total</span>
              <span className="text-red-500 font-medium flex items-center gap-1">
                <FontAwesomeIcon icon={faTriangleExclamation} className="w-3 h-3" />
                1 needs follow-up
              </span>
            </div>
          </div>
          <div className="p-3 space-y-2">
            {mockApps.map((app) => (
              <div key={app.company} className="bg-[#FAFAF8] border border-[#E8E5DE] rounded-xl px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">{app.company}</p>
                  <p className="text-xs text-gray-400">{app.role} · {app.days}d ago</p>
                  {app.flag && (
                    <span className="text-[10px] font-medium text-red-500 mt-0.5 flex items-center gap-1">
                      <FontAwesomeIcon icon={faTriangleExclamation} className="w-2.5 h-2.5" />
                      Follow up needed
                    </span>
                  )}
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${app.color}`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function GoogleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.3 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.3 6.1 29.4 4 24 4 16.2 4 9.5 8.5 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.7 13.6-4.7l-6.3-5.3C29.3 35.7 26.8 36.5 24 36.5c-5.2 0-9.6-3.5-11.2-8.3l-6.5 5C9.4 39.4 16.1 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.3 5.3C40.9 36.1 44 30.6 44 24c0-1.2-.1-2.4-.4-3.5z"/>
    </svg>
  )
}