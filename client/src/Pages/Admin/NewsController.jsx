import { useState, useEffect } from "react";
import AdminPanelNavbar from "../../Components/AdminPanelNavbar";
import CategorySelect from "../../Components/CategorySelect";
import { AnimatePresence, motion } from "framer-motion";

export default function NewsController() {
    const [news, setNews] = useState([]);
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchNews();
        fetchCategories();
    }, []);

    const fetchNews = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:4040/api/news/all", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (data.success) {
                setNews(data.news);
                setMessage(data.msg);
            } else {
                setMessage("Failed to fetch news");
            }
        } catch (error) {
            console.error("Error fetching news:", error);
            setMessage("An error occurred while fetching news");
        }
    };

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:4040/api/category/all", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
                setCategories(data.data);
            } else {
                console.error("Failed to fetch categories:", data);
                setCategories([]);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            setCategories([]);
        }
    };

    const handleUpdateStatus = async (newsId, newStatus) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:4040/api/news/update-status/${newsId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                setMessage(data.msg);
                fetchNews(); // refresh list
            } else {
                setMessage("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            setMessage("An error occurred while updating status");
        }
    };

    const handleDeleteNews = async (newsId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:4040/api/news/delete/${newsId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setMessage(data.msg);
                fetchNews(); // refresh list
            } else {
                setMessage("Failed to delete news");
            }
        } catch (error) {
            console.error("Error deleting news:", error);
            setMessage("An error occurred while deleting news");
        }
    };

    const handleUpdateCategory = async (newsId, categoryId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(
                `http://localhost:4040/api/news/update/${newsId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ categoryId }),
                }
            );
            const data = await res.json();
            if (data.success) {
                setMessage(data.msg);
                fetchNews();
            } else {
                setMessage("Failed to update category");
            }
        } catch (error) {
            console.error("Error updating category:", error);
            setMessage("An error occurred while updating category");
        }
    };

    return (
        <div className="m-7">
            <AdminPanelNavbar />
            <div className="shadow-lg rounded-3xl p-6">
                <h1 className="text-3xl font-semibold text-center mb-4">News</h1>
                {message && (
                    <p className="text-center text-green-600 font-medium mb-3">
                        {message}
                    </p>
                )}
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            {["AUTHOR", "TITLE", "STATUS", "CATEGORY", "ACTION"].map((h) => (
                                <th key={h} className="p-3 text-left">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {news.length > 0 ? (
                                news.map((item) => (
                                    <motion.tr
                                        key={item._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.5, ease: "easeIn" }}
                                        className="border-t border-gray-200"
                                    >
                                        <td className="p-3">{item.journalist?.name || "N/A"}</td>
                                        <td className="p-3">{item.title}</td>
                                        <td className="p-3 capitalize">{item.status}</td>
                                        <td className="p-3 w-48">
                                            <CategorySelect
                                                value={item.category?._id || ""}
                                                onChange={(catId) =>
                                                    handleUpdateCategory(item._id, catId)
                                                }
                                                options={categories}
                                            />
                                        </td>
                                        <td className="p-3 space-x-2">
                                            <button
                                                onClick={() => handleUpdateStatus(item._id, "approved")}
                                                className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(item._id, "rejected")}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                                            >
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => handleDeleteNews(item._id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <motion.tr
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <td colSpan="5" className="p-3 text-center text-gray-500 italic">
                                        No news found
                                    </td>
                                </motion.tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
