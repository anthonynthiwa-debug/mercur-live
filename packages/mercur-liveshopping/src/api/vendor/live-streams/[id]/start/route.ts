import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework"
import { LIVE_SHOPPING_MODULE } from "../../../../../index"

export const POST = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const liveShoppingService: any = req.scope.resolve(LIVE_SHOPPING_MODULE)
  const { id } = req.params

  const stream = await liveShoppingService.startStream(id)

  const tokens = await liveShoppingService.generateAgoraToken(
      stream.channel_name,
      req.auth_context.actor_id,
      "host"
  )

  res.json({ stream, tokens })
}
