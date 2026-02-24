import {Router} from "express"
import {body} from "express-validator";
import {loginHandler} from "./handlers/login-handler";
import {meHandler} from "./handlers/me-handler";

export const authRouter = Router({})

const authPasswordValidation = body('password').isString()
const authLoginOrEmailValidation = body('loginOrEmail').isString()

authRouter.post('/login',authPasswordValidation, authLoginOrEmailValidation, loginHandler)

authRouter.get('/me', meHandler)