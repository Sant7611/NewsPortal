import z from 'zod';

export const SignupSchemaValidator = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email field is required").email('Inavlid email'),
    password: z.string().min(6, "Password should have minimum 6 character"),
    role: z.enum(['viewer', 'journalist', 'admin'], "Role is required")
})

export const LoginSchemaValidator = z.object({
    email: z.string().min(1, "Email field is required").email('Inavlid email'),
    password: z.string().min(1, "Password cannot be empty"),
})