import {Router} from "express"
import {authService} from "../domain/auth-service";
import {body} from "express-validator";
import {HttpStatuses} from "../../../common/types/http-statuses";

export const authRouter = Router({})

const authPasswordValidation = body('password').isString()
const authLoginOrEmailValidation = body('loginOrEmail').isString()

authRouter.post('/login',authPasswordValidation, authLoginOrEmailValidation, async (req, res) => {
    const {loginOrEmail, password} = req.body;

    const user = await authService.checkUserCredentials({loginOrEmail, password});

    if (!user) {
        return res.status(HttpStatuses.Unauthorized).send({})
    }

    res.status(HttpStatuses.NoContent).send({})


})