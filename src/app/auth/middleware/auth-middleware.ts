import type { Request, Response, NextFunction } from 'express';
import { verifyUserToken } from '../utils/token';



export function authenticationMiddleware() {
    return function (req: Request, res: Response, next: NextFunction) {
        const header = req.headers['authorization'];
        if (!header) {
            return next();
        }

        if (!header?.startsWith('Bearer')) {
            return res.status(400).json({
                error: 'authorization header must start with Bearer'
            })
        }

        const token = header.split(' ')[1];

        if (!token) {
            return res.status(400).json({
                error: 'authorization header must start with Bearer and be followed by a valid token!'
            })
        }

        try {
            const user = verifyUserToken(token);
            // @ts-ignore
            req.user = user;
            next();
        } catch (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
    }
}

export function restrictToAuthenticatedUsers() {
    return function (req: Request, res: Response, next: NextFunction) {
        // @ts-ignore
        if (!req.user) {
            return res.status(401).json({
                error: 'Unauthorized! Please provide a valid token to access this resource.'
            })
        }
        next();
    }
}