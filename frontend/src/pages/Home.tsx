import React from 'react';
import { Link } from 'react-router-dom';
import App from '../App';
import '../index.css';

const Home: React.FC = () => {
  return (
    <>
      <div style={{ 
        position: 'fixed', 
        top: '20px', 
        right: '20px', 
        zIndex: 1000 
      }}>
        <Link 
          to="/admin" 
          style={{
            padding: '10px 20px',
            background: '#4CAF50',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}
        >
          Admin Panel
        </Link>
      </div>
      <App />
    </>
  );
};

export default Home;
