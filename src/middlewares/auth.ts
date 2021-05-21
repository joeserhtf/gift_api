import AuthService from "@src/services/auth";
import { Request, Response, NextFunction } from "express";

export function authMiddleware(req: Partial<Request>, res: Partial<Response>, next: NextFunction): void {
    const authorization = req.headers?.['authorization'];
    try {
        const decoded = AuthService.decodeToken(authorization as string);
        req.decoded = decoded;
        next();
    } catch (err) {
        res.status?.(401).send({ code: 401, error: err.message });
    }

}