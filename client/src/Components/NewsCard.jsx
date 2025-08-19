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

  // Function to truncate text and add "...read more"
  const truncateText = (text, wordLimit, newsId, categoryId) => {
    if (!text) return "";
    
    const words = text.split(' ');
    if (words.length <= wordLimit) {
      return text;
    }
    
    const truncated = words.slice(0, wordLimit).join(' ');
    return (
      <>
        {truncated}...{" "}
        <span 
          onClick={() => handleNewsClick(newsId, categoryId)}
          className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium underline"
        >
          read more
        </span>
      </>
    );
  };

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
    { id: 5, title: "Can play a lot of music instrument" },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  // Show loading state
  if (loading) {
    return (
      <div className="container mt-4 mb-4 border-t-4 border-b-4">
        <div className="flex justify-center items-center h-96">
          <div className="text-xl font-semibold">Loading news...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mt-4 mb-4 border-t-4 border-b-4">
        <div className="flex justify-center items-center h-96">
          <div className="text-xl font-semibold text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  // Show "no news available" if no news
  if (!News || News.length === 0) {
    return (
      <div className="container mt-4 mb-4 border-t-4 border-b-4">
        <div className="flex justify-center items-center h-96">
          <div className="text-xl font-semibold text-gray-600">
            No news available at the moment
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="container mt-4 mb-4 border-t-4 border-b-4 m-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex">
        {/* Left Column - News[0] and News[1] stacked vertically */}
        <div className="flex flex-col w-[34rem] border-r-2 border-indigo-950">
          {/* Main Article - News[0] */}
          {News[0] && (
            <motion.div
              className="space-y-2 p-8 rounded-md border-b-2 border-indigo-950"
              variants={itemVariants}
            >
              <h1
                onClick={() =>
                  handleNewsClick(News[0]._id, News[0]?.category?._id)
                }
                className="text-2xl font-semibold cursor-pointer hover:text-gray-600 transition-colors"
              >
                {News[0].title}
              </h1>
              <motion.div className="flex justify-between">
                <div>
                  <Share2 className="cursor-pointer" />
                </div>
                <div className="flex space-x-4">
                  <ChartBarStacked />:{" "}
                  <p className="font-bold px-3">
                    {News[0]?.category?.categoryName}
                  </p>
                  <CircleUser />:{" "}
                  <p className="font-bold px-3">{News[0]?.journalist?.name}</p>
                </div>
              </motion.div>
              <hr className="my-4" />
              {News[0]?.image?.[0]?.path && (
                <motion.img
                  className="object-cover w-full h-64 rounded-lg"
                  src={News[0].image[0].path}
                  alt={News[0].title}
                  
                  transition={{ duration: 0.3 }}
                />
              )}
              <p className="text-gray-600 leading-relaxed">
                {truncateText(News[0].description, 30, News[0]._id, News[0]?.category?._id)}
              </p>
            </motion.div>
          )}

          {/* Second Article - News[1] below News[0] */}
          {News[1] && (
            <motion.div
              className="space-y-2 p-8 rounded-md"
              variants={itemVariants}
            >
              <h2
                className="text-xl font-semibold cursor-pointer hover:text-gray-600 transition-colors"
                onClick={() =>
                  handleNewsClick(News[1]._id, News[1]?.category?._id)
                }
              >
                {News[1].title}
              </h2>
              <motion.div className="flex justify-between">
                <div>
                  <Share2 className="cursor-pointer" />
                </div>
                <div className="flex space-x-4">
                  <ChartBarStacked />:{" "}
                  <p className="font-bold px-3">
                    {News[1]?.category?.categoryName}
                  </p>
                  <CircleUser />:{" "}
                  <p className="font-bold px-3">{News[1]?.journalist?.name}</p>
                </div>
              </motion.div>
              <hr className="my-4" />
              {News[1]?.image?.[0]?.path && (
                <motion.img
                  className="object-cover w-full h-48 rounded-lg"
                  src={News[1].image[0].path}
                  alt={News[1].title}
                  
                  transition={{ duration: 0.3 }}
                />
              )}
              <p className="text-gray-600 leading-relaxed">
                {truncateText(News[1].description, 25, News[1]._id, News[1]?.category?._id)}
              </p>
            </motion.div>
          )}
        </div>

        {/* Center Column - Hero Article (News[2]) */}
        {News[2] && (
          <motion.div
            className="p-8 space-y-2 grow basis-6xl rounded-md border-r-2 border-indigo-950"
            variants={itemVariants}
          >
            <h1
              className="border-2 text-5xl font-bold p-2 cursor-pointer hover:text-gray-600 transition-colors"
              onClick={() =>
                handleNewsClick(News[2]._id, News[2]?.category?._id)
              }
            >
              {News[2].title}
            </h1>

            <motion.div className="flex justify-between">
              <div>
                <Share2 className="cursor-pointer" />
              </div>
              <div className="flex space-x-4">
                <ChartBarStacked />:{" "}
                <p className="font-bold px-3">
                  {News[2]?.category?.categoryName}
                </p>
                <CircleUser />:{" "}
                <p className="font-bold px-3">{News[2]?.journalist?.name}</p>
              </div>
            </motion.div>
            <hr className="my-4" />

            {News[2]?.image?.[0]?.path && (
              <motion.img
                className="w-full h-96 object-cover rounded-lg"
                src={News[2].image[0].path}
                alt={News[2].title}
                
                transition={{ duration: 0.3 }}
              />
            )}
            <p className="text-gray-600 leading-relaxed">
              {truncateText(News[2].description, 40, News[2]._id, News[2]?.category?._id)}
            </p>
          </motion.div>
        )}

        {/* Right Column - Popular Articles */}
        {popularNews && popularNews.length > 0 && (
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
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3
                        className="font-medium text-gray-900 leading-snug hover:text-gray-600 cursor-pointer"
                        onClick={() =>
                          handleNewsClick(article._id, article.category?._id)
                        }
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
        )}
      </div>

      {/* Bottom Section - News[3] if it exists */}
      {News[3] && (
        <motion.div
          className="container mx-auto px-4 border-t-2 mt-6"
          variants={containerVariants}
        >
          <motion.div
            className="p-6 rounded-lg"
            variants={itemVariants}
          >
            <div className="space-y-6">
              <h1
                className="text-4xl font-serif font-bold leading-tight cursor-pointer hover:text-gray-600 transition-colors"
                onClick={() =>
                  handleNewsClick(News[3]._id, News[3]?.category?._id)
                }
              >
                {News[3].title}
              </h1>

              <motion.div className="flex justify-between">
                <div>
                  <Share2 className="cursor-pointer" />
                </div>
                <div className="flex space-x-4">
                  <ChartBarStacked />:{" "}
                  <p className="font-bold px-3">
                    {News[3]?.category?.categoryName}
                  </p>
                  <CircleUser />:{" "}
                  <p className="font-bold px-3">
                    {News[3]?.journalist?.name}
                  </p>
                </div>
              </motion.div>

              <hr className="my-4" />

              <div className="flex gap-6">
                {News[3]?.image?.[0]?.path && (
                  <motion.img
                    src={News[3].image[0].path}
                    className="w-1/2 h-96 object-cover rounded-lg"
                    alt={News[3].title}
                    
                    transition={{ duration: 0.3 }}
                  />
                )}
                <div className="w-1/2">
                  <p className="text-gray-600 leading-relaxed">
                    {truncateText(News[3].description, 35, News[3]._id, News[3]?.category?._id)}
                  </p>
                  
                  {/* Advertisement section */}
                  <div className="border-t pt-6 mt-6">
                    <div className="flex gap-6">
                      <motion.img
                        src={img4}
                        className="w-1/3 h-48 object-cover rounded-lg"
                        
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
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}