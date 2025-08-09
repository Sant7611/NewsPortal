import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { motion } from 'framer-motion';
import {
    User, Lock, Mail, Github, Facebook, Linkedin, Chrome
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Authorization() {
    const navigate = useNavigate();

    const [isLoginActive, setIsLoginActive] = useState(true);
    const [role, setRole] = useState('viewer');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState("");

    const roles = [
        { id: 'viewer', label: 'Viewer' },
        { id: 'journalist', label: 'Journalist' },
        { id: 'admin', label: 'Admin' }
    ];

    useEffect(() => {
        localStorage.removeItem("token")
    }, [])

    async function HandleRegistration(event) {
        event.preventDefault();

        const response = await fetch("http://localhost:4040/api/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password, role })
        });

        const data = await response.json();

        if (!response.ok) {
            toast.error(data.message || "Registration failed");
        } else {
            toast.success(data.message || "Registered successfully");
            setTimeout(() => window.location.reload(), 1500);
        }
    }

    async function HandleLogin(event) {
        event.preventDefault();

        const response = await fetch("http://localhost:4040/api/user/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        // console.log("login response:", data);

        if (!response.ok) {
            toast.error(data.message || "Login failed");
        } else {
            const token = data.access_token; // store cleanly
            localStorage.setItem('token', token);
            toast.success(data.message || "Login successful");

            try {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                console.log("decoded token:", decoded);

                // Redirect based on role
                const targetRoute = decoded.role === "admin" ? '/adminpanel/dashboard' : '/homepage';
                setTimeout(() => navigate(targetRoute), 1000);

            } catch (e) {
                console.error("Invalid token", e);
                toast.error("Invalid token received");
            }
        }
    }


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
                        <form className="w-full">
                            <h1 className="text-4xl font-bold mb-8">Login</h1>
                            <div className="relative mb-6">
                                <input
                                    type="text"
                                    placeholder="email"
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg border-none outline-none text-base font-medium"
                                />
                                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            </div>
                            <div className="relative mb-6">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg border-none outline-none text-base font-medium"
                                />
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            </div>
                            <div className="text-right mb-6">
                                <a href="#" className="text-sm text-gray-700 hover:text-[#CBC8B9]">Forgot Password?</a>
                            </div>
                            <button
                                onClick={HandleLogin}
                                className="w-full h-12 bg-[#CBC8B9] rounded-lg shadow text-white font-semibold text-base hover:bg-[#bbb8a9] transition-colors"
                            >
                                Login
                            </button>
                            <p className="my-4 text-sm text-gray-600">
                                or login with social platforms
                            </p>
                            <div className="flex justify-center gap-4">
                                {[Chrome, Facebook, Github, Linkedin].map((Icon, index) => (
                                    <a
                                        key={index}
                                        href="#"
                                        className="p-2.5 border-2 border-gray-200 rounded-lg text-gray-700 hover:border-[#CBC8B9] hover:text-[#CBC8B9] transition-colors"
                                    >
                                        <Icon className="w-6 h-6" />
                                    </a>
                                ))}
                            </div>
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
                        <form className="w-full">
                            <h1 className="text-4xl font-bold mb-8">Registration</h1>
                            <div className="relative mb-6">
                                <input
                                    type="text"
                                    placeholder="name"
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg border-none outline-none text-base font-medium"
                                />
                                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            </div>
                            <div className="relative mb-6">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg border-none outline-none text-base font-medium"
                                />
                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            </div>
                            <div className="relative mb-6">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg border-none outline-none text-base font-medium"
                                />
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            </div>
                            <div className="relative mb-6">
                                <div className="flex flex-col space-y-2">
                                    <p className="text-left text-sm font-medium text-gray-700 mb-2">Select your role:</p>
                                    <div className="flex justify-between items-center">
                                        {roles.map((r) => (
                                            <label
                                                key={r.id}
                                                className={`
                                                    flex-1 mx-1 py-2 px-4 rounded-lg cursor-pointer
                                                    text-sm font-medium text-center transition-all
                                                    ${role === r.id
                                                        ? 'bg-[#CBC8B9] text-white shadow-md'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                                                `}
                                            >
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value={r.id}
                                                    checked={role === r.id}
                                                    onChange={(e) => setRole(e.target.value)}
                                                    className="hidden"
                                                />
                                                {r.label}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={HandleRegistration}
                                className="w-full h-12 bg-[#CBC8B9] rounded-lg shadow text-white font-semibold text-base hover:bg-[#bbb8a9] transition-colors"
                            >
                                Register
                            </button>
                            <p className="my-4 text-sm text-gray-600">
                                or register with social platforms
                            </p>
                            <div className="flex justify-center gap-4">
                                {[Chrome, Facebook, Github, Linkedin].map((Icon, index) => (
                                    <a
                                        key={index}
                                        href="#"
                                        className="p-2.5 border-2 border-gray-200 rounded-lg text-gray-700 hover:border-[#CBC8B9] hover:text-[#CBC8B9] transition-colors"
                                    >
                                        <Icon className="w-6 h-6" />
                                    </a>
                                ))}
                            </div>
                        </form>
                    </motion.div>
                )}
                {/* Toggle Box */}
                <div
                    className="absolute w-1/2 h-full bg-[#CBC8B9] rounded-l-[30px] z-20"
                    style={{
                        right: isLoginActive ? "0" : "auto",
                        left: isLoginActive ? "auto" : "0",
                    }}
                >
                    <div className="h-full flex flex-col justify-center items-center text-white p-10">
                        <h1 className="text-4xl font-bold mb-4">
                            {isLoginActive ? "Hello, Welcome!" : "Welcome Back!"}
                        </h1>
                        <p className="text-lg mb-8">
                            {isLoginActive
                                ? "Don't have an account? Sign up and start your journey."
                                : "Already have an account? Sign in and continue your journey."}
                        </p>
                        <button
                            className="w-40 h-12 bg-white text-[#CBC8B9] rounded-lg shadow font-semibold text-base hover:bg-gray-100 transition-colors"
                            onClick={() => setIsLoginActive(!isLoginActive)}
                        >
                            {isLoginActive ? "Sign Up" : "Sign In"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Authorization;
