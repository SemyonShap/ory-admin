export const getEnv = (envName: string): string | undefined => {
  return process.env[envName]
}

export const requiredUrl = (envName: string): string => {
  const url = getEnv(envName)
  if (!url) throw new Error(`Missing required env var: ${envName}`)
  return url.replace(/\/$/, "")
}

export const oplPathEnv = () => getEnv("KETO_OPL_PATH")
export const oplUrlEnv = () => getEnv("KETO_OPL_URL")

export const kratosAdminUrl = () => requiredUrl("KRATOS_ADMIN_URL")
export const hydraAdminUrl = () => requiredUrl("HYDRA_ADMIN_URL")
export const ketoOplUrl = () => requiredUrl("KETO_OPL_URL")
export const ketoReadUrl = () => requiredUrl("KETO_READ_URL")
export const ketoWriteUrl = () => requiredUrl("KETO_WRITE_URL")
