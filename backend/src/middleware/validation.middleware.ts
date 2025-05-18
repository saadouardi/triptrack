import type { Request, Response, NextFunction } from "express"

export const validateRequestBody = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body)

    if (error) {
      res.status(400).json({
        message: "Validation error",
        details: error.details.map((detail: any) => detail.message),
      })
      return
    }

    next()
  }
}
