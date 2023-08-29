import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectName, SET_LOGIN } from "../../redux/features/auth/authSlice";
import { logoutUser } from "../../services/authService";
import './Header.css'
import { AiOutlineLogout } from "react-icons/ai"
const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const name = useSelector(selectName);

  const logout = async () => {
    await logoutUser();
    await dispatch(SET_LOGIN(false));
    navigate("/");
  };

  return (
    <div className="--pad header">
      <div className="--flex-between">
      <img
          src='https://iocl.com/assets/images/logo.gif'
          alt=''
          className='logo'
        />
        <h2>
          <span className="--fw-thick">INVENTORY MANAGEMENT SYSTEM </span>
          {/* <span className="--color-danger">{name}</span> */}
        </h2>
        <h3 className="name">
          <span className="--fw-thin">Welcome, </span>
          <span className="--color-danger">{name}</span>
        </h3>
        <button onClick={logout} className="--btn --btn-danger logout">
        
          Logout &nbsp; &nbsp;
          <AiOutlineLogout/>
        </button>
      </div>
      <hr />
    </div>
  );
};

export default Header;
