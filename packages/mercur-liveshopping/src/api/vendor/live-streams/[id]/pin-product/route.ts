import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework"
import { LIVE_SHOPPING_MODULE } from "../../../../../index"

export const POST = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const liveShoppingService: any = req.scope.resolve(LIVE_SHOPPING_MODULE)
  const { id } = req.params
  const { product_id, variant_id, flash_deal } = req.body as any

  const pin = await liveShoppingService.pinProduct(id, product_id, variant_id, flash_deal)

  res.json({ pin })
}

export const DELETE = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
    const liveShoppingService: any = req.scope.resolve(LIVE_SHOPPING_MODULE)
    const { pin_id } = req.body as any

    await liveShoppingService.unpinProduct(pin_id)

    res.status(204).send()
}
