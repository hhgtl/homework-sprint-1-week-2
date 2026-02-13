import {Router} from "express"
import {authService} from "../domain/auth-service";
import {body} from "express-validator";
import {HttpStatuses} from "../../../common/types/http-statuses";
import {jwtAdapter} from "../adapters/jwt-adapter";

export const authRouter = Router({})

const authPasswordValidation = body('password').isString()
const authLoginOrEmailValidation = body('loginOrEmail').isString()

authRouter.post('/login',authPasswordValidation, authLoginOrEmailValidation, async (req, res) => {
    const {loginOrEmail, password} = req.body;

    const user = await authService.loginUser({loginOrEmail, password});

    if (user.status !== HttpStatuses.Success) {
        return res.status(user.status).send(user)
    }


    res.status(HttpStatuses.Success).send({accessToken: user.data?.accessToken})


})

authRouter.get('/me', async (req, res) => {
    const bearerJWT = req.headers.authorization;

    if (!bearerJWT) {
        return res.status(HttpStatuses.Unauthorized).send()
    }

    const jwt = bearerJWT.split(' ')[1]

    const meResult = await authService.me(jwt)

    if (meResult.status !== HttpStatuses.Success) {
        return res.status(HttpStatuses.Unauthorized).send()
    }

    res.status(HttpStatuses.Success).send(meResult.data)

})