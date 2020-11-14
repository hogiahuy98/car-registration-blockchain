import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { User } from '../fabric/user/user.fabric';

export function authentication(req: Request, res: Response, next: NextFunction): any {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);
    const user = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = user;
    next();
}