import {Router} from "express"
import {body} from "express-validator";
import {loginHandler} from "./handlers/login-handler";
import {meHandler} from "./handlers/me-handler";
import {registrationHandler} from "./handlers/registration-handler";
import {loginValidation} from "../../../common/validation/login-validation";
import {passwordValidation} from "../../../common/validation/password-validation";
import {emailValidation} from "../../../common/validation/email-validation";
import {inputValidationMiddleware} from "../../../common/middleware/inputValidationMiddleware";
import {registrationEmailResendingHandler} from "./handlers/registration-email-resending-handler";
import {codeValidation} from "../validation/code-validation";
import {registrationConfirmationHandler} from "./handlers/registration-confirmation-handler";
import {refreshTokenHandler} from "./handlers/refresh-token-handler";
import {logoutHandler} from "./handlers/logout-handler";

export const authRouter = Router({})

const authPasswordValidation = body('password').isString()
const authLoginOrEmailValidation = body('loginOrEmail').isString()

authRouter.post('/login', authPasswordValidation, authLoginOrEmailValidation, loginHandler)

authRouter.get('/me', meHandler)

authRouter.post('/registration', loginValidation, passwordValidation, emailValidation, inputValidationMiddleware, registrationHandler)

authRouter.post('/registration-email-resending', emailValidation, inputValidationMiddleware, registrationEmailResendingHandler)

authRouter.post('/registration-confirmation', codeValidation, inputValidationMiddleware, registrationConfirmationHandler)

authRouter.post('/refresh-token', refreshTokenHandler)

authRouter.post('/logout', logoutHandler)