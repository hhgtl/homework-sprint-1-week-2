import jwt from "jsonwebtoken";

const SECRET = 'MY_SECRET_PASSWORD'

export const jwtAdapter = {
    createToken({userId}: {userId: string}) {
        return jwt.sign({userId}, SECRET, { expiresIn: '30d' });

    },

    verifyToken(token: string) {
        try {
            return jwt.verify(token, SECRET) as { userId: string };
        } catch (error) {
            console.error("Token verify some error");
            return null;
        }
    }
}