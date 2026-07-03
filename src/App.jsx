import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Dashboard from './components/Dashboard'
import LandingPage from './components/LandingPage'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    )
    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F6F2]">
      <p className="text-sm text-gray-400">Loading...</p>
    </div>
  )

  if (!session) return <LandingPage onLogin={handleLogin} />

  return <Dashboard session={session} />
}