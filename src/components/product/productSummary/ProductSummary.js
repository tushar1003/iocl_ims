import React, { useEffect, useState } from 'react';
import './ProductSummary.scss';
import { AiFillDollarCircle } from 'react-icons/ai';
import { BsCart4, BsCartX } from 'react-icons/bs';
import { BiCategory } from 'react-icons/bi';
import InfoBox from '../../infoBox/InfoBox';
import { useDispatch, useSelector } from 'react-redux';
import {
  CALC_CATEGORY,
  CALC_OUTOFSTOCK,
  CALC_STORE_VALUE,
  selectCategory,
  selectOutOfStock,
  selectTotalStoreValue,
} from '../../../redux/features/product/productSlice';
import { utils as XLSXUtils, write as writeXLSX } from 'xlsx';
import { AiOutlineDownload } from "react-icons/ai";
import InventoryBarChart from './InventoryBarChart';
// Icons
const earningIcon = <AiFillDollarCircle size={40} color='#fff' />;
const productIcon = <BsCart4 size={40} color='#fff' />;
const categoryIcon = <BiCategory size={40} color='#fff' />;
const outOfStockIcon = <BsCartX size={40} color='#fff' />;

// Format Amount
export const formatNumbers = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const ProductSummary = ({ products }) => {
  const [outOfStockProducts, setOutOfStockProducts] = useState([]);
  const dispatch = useDispatch();
  const totalStoreValue = useSelector(selectTotalStoreValue);
  const outOfStock = useSelector(selectOutOfStock);
  const category = useSelector(selectCategory);

  useEffect(() => {
    dispatch(CALC_STORE_VALUE(products));
    dispatch(CALC_OUTOFSTOCK(products));
    dispatch(CALC_CATEGORY(products));
    const outOfStockProductsList = products.filter(
      (product) => product.quantity === 0
    );
    setOutOfStockProducts(outOfStockProductsList);
  }, [dispatch, products]);

  const generateOutOfStockExcel = () => {
    const data = outOfStockProducts.map((product) => {
      return {
        'Product Name': product.name,
        Category: product.category,
        Subcaegory: product.subcategory,
        // Add other columns if needed
      };
    });

    const worksheet = XLSXUtils.json_to_sheet(data);
    const workbook = XLSXUtils.book_new();
    XLSXUtils.book_append_sheet(workbook, worksheet, 'Out of Stock Products');

    const excelBuffer = writeXLSX(workbook, {
      bookType: 'xlsx',
      type: 'buffer',
    });
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const excelUrl = URL.createObjectURL(excelBlob);

    const link = document.createElement('a');
    link.href = excelUrl;
    link.download = 'out-of-stock-products.xlsx';
    link.click();
  };

  return (
    <div className='product-summary'>
      <h3 className='--mt'>INVENTORY AT GLANCE</h3>
      <div className='info-summary'>
        <InfoBox
          icon={productIcon}
          title={'Total Products'}
          count={products.length}
          bgColor='card1'
        />
        <InfoBox
          icon={outOfStockIcon}
          title={'Out of Stock'}
          count={outOfStock}
          bgColor='card3'
        />
        <div className='info-box'>
          {/* <span className='info-icon --color-white'>{icon}</span> */}
          
          <button onClick={generateOutOfStockExcel} className='tooltip-btn'>
          {' '}
          <AiOutlineDownload className='icon-download'  size={35}/>

        </button>
        </div>
        <InventoryBarChart totalProducts={products.length} totalOutOfStock={outOfStock} />
      </div>
    </div>
  );
};

export default ProductSummary;
