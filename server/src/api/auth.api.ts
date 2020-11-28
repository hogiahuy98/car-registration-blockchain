import { Router, Request, Response } from 'express';
import { User, registerUser, getUserByPhoneNumber, getId } from '../fabric/user/User.fabric';
import * as bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import * as jwt from 'jsonwebtoken';
import { FABRIC_ERROR_CODE } from '../constant';

const router = Router();

const jwt_secret = process.env.JWT_SECRET || "blockchain";



router.post('/registry/citizen',async (req: Request, res: Response) => {
    try {
        const citizen: User = {
            id: nanoid(),
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


router.post('/registry/police',async (req: Request, res: Response) => {
    try {
        const citizen: User = {
            id: nanoid(),
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
    try {
        const user = await getUserByPhoneNumber(req.body.phoneNumber);
        if(typeof user === 'undefined') return res.send({ success: false, message: "Số điện thoại hoặc mật khẩu không đúng" });
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
    } catch (error) {
        console.log(error);
        if (error === FABRIC_ERROR_CODE.IDENTITY_NOT_FOUND_IN_WALLET)
            return res.status(403).send({
                success: false,
                message: "Incorrect identity card or password"
            })
    }
});


export default router;
