import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework"
import { LIVE_SHOPPING_MODULE } from "../../../../index"

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const liveShoppingService: any = req.scope.resolve(LIVE_SHOPPING_MODULE)
  const { id } = req.params

  const stream = await liveShoppingService.retrieveLiveStream(id, {
      relations: ["pins", "messages"]
  })

  let tokens = null
  if (stream.status === "live" || stream.status === "scheduled") {
      tokens = await liveShoppingService.generateAgoraToken(
          stream.channel_name,
          req.auth_context?.actor_id || `viewer_${Math.floor(Math.random() * 100000)}`,
          "viewer"
      )
  }

  res.json({ stream, tokens })
}
