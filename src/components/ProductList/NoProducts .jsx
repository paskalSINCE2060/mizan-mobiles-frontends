import React from 'react';
import { getCategoryDisplayName } from './category';

const NoProducts = ({ selectedCategory, searchTerm, onClearFilters }) => {
  return (
    <div className="no-products">
      <div className="no-products-content">
        <h3>No products found</h3>
        {selectedCategory !== 'all' ? (
          <p>No products in {getCategoryDisplayName(selectedCategory)} category.</p>
        ) : searchTerm ? (
          <p>No products match your search "{searchTerm}".</p>
        ) : (
          <p>No products have been added yet.</p>
        )}
        <button className="btn-clear-filters" onClick={onClearFilters}>
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default NoProducts;