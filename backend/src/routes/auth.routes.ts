import express from "express";
import {
    forgotPassword,
    getUserProfile,
    googleCallback,
    login,
    logout,
    refreshToken,
    register,
    resetPassword,
    verifyEmail
} from "../controllers/auth.controller";
import passport from "../middlewares/passport.middleware"
import {validateData} from "../middlewares/validation.middleware";
import {
    forgotPasswordSchema,
    loginSchema,
    logoutSchema,
    refreshTokenSchema,
    registerSchema,
    resetPasswordSchema,
    verifyEmailSchema
} from "../db/schema/auth.schema";

const router = express.Router();

router.post("/register", validateData(registerSchema), register)
router.post("/verify-email", validateData(verifyEmailSchema), verifyEmail)
router.post("/login", validateData(loginSchema), (req, res, next) => {
    passport.authenticate("local", {session: false},

        (err: any, user: any, info: any) => {
            if (err) return next(err);
            if (!user) return res.status(401).json({error: info?.message ?? "Unauthorized"});
            // attach user to req and call controller to issue tokens
            (req as any).user = user;
            console.log('user', user)

            return login(req, res);
        })(req, res, next);
})
router.post("/logout", validateData(logoutSchema), logout)
router.post("/forgot-password", validateData(forgotPasswordSchema), forgotPassword)
router.post("/reset-password", validateData(resetPasswordSchema), resetPassword)
router.post("/refresh", validateData(refreshTokenSchema), refreshToken)
// router.post("/update-password", updatePassword)
// router.post("/update-profile", updateProfile)


// Google Auth placeholders to satisfy typings
router.get("/google", passport.authenticate("google", {scope: ["profile", "email"], session: false}));

router.get("/google/callback", passport.authenticate("google", {
    failureRedirect: "/",
    session: false
}), googleCallback);

router.get('/google/profile', getUserProfile);
router.get("/google/failure", (req, res) => res.status(401).send("Google [auth] failed"));


export default router;