import { GetServerSideProps } from 'next';

export default function HealthCheck() {
  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      padding: '20px', 
      textAlign: 'center',
      background: 'linear-gradient(135deg, #2D3748, #7C9AE7)',
      color: 'white',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div>
        <h1>✅ Autonique.ai Health Check</h1>
        <p>Service is running properly</p>
        <p>Timestamp: {new Date().toISOString()}</p>
      </div>
    </div>
  );
}

// This ensures the page renders server-side for health checks
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      timestamp: new Date().toISOString()
    }
  };
};
