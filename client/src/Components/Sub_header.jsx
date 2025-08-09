import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function SubHeader() {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCateopry = async () => {
      try {
        setLoading(true);
        const data = await fetch("http://localhost:4040/api/category/all");
        const categories = await data.json();

        if (categories.success && categories.data) {
          setCategory(categories.data);
        } else {
          console.log("No categories found or API error:", categories.msg);
          setCategory([]); // Set empty array if no categories
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to fetch categories");
        setCategory([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchCateopry();
  }, []);

  return (
    <div className="flex justify-between items-center border-b-2 ">
      {/* Left - Newspaper Section */}
      <div className="border-r-2 py-3 px-6">
        <button className="flex items-center space-x-2 hover:text-gray-600 transition-colors">
          <span className="font-medium">Newspaper</span>
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      {/* Center - Navigation */}
      <nav className="flex px-6">
        <ul className="flex items-center space-x-8">
          {loading ? (
            <li>
              <span className="py-3 text-sm text-gray-500">
                Loading categories...
              </span>
            </li>
          ) : error ? (
            <li>
              <span className="py-3 text-sm text-red-500">
                Error loading categories
              </span>
            </li>
          ) : category && category.length > 0 ? (
            category.map((item, index) => (
              <li key={item._id || index}>
                <button className="py-3 text-sm hover:text-gray-600 transition-colors relative group cursor-pointer">
                  {item.categoryName}
                  <p className="absolute inset-x-0 bottom-0 h-0.5 bg-black scale-x-0 group-hover:scale-x-100 transition-transform" />
                </button>
              </li>
            ))
          ) : (
            <li>
              <span className="py-3 text-sm text-gray-500">
                No categories available
              </span>
            </li>
          )}
        </ul>
      </nav>

      {/* Right - Search */}
      <div className="border-l-2 py-3 px-6">
        <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
          <Search className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
