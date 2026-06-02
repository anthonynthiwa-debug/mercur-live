import { model } from "@medusajs/framework/utils"
import LiveStream from "./live-stream"

const LiveStreamMessage = model.define("LiveStreamMessage", {
  id: model.id({ prefix: "lsmsg" }).primaryKey(),
  stream: model.belongsTo(() => LiveStream, {
    mappedBy: "messages",
  }),
  customer_id: model.text().index().nullable(),
  seller_id: model.text().index().nullable(), // if message from host
  message: model.text(),
  timestamp: model.dateTime(),
  is_deleted: model.boolean().default(false),
  metadata: model.json().nullable(),
})

export default LiveStreamMessage
