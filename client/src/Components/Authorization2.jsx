import React, { useState } from 'react';
import { toast } from "react-toastify";
import { motion } from 'framer-motion';
import { User, Lock, Mail, Github, Facebook, Linkedin, Chrome } from 'lucide-react';
import { z } from 'zod';

// Enhanced validation schemas with more detailed messages
const registrationSchema = z.object({
    name: z.string()
        .min(1, "Name is required")
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name cannot exceed 50 characters")
        .regex(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces"),
    email: z.string()
        .email("Please enter a valid email address")
        .min(1, "Email is required")
        .max(100, "Email cannot exceed 100 characters"),
    password: z.string()
        .min(6, "Password must be at least 6 characters")
        .max(50, "Password cannot exceed 50 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    role: z.enum(['viewer', 'journalist', 'admin'], {
        required_error: "Please select a role",
        invalid_type_error: "Invalid role selected"
    })
});

const loginSchema = z.object({
    email: z.string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
    password: z.string()
        .min(1, "Password is required")
});

function Authorization() {
    const [isLoginActive, setIsLoginActive] = useState(true);
    const [role, setRole] = useState('viewer');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const roles = [
        { id: 'viewer', label: 'Viewer' },
        { id: 'journalist', label: 'Journalist' },
        { id: 'admin', label: 'Admin' }
    ];

    const clearErrors = () => {
        setErrors({});
    };

    // Registration function with enhanced validation
    async function HandleRegistration(event) {
        event.preventDefault();
        clearErrors();

        try {
            const validationResult = registrationSchema.parse({ name, email, password, role });

            const response = await fetch("http://localhost:4040/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(validationResult)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            toast.success("Registration successful! Please log in.");
            setIsLoginActive(true);
            // Clear form
            setName('');
            setEmail('');
            setPassword('');
            setRole('viewer');

        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors = {};
                error.errors.forEach((err) => {
                    newErrors[err.path[0]] = err.message;
                });
                setErrors(newErrors);
                toast.error("Please fix the validation errors");
            } else {
                toast.error(error.message || "An error occurred during registration");
            }
        }
    }

    // Login function with enhanced validation
    async function HandleLogin(event) {
        event.preventDefault();
        clearErrors();

        try {
            const validationResult = loginSchema.parse({ email, password });

            const response = await fetch("http://localhost:4040/api/auth/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(validationResult)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            toast.success("Login successful!");
            // Clear form
            setEmail('');
            setPassword('');

        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors = {};
                error.errors.forEach((err) => {
                    newErrors[err.path[0]] = err.message;
                });
                setErrors(newErrors);
                toast.error("Please fix the validation errors");

            } else {
                toast.error(error.message || "An error occurred during login");
            }
        }
    }

    const renderError = (field) => {
        return errors[field] && (
            <p className="text-red-500 text-sm mt-1 text-left">{errors[field]}</p>
        );
    };

    const inputClasses = "w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg border-none outline-none text-base font-medium";
    const buttonClasses = "w-full h-12 bg-[#CBC8B9] rounded-lg shadow text-white font-semibold text-base hover:bg-[#bbb8a9] transition-colors";
    const linkClasses = "text-[#CBC8B9] hover:underline";

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="relative w-[850px] h-[550px] bg-white rounded-[30px] shadow-lg overflow-hidden">

                {/* Login Form */}
                {isLoginActive ? (
                    <motion.div
                        key="login"
                        initial={{ x: -500, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 500, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute left-0 w-1/2 h-full bg-white flex items-center text-gray-800 text-center p-10 z-10"
                    >
                        <form className="w-full" onSubmit={HandleLogin}>
                            <h1 className="text-4xl font-bold mb-8">Login</h1>
                            <div className="relative mb-6">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                        clearErrors();
                                    }}
                                    className={inputClasses}
                                />
                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                {renderError('email')}
                            </div>
                            <div className="relative mb-6">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(event) => {
                                        setPassword(event.target.value);
                                        clearErrors();
                                    }}
                                    className={inputClasses}
                                />
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                {renderError('password')}
                            </div>

                            <button
                                type="submit"
                                className={buttonClasses}
                            >
                                Login
                            </button>

                            <p className="mt-4 text-sm text-gray-600">
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLoginActive(false);
                                        clearErrors();
                                    }}
                                    className={linkClasses}
                                >
                                    Register here
                                </button>
                            </p>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="register"
                        initial={{ x: 500, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -500, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute right-0 w-1/2 h-full bg-white flex items-center text-gray-800 text-center p-10 z-10"
                    >
                        <form className="w-full" onSubmit={HandleRegistration}>
                            <h1 className="text-4xl font-bold mb-8">Registration</h1>
                            <div className="relative mb-6">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(event) => {
                                        setName(event.target.value);
                                        clearErrors();
                                    }}
                                    className={inputClasses}
                                />
                                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                {renderError('name')}
                            </div>
                            <div className="relative mb-6">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                        clearErrors();
                                    }}
                                    className={inputClasses}
                                />
                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                {renderError('email')}
                            </div>
                            <div className="relative mb-6">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(event) => {
                                        setPassword(event.target.value);
                                        clearErrors();
                                    }}
                                    className={inputClasses}
                                />
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                {renderError('password')}
                            </div>

                            <div className="relative mb-6">
                                <select
                                    value={role}
                                    onChange={(event) => {
                                        setRole(event.target.value);
                                        clearErrors();
                                    }}
                                    className={inputClasses}
                                >
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.label}
                                        </option>
                                    ))}
                                </select>
                                {renderError('role')}
                            </div>

                            <button
                                type="submit"
                                className={buttonClasses}
                            >
                                Register
                            </button>

                            <p className="mt-4 text-sm text-gray-600">
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLoginActive(true);
                                        clearErrors();
                                    }}
                                    className={linkClasses}
                                >
                                    Login here
                                </button>
                            </p>
                        </form>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default Authorization;