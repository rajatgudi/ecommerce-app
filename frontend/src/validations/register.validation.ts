// Define schema
import {z} from "zod";

export const schema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("invalid email address"),
    password: z.string().min(8, {message: "password must be at least 8 characters"}).superRefine((val, ctx) => {
        if (!/[A-Z]/.test(val)) {
            ctx.addIssue({
                code: "custom",
                message: "password must contain at least one uppercase letter",
            });
        }
        if (!/[0-9]/.test(val)) {
            ctx.addIssue({
                code: "custom",
                message: "password must contain at least one number",
            });
        }

        // common special chars set; modify if you want a different set
        if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(val)) {
            ctx.addIssue({
                code: "custom",
                message: "password must contain at least one special character",
            });
        }
    }),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

// Type is automatically inferred from schema
export type RegisterValidation = z.infer<typeof schema>;
