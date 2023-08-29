import React, { useEffect, useState } from "react";
import styles from "./auth.module.scss";
import { BiLogIn } from "react-icons/bi";
import { MdInventory2 } from "react-icons/md";
import Card from "../../components/card/Card";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { loginUser, validateEmail } from "../../services/authService";
import { SET_LOGIN, SET_NAME } from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";
import { loadCaptchaEnginge, LoadCanvasTemplate, LoadCanvasTemplateNoReload, validateCaptcha } from 'react-simple-captcha';

const initialState = {
  email: "",
  password: "",
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setformData] = useState(initialState);
  const { email, password } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  useEffect(() => {
    loadCaptchaEnginge(6,'aqua');
 }, []);

//  const doSubmit = () => {
    
//  };

  const login = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("All fields are required");
    }

    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email");
    }
    let user_captcha = document.getElementById('user_captcha_input').value;

    if (validateCaptcha(user_captcha) === true) {
      //  alert('Captcha Matched');
       loadCaptchaEnginge(6,'red');
       document.getElementById('user_captcha_input').value = '';
    } else {
      //  alert('Captcha Does Not Match');
       document.getElementById('user_captcha_input').value = '';
       return toast.error("Captcha Does Not Match");
    }
    const userData = {
      email,
      password,
    };
    setIsLoading(true);
    try {
      const data = await loginUser(userData);
      console.log(data);
      await dispatch(SET_LOGIN(true));
      await dispatch(SET_NAME(data.name));
      navigate("/dashboard");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className={`container ${styles.auth}`}>
      {isLoading && <Loader />}
      <Card>
        <div className={styles.form}>
          <h2>IMS Login</h2>
          <div className="--flex-center">
          <MdInventory2 size={35} color="#999"/>
          </div>
          <form onSubmit={login}>
            <input
              type="email"
              placeholder="Email"
              required
              name="email"
              value={email}
              onChange={handleInputChange}
            />
            <input
              type="password"
              placeholder="Password"
              required
              name="password"
              value={password}
              onChange={handleInputChange}
            />
            {/* <LoadCanvasTemplate /> */}
            <div className="col mt-3">
                  <LoadCanvasTemplate />
               </div>
               <div className="col mt-3">
                  <div>
                     <input
                        placeholder="Enter Captcha Value"
                        id="user_captcha_input"
                        name="user_captcha_input"
                        type="text"
                     />
                  </div>
               </div>
            <button type="submit" className="--btn --btn-primary --btn-block">
              Login
            </button>
          </form>
          <Link to="/forgot">Forgot Password</Link>

          <span className={styles.register}>
            <Link to="/">Home</Link>
            <p> &nbsp; Don't have an account? &nbsp;</p>
            <Link to="/register">Register</Link>
          </span>
        </div>
      </Card>
    </div>
  );
};

export default Login;