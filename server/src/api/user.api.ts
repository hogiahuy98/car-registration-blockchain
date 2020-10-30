import { Router, Request, Response } from 'express';
import { User, registerUser, getUserByIdentityCard, getId } from '../fabric/user/user.fabric';
import * as bcrypt from 'bcrypt';
import uid from 'uid';
import * as jwt from 'jsonwebtoken';

const router = Router();

const jwt_secret = process.env.JWT_SECRET || "blockchain";
const uidLen = 8;

router.get('/me', async (req: Request, res: Response) => {
    const rs = await getUserByIdentityCard(req.query.ic);
    res.send(rs);
})

router.post('/citizen',async (req: Request, res: Response) => {
    try {
        const citizen: User = {
            UID: uid(uidLen),
            fullName: req.body.fullName,
            phoneNumber: req.body.phoneNumber,
            dateOfBirth: req.body.dateOfBirth.toString(),
            password: bcrypt.hashSync(req.body.password, 5),
            identityCardNumber: req.body.identityCardNumber,
            role: "citizen",
            ward: req.body.ward
        }
    
        await registerUser(citizen);
        return res.status(201).json({
            success: true,
            message: `Dang ky thanh cong ${req.body.fullName}`
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send("error while register user");
    }

})


router.post('/police',async (req: Request, res: Response) => {
    try {
        const citizen: User = {
            UID: uid(uidLen),
            fullName: req.body.fullName,
            phoneNumber: req.body.phoneNumber,
            dateOfBirth: req.body.dateOfBirth.toString(),
            password: bcrypt.hashSync(req.body.password, 5),
            identityCardNumber: req.body.identityCardNumber,
            role: "police",
            ward: req.body.ward
        }
    
        await registerUser(citizen);
        return res.status(201).json({
            success: true,
            message: `Dang ky thanh cong ${req.body.fullName}`
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send("error while register user");
    }

});


router.post('/login', async (req: Request, res: Response) => {
    const user = await getUserByIdentityCard(req.body.identityCardNumber);
    const isCorrectPassword = await bcrypt.compare(req.body.password, user.Record.password);
    if(!isCorrectPassword) {
        const rs = {
            success: false,
            message: "Incorrect identity card or password"
        };
        return res.status(401).send(rs);
    }
    delete user.Record.password;
    const token = jwt.sign(user.Record, jwt_secret)
    const rs = {
        success: true,
        data: {
            user: user.Record,
            token: token
        }
    }
    res.status(200).json(rs);
});


export default router; 