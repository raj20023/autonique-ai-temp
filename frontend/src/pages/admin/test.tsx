import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function AdminTest() {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testAdminAccess = async () => {
    setLoading(true);
    setResults([]);
    
    try {
      const token = localStorage.getItem('access_token');
      addResult(`🔑 Token found: ${!!token}`);
      
      if (!token) {
        addResult('❌ No token found - please login first');
        setLoading(false);
        return;
      }

      addResult(`🔍 Token length: ${token.length} characters`);

      // Use production API URL
      const API_URL = 'https://api.autonique.in';
      addResult(`🌐 API URL: ${API_URL}`);

      const headers = { 'Authorization': `Bearer ${token}` };

      // Test 1: Check /users/me
      addResult('1️⃣ Testing /users/me...');
      try {
        const userResponse = await fetch(`${API_URL}/api/v1/users/me`, { headers });
        addResult(`   Status: ${userResponse.status}`);
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          addResult(`   ✅ User: ${userData.name}`);
          addResult(`   ✅ Role: ${userData.role}`);
          addResult(`   ✅ ID: ${userData.id}`);
          
          if (userData.role === 'admin') {
            addResult('   🎉 USER IS ADMIN!');
          } else {
            addResult(`   ❌ User role is '${userData.role}' not 'admin'`);
          }
        } else {
          const errorText = await userResponse.text();
          addResult(`   ❌ Error: ${errorText}`);
        }
      } catch (error) {
        addResult(`   ❌ Exception: ${error}`);
      }

      // Test 2: Check admin stats
      addResult('2️⃣ Testing /admin/stats...');
      try {
        const statsResponse = await fetch(`${API_URL}/api/v1/user-management/admin/stats`, { headers });
        addResult(`   Status: ${statsResponse.status}`);

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          addResult(`   ✅ Stats: ${JSON.stringify(statsData)}`);
        } else {
          const errorText = await statsResponse.text();
          addResult(`   ❌ Error: ${errorText}`);
        }
      } catch (error) {
        addResult(`   ❌ Exception: ${error}`);
      }

      // Test 3: Check admin users
      addResult('3️⃣ Testing /admin/users...');
      try {
        const usersResponse = await fetch(`${API_URL}/api/v1/user-management/admin/users`, { headers });
        addResult(`   Status: ${usersResponse.status}`);
        
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          addResult(`   ✅ Found ${usersData.users?.length || 0} users`);
          usersData.users?.slice(0, 3).forEach((user: any) => {
            addResult(`      • ${user.name} (Role: ${user.role})`);
          });
        } else {
          const errorText = await usersResponse.text();
          addResult(`   ❌ Error: ${errorText}`);
        }
      } catch (error) {
        addResult(`   ❌ Exception: ${error}`);
      }

    } catch (error) {
      addResult(`❌ General error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Access Test - AutoniqueAI</title>
      </Head>

      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            🧪 Admin Access Test
          </h1>
          
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <p className="text-gray-600 mb-4">
              This page tests admin access step by step to identify issues.
            </p>
            
            <button
              onClick={testAdminAccess}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Run Admin Access Test'}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
            
            {results.length === 0 ? (
              <p className="text-gray-500">Click "Run Admin Access Test" to start</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded text-sm font-mono ${
                      result.includes('✅') ? 'bg-green-50 text-green-800' :
                      result.includes('❌') ? 'bg-red-50 text-red-800' :
                      result.includes('🎉') ? 'bg-blue-50 text-blue-800' :
                      'bg-gray-50 text-gray-700'
                    }`}
                  >
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <a
              href="/admin/dashboard"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Go to Admin Dashboard
            </a>
            {' | '}
            <a
              href="/dashboard"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Go to Main Dashboard
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
