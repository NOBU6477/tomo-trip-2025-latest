import { Request, Response, NextFunction } from 'express';

// エラーハンドリングミドルウェア
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('エラーが発生しました:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'サーバーエラーが発生しました';
  
  res.status(statusCode).json({
    error: {
      message,
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    },
  });
}

// 存在しないエンドポイントのためのミドルウェア
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    error: {
      message: 'リクエストされたリソースが見つかりません',
    },
  });
}