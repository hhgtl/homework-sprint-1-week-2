import jwt, {SignOptions} from "jsonwebtoken";


const SECRET = 'MY_SECRET_PASSWORD'

export const jwtAdapter = {
    createToken({userId, deviceId, expiresIn = '30d'}: {userId: string, deviceId: string, expiresIn?: SignOptions['expiresIn']}) {
        return jwt.sign({userId, deviceId}, SECRET, { expiresIn });
    },

    verifyToken(token: string) {
        try {
            return jwt.verify(token, SECRET) as { userId: string, deviceId: string };
        } catch (error) {
            console.error("Token verify some error");
            return null;
        }
    }
}