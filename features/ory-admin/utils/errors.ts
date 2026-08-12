import {
  FetchError,
  Middleware,
  RequiredError,
  ResponseError,
} from "@ory/client-fetch"

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined
}

function parseErrorBody(body: string): string {
  try {
    const json = JSON.parse(body)

    // Ory standard: { "error": { "message": "...", "reason": "...", "code": ... } }
    const err = json?.error
    if (err && typeof err === "object") {
      const nested =
        asString(err.message) ||
        asString(err.reason) ||
        asString(err.error_description)
      if (nested) return nested
    }

    const direct =
      asString(json?.error_description) ||
      asString(json?.error) ||
      asString(json?.message) ||
      asString(json?.error_hint)
    if (direct) return direct

    return JSON.stringify(json)
  } catch {
    return body
  }
}

export async function toReadableError(e: unknown): Promise<Error> {
  if (e instanceof ResponseError) {
    const body = await e.response
      .clone()
      .text()
      .catch(() => "")
    return new Error(
      parseErrorBody(body) || `Request failed with status ${e.response.status}`,
    )
  }
  if (e instanceof FetchError) {
    const cause = e.cause instanceof Error ? e.cause.message : String(e.cause)
    return new Error(`Network error: ${cause}`)
  }
  if (e instanceof RequiredError) {
    return new Error(`Missing required parameter: ${e.field}`)
  }
  if (e instanceof Error) return e
  return new Error(String(e))
}

export const errorMiddleware: Middleware = {
  async post({ response }) {
    if (response.ok) return response
    throw await toReadableError(new ResponseError(response))
  },
  async onError({ error }) {
    throw await toReadableError(error)
  },
}
