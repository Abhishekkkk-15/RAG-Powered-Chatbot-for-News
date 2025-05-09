import React, { useState, useEffect } from "react";
import NewsArticleCard from "../components/NewsArticleCard";
import CategoryFilter from "../components/CategoryFilter";

import axios from "axios";
import AIChat from "../components/AIChat";

const Home: React.FC = () => {
  //  const [close, onClose] = useState(false)

  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("all");
  useEffect(() => {
    const fetchNewsArticles = async () => {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:3000/api/articles/${category}`
      );
      console.log(data.data);
      setFilteredArticles(data.data);
      setLoading(false);
    };
    fetchNewsArticles();
  }, [category, setCategory]);

  useEffect(() => {
    async function setSession() {
     try {
       const { data } = await axios.get("http://localhost:3000/api/user/chat");
       console.log("session data",data)
       localStorage.setItem("sessionId", data.data);
     } catch (error) {
      console.log(error)
     }
    }

    const sessionId = localStorage.getItem("sessionId");
     if(!sessionId){
      setSession();
     }
    
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <CategoryFilter setCat={setCategory} />

        {/* Featured Article Skeleton */}
        <div className="mb-8">
          <div className="h-8 w-48 bg-gray-200 dark:bg-slate-700 rounded mb-4"></div>
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden">
            <div className="md:grid md:grid-cols-2 gap-4">
              <div className="h-64 md:h-full bg-gray-200 dark:bg-slate-700 animate-pulse"></div>
              <div className="p-6">
                <div className="w-24 h-6 bg-gray-200 dark:bg-slate-700 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Articles Skeleton */}
        <div>
          <div className="h-8 w-48 bg-gray-200 dark:bg-slate-700 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden"
              >
                <div className="h-48 bg-gray-200 dark:bg-slate-700 animate-pulse"></div>
                <div className="p-4">
                  <div className="w-20 h-5 bg-gray-200 dark:bg-slate-700 rounded mb-3"></div>
                  <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CategoryFilter setCat={setCategory} />

      <div className="grid grid-cols-1 gap-8">
        {filteredArticles.length > 0 ? (
          <>
            {/* Featured Article */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Featured
              </h2>
              <NewsArticleCard article={filteredArticles[0]} featured={true} />
            </div>

            {/* Latest Articles */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Latest News
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.slice(1).map((article, idx) => (
                  <NewsArticleCard key={idx} article={article} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              No articles found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Try selecting a different category
            </p>
          </div>
        )}
      </div>
      <div>
        <AIChat />
      </div>
    </div>
  );
};

export default Home;
