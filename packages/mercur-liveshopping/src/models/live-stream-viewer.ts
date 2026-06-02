import { model } from "@medusajs/framework/utils"
import LiveStream from "./live-stream"

const LiveStreamViewer = model.define("LiveStreamViewer", {
  id: model.id({ prefix: "lsvw" }).primaryKey(),
  stream: model.belongsTo(() => LiveStream, {
    mappedBy: "viewers",
  }),
  customer_id: model.text().index().nullable(),
  join_at: model.dateTime(),
  leave_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default LiveStreamViewer
