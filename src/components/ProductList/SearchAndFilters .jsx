import React from 'react';
import { validCategories, getCategoryDisplayName } from './category';

const SearchAndFilters = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categoryCounts
}) => {
  return (
    <div className="filters-section">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products by name, brand, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="category-filters">
        <button
          className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All Products ({categoryCounts.all})
        </button>
        {validCategories.map(category => (
          <button
            key={category}
            className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {getCategoryDisplayName(category)} ({categoryCounts[category] || 0})
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchAndFilters;