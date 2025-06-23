import React from 'react';
import ProductCard from './ProductCard';
import NoProducts from './NoProducts ';

const ProductGrid = ({
  products,
  onEdit,
  onDelete,
  getSafeImageUrl,
  handleImageError,
  selectedCategory,
  searchTerm,
  setSelectedCategory,
  setSearchTerm
}) => {
  if (products.length === 0) {
    return (
      <NoProducts
        selectedCategory={selectedCategory}
        searchTerm={searchTerm}
        onClearFilters={() => {
          setSelectedCategory('all');
          setSearchTerm('');
        }}
      />
    );
  }

  return (
    <div className="admin-products-grid">
      {products.map(product => (
        <ProductCard
          key={product._id}
          product={product}
          onEdit={() => onEdit(product)}
          onDelete={() => onDelete(product._id, product.name)}
          getSafeImageUrl={getSafeImageUrl}
          handleImageError={handleImageError}
        />
      ))}
    </div>
  );
};

export default ProductGrid;