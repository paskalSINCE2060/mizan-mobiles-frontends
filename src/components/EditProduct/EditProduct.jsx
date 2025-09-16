import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    fetch(`https://mizan-mobile-backend-mizan.up.railway.app/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => {
        toast.error("Failed to load product data");
        console.error(err);
      });
  }, [id]);

  const validate = () => {
    const errs = {};
    if (!product.name.trim()) errs.name = "Name is required";
    if (!product.description.trim()) errs.description = "Description is required";
    if (!product.price || isNaN(product.price) || Number(product.price) <= 0)
      errs.price = "Price must be a positive number";
    const imageUrlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i;
    if (!imageUrlRegex.test(product.image))
      errs.image = "Enter a valid image URL (jpg/png/gif/webp)";
    return errs;
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // Drag & drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle file selection or drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Trigger file input click
  const onButtonClick = () => {
    inputRef.current.click();
  };

  // Upload image to backend
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image file to upload.");
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Selected file is not an image.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await fetch("https://mizan-mobile-backend-mizan.up.railway.app/api/upload/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setProduct((prev) => ({ ...prev, image: data.imageUrl }));
      toast.success("Image uploaded successfully!");
      setShowModal(false);
      setSelectedFile(null);
    } catch (error) {
      toast.error("Image upload failed.");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await fetch(`https://mizan-mobile-backend-mizan.up.railway.app/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (res.ok) {
        toast.success("Product updated successfully!");
        setTimeout(() => {
          navigate("/products");
        }, 1500);
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to update product");
      }
    } catch (error) {
      toast.error("Network error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 15 }}>
          <label>Name</label>
          <br />
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          />
          {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>Description</label>
          <br />
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            rows={4}
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          />
          {errors.description && (
            <p style={{ color: "red" }}>{errors.description}</p>
          )}
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>Price</label>
          <br />
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          />
          {errors.price && <p style={{ color: "red" }}>{errors.price}</p>}
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>Product Image</label>
          <br />
          {product.image && (
            <img
              src={product.image}
              alt="Product"
              style={{
                maxWidth: "100%",
                maxHeight: 250,
                borderRadius: 8,
                marginBottom: 10,
                objectFit: "contain",
              }}
            />
          )}
          <br />
          <button
            type="button"
            onClick={() => setShowModal(true)}
            style={{
              padding: "8px 16px",
              cursor: "pointer",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#0056b3")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#007bff")
            }
          >
            Upload New Image
          </button>
          {errors.image && <p style={{ color: "red" }}>{errors.image}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            cursor: loading ? "not-allowed" : "pointer",
            backgroundColor: loading ? "#6c757d" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: 4,
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = "#218838";
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = "#28a745";
          }}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {/* Modal */}
      {showModal && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 8,
              maxWidth: 450,
              width: "90%",
              boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
              textAlign: "center",
              position: "relative",
            }}
          >
            <h3>Upload Image</h3>

            <div
              onClick={onButtonClick}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              style={{
                marginTop: 15,
                padding: 40,
                border: "3px dashed #007bff",
                borderRadius: 8,
                backgroundColor: dragActive ? "#e9f5ff" : "transparent",
                color: dragActive ? "#0056b3" : "#007bff",
                cursor: "pointer",
                userSelect: "none",
                transition: "background-color 0.3s, color 0.3s",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              {selectedFile
                ? `Selected file: ${selectedFile.name}`
                : "Drag & drop an image here, or click to select"}
            </div>

            <input
              type="file"
              accept="image/*"
              ref={inputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <div style={{ marginTop: 20 }}>
              <button
                onClick={handleUpload}
                disabled={uploading}
                style={{
                  marginRight: 10,
                  padding: "8px 16px",
                  backgroundColor: "#28a745",
                  border: "none",
                  color: "white",
                  borderRadius: 4,
                  cursor: uploading ? "not-allowed" : "pointer",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) => {
                  if (!uploading) e.currentTarget.style.backgroundColor = "#218838";
                }}
                onMouseLeave={(e) => {
                  if (!uploading) e.currentTarget.style.backgroundColor = "#28a745";
                }}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>

              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedFile(null);
                  setDragActive(false);
                }}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#dc3545",
                  border: "none",
                  color: "white",
                  borderRadius: 4,
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#b02a37";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#dc3545";
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProduct;
