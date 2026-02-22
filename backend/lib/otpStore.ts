// In-memory OTP store (would use Redis or similar in production)
// Use global to persist across Next.js hot reloads and route compilations
declare global {
  var otpStore: Record<string, { otp: number; expires: Date }> | undefined
}

export const otpStore: Record<string, { otp: number; expires: Date }> = 
  global.otpStore || (global.otpStore = {})
