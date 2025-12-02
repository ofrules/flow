import { Request } from "express";

/**
 * Helper class, for storing Request Data
 */
export class RequestData {
  method: string;
  url: string;
  ip: string;
  headers: unknown;
  query: unknown;
  body: unknown;

  constructor(req: Request) {
    this.method = req.method;
    this.url = req.originalUrl;
    // NOTE: x-real-ip is from nginx reverse proxy
    this.ip = (req.header("x-real-ip") as string) ?? req.ip ?? "";
    this.headers = req.headers;
    this.query = req.query;
    this.body = req.body;
  }
}
