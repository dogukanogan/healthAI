import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Registration() {
  const [formData, setFormData] = useState({ full_name: '', email: '' });
  const [status, setStatus] = useState({ type: '', message: '' });

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (!formData.full_name.trim()) {
      setStatus({ type: 'error', message: 'Full name is required' });
      return;
    }

    if (!formData.email || !validateEmail(formData.email)) {
      setStatus({ type: 'error', message: 'Valid email is required' });
      return;
    }

    try {
      await axios.post(`${API_URL}/api/people`, formData);
      setStatus({ type: 'success', message: 'Person successfully registered!' });
      setFormData({ full_name: '', email: '' });
    } catch (error) {
      if (error.response?.data?.error === 'EMAIL_ALREADY_EXISTS') {
        setStatus({ type: 'error', message: 'Email already exists!' });
      } else {
        setStatus({ type: 'error', message: 'An error occurred during registration.' });
      }
    }
  };

  return (
    <div className="card">
      <h1>Register New Person</h1>
      
      {status.message && (
        <div className={`message ${status.type}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-input"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            placeholder="John Doe"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-input"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default Registration;
