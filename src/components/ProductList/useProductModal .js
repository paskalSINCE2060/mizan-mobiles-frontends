import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { validCategories } from './category';

export const useProductModal = (token, products, fetchProducts) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    brand: '',
    description: '',
    price: '',
    oldPrice: '',
    category: '',
    featured: false,
    inStock: true,
    specs: {
      storage: '',
      display: '',
      battery: '',
      camera: '',
      connectivity: '',
      features: '',
      sensors: '',
      color: ''
    }
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');

  // Open edit modal
  const openEditModal = useCallback((product) => {
    console.log('Opening edit modal for product:', product);
    setEditProduct(product);
    setEditFormData({
      name: product.name || '',
      brand: product.brand || '',
      description: product.description || '',
      price: product.price || '',
      oldPrice: product.oldPrice || '',
      category: product.category || '',
      featured: product.featured || false,
      inStock: product.inStock !== undefined ? product.inStock : true,
      specs: {
        storage: product.specs?.storage || '',
        display: product.specs?.display || '',
        battery: product.specs?.battery || '',
        camera: product.specs?.camera || '',
        connectivity: product.specs?.connectivity || '',
        features: product.specs?.features || '',
        sensors: product.specs?.sensors || '',
        color: product.specs?.color || ''
      }
    });
    setImagePreview(product.image || '');
    setErrors({});
    setModalOpen(true);
  }, []);

  // Close edit modal
  const closeEditModal = useCallback(() => {
    setModalOpen(false);
    setEditProduct(null);
    setEditFormData({
      name: '',
      brand: '',
      description: '',
      price: '',
      oldPrice: '',
      category: '',
      featured: false,
      inStock: true,
      specs: {
        storage: '',
        display: '',
        battery: '',
        camera: '',
        connectivity: '',
        features: '',
        sensors: '',
        color: ''
      }
    });
    setImagePreview('');
    setErrors({});
  }, []);

  // Handle form changes
  const handleEditChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('specs.')) {
      const specName = name.split('.')[1];
      setEditFormData(prev => ({
        ...prev,
        specs: {
          ...prev.specs,
          [specName]: value
        }
      }));
    } else {
      setEditFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  // Handle image changes
  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Here you would typically upload the file to your server
      // For now, we'll just use the preview
      toast.info('Image selected. Note: Actual upload functionality needs to be implemented.');
    }
  }, []);

  // Validate form data - FIXED VERSION
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!editFormData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!editFormData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    const currentPrice = parseFloat(editFormData.price);
    if (!editFormData.price || isNaN(currentPrice) || currentPrice <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    // FIXED: Only validate oldPrice if it has a value and is not empty
    if (editFormData.oldPrice && editFormData.oldPrice.toString().trim() !== '') {
      const oldPrice = parseFloat(editFormData.oldPrice);
      if (isNaN(oldPrice) || oldPrice <= 0) {
        newErrors.oldPrice = 'Original price must be a positive number';
      } else if (!isNaN(currentPrice) && oldPrice <= currentPrice) {
        // Only compare if currentPrice is valid
        newErrors.oldPrice = 'Original price must be higher than current price';
        console.log('Price validation:', {
          oldPrice,
          currentPrice,
          oldPriceType: typeof oldPrice,
          currentPriceType: typeof currentPrice,
          comparison: oldPrice <= currentPrice
        });
      }
    }
    
    if (!editFormData.category) {
      newErrors.category = 'Category is required';
    } else if (!validCategories.includes(editFormData.category)) {
      newErrors.category = 'Invalid category selected';
    }
    
    return newErrors;
  }, [editFormData]);

  // Save edit - FIXED VERSION
  const handleSaveEdit = useCallback(async () => {
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the validation errors before saving');
      return;
    }
    
    try {
      // Prepare the data with proper type conversion
      const updateData = {
        name: editFormData.name.trim(),
        brand: editFormData.brand.trim(),
        description: editFormData.description.trim(),
        price: parseFloat(editFormData.price),
        category: editFormData.category,
        featured: editFormData.featured,
        inStock: editFormData.inStock,
        // Clean up specs - remove empty values
        specs: Object.fromEntries(
          Object.entries(editFormData.specs).filter(([key, value]) => value && value.trim() !== '')
        )
      };

      // Only add oldPrice if it exists, is not empty, and is different from current oldPrice
      if (editFormData.oldPrice && editFormData.oldPrice.toString().trim() !== '') {
        const newOldPrice = parseFloat(editFormData.oldPrice);
        // Only send oldPrice if it's actually changing or if it's a valid value greater than price
        if (newOldPrice > updateData.price) {
          updateData.oldPrice = newOldPrice;
        }
      }

      console.log('Sending update data:', updateData);
      console.log('Current price:', updateData.price, typeof updateData.price);
      console.log('Old price:', updateData.oldPrice, typeof updateData.oldPrice);
      
      const response = await fetch(`https://mizan-mobile-backend-mizan.up.railway.app/api/products/${editProduct._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server response:', errorData);
        throw new Error(errorData.message || 'Failed to update product');
      }
      
      // FIXED: Remove the unused variable
      await response.json();
      toast.success('Product updated successfully!');
      
      // Refresh products list
      if (fetchProducts) {
        await fetchProducts();
      }
      
      closeEditModal();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error.message || 'Failed to update product');
    }
  }, [editProduct, editFormData, token, fetchProducts, closeEditModal, validateForm]);

  return {
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
  };
};