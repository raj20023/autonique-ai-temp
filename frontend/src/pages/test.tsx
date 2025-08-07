import { useState, useEffect } from 'react';

export default function TestPage() {
  const [clientInfo, setClientInfo] = useState<any>({});

  useEffect(() => {
    setClientInfo({
      userAgent: navigator.userAgent,
      url: window.location.href,
      hostname: window.location.hostname,
      protocol: window.location.protocol,
    });
  }, []);

  const testHomepage = async () => {
    try {
      const response = await fetch('/');
      console.log('Homepage response:', response.status, response.statusText);
      alert(`Homepage response: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.error('Homepage error:', error);
      alert(`Homepage error: ${error}`);
    }
  };

  const testAPI = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      console.log('API response:', data);
      alert(`API response: ${JSON.stringify(data)}`);
    } catch (error) {
      console.error('API error:', error);
      alert(`API error: ${error}`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h1>🧪 Debug Page</h1>
      <p style={{ color: 'green', fontWeight: 'bold' }}>✅ If you can see this page, Next.js is working!</p>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>Environment Variables:</h2>
        <ul>
          <li><strong>NEXT_PUBLIC_API_URL:</strong> {process.env.NEXT_PUBLIC_API_URL || '❌ NOT SET'}</li>
          <li><strong>NEXT_PUBLIC_FRONTEND_URL:</strong> {process.env.NEXT_PUBLIC_FRONTEND_URL || '❌ NOT SET'}</li>
          <li><strong>NEXT_PUBLIC_FACEBOOK_APP_ID:</strong> {process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '❌ NOT SET'}</li>
          <li><strong>NODE_ENV:</strong> {process.env.NODE_ENV || '❌ NOT SET'}</li>
        </ul>
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>Client Info:</h2>
        <ul>
          <li><strong>Window available:</strong> {typeof window !== 'undefined' ? '✅ YES' : '❌ NO'}</li>
          <li><strong>Current URL:</strong> {clientInfo.url || 'Loading...'}</li>
          <li><strong>Hostname:</strong> {clientInfo.hostname || 'Loading...'}</li>
          <li><strong>Protocol:</strong> {clientInfo.protocol || 'Loading...'}</li>
        </ul>
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>Test Buttons:</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={testHomepage}
            style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Test Homepage
          </button>
          <button
            onClick={testAPI}
            style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Test API Health
          </button>
          <a
            href="/"
            style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', textDecoration: 'none', borderRadius: '5px', display: 'inline-block' }}
          >
            Go to Homepage
          </a>
          <a
            href="/health"
            style={{ padding: '10px 20px', backgroundColor: '#ffc107', color: 'black', textDecoration: 'none', borderRadius: '5px', display: 'inline-block' }}
          >
            Go to Health Page
          </a>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <h2>Instructions:</h2>
        <ol>
          <li>Check if environment variables are set properly</li>
          <li>Click "Test Homepage" to see what error occurs</li>
          <li>Click "Test API Health" to check if API routes work</li>
          <li>Try the navigation links</li>
          <li>Check browser console for detailed errors</li>
        </ol>
      </div>
    </div>
  );
}
