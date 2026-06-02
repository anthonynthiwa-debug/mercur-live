'use client'

import React, { useState, useEffect, useRef } from 'react'
import { RTMClient } from 'agora-rtm-sdk'

interface LiveChatProps {
  streamId: string
  rtmClient: RTMClient | null
  channelName: string
}

export default function LiveChat({ streamId, rtmClient, channelName }: LiveChatProps) {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!rtmClient) return

    const handleMessage = (event: any) => {
        const data = JSON.parse(event.message)
        if (data.type === 'CHAT_MESSAGE') {
            setMessages(prev => [...prev, data.payload])
        }
    }

    rtmClient.on('message', handleMessage)
    return () => {
        rtmClient.off('message', handleMessage)
    }
  }, [rtmClient])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !rtmClient) return

    const msg = {
        type: 'CHAT_MESSAGE',
        payload: {
            user: 'Me',
            text: input,
            timestamp: Date.now()
        }
    }

    await rtmClient.publish(channelName, JSON.stringify(msg))
    setMessages(prev => [...prev, msg.payload])
    setInput('')
  }

  return (
    <div className="flex flex-col h-full bg-black/50 backdrop-blur-md rounded-lg p-4 text-white">
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-2 mb-4 scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className="text-sm">
            <span className="font-bold mr-2">{m.user}:</span>
            <span>{m.text}</span>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Say something..."
          className="flex-1 bg-white/20 rounded px-2 py-1 outline-none text-sm"
        />
        <button type="submit" className="bg-blue-600 px-3 py-1 rounded text-sm">Send</button>
      </form>
    </div>
  )
}
