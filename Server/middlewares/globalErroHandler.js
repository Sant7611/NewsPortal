import { ZodError } from 'zod';

export const globalErrorHandler = (error, req, res, next) => {
    // Set default values
    const statusCode = error.statusCode || 500;
    const message = error.message || "Something went wrong!";
    const status = error.status || "error";

    // Handle Zod validation errors
    if (error instanceof ZodError) {
        
        const validationErrors = error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
        }));
 
        return res.status(400).json({
            success: false,
            status: status,
            message: validationErrors[0]?.message || "Validation failed",
            errors: validationErrors,
        });
    }

    // Optional: log server-side error in development
    if (process.env.NODE_ENV === "development") {
        console.error("🔴 Error:", error);
    }

    // Handle all other errors
    return res.status(statusCode).json({
        success: false,
        status: statusCode,
        message,
    });
};
