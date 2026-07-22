const isServer = typeof window === "undefined";

export const getEnv = (name: string) =>
  isServer
    ? (process.env[name] ?? process.env[`NEXT_PUBLIC_${name}`])
    : process.env[`NEXT_PUBLIC_${name}`];

export const requiredUrl = (envName: string): string => {
  const url = getEnv(envName);
  if (!url) throw new Error(`Missing required env var: ${envName}`);
  return url.replace(/\/$/, "");
};

export const adminUrl = () => requiredUrl("ADMIN_URL");
