import express from "express";
import { setupApp } from "./setup-app";
import { runDb } from "./db/db";

const app = express();

app.set('trust proxy', true)

// МІНІМАЛЬНА ЗМІНА: Vercel викликає цю функцію при кожному запиті,
// тому ми перевіряємо БД тут.
app.use(async (req, res, next) => {
    await runDb();
    next();
});

setupApp(app);

const PORT = process.env.PORT || 5001;

// МІНІМАЛЬНА ЗМІНА: Запускаємо app.listen тільки локально
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, async () => {
        await runDb();
        console.log(`Example app listening on port ${PORT}`);
    });
}

// МІНІМАЛЬНА ЗМІНА: Vercel вимагає експорту додатку
export default app;