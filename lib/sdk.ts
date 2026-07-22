export const requiredUrl = (envName: string): string => {
  const url = process.env[envName]
  if (!url) throw new Error(`Missing required env var: ${envName}`)
  return url.replace(/\/$/, "")
}

export const adminUrl = () => requiredUrl("ADMIN_URL")
