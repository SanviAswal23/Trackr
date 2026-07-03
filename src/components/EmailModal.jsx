import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faXmark, faCopy, faEnvelopeOpen, faEnvelope, faComment
} from '@fortawesome/free-solid-svg-icons'

export default function EmailModal({ drafts, recruiterEmail, company, role, onClose }) {
  const [tab, setTab] = useState('email')
  const [copied, setCopied] = useState(false)

  const activeText = tab === 'email' ? drafts.email : drafts.linkedin

  const handleCopy = () => {
    navigator.clipboard.writeText(activeText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const subject = 'Following up: ' + role + ' at ' + company
  const mailtoHref = recruiterEmail
    ? 'mailto:' + recruiterEmail + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(drafts.email)
    : null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-ink">Follow-up Draft</h2>
            <p className="text-xs text-gray-400 mt-0.5">{company + ' · ' + role}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setTab('email')}
              className={'flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition ' + (tab === 'email' ? 'bg-white text-ink shadow-sm' : 'text-gray-500 hover:text-ink')}
            >
              <FontAwesomeIcon icon={faEnvelope} className="w-3 h-3" />
              Email
            </button>
            <button
              onClick={() => setTab('linkedin')}
              className={'flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition ' + (tab === 'linkedin' ? 'bg-white text-ink shadow-sm' : 'text-gray-500 hover:text-ink')}
            >
              <FontAwesomeIcon icon={faComment} className="w-3 h-3" />
              LinkedIn message
            </button>
          </div>

          {tab === 'email' && !recruiterEmail && (
            <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
              <FontAwesomeIcon icon={faEnvelopeOpen} className="w-3 h-3 mt-0.5 shrink-0" />
              No recruiter email saved — edit the application to add one and enable one-click send.
            </div>
          )}

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap max-h-64 overflow-y-auto leading-relaxed">
            {activeText}
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-xl transition"
          >
            Close
          </button>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-gray-300 text-ink rounded-xl hover:bg-gray-50 transition"
          >
            <FontAwesomeIcon icon={faCopy} className="w-3.5 h-3.5" />
            {copied ? 'Copied!' : 'Copy'}
          </button>
          {tab === 'email' && mailtoHref && (
            <a
              href={mailtoHref}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
            >
              <FontAwesomeIcon icon={faEnvelope} className="w-3.5 h-3.5" />
              Open in email client
            </a>
          )}
        </div>

      </div>
    </div>
  )
}
