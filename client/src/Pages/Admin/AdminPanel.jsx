import { useEffect, useState } from "react";
import AdminPanelNavbar from "../../Components/AdminPanelNavbar";
import { motion, AnimatePresence } from "framer-motion"; 

export default function AdminPanel() {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:4040/api/admin/Users", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (data.success === true || data.success === "true") {
                setUsers(data.users);
                setMessage(data.message);
            } else {
                setMessage(data.message || "Failed to fetch users");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setMessage("An error occurred while fetching users");
        }
    };

    return (
        <>
            <div className="m-7">
                <AdminPanelNavbar />
                <div className="shadow-lg rounded-3xl">
                    <h1 className="text-3xl font-semibold text-center mb-4">Users</h1>
                    {message && (
                        <p className="text-center text-green-600 font-medium mb-3">{message}</p>
                    )}
                    <div>
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="p-3 text-left">NAME</th>
                                    <th className="p-3 text-left">EMAIL</th>
                                    <th className="p-3 text-left">ROLE</th>
                                    <th className="p-3 text-left">ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence> 
                                    {users.length > 0 ? (
                                        users.map((user, index) => (
                                            <motion.tr
                                                key={index}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.3, ease: "easeOut" }}
                                                className="border-t border-gray-200"
                                            >
                                                <td className="p-3">{user.name}</td>
                                                <td className="p-3">{user.email}</td>
                                                <td className="p-3 capitalize">{user.role}</td>
                                                <td className="p-3">
                                                    <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
                                                        Remove
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="p-3 text-center text-gray-500">
                                                No users found
                                            </td>
                                        </tr>
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
