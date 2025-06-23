import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProductList.css';

import LoadingSpinner from './LoadingSpinner';
import AccessDenied from './AccessDenied ';
import SearchAndFilters from './SearchAndFilters ';
import ProductGrid from './ProductGrid ';
import Pagination from './Pagination ';
import EditProductModal from './EditProductModal ';
import { useProductData } from './useProductData ';
import { useProductFilters } from './useProductFilters ';
import { useProductModal } from './useProductModal ';
import { getCategoryDisplayName } from './category';

const ProductList = () => {
  const user = useSelector(state => state.auth?.user);
  const token = useSelector(state => state.auth?.token);

  // Custom hooks for data management
  const {
    products,
    loading,
    handleImageError,
    getSafeImageUrl,
    fetchProducts,
    handleDelete
  } = useProductData(token);

  const {
    filteredProducts,
    currentPage,
    setCurrentPage,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    categoryCounts,
    currentProducts,
    totalPages
  } = useProductFilters(products);

  const {
    modalOpen,
    editProduct,
    editFormData,
    errors,
    imagePreview,
    openEditModal,
    closeEditModal,
    handleEditChange,
    handleImageChange,
    handleSaveEdit
  } = useProductModal(token, products, fetchProducts);

  // Initial data fetch
  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token, fetchProducts]);

  // Authentication and authorization checks
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <AccessDenied type="auth" />;
  }

  if (user.role !== 'admin') {
    return <AccessDenied type="admin" userRole={user.role} />;
  }

  return (
    <div className="admin-product-list">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="page-header">
        <h1>Product Management</h1>
        <p className="subtitle">Manage your product inventory</p>
      </div>

      <SearchAndFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categoryCounts={categoryCounts}
      />

      <div className="results-info">
        <p>Showing {currentProducts.length} of {filteredProducts.length} products
          {selectedCategory !== 'all' && ` in ${getCategoryDisplayName(selectedCategory)}`}
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      </div>

      <ProductGrid
        products={currentProducts}
        onEdit={openEditModal}
        onDelete={handleDelete}
        getSafeImageUrl={getSafeImageUrl}
        handleImageError={handleImageError}
        selectedCategory={selectedCategory}
        searchTerm={searchTerm}
        setSelectedCategory={setSelectedCategory}
        setSearchTerm={setSearchTerm}
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {modalOpen && (
        <EditProductModal
          isOpen={modalOpen}
          editProduct={editProduct}
          editFormData={editFormData}
          errors={errors}
          imagePreview={imagePreview}
          onClose={closeEditModal}
          onChange={handleEditChange}
          onImageChange={handleImageChange}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default ProductList;