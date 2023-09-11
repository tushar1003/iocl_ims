import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import ProductForm from "../../components/product/productForm/ProductForm";
import {
  createProduct,
  selectIsLoading,
} from "../../redux/features/product/productSlice";
import * as XLSX from "xlsx";
import "./AddProduct.css"
const initialState = {
  name: "",
  category: "",
  subcategory:"",
  quantity: "",
  maxQuantity: "",
};

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState(initialState);
  const [productImage, setProductImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState("");

  const isLoading = useSelector(selectIsLoading);

  const { name, category, subcategory, maxQuantity, quantity } = product;
  const [selectedFileName, setSelectedFileName] = useState(
    "Click to select an Excel file"
  );
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    setProductImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const generateKSKU = (category) => {
    const letter = category.slice(0, 3).toUpperCase();
    const number = Date.now();
    const sku = letter + "-" + number;
    return sku;
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("sku", generateKSKU(category));
    formData.append("category", category);
    formData.append("subcategory", subcategory);
    formData.append("quantity", Number(quantity));
    formData.append("maxQuantity", maxQuantity);
    formData.append("description", description);
    formData.append("image", productImage);

    console.log(...formData);
 
    await dispatch(createProduct(formData));

    navigate("/dashboard");
  };

  const [bulkFile, setBulkFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setSelectedFileName(selectedFile.name);
    }
    else{
      setSelectedFileName("Click to select an Excel file");
    }
    setBulkFile(e.target.files[0]);
  };

  const handleDownload = () => {
    const downloadLink = document.createElement("a");
    downloadLink.href = "https://docs.google.com/spreadsheets/d/1wvJFxLxC1Bv74j9A-fX6xnwzI0Tab4Gw/edit?usp=sharing&ouid=107506255592970431254&rtpof=true&sd=true"; // Replace with the actual file path
    downloadLink.download = "transactions.xlsx"; // Replace with the desired downloaded file name
    document.body.appendChild(downloadLink);
    downloadLink.click(); 
    document.body.removeChild(downloadLink);
  };
  

  const handleBulkImport = async () => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      console.log(jsonData);
      for (const productData of jsonData) {
        const formData = new FormData();
        const productCategory = productData.category || "";
        formData.append("name", productData.name);
        // formData.append("sku", generateKSKU(productCategory));
        formData.append("category",productCategory);
        formData.append("subcategory", productData.subcategory);
        formData.append("quantity", Number(productData.quantity));
        formData.append("maxQuantity", productData.maxQuantity);
        formData.append("description", productData.description);
        // You'll need to adjust the image handling based on your requirements
        // formData.append("image", productImage);
        console.log(formData);
        await dispatch(createProduct(formData));
      }

      navigate("/dashboard");
    };
    reader.readAsArrayBuffer(bulkFile);
  };

  return (
    <div className="main">
      {isLoading && <Loader />}
      <h3 className="--mt">Add New Product</h3>
      
      <ProductForm
        product={product}
        productImage={productImage}
        imagePreview={imagePreview}
        description={description}
        setDescription={setDescription}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        saveProduct={saveProduct}
      />
      <div className="file-upload-container">
        <label className="file-upload-label" htmlFor="fileInput">
          {selectedFileName}
        </label>
        <input
          type="file"
          id="fileInput"
          className="file-upload-input"
          onChange={handleFileChange}
        />
      </div>
      <button className="mass-upload-button" onClick={handleBulkImport}>
        Mass Upload Products
      </button>
      
      <button className="mass-upload-button"  onClick={handleDownload}>Download Sample File</button>
    </div>
  );
};

export default AddProduct;
