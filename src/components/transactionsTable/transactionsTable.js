import React, { useEffect, useState } from 'react';
import axios from 'axios'; // You need to install axios using "npm install axios" or "yarn add axios"
import './transactionsTable.css';
import { utils as XLSXUtils, write as writeXLSX } from 'xlsx';
import DataTable from 'react-data-table-component';
import TransactionQueryForm from './TransactionQueryForm';

// ... (rest of your code)
function TransactionsTable() {
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [flag,setFlag]=useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const handleQuerySearch = ({
    category,
    subcategory,
    productName,
    startDate,
    endDate,
    transactionType,
    ventureName,
  }) => {
    // Filter transactions based on query parameters
    const filteredData = transactions.filter((transaction) => {
      const isCategoryMatch =
        !category || transaction.productId.category === category;
      const isSubcategoryMatch =
        !subcategory || transaction.productId.subcategory === subcategory;
      const isProductNameMatch =
        !productName || transaction.productId.name.toLowerCase() === productName.toLowerCase();
      const isTransactionTypeMatch =
        !transactionType || transaction.transactionType === transactionType;
      const isVentureMatch =
        !ventureName || transaction.ventureName.toLowerCase() === ventureName.toLowerCase();
      const isDateMatch =
        (!startDate || new Date(transaction.date) >= new Date(startDate)) &&
        (!endDate || new Date(transaction.date) <= new Date(endDate));

      return (
        isCategoryMatch &&
        isSubcategoryMatch &&
        isProductNameMatch &&
        isDateMatch &&
        isTransactionTypeMatch &&
        isVentureMatch
      );
    });

    // Update filtered transactions state
    setFilteredTransactions(filteredData);
  };
  useEffect(() => {
    // Fetch transactions data from API
    axios
      .get('https://iocl-ims-frontend.onrender.com/api/transactions')
      .then((response) => {
        const sortedTransactions = response.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date) // Sort in descending order
        );
        setTransactions(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);
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
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem);
  var val1 = 1;
  function downloadExcel() {
    const data = filteredTransactions.map((transaction) => {
      return {
        'Sr. No.': val1++,
        Date: convertToLocalDate(transaction.date),
        Time: convertToIST(transaction.updatedAt),
        'Product Name': transaction.productId.name,
        Category: transaction.productId.category,
        subcategory: transaction.productId.subcategory,
        'Transaction Type': transaction.transactionType,
        'Quantity Incoming/Outgoing': transaction.quantity,
        Invoice: transaction.invoice,
        'Venture Name': transaction.ventureName,
      };
    });

    const worksheet = XLSXUtils.json_to_sheet(data);
    const workbook = XLSXUtils.book_new();
    XLSXUtils.book_append_sheet(workbook, worksheet, 'Transactions');

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
    link.download = 'transactions.xlsx';
    link.click();
  }
  const [filterText, setFilterText] = useState('');

  const columns = [
    { name: 'Sr. No.', selector: (row) => row._id },
    {
      name: 'Date',
      selector: (row) => new Date(row.date).toLocaleDateString(),
    },
    {
      name: 'Time',
      selector: (row) => new Date(row.updatedAt).toLocaleTimeString(),
    },
    // { name: 'Product Name', selector: (row) => row.productId.name },
    {
      name: 'Product Name',
      selector: (row) => row.productId.name,
      sortable: true,
      grow: 2,
      cell: (row) => <div>{row.productId.name}</div>,
      format: (row) =>
        row.productId.name.toLowerCase().includes(filterText.toLowerCase()),
    },
    { name: 'Category', selector: (row) => row.productId.category },
    { name: 'Subcategory', selector: (row) => row.productId.subcategory },
    { name: 'Transaction Type', selector: (row) => row.transactionType },
    { name: 'Quantity Incoming/Outgoing', selector: (row) => row.quantity },
    { name: 'Invoice', selector: (row) => row.invoice },
    { name: 'Venture Name', selector: (row) => row.ventureName },
  ];

  const filteredData = currentItems.filter((item) =>
    item.productId.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const dataTableExtensions = {
    // Search bar component
    filter: true,
    onFilter: (e) => setFilterText(e.target.value),
    // Paginated data
    pagination: true,
    // Data to display
    data: filteredData,
  };

  return (
    <div>
      {/* <table>
      <thead>
        <tr>
          <th>Sr. No.</th>
          <th>Date</th>
          <th>Time</th>
          <th>Product Name</th>
          <th>Category</th>
          <th>subcategory</th>
          <th>Transaction Type</th>
          <th>Quantity Incoming/Outgoing</th>
          <th>Invoice</th>
          <th>Venture Name</th>
        </tr>
      </thead>
      <tbody>
        {currentItems.map(transaction => (
          <tr key={transaction._id} className={transaction.transactionType === 'incoming' ? 'incoming' : 'outgoing'}>
            <td>{val++}</td>
            <td>{convertToLocalDate(transaction.date)}</td>
            <td>{convertToIST(transaction.updatedAt)}</td>
            <td>{transaction.productId.name}</td>
            <td>{transaction.productId.category}</td>
            <td>{transaction.productId.subcategory}</td>
            <td>{transaction.transactionType}</td>
            <td>{transaction.quantity}</td>
            <td>{transaction.invoice}</td>
            <td>{transaction.ventureName}</td>
          </tr>
        ))}
      </tbody>
    </table> */}
      {/* <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span>{currentPage}</span>
        <button
          disabled={indexOfLastItem >= transactions.length}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div> */}
      {/* <DataTable
      title="Transactions"
      columns={columns}
      data={transactions}
      pagination
      highlightOnHover
      striped
      defaultSortField="date"
      defaultSortAsc={false}
      paginationPerPage={10}
    /> */}
      <TransactionQueryForm onSearch={handleQuerySearch} setFlag={setFlag}/>{' '}
      {/* Render the query form */}
      {flag==true && (<DataTable
        title='Transactions'
        columns={columns}
        data={
          filteredTransactions
        }
        pagination
        highlightOnHover
        striped
        defaultSortField='date'
        defaultSortAsc={false}
        paginationPerPage={10}
        filter
        customStyles={{
          rows: {
            style: {
              minHeight: '48px', // Adjust the row height if needed
            },
          },
        }}
        conditionalRowStyles={[
          {
            when: (row) => row.transactionType === 'outgoing',
            style: {
              backgroundColor: '#ffcdd2',
              color: '#333',
            },
          },
          {
            when: (row) => row.transactionType === 'incoming',
            style: {
              backgroundColor: '#c8e6c9',
              color: '#333',
            },
          },
        ]}
      />)}

      {flag==true && (<button className='download-button' onClick={downloadExcel}>
        Download Excel
      </button>)}
    </div>
  );
}

export default TransactionsTable;
