import type { Request, Response, NextFunction } from "express"

export const errorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error("Error:", error)

  const status = 500
  const message = error.message || "Something went wrong"

  res.status(status).json({
    status,
    message,
  })
}
