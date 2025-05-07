import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Bookmark, BookmarkCheck } from 'lucide-react';
import { Article } from '../types';
// import { articles } from '../data/mockData';
import AIChat from '../components/AIChat';
import { formatDistanceToNow } from '../utils/dateUtils';
import axios from 'axios';

const ArticleDetail: React.FC = () => {
  const { article_id } = useParams<{ article_id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  useEffect(() => {
  
     (async()=>{
      setLoading(true)
      const {data} = await axios.get(`http://localhost:3000/api/article/${article_id}`)
      setArticle(data.data)
      console.log(data.data)
      setLoading(false)
     })()
      
   
  }, []);
  
  const toggleBookmark = () => {
    if (!article) return;
    
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    
    if (isBookmarked) {
      const newBookmarks = bookmarks.filter((bookmarkId: string) => bookmarkId !== article.article_id);
      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
    } else {
      bookmarks.push(article.article_id);
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    
    setIsBookmarked(!isBookmarked);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-slate-700 max-w-md mx-auto rounded"></div>
          <div className="mt-4 h-4 bg-gray-200 dark:bg-slate-700 max-w-sm mx-auto rounded"></div>
          <div className="mt-8 h-64 bg-gray-200 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Article not found</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">The article you're looking for doesn't exist.</p>
        <Link to="/" className="mt-4 inline-flex items-center text-blue-800 dark:text-blue-400 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-blue-800 dark:text-blue-400 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to News
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <article className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
            <div className="h-64 sm:h-80 md:h-96 overflow-hidden">
              <img 
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-800 text-white rounded-full capitalize">
                    {article.category}
                  </span>
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>{article.source}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDistanceToNow(new Date(article.publishedAt))}</span>
                  </div>
                </div>
                
                <button 
                  onClick={toggleBookmark}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
                  aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="w-5 h-5 text-blue-800 dark:text-blue-400" />
                  ) : (
                    <Bookmark className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  )}
                </button>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {article.title}
              </h1>
              
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 text-lg font-medium mb-6">
                  {article.description}
                </p>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  {article.content}
                </p>
                
                <div className="mt-6 text-gray-700 dark:text-gray-300">
                  <p><strong>Author:</strong> {article.creator}</p>
                </div>
              </div>
            </div>
          </article>
        </div>
        
        <div className="lg:col-span-1">
          <AIChat/>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;