import { Router, Request, Response, request } from 'express';
import { registryCar, getAllCars, Car } from '../fabric/car/car.fabric'
import uid from 'uid';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
    const identityCardNumber = '385752739';
    const car: Car = {
        UID: uid(8),
        brand: req.body.brand,
        color: req.body.color,
        model: req.body.model,
        vin: req.body.vin,
    }
    const registryResult = await registryCar(car, identityCardNumber);
    return res.json({registryResult});
})

router.get('/', async (req: Request, res: Response) => {
    const identityCardNumber = '385752739';
    const cars = getAllCars(identityCardNumber);
    res.json(cars);
})

export default router;