import mongoose from "mongoose"

const WishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  language: String,
  genres: [String],
  poster: String,
})

WishlistSchema.index({ userId: 1, title: 1 }, { unique: true })

export default mongoose.models.Wishlist || mongoose.model("Wishlist", WishlistSchema)
