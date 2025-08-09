import { motion } from "framer-motion";
import { ChartBarStacked, CircleUser, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import img4 from "../assets/img4.png";
import { useEffect, useState } from "react";
import { storeRecentRead } from "../utils/newsAPI";

export default function NewsCard() {
    const navigate = useNavigate();
    const [popularNews, setPopularNews] = useState([]);
    const [News, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchPopularNews() {
            try {
                const res = await fetch("http://localhost:4040/api/news/popularnews");
                const data = await res.json();
                if (data.success) {
                    setPopularNews(data.popularArticle || []);
                }
            } catch (error) {
                console.error("Error fetching popular news:", error);
                setPopularNews([]);
            }
        }

        async function fetchAllNews() {
            try {
                setLoading(true);
                const res = await fetch("http://localhost:4040/api/news/allnews");
                const data = await res.json();
                if (data.success) {
                    setNews(data.news || []);
                } else {
                    setError("Failed to fetch news");
                }
            } catch (error) {
                console.error("Error fetching news:", error);
                setError("Failed to fetch news");
                setNews([]);
            } finally {
                setLoading(false);
            }
        }

        fetchPopularNews();
        fetchAllNews();
    }, []);

    const handleNewsClick = async (newsId, categoryId) => {
        await storeRecentRead(newsId);
        navigate(`news/${newsId}/${categoryId}`);
    };

    const ads = [
        { id: 1, title: "For male/female that between 23-50 YO" },
        { id: 2, title: "Have a good and crazy taste of music" },
        { id: 3, title: "Can play a lot of music instrument" },
        { id: 4, title: "Have 2 years of experience in music" },
        { id: 5, title: "Can play a lot of music instrument" }
    ];

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.2 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
    };

    return (
        <motion.div
            className="container mt-4 mb-4 border-t-4 border-b-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex">
                {/* Main Article */}
                <motion.div
                    className="w-[34rem] space-y-2 border-0 p-8 rounded-md border-r-2 border-indigo-950"
                    variants={itemVariants}
                >
                    <h1
                        onClick={() => handleNewsClick(News[0]?._id, News[0]?.category?._id)}
                        className="text-2xl font-semibold cursor-pointer hover:text-gray-600 transition-colors"
                    >
                        {News[0]?.title ?? "Fetching latest news..."}
                    </h1>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="flex justify-between">
                        <div>

                            <Share2 className="cursor-pointer" />
                        </div>
                        <div className="flex space-x-4">
                            < ChartBarStacked />: <p className="font-bold px-3">{News[0]?.category?.categoryName ?? "Fetching latest news..."} </p>
                            <CircleUser />: <p className="font-bold px-3">{News[0]?.journalist?.name ?? "Fetching latest news..."} </p>

                        </div>
                    </motion.div>
                    <hr className="my-4" />
                    {News[0]?.image?.[0]?.path ? (
                        <motion.img
                            className="object-cover w-2xl"
                            src={News[0].image[0].path}
                            alt={News[0].title}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        />
                    ) : (
                        <p className="text-gray-400 italic">Fetching latest news image...</p>
                    )}
                    <p className="text-gray-600 leading-relaxed">
                        {News[0]?.description ?? "Fetching latest news..."}
                    </p>
                </motion.div>

                {/* Secondary Article */}
                <motion.div
                    className="p-8 space-y-2 grow basis-6xl rounded-md border-r-2 border-indigo-950"
                    variants={itemVariants}
                >
                    <h1
                        className="border-2 text-5xl font-bold p-2 cursor-pointer hover:text-gray-600 transition-colors"
                        onClick={() => handleNewsClick(News[1]?._id, News[1]?.category?._id)}
                    >
                        {News[1]?.title ?? "Fetching latest news..."}
                    </h1>

                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="flex justify-between">
                        <div>

                            <Share2 className="cursor-pointer" />
                        </div>
                        <div className="flex space-x-4">
                            < ChartBarStacked />: <p className="font-bold px-3">{News[1]?.category?.categoryName ?? "Fetching latest news..."} </p>
                            <CircleUser />: <p className="font-bold px-3">{News[1]?.journalist?.name ?? "Fetching latest news..."} </p>

                        </div>
                    </motion.div>
                    <hr className="my-4" />

                    {News[1]?.image?.[0]?.path ? (
                        <motion.img
                            className="w-4xl"
                            src={News[1].image[0].path}
                            alt={News[1].title}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        />
                    ) : (
                        <p className="text-gray-400 italic">Fetching latest news image...</p>
                    )}
                    <p className="text-gray-600 leading-relaxed">
                        {News[1]?.description ?? "Fetching latest news..."}
                    </p>
                </motion.div>

                {/* Popular Articles */}
                <motion.div
                    className="w-80 p-6 rounded-lg shadow-sm"
                    variants={itemVariants}
                >
                    <h2 className="text-xl font-semibold mb-6">Popular Articles Now</h2>
                    <hr />
                    <div className="divide-y">
                        {popularNews.map((article, index) => (
                            <motion.div
                                key={article._id}
                                className="py-4 first:pt-0 last:pb-0"
                                whileHover={{ x: 10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex items-start space-x-4">
                                    <span className="text-2xl font-bold">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <div>
                                        <h3
                                            className="font-medium text-gray-900 leading-snug hover:text-gray-600 cursor-pointer"
                                            onClick={() => handleNewsClick(article._id, article.category?._id)}
                                        >
                                            {article.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {new Date(article.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Bottom News Section */}
            <motion.div
                className="container mx-auto px-4 border-t-2"
                variants={containerVariants}
            >
                <div className="flex gap-8">
                    {/* Left Column */}
                    <motion.div
                        className="flex-1 p-6 rounded-lg border-r-2"
                        variants={itemVariants}
                    >
                        <div className="space-y-6">
                            <h2
                                className="text-2xl font-serif font-bold leading-tight cursor-pointer hover:text-gray-600 transition-colors"
                                onClick={() => handleNewsClick(News[2]?._id, News[2]?.category?._id)}
                            >
                                {News[2]?.title ?? "Fetching latest news..."}
                            </h2>

                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="flex justify-between">
                                <div>

                                    <Share2 className="cursor-pointer" />
                                </div>
                                <div className="flex space-x-4">
                                    < ChartBarStacked />: <p className="font-bold px-3">{News[2]?.category?.categoryName ?? "Fetching latest news..."} </p>
                                    <CircleUser />: <p className="font-bold px-3">{News[2]?.journalist?.name ?? "Fetching latest news..."} </p>

                                </div>
                            </motion.div>

                            <hr className="my-4" />

                            <div className="flex gap-6">
                                {News[2]?.image?.[0]?.path ? (
                                    <motion.img
                                        src={News[2].image[0].path}
                                        className="w-1/2 h-64 object-cover rounded-lg"
                                        alt={News[2].title}
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                ) : (
                                    <p className="text-gray-400 italic">Fetching latest news image...</p>
                                )}
                                <p className="text-gray-600 leading-relaxed">
                                    {News[2]?.description ?? "Fetching latest news..."}
                                </p>
                            </div>

                            <div className="border-t pt-6">
                                <div className="flex gap-6">
                                    <motion.img
                                        src={img4}
                                        className="w-1/3 h-48 object-cover rounded-lg"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                    <div>
                                        <h2 className="text-xl font-semibold mb-4">
                                            Composer Needed Now!
                                        </h2>
                                        <ul className="space-y-2">
                                            {ads.map((item) => (
                                                <motion.li
                                                    key={item.id}
                                                    className="text-gray-600 hover:text-gray-900 cursor-pointer"
                                                    whileHover={{ x: 10 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    {item.title}
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column */}
                    <motion.div
                        className="flex-1 p-6 rounded-lg"
                        variants={itemVariants}
                    >
                        <div className="space-y-6">
                            <h1
                                className="text-4xl font-serif font-bold leading-tight cursor-pointer hover:text-gray-600 transition-colors"
                                onClick={() => handleNewsClick(News[3]?._id, News[3]?.category?._id)}
                            >
                                {News[3]?.title ?? "Fetching latest news..."}
                            </h1>

                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="flex justify-between">
                                <div>

                                    <Share2 className="cursor-pointer" />
                                </div>
                                <div className="flex space-x-4">
                                    < ChartBarStacked />: <p className="font-bold px-3">{News[3]?.category?.categoryName ?? "Fetching latest news..."} </p>
                                    <CircleUser />: <p className="font-bold px-3">{News[3]?.journalist?.name ?? "Fetching latest news..."} </p>

                                </div>
                            </motion.div>

                            <hr className="my-4" />

                            <div className="flex gap-6">
                                {News[3]?.image?.[0]?.path ? (
                                    <motion.img
                                        src={News[3].image[0].path}
                                        className="w-1/2 h-96 object-cover rounded-lg"
                                        alt={News[3].title}
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                ) : (
                                    <p className="text-gray-400 italic">Fetching latest news image...</p>
                                )}
                                <p className="text-gray-600 leading-relaxed">
                                    {News[3]?.description ?? "Fetching latest news..."}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
}