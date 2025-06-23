// utils/productHelpers.js

// Format price with currency symbol
export const formatPrice = (price, currency = '$') => {
  if (price === null || price === undefined) return 'N/A';
  
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) return 'N/A';
  
  return `${currency}${numPrice.toFixed(2)}`;
};

// Format stock quantity
export const formatStock = (stock) => {
  if (stock === null || stock === undefined) return 'N/A';
  
  const numStock = parseInt(stock);
  if (isNaN(numStock)) return 'N/A';
  
  return numStock.toLocaleString();
};

// Get stock status based on quantity
export const getStockStatus = (stock, lowStockThreshold = 10) => {
  if (stock === 0) return 'out-of-stock';
  if (stock <= lowStockThreshold) return 'low-stock';
  return 'in-stock';
};

// Get stock status display text
export const getStockStatusText = (stock, lowStockThreshold = 10) => {
  const status = getStockStatus(stock, lowStockThreshold);
  
  switch (status) {
    case 'out-of-stock':
      return 'Out of Stock';
    case 'low-stock':
      return 'Low Stock';
    case 'in-stock':
      return 'In Stock';
    default:
      return 'Unknown';
  }
};

// Get stock status color class
export const getStockStatusColor = (stock, lowStockThreshold = 10) => {
  const status = getStockStatus(stock, lowStockThreshold);
  
  switch (status) {
    case 'out-of-stock':
      return 'text-red-600 bg-red-100';
    case 'low-stock':
      return 'text-yellow-600 bg-yellow-100';
    case 'in-stock':
      return 'text-green-600 bg-green-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

// Truncate text to specified length
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Generate slug from product name
export const generateSlug = (name) => {
  if (!name) return '';
  
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

// Calculate discount percentage
export const calculateDiscountPercentage = (originalPrice, salePrice) => {
  if (!originalPrice || !salePrice || originalPrice <= salePrice) return 0;
  
  const discount = ((originalPrice - salePrice) / originalPrice) * 100;
  return Math.round(discount);
};

// Format date for display
export const formatDate = (date) => {
  if (!date) return 'N/A';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format date and time for display
export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get relative time (e.g., "2 hours ago")
export const getRelativeTime = (date) => {
  if (!date) return 'N/A';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  const now = new Date();
  const diffMs = now - dateObj;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return formatDate(date);
};

// Convert file size to human readable format
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Generate random SKU
export const generateSKU = (prefix = 'PRD') => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

// Check if product is on sale
export const isProductOnSale = (product) => {
  return product.salePrice && product.salePrice < product.price;
};

// Get product status badge color
export const getProductStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'text-green-800 bg-green-100';
    case 'inactive':
      return 'text-gray-800 bg-gray-100';
    case 'out_of_stock':
      return 'text-red-800 bg-red-100';
    case 'discontinued':
      return 'text-red-800 bg-red-100';
    default:
      return 'text-gray-800 bg-gray-100';
  }
};

// Sort products by different criteria
export const sortProducts = (products, sortBy) => {
  if (!products || !Array.isArray(products)) return [];
  
  const sorted = [...products];
  
  switch (sortBy) {
    case 'name_asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name_desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'price_asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'stock_asc':
      return sorted.sort((a, b) => a.stock - b.stock);
    case 'stock_desc':
      return sorted.sort((a, b) => b.stock - a.stock);
    case 'created_at_desc':
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'created_at_asc':
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    default:
      return sorted;
  }
};