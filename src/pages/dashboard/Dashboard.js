import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductList from "../../components/product/productList/ProductList";
import ProductSummary from "../../components/product/productSummary/ProductSummary";
import TransactionsTable from "../../components/transactionsTable/transactionsTable";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import { selectIsLoggedIn } from "../../redux/features/auth/authSlice";
import { getProducts } from "../../redux/features/product/productSlice";
import axios from "axios";
const Dashboard = () => {
  useRedirectLoggedOutUser("/login"); 
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const { products, isLoading, isError, message } = useSelector(
    (state) => state.product
  );
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    if (isLoggedIn === true) {
      dispatch(getProducts());
    }
    if (isError) {
      console.log(message);
    }
  }, [isLoggedIn, isError, message, dispatch]);
  


  return (
    <div>
      <ProductSummary products={products} />
      <ProductList products={products} isLoading={isLoading} flag={true}/>
      {/* <h2>
        Transactions
      </h2> */}
      {/* <TransactionsTable /> */}
    </div>
  );
};

export default Dashboard;
