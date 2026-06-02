'use client'

import React, { useState } from 'react'
import { client } from '@/lib/mercur'

export default function InStreamCheckout({ product, onClose }: { product: any, onClose: () => void }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)

  const handleAddToCart = async () => {
      setLoading(true)
      setError(null)
      try {
          // Get first available region to avoid hardcoded ID
          const regions = await (client.store as any).region.query()
          const regionId = regions.regions?.[0]?.id

          if (!regionId) throw new Error("No regions available")

          const { cart } = await (client.store as any).cart.mutate({ region_id: regionId })

          await (client.store as any).cart.$id.lineItems.mutate({
              $id: cart.id,
              variant_id: product.variant_id || product.id,
              quantity: 1
          })

          setStep(2)
      } catch (e: any) {
          setError(e.message || "Failed to add to cart")
      } finally {
          setLoading(false)
      }
  }

  const handleCompletePurchase = async () => {
      setLoading(true)
      try {
          setStep(3)
      } catch (e: any) {
          setError(e.message || "Payment failed")
      } finally {
          setLoading(false)
      }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="p-4 border-b flex justify-between items-center text-black">
          <h2 className="font-bold">Live Checkout</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">&times;</button>
        </div>

        <div className="p-6 text-black">
          {error && <div className="bg-red-50 text-red-600 p-2 rounded text-xs mb-4">{typeof error === 'string' ? error : 'Checkout error'}</div>}

          {step === 1 && (
            <div className="space-y-4">
               <div className="flex gap-4 items-center bg-gray-50 p-3 rounded">
                  <img src={product.thumbnail} className="w-12 h-12 rounded object-cover" />
                  <div>
                      <div className="text-sm font-bold">{product.title}</div>
                      <div className="text-xs text-gray-500">${product.price}</div>
                  </div>
               </div>
               <button
                onClick={handleAddToCart}
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded font-bold disabled:opacity-50"
               >
                 {loading ? 'Processing...' : 'Add to Cart & Checkout'}
               </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
                <div className="text-sm font-bold">Shipping & Payment</div>
                <input placeholder="Full Name" className="w-full border rounded p-2 text-sm" />
                <input placeholder="Address" className="w-full border rounded p-2 text-sm" />
                <div className="border rounded p-4 text-center text-gray-400 bg-gray-50 italic text-sm">
                    Stripe Elements Placeholder
                </div>
                <button
                    onClick={handleCompletePurchase}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded font-bold disabled:opacity-50"
                >
                    {loading ? 'Verifying...' : 'Pay Now'}
                </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="font-bold text-xl mb-2">Order Confirmed!</h3>
                <p className="text-sm text-gray-500 mb-6">You've successfully purchased {product.title}.</p>
                <button onClick={onClose} className="w-full bg-black text-white py-3 rounded font-bold">Return to Stream</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
