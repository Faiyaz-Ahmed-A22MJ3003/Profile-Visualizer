'use client';

import { useState } from 'react';
import Login from './components/Login';
import Visualization from './components/Visualization';
import { fetchGoogleSheetsData, Profile } from './components/fetchSheetsData';

export default function Page() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginSuccess = async (accessToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGoogleSheetsData(accessToken);
      setProfiles(data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to load Google Sheet profiles. Check API permissions.');
    } finally {
      setLoading(false);
    }
  };

  if (profiles.length > 0) {
    return <Visualization profiles={profiles} />;
  }

  return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {loading ? (
        <p style={{ color: '#fff' }}>Loading 200 profiles from Google Sheets...</p>
      ) : (
        <div>
          {error && <p style={{ color: '#ff4d4d', marginBottom: '16px' }}>{error}</p>}
          <Login onSuccess={handleLoginSuccess} />
        </div>
      )}
    </main>
  );
}