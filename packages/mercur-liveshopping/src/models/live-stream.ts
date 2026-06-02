import { model } from "@medusajs/framework/utils"
import LiveStreamProductPin from "./live-stream-product-pin"
import LiveStreamViewer from "./live-stream-viewer"
import LiveStreamMessage from "./live-stream-message"

export const LiveStreamStatus = {
  SCHEDULED: "scheduled",
  LIVE: "live",
  PAUSED: "paused",
  ENDED: "ended",
}

const LiveStream = model.define("LiveStream", {
  id: model.id({ prefix: "lstr" }).primaryKey(),
  seller_id: model.text().index(),
  title: model.text().searchable(),
  description: model.text().nullable(),
  scheduled_at: model.dateTime().nullable(),
  started_at: model.dateTime().nullable(),
  ended_at: model.dateTime().nullable(),
  status: model.enum(Object.values(LiveStreamStatus)).default(LiveStreamStatus.SCHEDULED),
  channel_name: model.text().unique(),
  recording_id: model.text().nullable(),
  vod_url: model.text().nullable(),
  co_host_ids: model.json().nullable(), // Array of seller IDs
  settings: model.json().nullable(), // Agora settings, etc.
  metadata: model.json().nullable(),
  pins: model.hasMany(() => LiveStreamProductPin, {
    mappedBy: "stream",
  }),
  viewers: model.hasMany(() => LiveStreamViewer, {
    mappedBy: "stream",
  }),
  messages: model.hasMany(() => LiveStreamMessage, {
    mappedBy: "stream",
  }),
})

export default LiveStream
