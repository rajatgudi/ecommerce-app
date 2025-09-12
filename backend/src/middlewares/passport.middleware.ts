import passport from 'passport';
import {db} from "../db";
import {usersTable} from "../db/schema/auth.schema";
import {eq} from "drizzle-orm";
import {Strategy as LocalStrategy} from "passport-local"
import type {Profile, VerifyCallback} from "passport-google-oauth20";
import {Strategy as GoogleStrategy} from "passport-google-oauth20"
import bcrypt from "bcryptjs";

passport.serializeUser((user, done) => {
    console.log('serializeUser', user)

    done(null, user);
})
passport.deserializeUser(async (id, done) => {
    try {
        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1)
        console.log('deserializeUser', user)
        done(null, user ?? null)
    } catch
        (err) {
        done(err);
    }
})

passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    session: false
}, async (email: string, password: string, done: never) => {
    try {
        const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1)
        if (!user) return done(null, false, {message: "Incorrect email or password"});
        if (!user.password) return done(null, false, {message: "Password not set, use social login"})

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return done(null, false, {message: "Incorrect email or password"});
        return done(null, user);
    } catch (err) {
        console.log(err);
        return done(err);
    }
}))

passport.use(<passport.Strategy>new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID ?? "544016951454-770vsgub8e41uu74k2hu4oob5td66ar1.apps.googleusercontent.com",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "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",
    callbackURL: process.env.GOOGLE_CALLBACK_URL ?? "http://localhost:3000/api/v1/google/callback",
}, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
    try {
        console.log(accessToken, refreshToken)

        const email = profile.emails?.[0]?.value
        if (!email) return done(new Error("Google account has no email"), null)
        console.log('profile', profile)

        const [existingUser] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1)
        if (existingUser) {
            //Update google_id if missing
            if (existingUser?.googleId) {
                await db.update(usersTable).set({googleId: profile.id}).where(eq(usersTable.id, existingUser.id))
            }
            return done(null, {...existingUser, google: true})
        }
        //create new user
        const [inserted] = await db.insert(usersTable).values({
            email,
            name: profile.displayName,
            googleId: profile.id,
            is_email_verified: true
        }).returning()
        return done(null, inserted)
    } catch (err) {
        return done(err)
    }
}))
export default passport;