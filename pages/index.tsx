import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import { Session } from '@supabase/supabase-js'
import Auth from '../components/Auth'
import Kyc from '../components/Kyc'

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      {!session ? <Auth /> : <Kyc key={session?.user?.id} session={session} />}
    </div>
  )
}