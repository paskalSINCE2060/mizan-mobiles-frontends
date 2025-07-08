import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import './PaymentCancel.css'; 

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-cancel-container">
      <div className="payment-cancel-card">
        <div className="payment-cancel-icon-wrapper">
          <XCircle className="payment-cancel-icon" />
        </div>
        <h2 className="payment-cancel-title">Payment Canceled</h2>
        <p className="payment-cancel-message">
          Looks like your payment didn't go through. You can return home or try again later.
        </p>
        <div className="payment-cancel-actions">
          <button onClick={() => navigate('/')} className="btn-primary">
            Return to Home
          </button>
          <button onClick={() => navigate('/cart')} className="btn-secondary">
            Retry Payment
          </button>
        </div>
        <div className="payment-cancel-blur-1" />
        <div className="payment-cancel-blur-2" />
      </div>
    </div>
  );
};

export default PaymentCancel;
