import {NextFunction, Request, Response} from "express";
import {FieldValidationError, validationResult} from "express-validator";

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formatter = (error: FieldValidationError) => {
            return {
                message: error.msg,
                field: error.path
            };
        };
        const result = errors.array({ onlyFirstError: true }) as FieldValidationError[];

        res.status(400).send({
            errorsMessages: result.map(formatter)
        });
        return
    }
    next();
}