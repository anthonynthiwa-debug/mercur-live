import { model } from "@medusajs/framework/utils"
import LiveStream from "./live-stream"

const LiveStreamProductPin = model.define("LiveStreamProductPin", {
  id: model.id({ prefix: "lspin" }).primaryKey(),
  stream: model.belongsTo(() => LiveStream, {
    mappedBy: "pins",
  }),
  product_id: model.text().index(),
  variant_id: model.text().index(),
  pinned_at: model.dateTime(),
  unpinned_at: model.dateTime().nullable(),
  is_flash_deal: model.boolean().default(false),
  flash_deal_price: model.bigNumber().nullable(),
  flash_deal_quantity: model.number().nullable(),
  flash_deal_ends_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default LiveStreamProductPin
