import React, { useState } from "react";
import Header from "../../Components/Header";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function CreatePost() {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState("");
  const [categoryID, setcategoryID] = useState("6835505ce9ef85e51b927792");
  const navigate = useNavigate();
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setImagePreview(null);
    setImageFile(null);
  };

  const GOOGLE_API_KEY = "AIzaSyDt2Msx0JRBNSfc_QZrB3pg-U3rxFZesdc";

  async function callGemini(userText) {
   const prompt = `You are an expert news editor for a news portal.

I will give you the content description of a news article. 
Your task is to determine the most suitable category for the news.
You must only respond with ONE exact category name from the following list, exactly as written:

- Job Portal
- Advertisment
- News
- World
- Business
- Art
- Livestyle
- Sport
- Opinion
- Culture
- Education
- Politic
- Uncategorized

Rules:
- Only respond with one exact category name from the above list.
- Do not return any extra words, punctuation, or explanations.
- If the news does not clearly fit any category, respond with: Uncategorized.

News content: ${userText}
`;


    const body = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    // Safely extract text from response
    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "Uncategorized"
    );
  }
  // Mapping AI output → Your DB category IDs
  const categoryMap = {
    "Job Portal": "68354fb0e9ef85e51b927760",
    Advertisment: "68354fc0e9ef85e51b927764",
    News: "68354fd7e9ef85e51b927768",
    World: "68354fdae9ef85e51b92776c",
    Business: "68354fdde9ef85e51b927770",
    Art: "68354fe2e9ef85e51b927774",
    Livestyle: "68354fe7e9ef85e51b927778",
    Sport: "68354fece9ef85e51b92777c",
    Opinion: "68354ff1e9ef85e51b927780",
    Culture: "68354ff9e9ef85e51b927784",
    Politic: "68355000e9ef85e51b927788",
    Uncategorized: "6835505ce9ef85e51b927792",
    Education: "6835505ce9ef85e51b927795",
  };

  useEffect(() => {
    if (!content.trim()) {
      setCategory("");
      setcategoryID("");
      return;
    }

    const delay = setTimeout(() => {
      callGemini(content).then((cat) => {
        setCategory(cat);

        // Match AI category to your DB category ID
        const id = categoryMap[cat] || categoryMap["Uncategorized"];
        setcategoryID(id);
      });
    }, 1500);

    return () => clearTimeout(delay);
  }, [content]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (category == "Uncategorized") {
      setcategoryID("6835505ce9ef85e51b927792");
    } else if (category == "Politics") {
    }
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("categoryID", categoryID);
    formData.append("description", content);
    if (imageFile) formData.append("news", imageFile);

    try {
      const response = await fetch("http://localhost:4040/api/news/create", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        navigate("/homepage");
        resetForm();
      } else {
        toast.error(result.message || "Error creating post");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="shadow-amber-100 shadow-lg rounded-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Create New Post
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Enter post title"
                required
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Write your post content here..."
                required
              />

              <div className="flex flex-col space-y-6">
                <h1>Category </h1>
                <label>{category}</label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <div className="w-full">
                {imagePreview ? (
                  <div className="relative w-full aspect-video mb-4 rounded-lg overflow-hidden border border-gray-300">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition text-center"
                  >
                    <ImagePlus className="h-12 w-12 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">
                      Click to upload an image
                    </span>
                  </label>
                )}
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center items-center bg-blue-600 text-white py-3 px-6 rounded-lg font-medium transition duration-200 hover:bg-blue-700 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
              ) : null}
              {isSubmitting ? "Posting..." : "Create Post"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
