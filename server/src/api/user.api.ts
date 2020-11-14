import { Router, Request, Response } from 'express';
import { User, registerUser, getUserByIdentityCard, getId } from '../fabric/user/user.fabric';
import * as bcrypt from 'bcrypt';
import uid from 'uid';
import * as jwt from 'jsonwebtoken';
import { authentication } from '../middleware/auth.middleware';

const router = Router();

const jwt_secret = process.env.JWT_SECRET || "blockchain";
const uidLen = 8;

router.get('/me', authentication, async (req: Request, res: Response) => {
    console.log(req.user);
    res.send(req.user);
});




export default router; 