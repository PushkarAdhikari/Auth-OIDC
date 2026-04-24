import express from "express";
import { authRouter } from "./auth/routes";

export function createApplication() {
    const app = express();


    //Middleware
    app.use(express.json());


    // Routes
    app.get('/', (req, res) => {
        return res.json({ message: 'Welcome to Auth Service' });
    })

    app.use('/auth', authRouter);


    return app;
}