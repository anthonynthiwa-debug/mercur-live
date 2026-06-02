import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework"
import { LIVE_SHOPPING_MODULE } from "../../../index"

export const POST = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const liveShoppingService: any = req.scope.resolve(LIVE_SHOPPING_MODULE)
  const sellerId = req.auth_context.actor_id

  const stream = await liveShoppingService.createLiveStreams({
      ...req.body as any,
      seller_id: sellerId,
      channel_name: `live_${sellerId}_${Date.now()}`
  })

  res.json({ stream })
}

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const liveShoppingService: any = req.scope.resolve(LIVE_SHOPPING_MODULE)
  const sellerId = req.auth_context.actor_id

  const [streams, count] = await liveShoppingService.listAndCountLiveStreams({
      seller_id: sellerId
  })

  res.json({ streams, count })
}
