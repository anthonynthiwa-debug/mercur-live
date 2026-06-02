import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework"
import { LIVE_SHOPPING_MODULE } from "../../../index"

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const liveShoppingService: any = req.scope.resolve(LIVE_SHOPPING_MODULE)
  const [streams, count] = await liveShoppingService.listAndCountLiveStreams(
      req.filterableFields,
      req.listConfig
  )

  res.json({ streams, count })
}
