import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET ?? "secret";
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN ?? "30m";

export function signAccessToken(payload: object) {

    //@ts-expect-error error
    return jwt.sign(payload, JWT_SECRET, {expiresIn: ACCESS_TOKEN_EXPIRES_IN});
}

export function verifyAccessToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
}