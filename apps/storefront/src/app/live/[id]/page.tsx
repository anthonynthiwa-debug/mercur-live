'use client'

import React, { useEffect, useState } from 'react'
import nextDynamic from 'next/dynamic'
import { client } from '@/lib/mercur'

const StreamViewer = nextDynamic(() => import('@/components/live/StreamViewer'), { ssr: false })

export const dynamic = 'force-dynamic'

export default function LiveStreamExperiencePage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const res = await client.store.liveStreams.$id.query({ $id: params.id })
        setData(res)
      } catch (e: any) {
        setError(e.message || "Failed to load live stream")
      } finally {
        setLoading(false)
      }
    }
    fetchStream()
  }, [params.id])

  if (loading) return <div className="flex h-screen items-center justify-center text-black bg-white">Loading live experience...</div>
  if (error) return <div className="flex h-screen items-center justify-center text-red-600 bg-white">{typeof error === 'string' ? error : 'An error occurred'}</div>
  if (!data?.stream) return <div className="flex h-screen items-center justify-center text-black bg-white">Stream not found.</div>

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
       <header className="bg-white border-b px-4 py-3 flex justify-between items-center text-black">
           <div className="flex items-center gap-4">
               <h1 className="font-bold text-lg">{String(data.stream.title)}</h1>
               {data.stream.status === 'live' && (
                   <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded font-bold animate-pulse">LIVE</span>
               )}
           </div>
           <button className="bg-gray-100 px-4 py-2 rounded text-sm font-bold hover:bg-gray-200 transition">Share</button>
       </header>

       <main className="flex-1 p-4 md:p-8">
           <div className="max-w-6xl mx-auto">
                {data.tokens && (
                    <StreamViewer
                        streamId={params.id}
                        appId={data.tokens.appId}
                        rtcToken={data.tokens.rtcToken}
                        rtmToken={data.tokens.rtmToken}
                        channelName={data.stream.channel_name}
                        userId={data.tokens.userId || `viewer_${Math.floor(Math.random() * 1000)}`}
                    />
                )}

                {!data.tokens && (
                    <div className="bg-black aspect-video rounded-lg flex items-center justify-center text-white">
                        Stream is not active yet.
                    </div>
                )}

                <div className="mt-8 bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-black">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{String(data.stream.title)}</h2>
                            <p className="text-gray-500">{String(data.stream.description || "Join the live shopping experience.")}</p>
                        </div>
                        <div className="text-right">
                             <div className="text-sm text-gray-400">Hosted by</div>
                             <div className="font-bold text-gray-900">Seller {String(data.stream.seller_id)}</div>
                        </div>
                    </div>
                </div>
           </div>
       </main>
    </div>
  )
}
