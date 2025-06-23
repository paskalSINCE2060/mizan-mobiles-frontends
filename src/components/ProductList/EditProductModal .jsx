import React from 'react';
import { validCategories, getCategoryDisplayName, PLACEHOLDER_IMAGE } from './category';

const EditProductModal = ({
  isOpen,
  editFormData,
  errors,
  imagePreview,
  onClose,
  onChange,
  onImageChange,
  onSave
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content edit-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Product</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="edit-form">
          <div className="form-row">
            <div className="form-group">
              <label>Product Name *</label>
              <input 
                name="name" 
                value={editFormData.name} 
                onChange={onChange}
                required 
              />
              {errors.name && <small className="error">{errors.name}</small>}
            </div>

            <div className="form-group">
              <label>Brand</label>
              <input 
                name="brand" 
                value={editFormData.brand} 
                onChange={onChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea 
              name="description" 
              value={editFormData.description} 
              onChange={onChange}
              required 
              rows="3"
            />
            {errors.description && <small className="error">{errors.description}</small>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Current Price *</label>
              <input 
                name="price" 
                type="number" 
                step="0.01"
                value={editFormData.price} 
                onChange={onChange}
                required 
              />
              {errors.price && <small className="error">{errors.price}</small>}
            </div>

            <div className="form-group">
              <label>Original Price (optional)</label>
              <input 
                name="oldPrice" 
                type="number" 
                step="0.01"
                value={editFormData.oldPrice} 
                onChange={onChange}
                placeholder="Must be greater than current price"
              />
              {errors.oldPrice && <small className="error">{errors.oldPrice}</small>}
              <small className="field-hint">Leave empty if no discount. Must be higher than current price to show discount.</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select 
                name="category" 
                value={editFormData.category} 
                onChange={onChange}
                required 
              >
                <option value="">Select Category</option>
                {validCategories.map(cat => (
                  <option key={cat} value={cat}>
                    {getCategoryDisplayName(cat)}
                  </option>
                ))}
              </select>
              {errors.category && <small className="error">{errors.category}</small>}
            </div>

            <div className="form-group">
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={editFormData.featured}
                    onChange={onChange}
                  />
                  Featured Product
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={editFormData.inStock}
                    onChange={onChange}
                  />
                  In Stock
                </label>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="specs-section">
            <h4>Specifications</h4>
            <div className="specs-grid">
              {['storage', 'display', 'battery', 'camera', 'connectivity', 'features', 'sensors', 'color'].map(spec => (
                <input
                  key={spec}
                  name={`specs.${spec}`}
                  placeholder={spec.charAt(0).toUpperCase() + spec.slice(1)}
                  value={editFormData.specs[spec]}
                  onChange={onChange}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Product Image</label>
            <input type="file" accept="image/*" onChange={onImageChange} />
            {imagePreview && (
              <div className="image-preview-container">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="image-preview"
                  onError={(e) => {
                    e.target.src = PLACEHOLDER_IMAGE;
                  }}
                />
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn-save">Save Changes</button>
            <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;