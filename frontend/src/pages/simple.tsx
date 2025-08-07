export default function SimplePage() {
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'Arial, sans-serif', 
      background: 'linear-gradient(135deg, #2D3748, #7C9AE7)',
      color: 'white',
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      <h1>🎉 Simple Test Page</h1>
      <p>This is a minimal page with no complex logic.</p>
      <p>If you can see this, the basic Next.js routing works.</p>
      
      <div style={{ 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        padding: '20px', 
        borderRadius: '10px',
        marginTop: '20px'
      }}>
        <h2>Navigation Test:</h2>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/test" style={{ color: '#FCD34D', textDecoration: 'underline' }}>Go to Debug Page</a>
          <a href="/health" style={{ color: '#FCD34D', textDecoration: 'underline' }}>Go to Health Page</a>
          <a href="/api/health" style={{ color: '#FCD34D', textDecoration: 'underline' }}>API Health (JSON)</a>
        </div>
      </div>
      
      <div style={{ 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        padding: '20px', 
        borderRadius: '10px',
        marginTop: '20px'
      }}>
        <h2>Status:</h2>
        <p>✅ Next.js is working</p>
        <p>✅ React is rendering</p>
        <p>✅ Styling is applied</p>
        <p>✅ No complex logic or API calls</p>
      </div>
    </div>
  );
}
