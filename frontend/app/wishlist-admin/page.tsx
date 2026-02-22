"use client"

import React, { useEffect, useState } from "react"

interface Movie {
  title: string
  language: string
  genres: string[]
  poster: string | null
}

const WishlistAdminPage = () => {
  const [wishlist, setWishlist] = useState<Movie[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWishlist = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      setError("No token found. Please login.")
      setLoading(false)
      return
    }
    try {
      const res = await fetch("/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Failed to fetch wishlist")
      const data = await res.json()
      if (data.success && data.wishlist) {
        setWishlist(data.wishlist)
      } else {
        setError("Failed to load wishlist")
      }
    } catch (err) {
      setError("Error fetching wishlist")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (title: string) => {
    const token = localStorage.getItem("token")
    if (!token) {
      setError("No token found. Please login.")
      return
    }
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
      } else {
        setError("Failed to remove movie")
      }
    } catch (err) {
      setError("Error removing movie")
      console.error(err)
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [])

  if (loading) return <div>Loading wishlist...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Wishlist Admin</h1>
      {wishlist.length === 0 ? (
        <p>No movies in wishlist.</p>
      ) : (
        <ul>
          {wishlist.map((movie) => (
            <li key={movie.title} style={{ marginBottom: "1rem" }}>
              <strong>{movie.title}</strong> ({movie.language})<br />
              Genres: {movie.genres.join(", ")}<br />
              {movie.poster && <img src={movie.poster} alt={movie.title} style={{ width: "100px" }} />}<br />
              <button onClick={() => removeFromWishlist(movie.title)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default WishlistAdminPage
