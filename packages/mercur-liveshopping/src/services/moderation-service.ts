import { MedusaService } from "@medusajs/framework/utils"
import LiveStreamMessage from "../models/live-stream-message"
import LiveStreamViewer from "../models/live-stream-viewer"

export default class LiveStreamModerationService extends MedusaService({
    LiveStreamMessage,
    LiveStreamViewer,
}) {
    async deleteMessage(messageId: string) {
        return await this.updateLiveStreamMessages({
            id: messageId,
            is_deleted: true
        })
    }

    async banViewer(streamId: string, customerId: string) {
        // Implementation for banning (e.g., adding to a blocklist in metadata)
        // This usually involves signaling via RTM to kick the user
    }
}
