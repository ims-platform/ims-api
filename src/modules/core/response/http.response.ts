import { Response } from 'express';

export class HttpResponse {
  static success(res: Response, data: unknown, details?: string): void {
    res.status(200).json({ success: true, data, details });
  }

  static created(res: Response, data: unknown, details?: string): void {
    res.status(201).json({ success: true, data, details });
  }

  static failure(res: Response, status: number, message: string, errors?: unknown): void {
    res.status(status).json({ success: false, message, errors });
  }
}
