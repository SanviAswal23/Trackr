import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTriangleExclamation, faPenToSquare, faTrash,
  faPaperPlane, faArrowUpRightFromSquare, faSpinner
} from '@fortawesome/free-solid-svg-icons'
import EmailModal from './EmailModal'

const statusConfig = {
  applied:   { style: 'bg-blue-50 text-blue-700 border-blue-200',      dot: 'bg-blue-500',   label: 'Applied' },
  interview: { style: 'bg-amber-50 text-amber-700 border-amber-200',   dot: 'bg-amber-500',  label: 'Interview' },
  rejected:  { style: 'bg-red-50 text-red-700 border-red-200',         dot: 'bg-red-500',    label: 'Rejected' },
  offer:     { style: 'bg-green-50 text-green-700 border-green-200',   dot: 'bg-green-500',  label: 'Offer' },
}

function daysSince(dateStr) {
  return Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24))
}

function emailTemplateFallback(company, role, days, profile) {
  const name = profile?.full_name ? '\n\n' + profile.full_name : ''
  return 'Hi,\n\nI hope you are doing well. I wanted to follow up on my application for the ' + role + ' position at ' + company + ', which I submitted ' + days + ' days ago. I remain very interested in the opportunity and would love to hear about any updates.\n\nPlease let me know if there is any additional information I can provide.\n\nBest regards' + name
}

function linkedinTemplateFallback(company, role, days, profile) {
  const name = profile?.full_name ? ' — ' + profile.full_name : ''
  return 'Hi! I recently applied for the ' + role + ' role at ' + company + ' (about ' + days + ' days ago) and wanted to reach out directly. I am really excited about the opportunity and would love to connect.' + name
}

// Calls YOUR OWN backend instead of Groq directly, so the Groq API key
// never ships to the browser. See server/routes/groq.js.
async function callGroq(prompt) {
  const res = await fetch('/api/groq', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }]
    })
  })
  if (!res.ok) throw new Error('Groq request failed')
  const data = await res.json()
  const text = data.choices?.[0]?.message?.content
  if (!text) throw new Error('No content returned')
  return text
}

function buildProfileContext(profile) {
  if (!profile) return ''
  const parts = []
  if (profile.full_name) parts.push('My name is ' + profile.full_name + '.')
  if (profile.skills) parts.push('My key skills: ' + profile.skills + '.')
  if (profile.bio) parts.push('About me: ' + profile.bio + '.')
  if (profile.resume_text) parts.push('Relevant resume excerpt: ' + profile.resume_text.slice(0, 600) + '.')
  return parts.length ? '\n\nContext about me:\n' + parts.join(' ') : ''
}

async function generateFollowUps(company, role, days, profile) {
  const context = buildProfileContext(profile)
  const emailPrompt = 'Write a short, polite follow-up email from a student to a recruiter at ' + company + ' for the role of ' + role + '. It has been ' + days + ' days since applying. Under 150 words, professional and friendly. No subject line. No sign-off or name at the end.' + context
  const linkedinPrompt = 'Write a short LinkedIn DM from a student following up on a ' + role + ' application at ' + company + ' submitted ' + days + ' days ago. Under 80 words, warm and direct. No sign-off or name at the end.' + context

  const [emailBody, linkedinBody] = await Promise.all([
    callGroq(emailPrompt).catch(() => null),
    callGroq(linkedinPrompt).catch(() => null)
  ])

  const name = profile?.full_name?.trim()
  return {
    email: emailBody
      ? emailBody.trim() + '\n\nBest regards,\n' + (name || '[Your Name]')
      : emailTemplateFallback(company, role, days, profile),
    linkedin: linkedinBody
      ? linkedinBody.trim() + (name ? ' — ' + name : '')
      : linkedinTemplateFallback(company, role, days, profile),
  }
}

export default function ApplicationCard({ app, profile, onEdit, onDelete }) {
  const days = daysSince(app.date_applied)
  const needsFollowUp = app.status === 'applied' && days > 10
  const [drafts, setDrafts] = useState(null)
  const [generating, setGenerating] = useState(false)
  const status = statusConfig[app.status] || statusConfig.applied

  const handleGenerate = async () => {
    setGenerating(true)
    const result = await generateFollowUps(app.company, app.role, days, profile)
    setDrafts(result)
    setGenerating(false)
  }

  const appliedDate = new Date(app.date_applied).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 transition hover:shadow-[0_1px_2px_rgba(0,0,0,0.03),0_16px_32px_-16px_rgba(0,0,0,0.1)] hover:border-gray-300 hover:-translate-y-0.5 duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-bold text-ink text-base tracking-tight truncate">{app.company}</h3>
          <p className="text-gray-400 text-sm truncate">{app.role}</p>
        </div>
        <span className={'inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ' + status.style}>
          <span className={'w-1.5 h-1.5 rounded-full ' + status.dot} />
          {status.label}
        </span>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-gray-400">
          {'Applied ' + appliedDate + ' · ' + days + 'd ago'}
        </p>
        {app.job_link && (
          <a
            href={app.job_link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-indigo-500 hover:text-indigo-700 transition"
          >
            View posting
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="w-2.5 h-2.5" />
          </a>
        )}
        {app.notes && (
          <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{app.notes}</p>
        )}
      </div>

      {needsFollowUp && (
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl">
          <FontAwesomeIcon icon={faTriangleExclamation} className="w-3 h-3" />
          Follow up needed
        </div>
      )}

      <div className="flex gap-2 flex-wrap pt-1 border-t border-gray-100 mt-1">
        <button
          onClick={() => onEdit(app)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 mt-3 border border-gray-200 text-gray-600 rounded-full hover:bg-gray-50 hover:border-gray-300 transition"
        >
          <FontAwesomeIcon icon={faPenToSquare} className="w-3 h-3" />
          Edit
        </button>
        <button
          onClick={() => onDelete(app.id)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 mt-3 border border-red-100 text-red-500 rounded-full hover:bg-red-50 hover:border-red-200 transition"
        >
          <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
          Delete
        </button>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 mt-3 bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-full hover:brightness-110 active:brightness-95 transition disabled:opacity-50 disabled:grayscale shadow-[0_4px_12px_-4px_rgba(99,102,241,0.5)] ml-auto"
        >
          <FontAwesomeIcon icon={generating ? faSpinner : faPaperPlane} className={'w-3 h-3' + (generating ? ' animate-spin' : '')} />
          {generating ? 'Generating...' : 'Follow-up'}
        </button>
      </div>

      {drafts && (
        <EmailModal
          drafts={drafts}
          recruiterEmail={app.recruiter_email}
          company={app.company}
          role={app.role}
          onClose={() => setDrafts(null)}
        />
      )}
    </div>
  )
}
