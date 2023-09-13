import React, { useState } from 'react';
import './TransactionQueryForm.css'; // Import your custom CSS for styling

const TransactionQueryForm = ({ onSearch ,setFlag}) => {
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [productName, setProductName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [ventureName, setVentureName] = useState('');

  const categories = ["Maintenance", "Safety", "Electricals", "Stationary", "Others"];
  const subcategoriesByCategory = {
    "Maintenance": ["Carousels", "LPG Pumps", "LPG Compressors", "General Machines", "TLD", "General Spares", "Air Compressors"],
    "Safety": ["Fire Engine", "Jokey Pump", "Security Compressor", "Fire Fighting Equip"],
    "Electricals": ["DG Sets", "Transformers", "PMCC Panels Spare", "Electrical Spares", "Cables"],
    "Stationary": ["Stationary"],
    "Others": ["Others"],
  };

  const handleSearch = () => {
    // Call the onSearch function with the entered values
    onSearch({
      category,
      subcategory,
      productName,
      startDate,
      endDate,
      transactionType,
      ventureName,
    });
  };

  const handleClear = () => {
    setCategory('');
    setSubcategory('');
    setProductName('');
    setStartDate('');
    setEndDate('');
    setTransactionType('');
    setVentureName('');
  };

  return (
    <div className="horizontal-form">
      <h2>Transaction Query</h2>
      <div className="form-row">
        <div className="form-group">
        <label>Category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Subcategory:</label>
        <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)}>
          <option value="">Select Subcategory</option>
          {category ? subcategoriesByCategory[category].map((subcat) => (
            <option key={subcat} value={subcat}>
              {subcat}
            </option>
          )) : null}
        </select>
      </div>
      <div className="form-group">
        <label>Product Name:</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </div>
      <div className="form-group">
          <label>Transaction Type:</label>
          <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
            <option value="">Select Transaction Type</option>
            <option value="incoming">Incoming</option>
            <option value="outgoing">Outgoing</option>
          </select>
        </div>
        <div className="form-group">
          <label>Vendor/Supplier Name:</label>
          <input type="text" value={ventureName} onChange={(e) => setVentureName(e.target.value)} />
        </div>
      <div className="form-group">
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div className="button-group">
        <button className="search-button" onClick={()=>{handleSearch(); setFlag(true);}}>Search</button>
        <button className="clear-button" onClick={()=>{handleClear();}}>Clear</button>
      </div>
      </div>
    </div>
  );
};

export default TransactionQueryForm;
