import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import dbConnect from "../../../lib/mongodb"
import Wishlist from "../../../models/Wishlist"

async function verifyToken(request: Request) {
  const authHeader = request.headers.get("authorization")
  const token = authHeader && authHeader.split(" ")[1]
  if (!token) {
    return null
  }
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET not set")
    return null
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string }
    return decoded.userId
  } catch (err) {
    console.error("Token verification failed:", err)
    return null
  }
}

export async function GET(request: Request) {
  const userId = await verifyToken(request)
  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }
  try {
    await dbConnect()
    const wishlist = await Wishlist.find({ userId }).select("-_id title language genres poster").lean()
    return NextResponse.json({ success: true, wishlist })
  } catch (err) {
    console.error("Wishlist fetch error:", err)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const userId = await verifyToken(request)
  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }
  try {
    const body = await request.json()
    const { title, language, genres, poster } = body
    if (!title) {
      return NextResponse.json({ success: false, message: "Title is required" }, { status: 400 })
    }
    await dbConnect()
    const existing = await Wishlist.findOne({ userId, title })
    if (existing) {
      return NextResponse.json({ success: false, message: "Movie already in wishlist" }, { status: 409 })
    }
    const newItem = new Wishlist({ userId, title, language, genres, poster })
    await newItem.save()
    return NextResponse.json({ success: true, message: "Added to wishlist" })
  } catch (err) {
    console.error("Wishlist add error:", err)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const userId = await verifyToken(request)
  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get("title")
    if (!title) {
      return NextResponse.json({ success: false, message: "Title is required" }, { status: 400 })
    }
    await dbConnect()
    const deleted = await Wishlist.findOneAndDelete({ userId, title })
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Movie not found in wishlist" }, { status: 404 })
    }
    return NextResponse.json({ success: true, message: "Removed from wishlist" })
  } catch (err) {
    console.error("Wishlist delete error:", err)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
