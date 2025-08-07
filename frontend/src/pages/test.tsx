export default function TestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🧪 Test Page</h1>
      <p>If you can see this page, the Next.js app is working.</p>
      
      <h2>Environment Variables:</h2>
      <ul>
        <li><strong>NEXT_PUBLIC_API_URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'NOT SET'}</li>
        <li><strong>NEXT_PUBLIC_FRONTEND_URL:</strong> {process.env.NEXT_PUBLIC_FRONTEND_URL || 'NOT SET'}</li>
        <li><strong>NEXT_PUBLIC_FACEBOOK_APP_ID:</strong> {process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || 'NOT SET'}</li>
        <li><strong>NODE_ENV:</strong> {process.env.NODE_ENV || 'NOT SET'}</li>
      </ul>
      
      <h2>Window Object:</h2>
      <p>Window available: {typeof window !== 'undefined' ? 'YES' : 'NO'}</p>
      
      <h2>Navigation Test:</h2>
      <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
        Go to Homepage
      </a>
    </div>
  );
}
