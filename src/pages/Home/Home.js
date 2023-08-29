import React from 'react';
import { RiProductHuntLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import './Home.scss';
import heroImg from '../../assets/inv-img.png';
import { ShowOnLogin, ShowOnLogout } from '../../components/protect/HiddenLink';
import img from './iocl-image.png';
import img1 from './indane.png';
import Login from '../auth/Login.js';
import Register from '../auth/Register.js';
const Home = () => {
  return (
    <div className='home'>
      <div className='box'>
        <img
          src='https://iocl.com/assets/images/logo.gif'
          alt=''
          className='logo'
        />
        <p className='description'>
          INVENTORY MANAGEMENT SYSTEM<br></br> &nbsp; &nbsp; @ KANPUR BOTTLING PLANT
          
        </p>
        <img src={img1} alt='' className='image1' />
      </div>


      <div className='loginclass'>
        <Login />
      </div>
    </div>
  );
};

const NumberText = ({ num, text }) => {
  return (
    <div className='--mr'>
      <h3 className='--color-white'>{num}</h3>
      <p className='--color-white'>{text}</p>
    </div>
  );
};

export default Home;
