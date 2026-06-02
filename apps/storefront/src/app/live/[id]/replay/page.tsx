'use client'

import React, { useEffect, useState, useRef } from 'react'
import { client } from '@/lib/mercur'

export const dynamic = 'force-dynamic'

export default function ReplayPage({ params }: { params: { id: string } }) {
  const [stream, setStream] = useState<any>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    client.store.liveStreams.$id.query({ $id: params.id }).then((res: any) => {
        setStream(res.stream)
    })
  }, [params.id])

  const handleTimeUpdate = () => {
      if (videoRef.current) {
          setCurrentTime(videoRef.current.currentTime)
      }
  }

  const getActivePin = () => {
      if (!stream?.pins || !stream.started_at) return null

      const startTime = new Date(stream.started_at).getTime()

      return stream.pins.find((pin: any) => {
          const pinOffset = (new Date(pin.pinned_at).getTime() - startTime) / 1000
          const unpinOffset = pin.unpinned_at
            ? (new Date(pin.unpinned_at).getTime() - startTime) / 1000
            : Infinity

          return currentTime >= pinOffset && currentTime < unpinOffset
      })
  }

  const activePin = getActivePin()

  if (!stream) return <div className="p-8 text-center text-gray-500">Loading replay...</div>

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 text-black bg-white">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">{stream.title} - Replay</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
              <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative border-4 border-white">
                  {stream.vod_url ? (
                      <video
                        ref={videoRef}
                        src={stream.vod_url}
                        controls
                        className="w-full h-full"
                        onTimeUpdate={handleTimeUpdate}
                      />
                  ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-white/50 space-y-2 bg-gradient-to-br from-gray-900 to-black">
                          <span className="text-4xl">🎬</span>
                          <span className="text-sm font-medium">Replay will be available shortly</span>
                      </div>
                  )}

                  {activePin && (
                      <div className="absolute bottom-12 right-6 w-64 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-white/20 animate-fade-in text-black">
                           <div className="flex gap-3">
                               <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0" />
                               <div className="flex-1 min-w-0">
                                   <div className="text-xs font-bold text-blue-600 mb-1 uppercase tracking-wider">Pinned Now</div>
                                   <div className="text-sm font-bold truncate">Product {activePin.product_id}</div>
                                   <button className="mt-2 w-full bg-black text-white text-[10px] py-1.5 rounded-lg font-bold hover:bg-gray-800 transition">
                                       View Details
                                   </button>
                               </div>
                           </div>
                      </div>
                  )}
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold mb-4">About this stream</h2>
                  <p className="text-gray-600 leading-relaxed">{stream.description || "No description provided."}</p>
              </div>
          </div>

          <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h2 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <span className="text-xl">🛍️</span> Featured Products
                  </h2>
                  <div className="space-y-4">
                      {stream.pins?.map((pin: any) => (
                          <div key={pin.id} className="group flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer border border-transparent hover:border-gray-100">
                              <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0" />
                              <div className="flex-1 min-w-0 py-1">
                                  <div className="text-sm font-bold text-gray-900 truncate">Product {pin.product_id}</div>
                                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                                       Featured at {Math.floor((new Date(pin.pinned_at).getTime() - new Date(stream.started_at).getTime()) / 1000)}s
                                  </div>
                              </div>
                              <div className="flex flex-col justify-center">
                                  <button className="bg-gray-900 text-white p-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition">
                                      Add
                                  </button>
                              </div>
                          </div>
                      ))}
                      {!stream.pins?.length && <div className="text-center py-8 text-gray-400 text-sm">No products featured in this stream.</div>}
                  </div>
              </div>
          </div>
      </div>
    </div>
  )
}
