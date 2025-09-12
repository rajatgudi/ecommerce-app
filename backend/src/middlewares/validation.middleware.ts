import type {NextFunction, Request, Response} from 'express';
import {z} from 'zod';

export function validateData(schema: z.ZodObject<any, any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            return next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessages = error.issues.map((issue) => ({
                    message: `${issue.path.join('.')} ${issue.message}`,
                }));
                return res.status(400).json({error: 'Invalid data', details: errorMessages});
            }
            return res.status(500).json({error: 'Internal Server Error'});
        }
    };
}