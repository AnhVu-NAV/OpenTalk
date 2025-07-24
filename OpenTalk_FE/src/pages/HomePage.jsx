import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from "../helper/auth.jsx";

const HomePage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      const { role } = user.role;

      if (role === '2') {
        navigate('/admin/dashboard');
        console.log('abc');
      } else {
        navigate('/user/home');
      }
    }
  }, [user, navigate]);

  return (
    <div>
    </div>
  );
};

export default HomePage;
