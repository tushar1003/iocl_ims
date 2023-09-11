import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Card from '../../card/Card';
import Modal from 'react-modal';
import './ProductForm.scss';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '600px',
    maxHeight: '90vh',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.2)',
    overflowY: 'auto',
  },
};

const ProductForm = ({
  product,
  productImage,
  imagePreview,
  description,
  setDescription,
  handleInputChange,
  handleImageChange,
  saveProduct,
}) => {
  const categories = [
    'Maintenance',
    'Safety',
    'Electricals',
    'Stationary',
    'Others',
  ]; // Your hardcoded categories
  const subcategoriesByCategory = {
    Maintenance: [
      'Carousels',
      'LPG Pumps',
      'LPG Compressors',
      'General Machines',
      'TLD',
      'General Spares',
      'Air Compressors',
    ],
    Safety: [
      'Fire Engine',
      'Jokey Pump',
      'Security Compressor',
      'Fire Fighting Equip',
    ],
    Electricals: [
      'DG Sets',
      'Transformers',
      'PMCC Panels Spare',
      'Electrical Spares',
      'Cables',
    ],
    Stationary: ['Stationary'],
    Others: ['Others'],
  };
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setSelectedCategory(selectedCategory);
    setSelectedSubcategory('');
  };
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => {
    setModalIsOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setModalIsOpen(false);
  };
  return (
    <div className='add-product'>
      <button className='--btn --btn-primary' onClick={openModal}>
        Add/Edit Product
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel='Add Product Modal'
         style={customStyles}
      >
        <div className='add-product'>
      <Card cardClass={'card'}>
        <form onSubmit={saveProduct}>
          <Card cardClass={'group'}>
            <label>Product Image</label>
            <code className='--color-dark'>
              Supported Formats: jpg, jpeg, png
            </code>
            <input
              type='file'
              name='image'
              onChange={(e) => handleImageChange(e)}
            />

            {imagePreview != null ? (
              <div className='image-preview'>
                <img src={imagePreview} alt='product' />
              </div>
            ) : (
              <p>No image set for this poduct.</p>
            )}
          </Card>
          <label>Product Name:</label>
          <input
            type='text'
            placeholder='Product name'
            name='name'
            value={product?.name}
            onChange={handleInputChange}
          />

          <label>Product Category:</label>
          <select
            name='category'
            value={product?.category}
            onChange={handleInputChange}
          >
            <option value=''>Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <label>Product Subcategory:</label>
          <select
            name='subcategory'
            value={product?.subcategory}
            onChange={handleInputChange}
          >
            <option value=''>Select a subcategory</option>
            {subcategoriesByCategory[product?.category]?.map((subcategory) => (
              <option key={subcategory} value={subcategory}>
                {subcategory}
              </option>
            ))}
          </select>

          <label>Product maxQuantity:</label>
          <input
            type='text'
            placeholder='Product maxQuantity'
            name='maxQuantity'
            value={product?.maxQuantity}
            onChange={handleInputChange}
          />

          <label>Product Quantity:</label>
          <input
            type='text'
            placeholder='Product Quantity'
            name='quantity'
            value={product?.quantity}
            onChange={handleInputChange}
          />

          <label>Product Description:</label>
          <ReactQuill
            theme='snow'
            value={description}
            onChange={setDescription}
            modules={ProductForm.modules}
            formats={ProductForm.formats}
          />

          <div className='--my'>
            <button type='submit' className='--btn --btn-primary'>
              Save Product
            </button>
          </div>
        </form>
      </Card>
      </div>
      </Modal>
    </div>
  );
};

ProductForm.modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['clean'],
  ],
};
ProductForm.formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'color',
  'background',
  'list',
  'bullet',
  'indent',
  'link',
  'video',
  'image',
  'code-block',
  'align',
];

export default ProductForm;
