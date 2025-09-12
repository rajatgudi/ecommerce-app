import type {Request, Response} from "express"
import jwt from "jsonwebtoken"

// Simple JWT-protected route
export function requireJwt(req: Request, res: Response, next: any) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({message: 'Missing or invalid Authorization header'});
    }
    console.log('auth', auth)

    const token = auth.slice(7);
    console.log('token', token)
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);


        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({message: 'Invalid or expired token'});
    }
}