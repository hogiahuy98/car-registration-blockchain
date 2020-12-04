import { Router, Request, Response } from 'express';
import { User, registerUser, getUserByPhoneNumber, getId, queryUser } from '../fabric/user/User.fabric';
import { authentication } from '../middleware/auth.middleware';
import { queryCars } from '../fabric/car/Car.fabric';

const router = Router();

const jwt_secret = process.env.JWT_SECRET || "blockchain";
const uidLen = 8;

router.get('/me', authentication, async (req: Request, res: Response) => {
    res.send(req.user);
});

router.get('/validateChangeOwner', authentication, async (req: Request, res: Response) => {
    const phoneNumber = req.query.pn;
    const fullName = req.query.n;
    if (typeof phoneNumber === 'undefined' || typeof fullName === 'undefined') return res.sendStatus(403);
    const queryString: any = {};
    queryString.selector = {
        docType: 'user',
        fullName: fullName,
        phoneNumber: phoneNumber,
    }
    try {
        const result = await queryUser(req.user.id, JSON.stringify(queryString));
        if(result.length > 0) return res.json({valid: true, newOwnerId: result[0].Record.id});
        else return res.json({valid: false});
    } catch (error) {
        console.log(error);
        return res.status(403);
    }
});

router.get('/:id', authentication, async (req: Request, res: Response) => {
    const queryResult: any = {}
    queryResult.selector = {
        docType: 'user',
        id: req.params.id
    }
    const result = await queryUser(req.user.id, JSON.stringify(queryResult));
    res.json(result[0]);
})

router.get('/:id/transferRequest', authentication, async (req: Request, res: Response) => {
    const queryResult: any = {}
    queryResult.selector = {
        docType: "transfer",
        newOwner: req.user.id,
        $or: [
            { state: 0 },
            { state: 1 },
        ],
    };
    const result = await queryCars(req.user.id, JSON.stringify(queryResult));
    res.json(result[0]);
})

router.get('/:id/cars/pending', authentication, async (req: Request, res: Response) => {
    try {
        if (req.user.role !== 'police' && req.user.id !== req.params.id){
            res.sendStatus(403);
        }
        const queryString: any = {};
        queryString.selector = {
            docType: 'car',
            owner: req.user.id,
            registrationState: 'pending'
        }
        const queryResult = await queryCars(req.user.id, JSON.stringify(queryString));
        res.json(queryResult);
    } catch (error) {
        console.log(error);
        res.send({error: true, msg: error.message});
    }
})

router.get('/:id/cars/registered', authentication, async (req: Request, res: Response) => {
    try {
        if (req.user.role !== 'police' && req.user.id !== req.params.id){
            res.sendStatus(403);
        }
        const queryString: any = {};
        queryString.selector = {
            docType: 'car',
            owner: req.user.id,
            $or: [
                {registrationState: 'registered'},
                {registrationState: 'transferring_ownership'}
            ]
        }
        const result = await queryCars(req.user.id, JSON.stringify(queryString));
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({error: true, msg: error.message});
    }
})


router.get('/:id/cars/transferring', authentication, async (req: Request, res: Response) => {
    try {
        if (req.user.role !== 'police' && req.user.id !== req.params.id){
            res.sendStatus(403);
        }
        const queryString: any = {};
        queryString.selector = {
            docType: 'transfer',
            currentOwner: req.params.id,
            state: 0
        }
        const result = await queryCars(req.user.id, JSON.stringify(queryString));
        if (result.length > 0) {
            const userQuery: any = {};
            userQuery.selector = {
                docType: 'user',
                id: result[0].Record.newOwner
            }
            const newOwner = await queryUser(req.user.id, JSON.stringify(userQuery));
            if (newOwner.length > 0) {
                result[0].newOwnerName = newOwner[0].Record.fullName;
                result[0].newOwnerPhoneNumber = newOwner[0].Record.phoneNumber;
            }
        }
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({error: true, msg: error.message});
    }
})




export default router; 