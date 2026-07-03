import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

export default function ProfileModal({ session, onClose }) {
  const [form, setForm] = useState({ full_name: '', skills: '', bio: '', resume_text: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [resumeFileName, setResumeFileName] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle()
      if (data) setForm({
        full_name: data.full_name || '',
        skills: data.skills || '',
        bio: data.bio || '',
        resume_text: data.resume_text || '',
      })
      setLoading(false)
    }
    load()
  }, [session.user.id])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setResumeFileName(file.name)
    setExtracting(true)

    try {
      const buffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise
      let text = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        text += content.items.map((item) => item.str).join(' ') + '\n'
      }
      setForm((f) => ({ ...f, resume_text: text.trim() }))
    } catch (err) {
      alert('Could not read that PDF. Try a different file, or paste your resume text below instead.')
    } finally {
      setExtracting(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .upsert({ user_id: session.user.id, ...form, updated_at: new Date().toISOString() })

    setSaving(false)
    if (error) { alert('Could not save profile.'); return }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-800">Your Profile</h2>
        <p className="text-xs text-gray-500 -mt-2">
          Used to personalize your follow-up drafts. Everything here is optional.
        </p>

        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : (
          <div className="space-y-3">
            <input
              name="full_name"
              placeholder="Your name"
              value={form.full_name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="skills"
              placeholder="Key skills (e.g. React, Python, SQL)"
              value={form.skills}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              name="bio"
              placeholder="Short bio / what you're looking for"
              value={form.bio}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />

            <div className="border border-dashed border-gray-300 rounded-lg p-3">
              <label className="text-xs font-semibold text-gray-600 block mb-2">
                Or upload your resume (PDF) — auto-fills details from it
              </label>
              <input type="file" accept="application/pdf" onChange={handleResumeUpload} className="text-xs" />
              {extracting && <p className="text-xs text-gray-400 mt-1">Reading PDF...</p>}
              {resumeFileName && !extracting && (
                <p className="text-xs text-green-700 mt-1">Loaded: {resumeFileName}</p>
              )}
            </div>

            {form.resume_text && (
              <details className="text-xs text-gray-500">
                <summary className="cursor-pointer font-semibold">Extracted resume text (editable)</summary>
                <textarea
                  name="resume_text"
                  value={form.resume_text}
                  onChange={handleChange}
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs mt-2"
                />
              </details>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="px-4 py-2 text-sm bg-lavender border border-ink text-indigo-950 rounded-lg hover:bg-purple-300 transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  )
}