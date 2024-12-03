'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function MessageForm() {
  const [message, setMessage] = useState('')
  const [songUrl, setSongUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Extract Spotify track ID from URL
      const trackId = songUrl.split('/track/')[1]?.split('?')[0]
      
      if (!trackId) {
        throw new Error('Invalid Spotify URL')
      }

      const { error } = await supabase
        .from('messages')
        .insert([
          {
            content: message,
            spotify_track_id: trackId,
          }
        ])

      if (error) throw error

      // Reset form
      setMessage('')
      setSongUrl('')
    } catch (error) {
      console.error('Error submitting message:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Your Message</label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message here..."
          required
          className="min-h-[100px]"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Spotify Song URL</label>
        <Input
          type="url"
          value={songUrl}
          onChange={(e) => setSongUrl(e.target.value)}
          placeholder="https://open.spotify.com/track/..."
          pattern="https://open\.spotify\.com/track/[a-zA-Z0-9]+"
          required
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  )
}

