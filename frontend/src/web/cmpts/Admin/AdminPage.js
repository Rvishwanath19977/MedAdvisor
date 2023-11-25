// Admin.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { getAllUsers, promoteUser } from '../../apiService';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

const Admin = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersData = await getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePromoteUser = async (userId) => {
    try {
      await promoteUser(userId);
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  
  return (
    <div className="container mt-5">
      <h2 className="mb-4">Admin Page</h2>
      {user.role === 'admin' ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  {user.role !== 'admin' && (
                    <Button
                      variant="success"
                      onClick={() => handlePromoteUser(user.id)}
                    >
                      Promote
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>You do not have permission to access this page.</p>
      )}
    </div>
  );
};

export default Admin;
