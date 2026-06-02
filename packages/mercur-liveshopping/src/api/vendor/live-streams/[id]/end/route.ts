import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework"
import { LIVE_SHOPPING_MODULE } from "../../../../../index"

export const POST = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const liveShoppingService: any = req.scope.resolve(LIVE_SHOPPING_MODULE)
  const { id } = req.params

  const stream = await liveShoppingService.endStream(id)

  res.json({ stream })
}
