// services/productAPI.js
import { API_ENDPOINTS } from './productConstants';

class ProductAPI {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  }

  // Helper method for making API calls
  async makeRequest(url, options = {}) {
    const token = localStorage.getItem('token');
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    };

    const response = await fetch(`${this.baseURL}${url}`, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Fetch products with filters and pagination
  async fetchProducts(params = {}) {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });

    const queryString = queryParams.toString();
    const url = `${API_ENDPOINTS.PRODUCTS}${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest(url);
  }

  // Fetch single product by ID
  async fetchProductById(id) {
    return this.makeRequest(`${API_ENDPOINTS.PRODUCTS}/${id}`);
  }

  // Create new product
  async createProduct(productData) {
    return this.makeRequest(API_ENDPOINTS.PRODUCTS, {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  }

  // Update existing product
  async updateProduct(id, productData) {
    return this.makeRequest(`${API_ENDPOINTS.PRODUCTS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  }

  // Delete product
  async deleteProduct(id) {
    return this.makeRequest(`${API_ENDPOINTS.PRODUCTS}/${id}`, {
      method: 'DELETE'
    });
  }

  // Bulk delete products
  async bulkDeleteProducts(productIds) {
    return this.makeRequest(`${API_ENDPOINTS.PRODUCTS}/bulk-delete`, {
      method: 'POST',
      body: JSON.stringify({ productIds })
    });
  }

  // Bulk update products
  async bulkUpdateProducts(productIds, updateData) {
    return this.makeRequest(`${API_ENDPOINTS.PRODUCTS}/bulk-update`, {
      method: 'POST',
      body: JSON.stringify({ productIds, updateData })
    });
  }

  // Fetch categories
  async fetchCategories() {
    return this.makeRequest(API_ENDPOINTS.CATEGORIES);
  }

  // Fetch brands
  async fetchBrands() {
    return this.makeRequest(API_ENDPOINTS.BRANDS);
  }

  // Upload product image
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('token');
    
    const response = await fetch(`${this.baseURL}${API_ENDPOINTS.UPLOAD}`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || 'Upload failed');
    }

    return response.json();
  }

  // Search products
  async searchProducts(query, filters = {}) {
    const params = {
      q: query,
      ...filters
    };
    
    return this.fetchProducts(params);
  }

  // Get product statistics
  async getProductStats() {
    return this.makeRequest(`${API_ENDPOINTS.PRODUCTS}/stats`);
  }
}

export const productAPI = new ProductAPI();