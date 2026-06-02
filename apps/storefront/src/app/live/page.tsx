'use client'

import React from 'react'
import Link from 'next/link'

export default function LiveStreamsPage() {
  const [streams, setStreams] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchStreams() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_URL}/store/live-streams`)
        const data = await response.json()
        setStreams(data.live_streams || [])
      } catch (e) {
        console.error("Failed to fetch streams", e)
      } finally {
        setLoading(false)
      }
    }
    fetchStreams()
  }, [])

  if (loading) return <div className="p-10 text-center">Loading streams...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-black bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Live Shopping</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {streams.length === 0 ? (
          <div className="col-span-3 text-center py-20 text-gray-500">No active streams found.</div>
        ) : (
          streams.map(s => (
            <Link href={`/live/${s.id}`} key={s.id} className="group border rounded-xl overflow-hidden hover:shadow-lg transition">
              <div className="aspect-video bg-gray-200 relative">
                  {s.status === 'live' && (
                      <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">Live</span>
                  )}
                  {s.thumbnail && <img src={s.thumbnail} className="w-full h-full object-cover" alt="" />}
              </div>
              <div className="p-4">
                <h3 className="font-bold group-hover:text-blue-600 transition">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.seller_id}</p>
                <div className="mt-4 flex justify-between items-center text-xs">
                    {s.status === 'live' ? (
                        <span className="text-gray-600">👥 {s.viewers || 0} watching</span>
                    ) : (
                        <span className="text-blue-600 font-bold">{s.scheduled_at}</span>
                    )}
                    <div className="bg-black text-white px-4 py-1.5 rounded font-bold">Watch</div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
