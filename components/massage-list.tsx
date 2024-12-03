'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Card, CardContent } from '@/components/ui/card'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Message {
  id: number
  content: string
  spotify_track_id: string
  created_at: string
}

export function MessageList() {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    // Initial fetch
    fetchMessages()

    // Subscribe to new messages
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages' 
      }, (payload) => {
        setMessages(prev => [payload.new as Message, ...prev])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchMessages() {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching messages:', error)
      return
    }

    setMessages(data)
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Card key={message.id}>
          <CardContent className="p-4">
            <p className="mb-4">{message.content}</p>
            <iframe
              src={`https://open.spotify.com/embed/track/${message.spotify_track_id}`}
              width="100%"
              height="80"
              frameBorder="0"
              allow="encrypted-media"
              className="rounded"
            />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

