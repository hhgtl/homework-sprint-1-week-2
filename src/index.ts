import express from "express";
import { setupApp } from "./setup-app";
import {runDb} from "./db/db";

const app = express();

app.set('trust proxy', true)

setupApp(app);

const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {
    await runDb()
    console.log(`Example app listening on port ${PORT}`);
});