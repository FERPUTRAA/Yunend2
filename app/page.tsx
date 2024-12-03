import { MessageForm } from '@/components/message-form'
import { MessageList } from '@/components/message-list'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">UnandfessXY</h1>
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <MessageForm />
          </div>
          <MessageList />
        </div>
      </div>
    </main>
  )
}

