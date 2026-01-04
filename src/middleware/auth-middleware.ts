import { Request, Response, NextFunction } from 'express'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'GET') {
        next()
    } else {
        const authHeader = req.headers.authorization

        if (!authHeader) {
            res.status(401).send()
            return
        }

        const token = authHeader.split(' ')[1]

        if (!token) {
            res.status(401).send()
            return
        }

        const decoded = Buffer.from(token, 'base64').toString('utf-8')
        const [login, password] = decoded.split(':')

        if (login === 'admin' && password === 'qwerty') {
            next()
        } else {
            res.status(401).send()
        }


    }
}