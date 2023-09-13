import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../components/loader/Loader';
import ProductForm from '../../components/product/productForm/ProductForm';
import {
  getProduct,
  getProducts,
  selectIsLoading,
  selectProduct,
  updateProduct,
} from '../../redux/features/product/productSlice';
import { getUser } from '../../services/authService';
import axios from 'axios';
import './EditProduct.css';
const EditProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectIsLoading);
  const [transactionType, setTransactionType] = useState(''); // "incoming" or "outgoing"
  const [transactionDate, setTransactionDate] = useState(new Date());
  const [ventureName, setVentureName] = useState('');
  const [invoice, setInvoice] = useState('');
  const [transactionQuantity, setTransactionQuantity] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false); // To toggle the form
  const productEdit = useSelector(selectProduct);

  const [product, setProduct] = useState(productEdit);
  const [productImage, setProductImage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState('');

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    dispatch(getProduct(id));
    async function getUserData() {
      const data = await getUser();
      console.log('Edit Product');
      console.log(data);
      setProfile(data);
    }
    getUserData();
  }, [dispatch, id]);

  useEffect(() => {
    setProduct(productEdit);

    setImagePreview(
      productEdit && productEdit.image ? `${productEdit.image.filePath}` : null
    );

    setDescription(
      productEdit && productEdit.description ? productEdit.description : ''
    );
  }, [productEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    setProductImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', product?.name);

    formData.append('category', product?.category);
    formData.append('subcategory', product?.subcategory);
    formData.append('quantity', product?.quantity);
    formData.append('maxQuantity', product?.maxQuantity);
    formData.append('description', description);
    if (productImage) {
      formData.append('image', productImage);
    }

    console.log(...formData);

    await dispatch(updateProduct({ id, formData }));
    await dispatch(getProducts());
    navigate('/dashboard');
  };

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    console.log(e);
    try {
      const transactionData = {
        productId: id,
        date: transactionDate,
        ventureName,
        invoice,
        quantity: transactionQuantity,
        transactionType: transactionType,
      };

      if (transactionType === 'incoming') {
        await axios.post(
          ' https://iocl-ims-frontend.onrender.com/api/transactions/incoming',
          transactionData
        );
      } else if (transactionType === 'outgoing') {
        await axios.post(
          '  https://iocl-ims-frontend.onrender.com/api/transactions/outgoing',
          transactionData
        );
      }

      // Update product quantity and refresh product data
      await dispatch(getProducts());
      navigate('/issue-material');
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <div>
      {isLoading && <Loader />}
      <h3 className='--mt'>Edit Product</h3>
      <div className='product-form-container'>
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

        {/* <button onClick={() => setIsFormOpen(true)}>
        Add Incoming Transaction
      </button> */}
        {profile?.isAdmin === true && (
          <button
            onClick={() => setIsFormOpen(true)}
            className='add-transaction-button'
          >
            Add Transaction
          </button>
        )}

        {isFormOpen && (
          <div className='modal-overlay'>
            <div className='modal'>
              <form
                onSubmit={handleTransactionSubmit}
                style={{
                  width: '300px',
                  margin: 'auto',
                  padding: '20px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  backgroundColor: '#f9f9f9',
                }}
              >
                <label
                  style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontWeight: 'bold',
                  }}
                >
                  Transaction Type:
                  <select
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      marginBottom: '15px',
                      border: '1px solid #ccc',
                      borderRadius: '3px',
                    }}
                  >
                    <option value=''>Select Transaction Type</option>
                    <option value='incoming'>Incoming</option>
                    <option value='outgoing'>Outgoing</option>
                  </select>
                </label>
                {transactionType === 'incoming' && (
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '10px',
                      fontWeight: 'bold',
                    }}
                  >
                    {' '}
                    Challan/Invoice
                    <input
                      type='text'
                      onChange={(e) => setInvoice(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        marginBottom: '15px',
                        border: '1px solid #ccc',
                        borderRadius: '3px',
                      }}
                    />
                  </label>
                )}
                <label
                  style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontWeight: 'bold',
                  }}
                >
                  Transaction Date:
                  <input
                    type='date'
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      marginBottom: '15px',
                      border: '1px solid #ccc',
                      borderRadius: '3px',
                    }}
                  />
                </label>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontWeight: 'bold',
                  }}
                >
                  Vendor/Supplier Name:
                  <input
                    type='text'
                    value={ventureName}
                    onChange={(e) => setVentureName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      marginBottom: '15px',
                      border: '1px solid #ccc',
                      borderRadius: '3px',
                    }}
                  />
                </label>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontWeight: 'bold',
                  }}
                >
                  Transaction Quantity:
                  <input
                    type='number'
                    value={transactionQuantity}
                    onChange={(e) => setTransactionQuantity(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      marginBottom: '15px',
                      border: '1px solid #ccc',
                      borderRadius: '3px',
                    }}
                  />
                </label>
                <button
                  type='submit'
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: '2px solid black',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  Save Transaction
                </button>
                <button onClick={() => setIsFormOpen(false)}
                style={{
                  display: 'block',
                  width: '100%',
                  margin:'4px 0px',
                  padding: '10px',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  border: '2px solid black',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s ease',
                }}
                >
                  Cancel Transaction
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProduct;
