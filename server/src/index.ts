import express, { Application, Request, Response, NextFunction } from "express";
import * as bodyParser from "body-parser";
import userRouter from './api/user.api';
import carRouter from './api/car.api';

const app: Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/user', userRouter);
app.use('/car', carRouter);

app.get("/test", (req: Request, res: Response) => {
    res.status(200).send("Hello World!");
});

app.listen(3000, () =>{
    console.log("Started CR server")
});