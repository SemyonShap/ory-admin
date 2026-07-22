import { configure, getConsoleSink, getLogger, LogRecord } from '@logtape/logtape';
import type { NextRequest } from 'next/server';

const logLevel = (process.env.LOG_LEVEL as 'debug' | 'info' | 'warning' | 'error') || 'info';

function customJsonFormatter(record: LogRecord) {
  const timestamp = new Date(record.timestamp).toISOString();
  const formattedRecord = {
    time: timestamp,
    level: record.level.toUpperCase(),
    message: record.message.join('.'),
    logger: record.category.join('.'),
    properties: serializeProperties(record.properties),
  };
  return JSON.stringify(formattedRecord) + '\n';
}

function serializeProperties(obj: unknown): unknown {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (obj instanceof Error) {
    return {
      name: obj.name,
      message: obj.message,
    };
  }
  if (Array.isArray(obj)) {
    return obj.map(serializeProperties);
  }
  const result: Record<string, unknown> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = serializeProperties((obj as Record<string, unknown>)[key]);
    }
  }
  return result;
}

configure({
  sinks: {
    console: getConsoleSink({ formatter: customJsonFormatter })
  },
  loggers: [
    {
      category: [],
      lowestLevel: logLevel,
      sinks: ['console']
    },
    {
      category: ['app', 'middleware'],
      lowestLevel: logLevel,
      sinks: ['console']
    },
    {
      category: ['logtape', 'meta'],
      lowestLevel: 'warning',
      sinks: ['console']
    }
  ],
  reset: true,
});

export const logger = getLogger(['app']);

function getSafeHeaders(headers: Headers): Record<string, string> {
  const allHeaders = Object.fromEntries(headers.entries());
  const isDev = process.env.NODE_ENV === 'development';
  if (!isDev) {
    const sensitiveKeys = ['authorization', 'cookie', 'x-api-key', 'set-cookie'];
    sensitiveKeys.forEach(key => delete allHeaders[key.toLowerCase()]);
  }
  return allHeaders;
}

function getRequestLogData(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwardedFor?.split(',')[0]?.trim() || realIp;
  const validIp = ip ? ip : 'unknown';
  
  return {
    headers: getSafeHeaders(request.headers),
    host: request.headers.get('host') || request.nextUrl.host,
    method: request.method,
    path: request.nextUrl.pathname,
    query: request.nextUrl.search ? request.nextUrl.search.slice(1) : null,
    remote: validIp,
    scheme: request.nextUrl.protocol.replace(':', ''),
  };
}

function getResponseLogData(response: Response) {
  const contentLength = response.headers.get('content-length');
  return {
    headers: getSafeHeaders(response.headers),
    size: contentLength ? parseInt(contentLength) : null,
    status: response.status,
    text_status: response.statusText || 'OK',
  };
}

export function logRequest(request: NextRequest) {
  const logger = getLogger(['app', 'middleware']);
  logger.info('HTTP Request', {
    http_request: getRequestLogData(request)
  });
}

export function logResponse(response: Response, type: string) {
  const logger = getLogger(['app', 'middleware']);
  logger.info(`HTTP Response (${type})`, {
    http_response: getResponseLogData(response)
  });
}

export function logRequestResponse(request: NextRequest, response: Response, type: string) {
  const logger = getLogger(['app', 'middleware']);
  logger.info(`HTTP Request and Response (${type})`, {
    http_request: getRequestLogData(request),
    http_response: getResponseLogData(response)
  });
}

export { getLogger };