import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/card/Card';
import Loader from '../../components/loader/Loader';
import { selectUser } from '../../redux/features/auth/authSlice';
import './Profile.scss';
import { toast } from 'react-toastify';
import { updateUser } from '../../services/authService';
import ChangePassword from '../../components/changePassword/ChangePassword';
import Modal from 'react-modal';

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
const EditProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector(selectUser);
  const { email } = user;

  useEffect(() => {
    if (!email) {
      navigate('/profile');
    }
  }, [email, navigate]);

  const initialState = {
    name: user?.name,
    email: user?.email,
    phone: user?.phone,
    bio: user?.bio,
    photo: user?.photo,
  };
  const [profile, setProfile] = useState(initialState);
  const [profileImage, setProfileImage] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Use a ref to access the modal element
  const modalRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Handle Image upload
      let imageURL;
      if (
        profileImage &&
        (profileImage.type === 'image/jpeg' ||
          profileImage.type === 'image/jpg' ||
          profileImage.type === 'image/png')
      ) {
        const image = new FormData();
        image.append('file', profileImage);
        image.append('cloud_name', 'diqbawhl5');
        image.append('upload_preset', 'jt0r8oej');

        // First save image to cloudinary
        const response = await fetch(
          'https://api.cloudinary.com/v1_1/diqbawhl5/image/upload',
          { method: 'post', body: image }
        );
        const imgData = await response.json();
        console.log(imgData);
        if (imgData.url) {
          imageURL = imgData.url.toString();
        }
        // Save Profile
        const formData = {
          name: profile.name,
          phone: profile.phone,
          bio: profile.bio,
          photo: profileImage ? imageURL : profile.photo,
        };

        const data = await updateUser(formData);
        console.log(data);
        toast.success('User updated');
        navigate('/profile');
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  // Function to close the modal
  // const closeModal = () => {
  //   setIsFormOpen(false);
  // };

  // Add a click event listener to the document
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (modalRef.current && !modalRef.current.contains(event.target)) {
  //       closeModal();
  //     }
  //   };

  //   // Attach the event listener
  //   document.addEventListener('click', handleClickOutside);

  //   // Clean up the event listener when the component unmounts
  //   return () => {
  //     document.removeEventListener('click', handleClickOutside);
  //   };
  // }, []);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => {
    setModalIsOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setModalIsOpen(false);
  };
  return (
    <div className='profile --my2'>
      {isLoading && <Loader />}

      <Card cardClass={'card --flex-dir-column'}>
        <span className='profile-photo'>
          <img src={user?.photo} alt='profilepic' />
        </span>
        <form className='--form-control --m' onSubmit={saveProfile}>
          <span className='profile-data'>
            <p>
              <label>Name:</label>
              <input
                type='text'
                name='name'
                value={profile?.name}
                onChange={handleInputChange}
              />
            </p>
            <p>
              <label>Email:</label>
              <input type='text' name='email' value={profile?.email} disabled />
              <br />
              <code>Email cannot be changed.</code>
            </p>
            <p>
              <label>Phone:</label>
              <input
                type='text'
                name='phone'
                value={profile?.phone}
                onChange={handleInputChange}
              />
            </p>
            <p>
              <label>Bio:</label>
              <textarea
                name='bio'
                value={profile?.bio}
                onChange={handleInputChange}
                cols='30'
                rows='10'
              ></textarea>
            </p>
            <p>
              <label>Photo:</label>
              <input type='file' name='image' onChange={handleImageChange} />
            </p>
            <div>
              <button className='--btn --btn-primary'>Edit Profile</button>
            </div>
          </span>
        </form>
      </Card>
      <br />
      {/* <button
        onClick={() =>{ setIsFormOpen(true);}}
        className='add-transaction-button'
      >
        Change Password
      </button> */}

      {/* {isFormOpen && (
        <div className='modal-overlay'>
          <div className='modal'>
            <ChangePassword />
            <button
        onClick={() =>{ setIsFormOpen(false);}}
        className='add-transaction-button'
      > Cancel change password</button>
          </div>
        </div>
      )} */}
      <button className='--btn --btn-primary' onClick={openModal}>
        Change Password
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel='Add Product Modal'
         style={customStyles}
      >
        <ChangePassword />
      </Modal>
    </div>
  );
};

export default EditProfile;
