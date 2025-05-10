import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { categories } from '../data/mockData';
interface CategoryFilterProps {
  setCat: React.Dispatch<React.SetStateAction<string>>;
}
const CategoryFilter: React.FC<CategoryFilterProps> = ({setCat}) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentCategory = searchParams.get('category') || 'all';
console.log(currentCategory)
  return (
    <div className="mb-8 overflow-x-auto pb-2">
      <div className="flex space-x-2 min-w-max">
        <Link
          to="/"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
            currentCategory === 'all'
              ? 'bg-blue-800 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700'
          }`}
          onClick={()=> setCat("all")}
        >
          All
        </Link>
        
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/?category=${category.slug}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              currentCategory === category.slug
                ? 'bg-blue-800 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700'
            }`}
            onClick={()=> setCat(currentCategory)}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;