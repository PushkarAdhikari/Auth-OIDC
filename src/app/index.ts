import express from "express";

export function createApplication() {
    const app = express();


    //Middleware



    // Routes
    app.get('/', (req, res) => {
        return res.json({ message: 'Welcome to Auth Service' });
    })

    return app;
}