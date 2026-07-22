import {
  configure,
  getConsoleSink,
  getLogger,
  LogRecord,
} from "@logtape/logtape"

const logLevel =
  (process.env.LOG_LEVEL as "debug" | "info" | "warning" | "error") || "info"

function customJsonFormatter(record: LogRecord) {
  const timestamp = new Date(record.timestamp).toISOString()
  const formattedRecord = {
    time: timestamp,
    level: record.level.toUpperCase(),
    message: record.message.join("."),
    logger: record.category.join("."),
    properties: serializeProperties(record.properties),
  }
  return JSON.stringify(formattedRecord) + "\n"
}

function serializeProperties(obj: unknown): unknown {
  if (obj === null || typeof obj !== "object") {
    return obj
  }
  if (obj instanceof Error) {
    return {
      name: obj.name,
      message: obj.message,
    }
  }
  if (Array.isArray(obj)) {
    return obj.map(serializeProperties)
  }
  const result: Record<string, unknown> = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = serializeProperties((obj as Record<string, unknown>)[key])
    }
  }
  return result
}

configure({
  sinks: {
    console: getConsoleSink({ formatter: customJsonFormatter }),
  },
  loggers: [
    {
      category: [],
      lowestLevel: logLevel,
      sinks: ["console"],
    },
    {
      category: ["app", "middleware"],
      lowestLevel: logLevel,
      sinks: ["console"],
    },
    {
      category: ["logtape", "meta"],
      lowestLevel: "warning",
      sinks: ["console"],
    },
  ],
  reset: true,
})

export const logger = getLogger(["app"])

export { getLogger }
