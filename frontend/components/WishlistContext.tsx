"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react"

interface Movie {
  title: string
  language: string
  genres: string[]
  poster: string | null
}

interface WishlistContextType {
  wishlist: Movie[]
  addToWishlist: (movie: Movie) => Promise<void>
  removeFromWishlist: (title: string) => Promise<void>
  isInWishlist: (title: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<Movie[]>([])

  const fetchWishlist = async () => {
    const token = localStorage.getItem("token")
    if (!token) return
    try {
      const res = await fetch("/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 401) {
        // Token expired or invalid, clear it
        localStorage.removeItem("token")
        setWishlist([])
        return
      }
      if (!res.ok) throw new Error("Failed to fetch wishlist")
      const data = await res.json()
      if (data.success && data.wishlist) {
        setWishlist(data.wishlist)
      }
    } catch (err) {
      console.error("Error fetching wishlist:", err)
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [])

  const addToWishlist = async (movie: Movie) => {
    const token = localStorage.getItem("token")
    if (!token) return
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(movie),
      })
      if (!res.ok) throw new Error("Failed to add to wishlist")
      const data = await res.json()
      if (data.success) {
        setWishlist((prev) => {
          if (prev.find((m) => m.title === movie.title)) return prev
          return [...prev, movie]
        })
      }
    } catch (err) {
      console.error("Error adding to wishlist:", err)
    }
  }

  const removeFromWishlist = async (title: string) => {
    const token = localStorage.getItem("token")
    if (!token) return
    try {
      const res = await fetch(`/api/wishlist?title=${encodeURIComponent(title)}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) throw new Error("Failed to remove from wishlist")
      const data = await res.json()
      if (data.success) {
        setWishlist((prev) => prev.filter((m) => m.title !== title))
      }
    } catch (err) {
      console.error("Error removing from wishlist:", err)
    }
  }

  const isInWishlist = (title: string) => {
    return wishlist.some((m) => m.title === title)
  }

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
