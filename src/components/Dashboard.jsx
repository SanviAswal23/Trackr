import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import ApplicationCard from './ApplicationCard'
import ApplicationForm from './ApplicationForm'
import ProfileModal from './ProfileModal'
import AnswerGenerator from './AnswerGenerator'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus, faRightFromBracket, faUser,
  faTableCells, faWandMagicSparkles, faTriangleExclamation,
  faSpinner, faInbox
} from '@fortawesome/free-solid-svg-icons'

export default function Dashboard({ session }) {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingApp, setEditingApp] = useState(null)
  const [showProfile, setShowProfile] = useState(false)
  const [profile, setProfile] = useState(null)
  const [activeTab, setActiveTab] = useState('applications')

  useEffect(() => {
    fetchApplications()
    fetchProfile()
  }, [])

  const fetchApplications = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) console.error(error)
    else setApplications(data)
    setLoading(false)
  }

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .maybeSingle()
    setProfile(data)
    if (!data) setShowProfile(true) // no profile row yet — likely a brand-new signup
  }

  const handleAdd = async (form) => {
    const { error } = await supabase
      .from('applications')
      .insert([{ ...form, user_id: session.user.id }])
    if (error) { console.error(error); return }
    setShowForm(false)
    fetchApplications()
  }

  const handleEdit = async (form) => {
    const { error } = await supabase
      .from('applications')
      .update(form)
      .eq('id', editingApp.id)
    if (error) { console.error(error); return }
    setEditingApp(null)
    fetchApplications()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return
    const { error } = await supabase.from('applications').delete().eq('id', id)
    if (error) { console.error(error); return }
    fetchApplications()
  }

  const followUpCount = applications.filter(app => {
    const days = Math.floor((new Date() - new Date(app.date_applied)) / (1000 * 60 * 60 * 24))
    return app.status === 'applied' && days > 10
  }).length

  const tabs = [
    { id: 'applications', label: 'Applications', icon: faTableCells },
    { id: 'answers', label: 'Answer Generator', icon: faWandMagicSparkles },
  ]

  const userEmail = session.user.email

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <div className="bg-ink sticky top-0 z-40 shadow-[0_1px_0_rgba(255,255,255,0.06)]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-bold text-base text-white tracking-tight">
            trackr<span className="text-indigo-400">.</span>
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400 mr-2 hidden sm:block">{userEmail}</span>
            <button
              onClick={() => setShowProfile(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition"
            >
              <FontAwesomeIcon icon={faUser} className="w-3.5 h-3.5" />
              Profile
            </button>
            <button
              onClick={() => supabase.auth.signOut()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition"
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-7 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ink tracking-tight">Dashboard</h1>
            <div className="flex items-center gap-3 mt-1.5">
              <p className="text-sm text-gray-400">
                {applications.length} application{applications.length !== 1 ? 's' : ''}
              </p>
              {followUpCount > 0 && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                  <FontAwesomeIcon icon={faTriangleExclamation} className="w-3 h-3" />
                  {followUpCount} need follow-up
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-indigo-700 transition shrink-0"
          >
            <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
            Add Application
          </button>
        </div>

        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition ${
                activeTab === tab.id
                  ? 'bg-ink text-white'
                  : 'text-gray-500 hover:text-ink hover:bg-gray-50'
              }`}
            >
              <FontAwesomeIcon icon={tab.icon} className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'applications' && (
          loading ? (
            <div className="py-24 flex flex-col items-center gap-3 text-gray-400 text-sm">
              <FontAwesomeIcon icon={faSpinner} className="w-5 h-5 animate-spin text-indigo-400" />
              Loading applications...
            </div>
          ) : applications.length === 0 ? (
            <div className="py-24 flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faInbox} className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-ink font-semibold text-sm">No applications yet</p>
                <p className="text-gray-400 text-sm mt-0.5">Add your first one to start tracking follow-ups.</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-indigo-700 transition mt-1"
              >
                <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
                Add Application
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {applications.map(app => (
                <ApplicationCard
                  key={app.id}
                  app={app}
                  profile={profile}
                  onEdit={setEditingApp}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )
        )}

        {activeTab === 'answers' && <AnswerGenerator profile={profile} />}
      </div>

      {showForm && (
        <ApplicationForm onSubmit={handleAdd} onClose={() => setShowForm(false)} />
      )}
      {editingApp && (
        <ApplicationForm initial={editingApp} onSubmit={handleEdit} onClose={() => setEditingApp(null)} />
      )}
      {showProfile && (
        <ProfileModal session={session} onClose={() => { setShowProfile(false); fetchProfile() }} />
      )}
    </div>
  )
}
