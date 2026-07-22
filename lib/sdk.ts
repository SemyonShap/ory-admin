export const requiredUrl = (envName: string): string => {
  const url = process.env[envName]
  if (!url) throw new Error(`Missing required env var: ${envName}`)
  return url.replace(/\/$/, "")
}

export const kratosAdminUrl = () => requiredUrl("KRATOS_ADMIN_URL")
export const hydraAdminUrl = () => requiredUrl("HYDRA_ADMIN_URL")
export const ketoReadUrl = () => requiredUrl("KETO_READ_URL")
export const ketoWriteUrl = () => requiredUrl("KETO_WRITE_URL")
