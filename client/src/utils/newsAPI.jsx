export const storeRecentRead = async (newsId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        await fetch("http://localhost:4040/api/recent-reads", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ newsId })
        });
    } catch (error) {
        console.error("Error storing recent read:", error);
    }
};

export const getRecommendations = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:4040/api/recommendations", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }
    });

    if (response.ok) {
        const data = await response.json();
        return data.data;  // Return the recommended news articles
    } else {
        console.error("Failed to fetch recommendations");
        return [];
    }
};
