import { model } from "@medusajs/framework/utils"

const LiveStreamAnalyticsDaily = model.define("LiveStreamAnalyticsDaily", {
  id: model.id({ prefix: "lsad" }).primaryKey(),
  stream_id: model.text().index(),
  date: model.dateTime(),
  peak_viewers: model.number().default(0),
  total_views: model.number().default(0),
  total_messages: model.number().default(0),
  total_revenue: model.bigNumber().default(0),
  total_orders: model.number().default(0),
  metadata: model.json().nullable(),
})

export default LiveStreamAnalyticsDaily
