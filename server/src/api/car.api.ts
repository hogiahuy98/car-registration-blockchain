import { Router, Request, Response, request } from 'express';
import moment from 'moment';
import {registryCar,
        getAllCars,
        Car,
        getProcesscingCars,
        acceptCarRegistration,
        rejectCarRegistration,
        getCarById,
        isOwnerOfCar, 
        requestChangeOwner,
        queryCars,
        getHistoryOfCar,
        approveTransferDeal
} from '../fabric/car/Car.fabric';
import { nanoid } from 'nanoid';
import { authentication } from '../middleware/auth.middleware';
import { getUserById } from '../fabric/user/User.fabric';

const router = Router();

// /car/ POST
router.post('/', authentication, async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const car: Car = {
            id: nanoid(),
            brand: req.body.brand,
            color: req.body.color,
            model: req.body.model,
            year: req.body.year,
            owner: req.user.id,
            chassisNumber: req.body.chassisNumber,
            engineNumber: req.body.engineNumber,
            capality: req.body.capality,
        }
        const registryResult = await registryCar(car, userId);
        return res.json({ ...registryResult });
    } catch (error) {
        res.sendStatus(400);
    }
})

router.get('/', authentication, async (req: Request, res: Response) => {
    const id = req.user.id;
    const cars = await getAllCars(id);
    if(!cars.result.cars || cars.result.cars.length === 0) return res.sendStatus(404)
    const result = await Promise.all(cars.result.cars.map(async (state: { Record: any; }) => {
        const car = state.Record;
        const user = await getUserById(car.owner);
        delete user.password
        car.owner = user;
        
        return car;
    }))
    console.log(result)
    res.json(result);
});

router.get('/checkEngineNumber', authentication, async (req: Request, res: Response) => {
    const engineNumber = req.query.en;
    const queryString: any = {};
    queryString.selector = {
        docType: 'car',
        engineNumber
    }
    try {
        const results = await queryCars(req.user.id, JSON.stringify(queryString));
        if (results.length === 0) {
            return res.send({ valid: true});
        }
        else return res.send({ valid: false });
    } catch (error) {
        console.log(error);
        return res.send( { valid: false });
    }
})


router.get('/checkChassisNumber', authentication, async (req: Request, res: Response) => {
    const chassisNumber = req.query.cn;
    const queryString: any = {};
    queryString.selector = {
        docType: 'car',
        chassisNumber: chassisNumber
    }
    try {
        const results = await queryCars(req.user.id, JSON.stringify(queryString));
        if (results.length === 0) {
            return res.send({ valid: true});
        }
        else return res.send({ valid: false });
    } catch (error) {
        console.log(error);
        return res.send( { valid: false });
    }
});

router.get('/pending', authentication, async (req: Request, res: Response) => {
    if (req.user.role !== "police") {
        return res.sendStatus(401);
    }
    const identityCardNumber = req.user.identityCardNumber;
    const queryResult = await getProcesscingCars(identityCardNumber);
    if (!queryResult.success) {
        return res.status(404);
    }
    return res.json(queryResult.result);
});

router.post('/transfer/:dealId/approveTransfer/', authentication, async (req: Request, res: Response) => {
    try {
        const TxID = await approveTransferDeal(req.user.id, req.params.dealId);
        if(typeof TxID === 'undefined') return res.send({ success: false })
        else return res.send({ success: true, TxID})
    } catch (error) {
        console.log(error);
        return res.send({ success: false });
    }
})

router.get('/:id', authentication, async (req: Request, res: Response) => {
    const queryString: any = {};
    queryString.selector = {
        docType: 'car',
        id: req.params.id
    }
    const result = await queryCars(req.user.id, JSON.stringify(queryString));
    res.json(result[0]);
});

router.get('/:id/history', authentication, async (req: Request, res: Response) => {
    const id = req.user.id;
    const carHistory = await getHistoryOfCar(id, req.params.id)
    res.send(carHistory);
})

router.put('/:id/acceptRegistration/', authentication, async (req: Request, res: Response) => {
    if (req.user.role !== 'police') {
        return res.sendStatus(401);
    }
    const id = req.user.id;
    const acceptRegistrationResult = await acceptCarRegistration(req.params.id, req.body.registrationNumber, id);
    if (!acceptRegistrationResult.success) {
        console.log(acceptRegistrationResult);
        return res.sendStatus(403);
    }
    else {
        return res.json({ TxID: acceptRegistrationResult.result.TxID });
    }
});


router.put('/:carId/rejectRegistration/', authentication, async (req: Request, res: Response) => {
    if (req.user.role !== 'police') {
        return res.sendStatus(401);
    }
    const identityCardNumber = req.user.identityCardNumber;
    const acceptRegistrationResult = await rejectCarRegistration(req.params.carId, req.body.registrationNumber, identityCardNumber);
    if (!acceptRegistrationResult.success) {
        console.log(acceptRegistrationResult);
        return res.sendStatus(403);
    }
    else {
        return res.json({ TxID: acceptRegistrationResult.result.TxID });
    }
});



router.post('/:carId/transferOwnership', authentication, async (req: Request, res: Response) =>{
    const carId = req.params.carId;
    const userId = req.user.id;
    const newOwner = req.body.newOwner;
    const isOwnerCar = await isOwnerOfCar(req.params.carId, req.user.id);
    if (!isOwnerCar.result.isOwner) return res.sendStatus(401);
    
    const requestResult = await requestChangeOwner(carId, newOwner, userId);

    if(requestResult.success) return res.send(requestResult.result)
    else return res.sendStatus(403);
});





export default router;