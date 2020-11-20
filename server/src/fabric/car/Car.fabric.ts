import { getCarContract } from './CommonFuntion';
import { Car } from './CarInterface';
export { Car } from './CarInterface'


export async function registryCar(car: Car, phoneNumber: string) {
    try {
        const contract = await getCarContract(phoneNumber);
        const params: Array<string> = [
            car.id,
            car.engineNumber,
            car.chassisNumber,
            car.brand,
            car.model,
            car.color,
            car.year,
        ]
        const TxID = await contract.submitTransaction('registryCar', ...params);
        return { success: true, result: { TxID: TxID.toString() } };
    } catch (error) {
        return { success: false, result: { error: error } };
    }
}


export async function getAllCars(phoneNumber: string) {
    try {
        const contract = await getCarContract(phoneNumber);
        const carsAsBuffer = await contract.evaluateTransaction('queryAllCars');
        const cars = JSON.parse(carsAsBuffer.toString());
        return { success: true, result: { cars } };
    } catch (error) {
        return { success: false, result: { error: error } }
    }
}


export async function getCarById(phoneNumber: string, carId: string) {
    try {
        const contract = await getCarContract(phoneNumber);
        const carsAsBuffer = await contract.evaluateTransaction('queryCarById', carId);
        const car = JSON.parse(carsAsBuffer.toString());
        return { success: true, result: { car } };
    } catch (error) {
        return { success: false, result: { error: error } }
    }
}


export async function getProcesscingCars(phoneNumber: string) {
    try {
        const contract = await getCarContract(phoneNumber);
        const processingCarsAsBuffer = await contract.evaluateTransaction('queryAllProcessingCar');
        const processingCars = JSON.parse(processingCarsAsBuffer.toString());
        if (processingCars.length > 0) {
            return { success: true, result: { processingCars } };
        }
        else {
            throw new Error("Không có xe đang xử lí");
        }
    } catch (error) {
        return { success: false, result: { msg: error } };
    }
}


export async function acceptCarRegistration(carId: string, registrationNumber: string, phoneNumber: string) {
    try {
        const contract = await getCarContract(phoneNumber);
        const TxID = await contract.submitTransaction('acceptRegistration', carId, registrationNumber);
        if (TxID.toString().length !== 0) {
            return { success: true, result: { TxID: TxID.toString() }};
        }
        else {
            throw new Error("Không thể hoàn thành đăng ký");
        }
    } catch (error) {
        return { success: false, result: { msg: error }};
    }
}

export async function rejectCarRegistration(carId: string, registrationNumber: string, phoneNumber: string) {
    try {
        const contract = await getCarContract(phoneNumber);
        const TxID = await contract.submitTransaction('rejectRegistration', carId);
        if (TxID.toString().length !== 0) {
            return { success: true, result: { TxID: TxID.toString() }};
        }
        else {
            throw new Error("Không thể hoàn thành đăng ký");
        }
    } catch (error) {
        return { success: false, result: { msg: error }};
    }
}

export async function isOwnerOfCar(carId: string, userId: string, phoneNumber: string): Promise<any> {
    try {
        const contract = await getCarContract(phoneNumber);
        const resultByte = await contract.evaluateTransaction('isOwnerOfCar', carId, userId);
        const result = resultByte.toString();
        console.log(result);
        if(result === 'true'){
            return { success: true, result: { isOnwer: true } }
        }
        return { success: true, result: { isOnwer: false } }
    } catch (error) {
        return { success: false, result: { msg: error } }
    }
}

export async function requestChangeOwner(carId: string, phoneNumber: string, newOwner: string, currentOwner: string) {
    try {
        const contract = await getCarContract(phoneNumber);
        const TxIDByte = await contract.submitTransaction('createRequestToChangeOwner', carId, currentOwner, newOwner);
        const TxID = TxIDByte.toString();
        if( TxID !== "" || TxID.length !== 0) {
            return { success: true, result: { TxID: TxID } }
        }
        else {
            throw new Error("Có lỗi khi gọi transaction");
        }
    } catch (error) {
        return { success: false, result: { msg: error } }
    }
}

export async function queryCars(phoneNumber: string, queryString: string): Promise<any> {
    try {
        const contract = await getCarContract(phoneNumber);
        const resultsBuffer = await contract.evaluateTransaction('queryResult', queryString);
        return JSON.parse(resultsBuffer.toString());
    } catch (error) {
        throw error;
    }
}

