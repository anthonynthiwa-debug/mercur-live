import { model } from "@medusajs/framework/utils"

const SellerPushSubscription = model.define("SellerPushSubscription", {
  id: model.id({ prefix: "spsub" }).primaryKey(),
  seller_id: model.text().index(),
  customer_id: model.text().index(),
  subscription: model.json(), // JSON string of PushSubscription
  metadata: model.json().nullable(),
})

export default SellerPushSubscription
