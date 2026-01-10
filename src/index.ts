import express from "express";
import { setupApp } from "./setup-app";
import {runDb} from "./db/db";

const app = express();
setupApp(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    await runDb()
    console.log(`Example app listening on port ${PORT}`);
});