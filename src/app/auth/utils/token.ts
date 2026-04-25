import JWT from "jsonwebtoken";

export interface UserTokenPayload {
    id: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'myjwtsecret'

export function createUserToken(payload: UserTokenPayload) {
    const token = JWT.sign(payload, JWT_SECRET);
    return token;
}

export function verifyUserToken(token: string, secret: string = JWT_SECRET) {
    try {
        const payload = JWT.verify(token, secret) as UserTokenPayload;
        return payload;
    } catch (error) {
        // throw new Error('Invalid token');
        return null;
    }
}
