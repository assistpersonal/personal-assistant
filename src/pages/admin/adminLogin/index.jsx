import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import { API_URL } from '../../../config';

const AdminLogin = () => {
  const navigate = useNavigate()
  // State to store form field values
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // State to handle validation errors
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
      const isLoggedIn = localStorage.getItem('isAdmin')
      
      if(isLoggedIn === 'true') {
          navigate('/admin/dashboard')
      }
  }, [])

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Email validation (basic)
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Mobile number validation (basic

    // Password validation (basic)
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if(formData.email === 'assistantpersonal381@gmail.com' && formData.password === 'Assistant@381') {
      isValid = true
    } else {
      isValid = false
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form before submission
    if (validateForm()) {
      // Submit form data
      localStorage.setItem('isAdmin', 'true')
      navigate('/admin/dashboard')

      // Reset form after submission
      setFormData({
        email: '',
        password: ''
      });
    } else {
      toast.error('Invalid credentials')
      console.log('Form has errors');
    }
  };

  return (
    <div className="max-w-md relative mx-auto mt-10 p-8 bg-white border border-gray-300 shadow-md rounded-lg">
    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Admin Login</h2>
    <form onSubmit={handleSubmit}>

      {/* Email field */}
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email}</p>}
      </div>

      {/* Password field */}
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        {errors.password && <p className="text-red-500 text-xs mt-2">{errors.password}</p>}
      </div>

      {/* Submit button */}
      <div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          login
        </button>
      </div>
    </form>
  </div>
  )
}

export default AdminLogin