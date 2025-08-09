import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getRecommendations } from "../utils/newsAPI";

export function RelatableNews() {
    const { newsID } = useParams();
    const [relatedNews, setRelatedNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRelatedNews = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                let recommendations = [];

                if (token) {
                    // Fetch personalized recommendations
                    recommendations = await getRecommendations();
                } else {
                    // Fetch popular articles for guests
                    const res = await fetch("http://localhost:4040/api/news/popularnews");
                    const data = await res.json();
                    recommendations = data.popularArticle.slice(0, 5);
                }

                setRelatedNews(recommendations);
            } catch (err) {
                console.error("Failed to fetch related news:", err);
                setRelatedNews([]); // Fallback to empty array
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedNews();
    }, [newsID]);


    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="w-80 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">
                {localStorage.getItem("token") ? "Recommended For You" : "Popular Articles"}
            </h2>
            <hr />
            {loading ? (
                <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            ) : (
                <div className="divide-y">
                    {relatedNews.map((article, index) => (
                        <motion.div
                            key={article._id}
                            className="py-4 first:pt-0 last:pb-0"
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="flex items-start space-x-4">
                                <span className="text-2xl font-bold">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <div>
                                    <h3
                                        className="font-medium text-gray-900 leading-snug hover:text-indigo-600 cursor-pointer"
                                        onClick={() => navigate(`/homepage/news/${article._id}/${article.category?._id || article.category}`)}
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
            )}
        </div>
    );
}