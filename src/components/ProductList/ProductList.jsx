import React, { useEffect, useState } from 'react';
import ProductCard from '../common/ProductCard ';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProductList.css';

const ProductList = () => {
  const isAdmin = useSelector(state => state.auth.user?.isAdmin);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // Modal & Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    price: '',
    oldPrice: '',
    category: '',
    image: '',       // This will hold URL or uploaded file name
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Image preview for file input
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);  // store the file to upload

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(console.error);
  }, []);

  if (!isAdmin) {
    return <p>Access denied. You must be an admin to view this page.</p>;
  }

  const openEditModal = (product) => {
    setEditProduct(product);
    setEditFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      oldPrice: product.oldPrice || '',
      category: product.category || '',
      image: product.image || '',
    });
    setImagePreview(product.image || null);
    setImageFile(null);
    setErrors({});
    setModalOpen(true);
  };

  const closeEditModal = () => {
    setModalOpen(false);
    setEditProduct(null);
    setErrors({});
    setImagePreview(null);
    setImageFile(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle file input change for image upload preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Basic validation function
  const validate = () => {
    let tempErrors = {};
    if (!editFormData.name.trim()) tempErrors.name = "Name is required";
    if (!editFormData.description.trim()) tempErrors.description = "Description is required";
    if (!editFormData.price || isNaN(editFormData.price)) tempErrors.price = "Valid price is required";
    if (editFormData.oldPrice && isNaN(editFormData.oldPrice)) tempErrors.oldPrice = "Old price must be a number";
    if (!editFormData.category.trim()) tempErrors.category = "Category is required";
    // image is optional here since you can keep old image or upload new
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Upload image helper function (if imageFile is present)
  const uploadImage = async () => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Image upload failed');
      const data = await res.json();
      return data.url; // or the returned image path/url from server
    } catch (err) {
      toast.error('Image upload failed');
      console.error(err);
      return null;
    }
  };

  const handleSaveEdit = async () => {
    if (!validate()) {
      toast.error("Please fix form errors");
      return;
    }

    let imageUrl = editFormData.image;

    if (imageFile) {
      const uploadedUrl = await uploadImage();
      if (!uploadedUrl) return; // stop if image upload failed
      imageUrl = uploadedUrl;
    }

    const updatedData = {
      ...editFormData,
      price: Number(editFormData.price),
      oldPrice: editFormData.oldPrice ? Number(editFormData.oldPrice) : '',
      image: imageUrl,
    };

    try {
      const response = await fetch(`http://localhost:5000/api/products/${editProduct._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error('Failed to update');

      const updatedProduct = await response.json();
      setProducts(products.map(p => (p._id === updatedProduct._id ? updatedProduct : p)));
      toast.success('Product updated successfully!');
      closeEditModal();
    } catch (error) {
      toast.error('Error updating product');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p._id !== id));
        toast.success('Product deleted!');
      }
      else toast.error('Failed to delete product');
    } catch {
      toast.error('Error deleting product');
    }
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div className="product-list">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>Products</h2>

      <div className="product-grid">
        {currentProducts.map(product => (
          <ProductCard
            key={product._id}
            product={product}
            isAdmin={true}
            onEdit={() => openEditModal(product)}
            onDelete={() => handleDelete(product._id)}
          />
        ))}
      </div>

      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(c => c - 1)}>⬅ Previous</button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? 'active' : ''}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(c => c + 1)}>Next ➡</button>
      </div>

      {modalOpen && (
        <div className="modal-backdrop" onClick={closeEditModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Edit Product</h3>
            <label>
              Name:
              <input name="name" value={editFormData.name} onChange={handleEditChange} />
              {errors.name && <small className="error">{errors.name}</small>}
            </label>

            <label>
              Description:
              <textarea name="description" value={editFormData.description} onChange={handleEditChange} />
              {errors.description && <small className="error">{errors.description}</small>}
            </label>

            <label>
              Price:
              <input name="price" type="number" value={editFormData.price} onChange={handleEditChange} />
              {errors.price && <small className="error">{errors.price}</small>}
            </label>

            <label>
              Old Price:
              <input name="oldPrice" type="number" value={editFormData.oldPrice} onChange={handleEditChange} />
              {errors.oldPrice && <small className="error">{errors.oldPrice}</small>}
            </label>

            <label>
              Category:
              <input name="category" value={editFormData.category} onChange={handleEditChange} />
              {errors.category && <small className="error">{errors.category}</small>}
            </label>

            <label>
              Image:
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: '120px', marginTop: '10px', borderRadius: '8px' }}
                />
              )}
            </label>

            <div style={{ marginTop: '15px' }}>
              <button onClick={handleSaveEdit} style={{ marginRight: '10px' }}>Save</button>
              <button onClick={closeEditModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
