import React, { useContext, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/home/index.jsx";
import About from "../pages/about";
import NotFound from '../shared/components/NotFound';
import Contact from '../pages/contact';
import Templates from '../pages/admin/templates';
import Login from '../pages/auth/login';
import Register from '../pages/auth/register';
import ForgetPassword from '../pages/auth/forget-password';
import VerifyEmail from '../pages/auth/verify-email';
import PrivateRoutes from './PrivateRoutes';
import AdminLayout from '../layouts/AdminLayout';
import DashBoard from '../pages/admin/dashboard';
import PostForm from '../pages/admin/templates/create';
import AddUser from '../pages/admin/Adduser';
import { AuthContext } from '../context/Authcontext';
import MainUser from '../pages/app';
import AdminLogin from '../pages/admin/adminLogin/index.jsx';

const AppRoutes = () => {
  const navigate = useNavigate()
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    // if(user) {
    //   navigate('/app')
    // } else {
    //   navigate('/')
    // }
  }, [user])
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route element={<PrivateRoutes />}>
          <Route path="dashboard" element={<></>} />
        </Route>
        <Route path="app" element={<MainUser />} />
        <Route path="verify-whatsapp" element={<VerifyEmail />} />
        <Route path="forget-password" element={<ForgetPassword />} />
      </Route>
      <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
      {/* Admin Routes with AdminLayout */}
      <Route element={<AdminLayout />}>
          <Route index element={<DashBoard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<DashBoard />} />
          <Route path="/admin/dashboard/add-user" element={<AddUser />} />
          <Route path="/admin/templates" element={<Templates />} />
          <Route path="/admin/templates/create" element={<PostForm />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes