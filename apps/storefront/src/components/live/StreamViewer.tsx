'use client'

import React, { useEffect, useRef, useState } from 'react'
import AgoraRTC, { IAgoraRTCClient, IRemoteVideoTrack } from 'agora-rtc-sdk-ng'
import AgoraRTM, { RTMClient } from 'agora-rtm-sdk'
import LiveChat from './LiveChat'
import PinnedProductOverlay from './PinnedProductOverlay'
import InStreamCheckout from './InStreamCheckout'

interface StreamViewerProps {
  streamId: string
  appId: string
  rtcToken: string
  rtmToken: string
  channelName: string
  userId: string
}

export default function StreamViewer({ streamId, appId, rtcToken, rtmToken, channelName, userId }: StreamViewerProps) {
  const [rtcClient, setRtcClient] = useState<IAgoraRTCClient | null>(null)
  const [rtmClient, setRtmClient] = useState<RTMClient | null>(null)
  const [remoteVideoTrack, setRemoteVideoTrack] = useState<IRemoteVideoTrack | null>(null)
  const [pinnedProduct, setPinnedProduct] = useState<any>(null)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const videoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const init = async () => {
      const client = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' })
      await client.join(appId, channelName, rtcToken, userId)
      setRtcClient(client)

      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType)
        if (mediaType === 'video') {
          setRemoteVideoTrack(user.videoTrack!)
        }
        if (mediaType === 'audio') {
          user.audioTrack?.play()
        }
      })

      const rtm = new AgoraRTM.RTM(appId, userId)
      await rtm.login()
      await rtm.subscribe(channelName)
      setRtmClient(rtm)

      rtm.on('message', (event: any) => {
          const data = JSON.parse(event.message)
          if (data.type === 'PRODUCT_PINNED') {
              setPinnedProduct(data.product)
          } else if (data.type === 'PRODUCT_UNPINNED') {
              setPinnedProduct(null)
          }
      })
    }

    init()

    return () => {
      rtcClient?.leave()
      rtmClient?.logout()
    }
  }, [appId, channelName, rtcToken, rtmToken, userId])

  useEffect(() => {
    if (remoteVideoTrack && videoRef.current) {
      remoteVideoTrack.play(videoRef.current)
    }
  }, [remoteVideoTrack])

  return (
    <div className="relative w-full h-[80vh] bg-black overflow-hidden rounded-lg">
      <div ref={videoRef} className="w-full h-full" />

      <div className="absolute top-4 left-4 z-10">
        <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold animate-pulse">LIVE</span>
      </div>

      <PinnedProductOverlay
        product={pinnedProduct}
        onBuyNow={() => setIsCheckoutOpen(true)}
      />

      <div className="absolute bottom-4 right-4 w-1/3 h-1/2">
        <LiveChat streamId={streamId} rtmClient={rtmClient} channelName={channelName} />
      </div>

      {isCheckoutOpen && (
        <InStreamCheckout
            product={pinnedProduct}
            onClose={() => setIsCheckoutOpen(false)}
        />
      )}
    </div>
  )
}
