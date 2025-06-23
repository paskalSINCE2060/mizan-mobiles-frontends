// constants/productConstants.js

// API Endpoints
export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  CATEGORIES: '/api/categories',
  BRANDS: '/api/brands',
  UPLOAD: '/api/upload'
};

// Product Status
export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  OUT_OF_STOCK: 'out_of_stock',
  DISCONTINUED: 'discontinued'
};

// Sort Options
export const SORT_OPTIONS = [
  { value: 'name_asc', label: 'Name (A-Z)' },
  { value: 'name_desc', label: 'Name (Z-A)' },
  { value: 'price_asc', label: 'Price (Low to High)' },
  { value: 'price_desc', label: 'Price (High to Low)' },
  { value: 'created_at_desc', label: 'Newest First' },
  { value: 'created_at_asc', label: 'Oldest First' },
  { value: 'stock_asc', label: 'Stock (Low to High)' },
  { value: 'stock_desc', label: 'Stock (High to Low)' }
];

// Items per page options
export const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

// Default values
export const DEFAULT_VALUES = {
  ITEMS_PER_PAGE: 20,
  SORT_BY: 'created_at_desc',
  SEARCH_QUERY: '',
  SELECTED_CATEGORY: '',
  SELECTED_STATUS: '',
  CURRENT_PAGE: 1
};

// Product form validation rules
export const VALIDATION_RULES = {
  NAME: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  DESCRIPTION: {
    maxLength: 1000
  },
  PRICE: {
    required: true,
    min: 0,
    max: 999999.99
  },
  STOCK: {
    required: true,
    min: 0,
    max: 999999
  },
  SKU: {
    required: true,
    minLength: 3,
    maxLength: 50
  }
};

// Error messages
export const ERROR_MESSAGES = {
  FETCH_FAILED: 'Failed to fetch products. Please try again.',
  UPDATE_FAILED: 'Failed to update product. Please try again.',
  DELETE_FAILED: 'Failed to delete product. Please try again.',
  CREATE_FAILED: 'Failed to create product. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  VALIDATION_ERROR: 'Please check the form for errors.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SERVER_ERROR: 'Server error. Please try again later.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  PRODUCT_CREATED: 'Product created successfully!',
  PRODUCT_UPDATED: 'Product updated successfully!',
  PRODUCT_DELETED: 'Product deleted successfully!',
  BULK_ACTION_COMPLETED: 'Bulk action completed successfully!'
};