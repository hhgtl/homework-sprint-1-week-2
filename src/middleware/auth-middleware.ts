import { Request, Response, NextFunction } from 'express'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    // Перевірка на Basic
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        res.status(401).send()
        return
    }

    const token = authHeader.split(' ')[1]
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [login, password] = decoded.split(':')

    if (login !== 'admin' || password !== 'qwerty') {
        res.status(401).send()
        return
    }

    next()
}