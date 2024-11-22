import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const SignupPage = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState('');

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    address: Yup.string().required('Address is required'),
    phoneNo: Yup.string().required('Phone number is required'),
    profilePicture: Yup.mixed().required('Profile picture is required')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      address: '',
      phoneNo: '',
      profilePicture: null
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('password', values.password);
        formData.append('address', values.address);
        formData.append('phoneNo', values.phoneNo);
        formData.append('profilePicture', values.profilePicture);

        const response = await axios.post(
          "http://localhost:5000/api/auth/signup",
          formData,
          { withCredentials: true }
        );

        setSuccess(response.data.message);
        setTimeout(() => {
          formik.resetForm();
          navigate("/verify");
        }, 3000);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          formik.setFieldError('general', err.response.data.message);
        } else {
          formik.setFieldError('general', 'Signup failed. Please try again.');
        }
        setTimeout(() => formik.setFieldError('general', ''), 2000);
      }
    }
  });

  const handleFileChange = (e) => {
    formik.setFieldValue('profilePicture', e.target.files[0]);
  };

  return (
    <div>
      <Header />
      <div className="flex justify-center items-center min-h-screen bg-stone-200">
        <div className="flex w-full max-w-5xl bg-white shadow-lg rounded-lg transition-shadow duration-300 hover:shadow-2xl">
          <div className="hidden md:flex md:w-1/2">
            <img src="/images/signup.jpg" alt="Sign Up" className="object-cover w-full h-full rounded-l-lg" />
          </div>
          <div className="w-full md:w-1/2 p-8 pt-16 space-y-6">
            <h2 className="text-3xl font-bold text-center text-gray-900">Sign Up</h2>
            {formik.errors.general && <p className="text-red-600 text-center">{formik.errors.general}</p>}
            {success && <p className="text-green-600 text-center">{success}</p>}
            <form className="space-y-4" onSubmit={formik.handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-base font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your name"
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-red-600 text-sm">{formik.errors.name}</p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-base font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your email"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-600 text-sm">{formik.errors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="block text-base font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your password"
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-600 text-sm">{formik.errors.password}</p>
                )}
              </div>
              <div>
                <label htmlFor="address" className="block text-base font-medium text-gray-700">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your address"
                />
                {formik.touched.address && formik.errors.address && (
                  <p className="text-red-600 text-sm">{formik.errors.address}</p>
                )}
              </div>
              <div>
                <label htmlFor="phoneNo" className="block text-base font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phoneNo"
                  name="phoneNo"
                  value={formik.values.phoneNo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your phone number"
                />
                {formik.touched.phoneNo && formik.errors.phoneNo && (
                  <p className="text-red-600 text-sm">{formik.errors.phoneNo}</p>
                )}
              </div>
              <div>
                <label htmlFor="profilePicture" className="block text-base font-medium text-gray-700">
                  Profile Picture
                </label>
                <input
                  type="file"
                  id="profilePicture"
                  name="profilePicture"
                  onChange={handleFileChange}
                  onBlur={formik.handleBlur}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
                {formik.touched.profilePicture && formik.errors.profilePicture && (
                  <p className="text-red-600 text-sm">{formik.errors.profilePicture}</p>
                )}
              </div>
              <button type="submit" className="w-full bg-slate-600 text-white py-2 px-4 rounded-md hover:bg-slate-800 transition duration-200">
                Sign Up
              </button>
            </form>
            <div className="text-center">
              <p className="text-base text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-600 hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;