import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

const decodeMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const code = (req.query.code || req.body.code) as string;
  if (!code) {
    return res.status(400).json({ error: "Empty code value" });
  }
  const secret = process.env.JWT_SECRET;
  try {
    const decoded = jwt.verify(code, secret);
    const body = req.body as Record<string, unknown>;
    req.body = Object.assign({}, body, decoded);
  } catch (codeError) {
    return res.status(400).json({
      error:
        (codeError as JsonWebTokenError).name === "TokenExpiredError"
          ? "Code has expired"
          : "Code is invalid",
    });
  }
  next();
};

export default decodeMiddleware;
