import { useState, useEffect } from 'react'

const emptyForm = {
  company: '',
  role: '',
  date_applied: '',
  status: 'applied',
  job_link: '',
  notes: '',
  recruiter_email: '',
}

export default function ApplicationForm({ onSubmit, onClose, initial }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (initial) setForm({ ...emptyForm, ...initial })
    else setForm(emptyForm)
  }, [initial])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    if (!form.company || !form.role || !form.date_applied) {
      alert('Company, role, and date applied are required.')
      return
    }
    onSubmit(form)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-800">
          {initial ? 'Edit Application' : 'Add Application'}
        </h2>

        <div className="space-y-3">
          <input
            name="company"
            placeholder="Company *"
            value={form.company}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="role"
            placeholder="Role *"
            value={form.role}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="date_applied"
            type="date"
            value={form.date_applied}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="rejected">Rejected</option>
            <option value="offer">Offer</option>
          </select>
          <input
            name="job_link"
            placeholder="Job link (optional)"
            value={form.job_link}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="recruiter_email"
            type="email"
            placeholder="Recruiter email (optional — e.g. from Apollo)"
            value={form.recruiter_email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="notes"
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {initial ? 'Save Changes' : 'Add Application'}
          </button>
        </div>
      </div>
    </div>
  )
}