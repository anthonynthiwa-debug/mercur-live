'use client'

import React from 'react'

export default function PinnedProductOverlay({ product, onBuyNow }: { product: any, onBuyNow: () => void }) {
  if (!product) return null

  return (
    <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-80 bg-white rounded-lg shadow-xl p-4 flex gap-4 animate-slide-up text-black">
      <img src={product.thumbnail} alt={product.title} className="w-20 h-20 object-cover rounded" />
      <div className="flex-1">
        <h3 className="text-sm font-bold line-clamp-1">{product.title}</h3>
        <p className="text-blue-600 font-bold">${product.price}</p>
        <div className="mt-2 flex gap-2">
          <button
            onClick={onBuyNow}
            className="flex-1 bg-blue-600 text-white text-xs py-2 rounded font-bold hover:bg-blue-700 transition"
          >
            BUY NOW
          </button>
          <button className="bg-gray-100 p-2 rounded hover:bg-gray-200">
            🛒
          </button>
        </div>
      </div>
    </div>
  )
}
