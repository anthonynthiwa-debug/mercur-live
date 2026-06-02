import { MedusaService } from "@medusajs/framework/utils"
import LiveStream, { LiveStreamStatus } from "../models/live-stream"
import LiveStreamProductPin from "../models/live-stream-product-pin"
import LiveStreamViewer from "../models/live-stream-viewer"
import LiveStreamMessage from "../models/live-stream-message"
import SellerPushSubscription from "../models/seller-push-subscription"
import LiveStreamAnalyticsDaily from "../models/live-stream-analytics-daily"
import { RtcTokenBuilder, RtcRole, RtmTokenBuilder, RtmRole } from "agora-access-token"
import PushNotificationService from "./push-notification-service"

export default class LiveStreamService extends MedusaService({
  LiveStream,
  LiveStreamProductPin,
  LiveStreamViewer,
  LiveStreamMessage,
  SellerPushSubscription,
  LiveStreamAnalyticsDaily,
}) {
  protected agoraAppId: string
  protected agoraAppCertificate: string

  protected pushNotificationService_: PushNotificationService

  constructor({
    agoraAppId,
    agoraAppCertificate,
    pushNotificationService
  }: {
    agoraAppId: string,
    agoraAppCertificate: string,
    pushNotificationService: PushNotificationService
  }) {
    super(...arguments)
    this.agoraAppId = agoraAppId || process.env.AGORA_APP_ID || ""
    this.agoraAppCertificate = agoraAppCertificate || process.env.AGORA_APP_CERTIFICATE || ""
    this.pushNotificationService_ = pushNotificationService
  }

  async generateAgoraToken(channelName: string, userId: string | number, role: "host" | "viewer") {
    const expirationTimeInSeconds = 3600
    const currentTimestamp = Math.floor(Date.now() / 1000)
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

    const rtcRole = role === "host" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER
    const rtcToken = RtcTokenBuilder.buildTokenWithAccount(
      this.agoraAppId,
      this.agoraAppCertificate,
      channelName,
      userId.toString(),
      rtcRole,
      privilegeExpiredTs
    )

    const rtmToken = RtmTokenBuilder.buildToken(
      this.agoraAppId,
      this.agoraAppCertificate,
      userId.toString(),
      RtmRole.Rtm_User,
      privilegeExpiredTs
    )

    return { rtcToken, rtmToken, appId: this.agoraAppId }
  }

  async startStream(streamId: string) {
    const stream = await this.retrieveLiveStream(streamId)
    const streamResult = await this.updateLiveStreams({
        id: streamId,
        status: LiveStreamStatus.LIVE,
        started_at: new Date()
    })

    const updatedStream = Array.isArray(streamResult) ? streamResult[0] : streamResult

    const recordingData = await this.startCloudRecording(updatedStream.channel_name)
    if (recordingData) {
        await this.updateLiveStreams({
            id: streamId,
            recording_id: recordingData.resourceId,
            metadata: { sid: recordingData.sid }
        })
    }

    // Notify followers
    try {
        await this.pushNotificationService_.notifyFollowers(
            updatedStream.seller_id,
            "Live Now!",
            `${updatedStream.seller_id} just started a live stream: ${updatedStream.title}`,
            `/live/${streamId}`
        )
    } catch (e) {
        console.error("Failed to send start stream notifications", e)
    }

    return updatedStream
  }

  async endStream(streamId: string) {
    const stream = await this.retrieveLiveStream(streamId)
    const updatedResult = await this.updateLiveStreams({
        id: streamId,
        status: LiveStreamStatus.ENDED,
        ended_at: new Date()
    })

    const updated = Array.isArray(updatedResult) ? updatedResult[0] : updatedResult

    if (stream.recording_id) {
        await this.stopCloudRecording(stream.channel_name, stream.recording_id, (stream.metadata as any)?.sid)
    }

    return updated
  }

  async pinProduct(streamId: string, productId: string, variantId: string, flashDealData?: any) {
    const activePins = await this.listLiveStreamProductPins({
        stream_id: streamId,
        unpinned_at: null
    })

    if (activePins.length > 0) {
        await this.updateLiveStreamProductPins(activePins.map(p => ({ id: p.id, unpinned_at: new Date() })))
    }

    return await this.createLiveStreamProductPins({
        stream_id: streamId,
        product_id: productId,
        variant_id: variantId,
        pinned_at: new Date(),
        is_flash_deal: !!flashDealData,
        flash_deal_price: flashDealData?.price,
        flash_deal_quantity: flashDealData?.quantity,
        flash_deal_ends_at: flashDealData?.ends_at
    })
  }

  private async startCloudRecording(channelName: string) {
      try {
          const { rtcToken: recordingToken } = await this.generateAgoraToken(channelName, "1000", "host")

          const acquire = await fetch(`https://api.agora.io/v1/apps/${this.agoraAppId}/cloud_recording/acquire`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${Buffer.from(process.env.AGORA_REST_ID + ':' + process.env.AGORA_REST_SECRET).toString('base64')}` },
              body: JSON.stringify({
                  cname: channelName,
                  uid: "1000",
                  clientRequest: { resourceExpiredHour: 24 }
              })
          }).then(res => res.json())

          const start = await fetch(`https://api.agora.io/v1/apps/${this.agoraAppId}/cloud_recording/resourceId/${acquire.resourceId}/mode/mix/start`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${Buffer.from(process.env.AGORA_REST_ID + ':' + process.env.AGORA_REST_SECRET).toString('base64')}` },
              body: JSON.stringify({
                  cname: channelName,
                  uid: "1000",
                  clientRequest: {
                      token: recordingToken,
                      recordingConfig: {
                          maxIdleTime: 30,
                          streamTypes: 2,
                          audioProfile: 1,
                          channelType: 1,
                          videoStreamType: 0,
                          transcodingConfig: {
                              height: 640,
                              width: 360,
                              bitrate: 500,
                              fps: 15,
                              mixedVideoLayout: 1,
                              backgroundColor: "#000000"
                          }
                      },
                      storageConfig: {
                          vendor: 1,
                          region: 1,
                          bucket: process.env.S3_BUCKET,
                          accessKey: process.env.S3_ACCESS_KEY,
                          secretKey: process.env.S3_SECRET_KEY,
                          fileNamePrefix: ["live_replays", channelName]
                      }
                  }
              })
          }).then(res => res.json())

          return { resourceId: acquire.resourceId, sid: start.sid }
      } catch (e) {
          console.error("Failed to start Agora Cloud Recording", e)
          return null
      }
  }

  private async stopCloudRecording(channelName: string, resourceId: string, sid: string) {
      try {
          await fetch(`https://api.agora.io/v1/apps/${this.agoraAppId}/cloud_recording/resourceId/${resourceId}/sid/${sid}/mode/mix/stop`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${Buffer.from(process.env.AGORA_REST_ID + ':' + process.env.AGORA_REST_SECRET).toString('base64')}` },
              body: JSON.stringify({
                  cname: channelName,
                  uid: "1000",
                  clientRequest: {}
              })
          })
      } catch (e) {
          console.error("Failed to stop Agora Cloud Recording", e)
      }
  }
}
