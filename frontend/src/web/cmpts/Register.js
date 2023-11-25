// Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import styled from 'styled-components';

const StyledRegister = styled.div`
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  display: flex;
  flex-direction: column;
`;

const StyledLabel = styled.label`
  display: block;
  margin-bottom: 10px;
  font-size: 14px;
`;

const StyledInput = styled.input`
  width: calc(100% - 20px);
  padding: 10px;
  margin-bottom: 15px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 16px;
`;

const StyledSelect = styled.select`
  width: calc(100% - 20px);
  padding: 10px;
  margin-bottom: 15px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 16px;
`;

const StyledButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  align-self: flex-end;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
`;

const Register = () => {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('patient');

  const handleRegisterFormSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('Enter a valid email address.');
      return;
    }
  
    try {
      await handleRegister(username, email, password, role);
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <StyledRegister>
      <h2>Register</h2>
      <form onSubmit={handleRegisterFormSubmit}>
        <div className="form-group">
          <StyledLabel htmlFor="username">Username:</StyledLabel>
          <StyledInput
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <StyledLabel htmlFor="password">Password:</StyledLabel>
          <StyledInput
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <StyledLabel htmlFor="email">Email:</StyledLabel>
          <StyledInput
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <StyledLabel htmlFor="role">Role:</StyledLabel>
          <StyledSelect
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </StyledSelect>
        </div>
        <StyledButton type="submit">Register</StyledButton>
      </form>
    </StyledRegister>
  );
};

export default Register;
