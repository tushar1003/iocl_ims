import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import useRedirectLoggedOutUser from '../../../customHook/useRedirectLoggedOutUser';
import { selectIsLoggedIn } from '../../../redux/features/auth/authSlice';
import { getProduct } from '../../../redux/features/product/productSlice';
import Card from '../../card/Card';
import { SpinnerImg } from '../../loader/Loader';
import './ProductDetail.scss';
import DOMPurify from 'dompurify';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { utils as XLSXUtils, write as writeXLSX } from 'xlsx';
const COLORS = ['#8884d8', '#82ca9d'];

const ProductDetail = () => {
  useRedirectLoggedOutUser('/login');
  const dispatch = useDispatch();

  const { id } = useParams();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const { product, isLoading, isError, message } = useSelector(
    (state) => state.product
  );

  const stockStatus = (quantity) => {
    if (quantity > 0) {
      return <span className='--color-success'>In Stock</span>;
    }
    return <span className='--color-danger'>Out Of Stock</span>;
  };
  const [transactions, setTransactions] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
  const [transactionLabels, setTransactionLabels] = useState([]);
  const [transactionTypeDistribution, setTransactionTypeDistribution] =
    useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  useEffect(() => {
    if (isLoggedIn === true) {
      dispatch(getProduct(id));
    }

    if (isError) {
      console.log(message);
    }
    axios
      .get('https://iocl-ims-frontend.onrender.com/api/transactions')
      .then((response) => {
        const filteredTransactions = response.data.filter(
          (transaction) => transaction.productId._id === id
        );

        const sortedTransactions = filteredTransactions.sort(
          (a, b) => new Date(b.date) - new Date(a.date) // Sort in descending order
        );
        setTransactions(sortedTransactions);

        const lastTwoDays = new Date();
        lastTwoDays.setDate(lastTwoDays.getDate() - 2);
        const relevantTransactions = sortedTransactions.filter(
          (transaction) => new Date(transaction.date) > lastTwoDays
        );

        // Group transactions by date
        const groupedTransactions = {};
        relevantTransactions.forEach((transaction) => {
          const transactionDate = new Date(
            transaction.date
          ).toLocaleDateString();
          if (!groupedTransactions[transactionDate]) {
            groupedTransactions[transactionDate] = 1;
          } else {
            groupedTransactions[transactionDate] += 1;
          }
        });

        const labels = Object.keys(groupedTransactions);
        const data = labels.map((label) => ({
          date: label,
          count: groupedTransactions[label],
        }));

        setTransactionLabels(labels);
        setTransactionData(data);
        const incomingCount = relevantTransactions.filter(
          (transaction) => transaction.transactionType === 'incoming'
        ).length;
        const outgoingCount = relevantTransactions.length - incomingCount;
        setTransactionTypeDistribution([
          { name: 'Incoming', value: incomingCount },
          { name: 'Outgoing', value: outgoingCount },
        ]);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [isLoggedIn, isError, message, dispatch]);
  const barData = {
    labels: transactionLabels,
    datasets: [
      {
        label: 'Number of Transactions',
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.6)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: transactionData,
      },
    ],
  };

  const pieData = transactionTypeDistribution;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem);
  var val = 1;
  const convertToIST = (utcTime) => {
    const utcDate = new Date(utcTime);
    const istOffset = 0; // 5 hours 30 minutes in milliseconds
    const istDate = new Date(utcDate.getTime() + istOffset);
    return istDate.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };
  function convertToLocalDate(utcTimestamp) {
    const utcDate = new Date(utcTimestamp);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const localDateString = utcDate.toLocaleDateString('en-US', options);
    return localDateString;
  }

  var val1=1;
  function downloadExcel() {
    const data = transactions.map(transaction => {
      return {
        'Sr. No.': val1++,
        'Date': convertToLocalDate(transaction.date),
        'Time': convertToIST(transaction.updatedAt),
        'Product Name': transaction.productId.name,
        'Transaction Type': transaction.transactionType,
        'Quantity Incoming/Outgoing': transaction.quantity,
        'Quantity Started': transaction.productId.quantity,
        'Invoice': transaction.invoice,
        'Venture Name': transaction.ventureName,
      };
    });
  
    const worksheet = XLSXUtils.json_to_sheet(data);
    const workbook = XLSXUtils.book_new();
    XLSXUtils.book_append_sheet(workbook, worksheet, 'Transactions');
  
    const excelBuffer = writeXLSX(workbook, { bookType: 'xlsx', type: 'buffer' });
    const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const excelUrl = URL.createObjectURL(excelBlob);
  
    const link = document.createElement('a');
    link.href = excelUrl;
    link.download = 'transactions.xlsx';
    link.click();
  }
  return (
    <div className='product-detail'>
      <h3 className='--mt'>Product Detail</h3>
      <div className='product-container'>
        <div className='product-card'>
          <Card cardClass='card'>
            {isLoading && <SpinnerImg />}
            {product && (
              <div className='detail'>
                <Card cardClass='group'>
                  {product?.image ? (
                    <img
                      src={product.image.filePath}
                      alt={product.image.fileName}
                    />
                  ) : (
                    <p>No image set for this product</p>
                  )}
                </Card>
                <h4>Product Availability: {stockStatus(product.quantity)}</h4>
                <hr />
                <h4>
                  <span className='badge'>Name: </span> &nbsp; {product.name}
                </h4>
                <p>
                  <b>&rarr; SKU : </b> {product.sku}
                </p>
                <p>
                  <b>&rarr; Category : </b> {product.category}
                </p>
                <p>
                  <b>&rarr; Subcategory : </b> {product.subcategory}
                </p>
                <p>
                  <b>&rarr; MaxQuantity : </b>
                  {product.maxQuantity}
                </p>
                <p>
                  <b>&rarr; Quantity in stock : </b> {product.quantity}
                </p>
                {/* <p>
              <b>&rarr; Total Value in stock : </b> {"$"}
              {product.maxQuantity * product.quantity}
            </p> */}
                <hr />
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(product.description),
                  }}
                ></div>
                <hr />
                <code className='--color-dark'>
                  Created on: {product.createdAt.toLocaleString('en-US')}
                </code>
                <br />
                <code className='--color-dark'>
                  Last Updated: {product.updatedAt.toLocaleString('en-US')}
                </code>
              </div>
            )}
          </Card>
        </div>
        <div className='bar-chart'>
          <h2>Transactions in the Last 2 Days (Bar Chart)</h2>
          <BarChart width={600} height={300} data={transactionData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='date' />
            <YAxis />
            <Tooltip />
            <Bar dataKey='count' fill='#8884d8' />
          </BarChart>
        </div>
      </div>
      <div className='product-container'>
        <div className='transactions'>
          <h2>Transactions</h2>
          <div>
          <button className="download-button" onClick={downloadExcel}>Download Excel</button>
          <table>
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Date</th>
                <th>Time</th>
                <th>Product Name</th>
                <th>Transaction Type</th>
                <th>Quantity Incoming/Outgoing</th>
                <th>Quantity Started</th>
                <th>Invoice</th>
                <th>Venture Name</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((transaction) => (
                <tr
                  key={transaction._id}
                  className={
                    transaction.transactionType === 'incoming'
                      ? 'incoming'
                      : 'outgoing'
                  }
                >
                  <td>{val++}</td>
                  <td>{convertToLocalDate(transaction.date)}</td>
                  <td>{convertToIST(transaction.updatedAt)}</td>
                  <td>{transaction.productId.name}</td>
                  <td>{transaction.transactionType}</td>
                  <td>{transaction.quantity}</td>
                  <td>{transaction.productId.quantity}</td>
                  <td>{transaction.invoice}</td>
                  <td>{transaction.ventureName}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <div className='pagination'>
            {/* Previous button */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            {/* Page number */}
            <span>{currentPage}</span>
            {/* Next button */}
            <button
              disabled={indexOfLastItem >= transactions.length}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>

        <div className='pie-chart'>
          <h2>Transaction Type Distribution (Pie Chart)</h2>
          <PieChart width={400} height={300}>
            <Pie
              dataKey='value'
              isAnimationActive={false}
              data={pieData}
              cx='50%'
              cy='50%'
              outerRadius={80}
              fill='#8884d8'
              label
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
