// utils/productValidation.js
import { VALIDATION_RULES, ERROR_MESSAGES } from './productConstants';

export const validateProduct = (product) => {
  const errors = {};

  // Validate name
  if (!product.name || product.name.trim().length === 0) {
    errors.name = 'Product name is required';
  } else if (product.name.trim().length < VALIDATION_RULES.NAME.minLength) {
    errors.name = `Product name must be at least ${VALIDATION_RULES.NAME.minLength} characters`;
  } else if (product.name.trim().length > VALIDATION_RULES.NAME.maxLength) {
    errors.name = `Product name must not exceed ${VALIDATION_RULES.NAME.maxLength} characters`;
  }

  // Validate description
  if (product.description && product.description.length > VALIDATION_RULES.DESCRIPTION.maxLength) {
    errors.description = `Description must not exceed ${VALIDATION_RULES.DESCRIPTION.maxLength} characters`;
  }

  // Validate price
  if (!product.price && product.price !== 0) {
    errors.price = 'Price is required';
  } else {
    const price = parseFloat(product.price);
    if (isNaN(price)) {
      errors.price = 'Price must be a valid number';
    } else if (price < VALIDATION_RULES.PRICE.min) {
      errors.price = `Price must be at least ${VALIDATION_RULES.PRICE.min}`;
    } else if (price > VALIDATION_RULES.PRICE.max) {
      errors.price = `Price must not exceed ${VALIDATION_RULES.PRICE.max}`;
    }
  }

  // Validate stock
  if (!product.stock && product.stock !== 0) {
    errors.stock = 'Stock quantity is required';
  } else {
    const stock = parseInt(product.stock);
    if (isNaN(stock)) {
      errors.stock = 'Stock must be a valid number';
    } else if (stock < VALIDATION_RULES.STOCK.min) {
      errors.stock = `Stock must be at least ${VALIDATION_RULES.STOCK.min}`;
    } else if (stock > VALIDATION_RULES.STOCK.max) {
      errors.stock = `Stock must not exceed ${VALIDATION_RULES.STOCK.max}`;
    }
  }

  // Validate SKU
  if (!product.sku || product.sku.trim().length === 0) {
    errors.sku = 'SKU is required';
  } else if (product.sku.trim().length < VALIDATION_RULES.SKU.minLength) {
    errors.sku = `SKU must be at least ${VALIDATION_RULES.SKU.minLength} characters`;
  } else if (product.sku.trim().length > VALIDATION_RULES.SKU.maxLength) {
    errors.sku = `SKU must not exceed ${VALIDATION_RULES.SKU.maxLength} characters`;
  }

  // Validate category
  if (!product.category || product.category.trim().length === 0) {
    errors.category = 'Category is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateBulkAction = (selectedProducts, action) => {
  if (!selectedProducts || selectedProducts.length === 0) {
    return {
      isValid: false,
      error: 'Please select at least one product'
    };
  }

  if (!action) {
    return {
      isValid: false,
      error: 'Please select an action'
    };
  }

  return {
    isValid: true,
    error: null
  };
};

export const validateSearchQuery = (query) => {
  if (!query || query.trim().length === 0) {
    return {
      isValid: false,
      error: 'Search query cannot be empty'
    };
  }

  if (query.trim().length < 2) {
    return {
      isValid: false,
      error: 'Search query must be at least 2 characters'
    };
  }

  return {
    isValid: true,
    error: null
  };
};

export const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!file) {
    return {
      isValid: false,
      error: 'Please select an image file'
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Only JPEG, PNG, GIF, and WebP files are allowed'
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Image file must be smaller than 5MB'
    };
  }

  return {
    isValid: true,
    error: null
  };
};

export const sanitizeProductData = (product) => {
  return {
    ...product,
    name: product.name?.trim(),
    description: product.description?.trim(),
    sku: product.sku?.trim(),
    category: product.category?.trim(),
    brand: product.brand?.trim(),
    price: parseFloat(product.price) || 0,
    stock: parseInt(product.stock) || 0,
    status: product.status || 'active'
  };
};