import React, { useContext, useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import AuthProvider, { AuthContext } from '../context/Authcontext';
import { useLocation } from "react-router-dom";

const AdminLayout = ({ children }) => {
    const navigate = useNavigate()
    const { user, logout } = useContext(AuthContext);
    const [isLoggedIn, setisLoggedIn] = useState(false)
  
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isAdmin')
        if(isLoggedIn === 'true') {
          setisLoggedIn(true)
          // navigate('/admin/dashboard')
        } else {
          navigate('/admin/login')
        }
    }, [])

    const handleAdminLogout = () => {
      localStorage.removeItem('isAdmin')
      navigate('/admin/login')
      location.reload()
    }
  return (
    <AuthProvider>
    <div className="admin-layout">
      {isLoggedIn && <nav>
        <div className='flex gap-3 bg-amber-100 p-3'>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/templates">Templates</Link>
            <div className='flex justify-end  w-full'>
              <Link to="/">Home</Link>
              <Link className='ml-2' onClick={handleAdminLogout}>Logout</Link>
            </div>
        </div>
      </nav>}
      <main>
        <Outlet />
      </main>
    </div>
    </AuthProvider>
  );
};

export default AdminLayout;