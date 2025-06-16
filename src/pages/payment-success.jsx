import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const PaymentSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState(null);
  const [error, setError] = useState(null);

  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const sessionId = query.get('session_id');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        if (!sessionId) throw new Error('Missing session ID');

        const response = await fetch(`/api/payment/checkout-session?sessionId=${sessionId}`);
        if (!response.ok) throw new Error('Failed to fetch session');

        const data = await response.json();
        setSessionData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  if (loading) return <p>Loading payment details...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>✅ Payment Successful!</h1>
      <p>Thank you for your purchase, {sessionData.customer_details?.name || 'Customer'}.</p>

      <h2>🛒 Order Summary</h2>
      <ul>
        {sessionData.line_items?.data?.length > 0 ? (
          sessionData.line_items.data.map((item, index) => (
            <li key={index}>
              {item.quantity} × {item.description} — ${(item.amount_total / 100).toFixed(2)}
            </li>
          ))
        ) : (
          <li>No items found</li>
        )}
      </ul>

      <p><strong>Total Paid:</strong> ${(sessionData.amount_total / 100).toFixed(2)}</p>

      <Link to="/">← Back to Home</Link>
    </div>
  );
};

export default PaymentSuccess;
