import { Module } from "@medusajs/framework/utils"
import LiveStreamService from "./services/service"

export const LIVE_SHOPPING_MODULE = "liveShoppingModule"

export default Module(LIVE_SHOPPING_MODULE, {
  service: LiveStreamService,
})
