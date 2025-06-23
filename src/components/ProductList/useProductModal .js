// hooks/useProductModal.js
import { useState } from 'react';

export const useProductModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'edit', 'create'

  const openModal = (product = null, mode = 'view') => {
    setSelectedProduct(product);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setModalMode('view');
  };

  const openEditModal = (product) => {
    openModal(product, 'edit');
  };

  const openCreateModal = () => {
    openModal(null, 'create');
  };

  const openViewModal = (product) => {
    openModal(product, 'view');
  };

  return {
    isModalOpen,
    selectedProduct,
    modalMode,
    openModal,
    closeModal,
    openEditModal,
    openCreateModal,
    openViewModal,
    setSelectedProduct
  };
};