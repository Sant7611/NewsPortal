import Header from "../Components/Header";
import {RelatableNews} from '../Components/ReletableNews'
import img2 from "../assets/img2.png";
import SubHeader from "../Components/Sub_header";
import Commentsection from "../Components/Comments";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { storeRecentRead } from "../utils/newsAPI";
import { ChartBarStacked, CircleUser, Share2 } from "lucide-react";
import Footer from "../Components/Footer";

export default function SingleNews() {
    const [news, setNews] = useState(null);
    const { newsID } = useParams();

    useEffect(() => {
        const fetchSingleNews = async () => {
            try {
                const res = await fetch(`http://localhost:4040/api/news/single/${newsID}`);
                const data = await res.json();
                setNews(data.news);

                // Track the view
                await storeRecentRead(newsID);
            } catch (err) {
                console.error("Failed to fetch single news:", err);
            }
        };

        fetchSingleNews();
    }, [newsID]);

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.3 }
        }
    };

    return (
        <>
            <Header />
            <SubHeader />

            <motion.div
                className="flex border-t-6 mt-4 border-b-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div
                    className="p-8 space-y-6 grow basis-6xl rounded-md border-r-2 border-indigo-950"
                    variants={itemVariants}
                >
                    <AnimatePresence mode="wait">
                        {news ? (
                            <motion.div
                                key="news"
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={containerVariants}
                            >
                                <motion.h1
                                    className="border-2 text-5xl font-bold p-2"
                                    variants={itemVariants}
                                >
                                    {news.title}
                                </motion.h1>
                                <motion.div whileHover={{ scale: 1 }} whileTap={{ scale: 0.9 }} className="flex justify-between my-4">
                                    <div>
                                        <Share2 className="cursor-pointer" />
                                    </div>
                                    <div className="flex space-x-4">
                                        < ChartBarStacked />: <p className="font-bold px-3">{news?.category.categoryName ?? "Fetching latest news..."} </p>
                                        <CircleUser />: <p className="font-bold px-3">{news?.journalist.name ?? "Fetching latest news..."} </p>

                                    </div>
                                </motion.div>

                                <hr className="my-4" />

                                <motion.img
                                    className="w-6xl my-4 rounded-lg"
                                    src={news.image?.[0]?.path || img2}
                                    alt="news"
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.3 }}
                                />

                                <motion.p
                                    className="text-gray-600 leading-relaxed"
                                    variants={itemVariants}
                                >
                                    {news.description}
                                </motion.p>
                            </motion.div>
                        ) : (
                            <motion.p className="text-gray-400 italic" variants={itemVariants}>
                                Fetching news...
                            </motion.p>
                        )}
                    </AnimatePresence>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <RelatableNews />
                </motion.div>
            </motion.div>

            <motion.div
                className="mb-6 border-b-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants}>
                    <Commentsection />
                </motion.div>
            </motion.div>

            <Footer />
        </>
    );
}