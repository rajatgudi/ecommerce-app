import type {Request, Response} from 'express'
import {db} from "../db";
import {emailVerifications, passwordResets, refreshTokens, usersTable,} from "../db/schema/auth.schema";
import {eq} from "drizzle-orm";
import bcrypt from 'bcryptjs'
import {daysFromNow, generateToken, minutesFromNow} from "../utils";
import {signAccessToken} from "../utils/jwt.utils";

const REFRESH_TOKEN_EXPIRES_DAYS = Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS ?? 7);
const register = async (req: Request, res: Response) => {
    const {email, password, name} = req.body

    const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1)

    if (existingUser.length) return res.status(409).json({error: "Email already in use!"})

    const passwordHash = await bcrypt.hash(password, 10)
    const registeredUser = await db.insert(usersTable).values({email, password: passwordHash, name}).returning()
    if (registeredUser?.length) {
        const token = generateToken()
        const expiresAt = daysFromNow(1)
        await db.insert(emailVerifications).values({
            userId: registeredUser[0].id.toString(),
            token: token,
            expires_at: expiresAt,
        })
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
        console.log(verificationUrl)

        return res.status(201).json({
            message: "User Created Successfully! Please verify your email",
            data: registeredUser
        })

    }
    return res.status(200).json({message: "Register"})
}
const login = async (req: Request, res: Response) => {

    const user = (req as any).user
    if (!user) return res.status(401).json({error: "Unauthorized!"})


    //sign tokens
    const accessToken = signAccessToken({sub: user.id, role: user.role, email: user.email})
    const refreshTokenValue = generateToken()
    const expiresAt = daysFromNow(REFRESH_TOKEN_EXPIRES_DAYS)
    console.log('accessToken', accessToken)

    await db.insert(refreshTokens).values({
        userId: user.id,
        token: refreshTokenValue,
        expiresAt: expiresAt,
    })
    delete user.password
    return res.status(200).json({
        message: "Login Successfully!",
        user: user,
        accessToken,
        refreshToken: refreshTokenValue
    })
}
export const googleCallback = async (req: Request, res: Response) => {
    const user = (req as any).user
    console.log('user', user)

    if (!user) return res.status(401).json({error: "Google authentication failed!"})
    const accessToken = signAccessToken({sub: user.id, role: user.role, email: user.email})
    const refreshTokenValue = generateToken()
    const expiresAt = daysFromNow(REFRESH_TOKEN_EXPIRES_DAYS)

    await db.insert(refreshTokens).values({
        userId: user.id, token: accessToken, expiresAt: expiresAt,
    })
    // For simplicity redirect to the frontend with tokens as a query (in production consider httpOnly cookie)
    const redirectUrl = `${process.env.FRONTEND_URL}/?accessToken=${accessToken}&refreshToken=${refreshTokenValue}`;
    // const redirectUrl = `${process.env.FRONTEND_URL}/dashboard`
    console.log("redirectUrl", redirectUrl)
    return res.redirect(redirectUrl)
}
const logout = async (req: Request, res: Response) => {
    const {refreshToken} = req.body
    if (!refreshToken) return res.status(401).json({error: "refreshToken required!"})

    await db.update(refreshTokens).set({revoked: true}).where(eq(refreshTokens.token, refreshToken))
    return res.status(200).json({message: "Logged out successfully!"})
}
const refreshToken = async (req: Request, res: Response) => {
    const {refreshToken} = req.body
    if (!refreshToken) return res.status(400).json({error: "refreshToken required"});
    const [tokenRow] = await db.select().from(refreshTokens).where(eq(refreshTokens.token, refreshToken)).limit(1)
    if (!tokenRow) return res.status(401).json({error: "invalid Refresh token!"})
    if (tokenRow.revoked) return res.status(401).json({error: "token revoked"})
    if (tokenRow.expiresAt < new Date()) return res.status(401).json({error: "token expired!"})

    const [userRows] = await db.select().from(usersTable).where(eq(usersTable.id, tokenRow.userId)).limit(1)
    if (!userRows) return res.status(401).json({error: "user not found!"})

    const accessToken = signAccessToken({sub: userRows.id, role: userRows.role, email: userRows.email});
    //update new refresh token

    const newRefreshToken = generateToken()
    const expiresAt = daysFromNow(REFRESH_TOKEN_EXPIRES_DAYS)
    await db.update(refreshTokens).set({revoked: true}).where(eq(refreshTokens.id, tokenRow.id)).returning()
    await db.insert(refreshTokens).values({
        userId: userRows.id,
        token: newRefreshToken,
        expiresAt: expiresAt
    }).returning()

    return res.json({accessToken, refreshToken: newRefreshToken});

}
const forgotPassword = async (req: Request, res: Response) => {
    const {email} = req.body
    if (!email) return res.status(400).json({error: "email required!"})

    const [checkuser] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1)
    if (!checkuser) return res.status(401).json({error: "If an account exists we'll send a reset email."})

    //generate token
    const token = generateToken()
    const expiresAt = minutesFromNow(60)
    await db.insert(passwordResets).values({
        userId: checkuser.id,
        token: token,
        expiresAt: expiresAt
    })

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    console.log(resetUrl)

    return res.status(200).json({message: "If an account exists we'll send a reset email."});
}
const resetPassword = async (req: Request, res: Response) => {
    try {
        const {token, newPassword} = req.body
        if (!token) return res.status(400).json({error: "token required!"})
        if (!newPassword) return res.status(401).json({error: "new password required!"})

        const [existingRow] = await db.select().from(passwordResets).where(eq(passwordResets.token, token)).limit(1)
        if (!existingRow) return res.status(401).json({error: "invalid token!"})
        if (existingRow.used) return res.status(401).json({error: "token revoked!"})
        if (existingRow.expiresAt < new Date()) return res.status(401).json({error: "token expired!"})

        const hashedPassword = await bcrypt.hash(newPassword, 12)
        await db.update(usersTable).set({password: hashedPassword}).where(eq(usersTable.id, existingRow.userId))
        await db.update(passwordResets).set({used: true}).where(eq(passwordResets.id, existingRow.id))

        return res.status(200).json({message: "Password updated successfully!"})
    } catch (err) {
        console.error(err)
    }
}
const verifyEmail = async (req: Request, res: Response) => {
    const {token} = req.body
    if (!token) return res.status(401).json({error: "token required!"})
    const [existingUser] = await db.select().from(emailVerifications).where(eq(emailVerifications.token, token)).limit(1)
    if (!existingUser) return res.status(401).json({error: "invalid token!"})
    if (existingUser.used) return res.status(401).json({error: "token already in use!"})
    if (existingUser.expires_at < new Date()) return res.status(401).json({error: "token expired!"})
    console.log('existingUser', existingUser)

    await db.update(usersTable).set({is_email_verified: true}).where(eq(usersTable.id, existingUser.userId))
    await db.update(emailVerifications).set({used: true}).where(eq(emailVerifications.userId, existingUser.userId))

    return res.status(200).json({message: "Email verified", data: existingUser});
}
const getUserProfile = async (req: Request, res: Response) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({message: 'Missing or invalid Authorization header'});
    }
    console.log('auth', auth)

    const token = auth.slice(7);
    console.log('token', token)
    const [userByToken] = await db.select().from(refreshTokens).where(eq(refreshTokens.token, token)).limit(1)
    if (!userByToken) return res.status(401).json({error: "invalid token!"})
    console.log('userByToken', userByToken)
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userByToken?.userId)).limit(1)
    if (!user) return res.status(401).json({error: "invalid token!"})
    console.log('user', user)

    return res.status(200).json({data: user, message: "Google sign in Successfully"})
}
// const updatePassword = async (req: Request, res: Response) => {
// }
// const updateProfile = async (req: Request, res: Response) => {
// }
export {
    register,
    logout,
    login,
    refreshToken,
    forgotPassword,
    resetPassword,
    verifyEmail, getUserProfile
}