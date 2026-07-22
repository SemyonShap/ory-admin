export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { getOplConfig } =
      await import("./features/ory-admin/utils/oplRuntimeConfig")
    getOplConfig()
  }
}
