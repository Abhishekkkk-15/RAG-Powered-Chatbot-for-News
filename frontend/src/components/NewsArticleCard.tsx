import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from '../utils/dateUtils';
import { Article } from '../types';

interface NewsArticleCardProps {
  article: Article;
  featured?: boolean;
}

const NewsArticleCard: React.FC<NewsArticleCardProps> = ({ article, featured = false }) => {
  const { article_id, title, description, source, publishedAt, urlToImage, category,url } = article;
 

  return (
    <Link 
      to={url}
      className={`
        group block overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300
        bg-white dark:bg-slate-800 h-full
        ${featured ? 'md:grid md:grid-cols-2 gap-4' : ''}
      `}
    >
      <div className={`relative overflow-hidden ${featured ? 'h-64 md:h-full' : 'h-48'}`}>
        <img 
          src={urlToImage} 
          alt={title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
        />
        <div className="absolute top-0 left-0 m-3">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-800 text-white rounded-full capitalize">
            {category || " category "}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className={`font-bold text-gray-900 dark:text-white group-hover:text-blue-800 dark:group-hover:text-blue-400 transition-colors duration-200 ${featured ? 'text-xl md:text-2xl' : 'text-lg'}`}>
          {title}
        </h3>
        
        <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-2">
          {description}
        </p>
        
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="text-gray-500 dark:text-gray-400">
            {/* <span>{source || " source "}</span> */}
            <span className="mx-2">•</span>
            <span>{formatDistanceToNow(new Date(publishedAt))}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NewsArticleCard;