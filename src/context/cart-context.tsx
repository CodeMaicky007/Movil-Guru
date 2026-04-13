"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export type CartItem = {
  id: number
  name: string
  price: number
  img: string
  color: string
  quantity: number
  tag?: string
}

const DEFAULT_ITEMS: CartItem[] = [
  {
    id: 1,
    name: "Funda Armor Kevlar",
    price: 34.90,
    img: "https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&w=400",
    color: "Negro militar",
    quantity: 1,
    tag: "Drop exclusivo",
  },
  {
    id: 2,
    name: "Cristal Templado 9H",
    price: 12.90,
    img: "https://images.pexels.com/photos/1038628/pexels-photo-1038628.jpeg?auto=compress&w=400",
    color: "Transparente",
    quantity: 2,
    tag: "Best seller",
  },
  {
    id: 4,
    name: "Auriculares Guru Buds",
    price: 79.00,
    img: "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&w=400",
    color: "Lima neón",
    quantity: 1,
    tag: "Edición Lima",
  },
]

type CartContextType = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, qty: number) => void
  clearCart: () => void
  total: number
  count: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(DEFAULT_ITEMS)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mg-cart")
      if (saved) setItems(JSON.parse(saved))
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) localStorage.setItem("mg-cart", JSON.stringify(items))
  }, [items, hydrated])

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeItem = (id: number) => setItems(prev => prev.filter(i => i.id !== id))

  const updateQuantity = (id: number, qty: number) => {
    if (qty < 1) { removeItem(id); return }
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i))
  }

  const clearCart = () => {
    setItems([])
    try { localStorage.removeItem("mg-cart") } catch {}
  }

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const count = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
