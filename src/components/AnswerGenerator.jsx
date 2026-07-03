import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faWandMagicSparkles, faCircleCheck, faTriangleExclamation,
  faCopy, faSpinner, faUserCircle, faBriefcase, faListCheck
} from '@fortawesome/free-solid-svg-icons'

// Calls YOUR OWN backend instead of Groq directly, so the Groq API key
// never ships to the browser. See server/routes/groq.js below.
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
  if (!profile) return 'No profile info was provided — answer generically but professionally.'
  const parts = []
  if (profile.full_name) parts.push(`Name: ${profile.full_name}`)
  if (profile.skills) parts.push(`Skills: ${profile.skills}`)
  if (profile.bio) parts.push(`Bio: ${profile.bio}`)
  if (profile.resume_text) parts.push(`Resume excerpt: ${profile.resume_text.slice(0, 3000)}`)
  return parts.length ? parts.join('\n') : 'No profile info was provided — answer generically but professionally.'
}

function stripCodeFences(text) {
  return text.replace(/```json/gi, '').replace(/```/g, '').trim()
}

export default function AnswerGenerator({ profile }) {
  const [jobDetails, setJobDetails] = useState('')
  const [questions, setQuestions] = useState('')
  const [answers, setAnswers] = useState(null)
  const [rawFallback, setRawFallback] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedIndex, setCopiedIndex] = useState(null)

  const profileEmpty = !profile?.resume_text && !profile?.skills && !profile?.bio

  const handleGenerate = async () => {
    if (!questions.trim()) return
    setLoading(true)
    setError('')
    setAnswers(null)
    setRawFallback(null)

    const context = buildProfileContext(profile)
    const prompt = `You are helping a student answer questions on an internship application form.

Candidate background (treat as ground truth — do NOT invent details not present here):
${context}

Internship details:
${jobDetails || 'Not provided.'}

Application questions:
${questions}

STRICT RULES:
1. Do NOT fabricate any project, company, skill, or achievement not in the candidate background.
2. If a specific detail is missing, write honestly in general terms — never make something up.
3. Reference the company's specific mission or product where mentioned in job details.
4. Draw directly from the candidate's actual skills and background.
5. Keep answers concise (2–5 sentences) unless the question calls for more.

Return ONLY valid JSON, no markdown, no code fences:
[{"question": "...", "answer": "...", "grounded": true}]

Set "grounded" to true only if the answer references specific real details from the candidate background.`

    try {
      const raw = await callGroq(prompt)
      const parsed = JSON.parse(stripCodeFences(raw))
      if (Array.isArray(parsed) && parsed.length) {
        setAnswers(parsed)
      } else throw new Error('Unexpected format')
    } catch {
      try {
        const raw = await callGroq(prompt)
        setRawFallback(stripCodeFences(raw))
      } catch {
        setError('Could not generate answers right now. Try again in a moment.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text, i) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(i)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="max-w-5xl space-y-4">
      <div className="bg-white border border-gray-200 rounded-3xl p-7 space-y-6 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_12px_32px_-16px_rgba(0,0,0,0.08)]">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 shadow-[0_4px_14px_-2px_rgba(99,102,241,0.45)]">
            <FontAwesomeIcon icon={faWandMagicSparkles} className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-ink text-lg tracking-tight">Answer Generator</h2>
            <p className="text-sm text-gray-400 mt-0.5">Paste the job posting and application questions — get tailored answers based on your profile.</p>
          </div>
        </div>

        {profileEmpty && (
          <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
            <FontAwesomeIcon icon={faUserCircle} className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            Your profile is empty — answers will be generic. Fill in your profile with skills, bio, or resume for personalized output.
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold flex items-center justify-center shrink-0">1</span>
              <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                <FontAwesomeIcon icon={faBriefcase} className="w-3 h-3 text-gray-400" />
                Job posting / description
              </label>
            </div>
            <div className="relative">
              <textarea
                value={jobDetails}
                onChange={(e) => setJobDetails(e.target.value)}
                rows={7}
                placeholder="Paste the internship description, requirements, company info..."
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:border-indigo-300 transition resize-none text-gray-700 placeholder-gray-300 bg-gray-50/50"
              />
              {jobDetails && (
                <span className="absolute bottom-2.5 right-3.5 text-[10px] text-gray-300 font-medium">
                  {jobDetails.trim().split(/\s+/).length} words
                </span>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold flex items-center justify-center shrink-0">2</span>
              <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                <FontAwesomeIcon icon={faListCheck} className="w-3 h-3 text-gray-400" />
                Application questions
              </label>
            </div>
            <div className="relative">
              <textarea
                value={questions}
                onChange={(e) => setQuestions(e.target.value)}
                rows={7}
                placeholder={"e.g.\n1. Why do you want to work here?\n2. Describe a project you're proud of."}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:border-indigo-300 transition resize-none text-gray-700 placeholder-gray-300 bg-gray-50/50"
              />
              {questions && (
                <span className="absolute bottom-2.5 right-3.5 text-[10px] text-gray-300 font-medium">
                  {questions.trim().split(/\s+/).length} words
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleGenerate}
            disabled={loading || !questions.trim()}
            className="inline-flex items-center gap-2 bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:brightness-110 active:brightness-95 transition disabled:opacity-40 disabled:grayscale shadow-[0_6px_20px_-6px_rgba(99,102,241,0.55)]"
          >
            {loading
              ? <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
              : <FontAwesomeIcon icon={faWandMagicSparkles} className="w-4 h-4" />
            }
            {loading ? 'Generating...' : 'Generate Answers'}
          </button>
          {!questions.trim() && !loading && (
            <span className="text-xs text-gray-300">Add your application questions to continue</span>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
            <FontAwesomeIcon icon={faTriangleExclamation} className="w-3.5 h-3.5 shrink-0" />
            {error}
          </div>
        )}
      </div>

      {rawFallback && (
        <div className="bg-white border border-amber-200 rounded-2xl p-5">
          <p className="text-xs text-amber-700 font-semibold mb-2">Couldn't split into separate questions — raw output:</p>
          <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{rawFallback}</div>
        </div>
      )}

      {answers && (
        <div className="space-y-3">
          {answers.map((qa, i) => (
            <div
              key={i}
              className={`bg-white border border-gray-200 rounded-2xl p-5 pl-6 space-y-3 relative overflow-hidden border-l-[3px] ${
                qa.grounded ? 'border-l-green-400' : 'border-l-amber-400'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-ink text-sm leading-snug">{qa.question}</p>
                <span className={`shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg border ${
                  qa.grounded
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  <FontAwesomeIcon icon={qa.grounded ? faCircleCheck : faTriangleExclamation} className="w-3 h-3" />
                  {qa.grounded ? 'Based on your profile' : 'Generic'}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{qa.answer}</p>
              <button
                onClick={() => handleCopy(qa.answer, i)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition"
              >
                <FontAwesomeIcon icon={faCopy} className="w-3 h-3" />
                {copiedIndex === i ? 'Copied!' : 'Copy answer'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
