// src/components/AdminControls.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminControls.css'; // Import the CSS file

const AdminControls = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch list of users from the server
    axios.get('https://iocl-ims-frontend.onrender.com/api/users/all')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const handleRoleChange = (userId, isAdmin) => {
    // Update user role on the server
    axios.put('https://iocl-ims-frontend.onrender.com/api/users/updateRole', { userId, isAdmin })
      .then(response => {
        const updatedUser = response.data;
        setUsers(users.map(user => user._id === userId ? updatedUser : user));
      })
      .catch(error => {
        console.error('Error updating user role:', error);
      });
  };

  return (
    <div className="admin-controls-container">
      <h1 className="admin-controls-header">SuperAdmin Controls</h1>
      <table className="admin-controls-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Is Admin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.isAdmin ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => handleRoleChange(user._id, !user.isAdmin)}>
                  {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminControls;
