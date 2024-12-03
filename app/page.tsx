'use client'

import { useEffect, useState } from 'react'
import { Metadata } from "next"
import { Layout } from "@/components/layout"
import { NowPlaying } from "@/components/now-playing"
import { Auth } from "@/components/auth"
import { supabase } from '@/lib/supabase'

export const metadata: Metadata = {
  title: "Spotify Profile",
  description: "See what I'm currently listening to on Spotify",
}

export default function HomePage() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tighter">Spotify Profile</h1>
        {session ? (
          <NowPlaying />
        ) : (
          <Auth />
        )}
      </div>
    </Layout>
  )
}