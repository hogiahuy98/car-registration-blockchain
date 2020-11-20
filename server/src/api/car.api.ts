import { Router, Request, Response, request } from 'express';
import {registryCar,
        getAllCars,
        Car,
        getProcesscingCars,
        acceptCarRegistration,
        rejectCarRegistration,
        getCarById,
        isOwnerOfCar, 
        requestChangeOwner,
        queryCars} from '../fabric/car/Car.fabric';
import uid from 'uid';
import { authentication } from '../middleware/auth.middleware'

const router = Router();

// /car/ POST
router.post('/', authentication, async (req: Request, res: Response) => {
    try {
        const userPhoneNumber = req.user.phoneNumber;
        const car: Car = {
            id: uid(16),
            brand: req.body.brand,
            color: req.body.color,
            model: req.body.model,
            year: req.body.year,
            owner: req.user.phoneNumber,
            chassisNumber: req.body.chassisNumber,
            engineNumber: req.body.engineNumber,
            capality: req.body.capality,
        }
        const registryResult = await registryCar(car, userPhoneNumber);
        return res.json({ ...registryResult });
    } catch (error) {
        res.sendStatus(400);
    }
})


router.get('/checkEngineNumber', authentication, async (req: Request, res: Response) => {
    const engineNumber = req.query.en;
    const queryString: any = {};
    queryString.selector = {
        docType: 'car',
        engineNumber
    }
    try {
        const results = await queryCars(req.user.phoneNumber, JSON.stringify(queryString));
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
        const results = await queryCars(req.user.phoneNumber, JSON.stringify(queryString));
        if (results.length === 0) {
            return res.send({ valid: true});
        }
        else return res.send({ valid: false });
    } catch (error) {
        console.log(error);
        return res.send( { valid: false });
    }
})

/*  /car/ GET */
router.get('/', authentication, async (req: Request, res: Response) => {
    const identityCardNumber = req.user.identityCardNumber;
    const cars = await getAllCars(identityCardNumber);
    if(!cars.result.cars || cars.result.cars.length === 0) {
        return res.sendStatus(404)
    }
    res.json(cars.result);
});


router.get('/:id', authentication, async (req: Request, res: Response) => {
    const identityCardNumber = req.user.identityCardNumber;
    const car = await getCarById(identityCardNumber, req.params.id);
    if(!car.result.car){
        return res.sendStatus(404)
    }
    res.json(car.result);
});



router.get('/pending/', authentication, async (req: Request, res: Response) => {
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


router.put('/:id/acceptRegistration/', authentication, async (req: Request, res: Response) => {
    if (req.user.role !== 'police') {
        return res.sendStatus(401);
    }
    const identityCardNumber = req.user.identityCardNumber;
    const acceptRegistrationResult = await acceptCarRegistration(req.params.id, req.body.registrationNumber, identityCardNumber);
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


router.post('/:carId/changeOwnership', authentication, async (req: Request, res: Response) =>{
    const carId = req.params.carId;
    const userId = req.user.id;
    const identityCardNumber = req.user.identityCardNumber;
    const newOwner = req.body.newOwner
    const isOwnerCar = await isOwnerOfCar(req.params.carId, req.user.id, req.user.identityCardNumber);
    console.log(isOwnerCar);
    if (!isOwnerCar.result.isOwner){
        return res.sendStatus(401);
    }
    const requestResult = await requestChangeOwner(carId, identityCardNumber, newOwner, userId);
    if(requestResult.success) {
        return res.send(requestResult.result)
    }
    else return res.sendStatus(403);
});




export default router;