import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      // console.log({ authToken: token });
      if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const token = authHeader?.split(" ")[1];

      const decoded = jwt.verify(
        token as string,
        config.JWT_SECRET as string
      ) as JwtPayload;

      req.user = {
        id: decoded.id,
        role: decoded.role,
      };

      if (roles.length && !roles.includes(decoded.role as string)) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      next();
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };
};

export default auth;
