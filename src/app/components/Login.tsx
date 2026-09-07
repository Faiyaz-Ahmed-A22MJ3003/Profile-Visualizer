'use client';

import { useGoogleLogin } from '@react-oauth/google';

interface LoginProps {
    onSuccess: (accessToken: string) => void;
}

export default function Login({ onSuccess }: LoginProps) {
    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            onSuccess(tokenResponse.access_token);
        },
        onError: () => console.error('Google Login Failed'),
        scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    });

    return (
        <div
            style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '40px 32px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                textAlign: 'center',
                maxWidth: '400px',
                width: '100%',
            }}
        >
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1f1f1f', marginBottom: '8px' }}>
                Kasatria Profile Visualizer
            </h1>
            <p style={{ fontSize: '14px', color: '#5f6368', marginBottom: '32px' }}>
                Sign in with Google to continue
            </p>

            <button
                onClick={() => login()}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '12px 24px',
                    backgroundColor: '#ffffff',
                    color: '#3c4043',
                    border: '1px solid #dadce0',
                    borderRadius: '24px', // Change to '50px' for fully pill-shaped
                    fontSize: '14px',
                    fontWeight: '500',
                    fontFamily: 'Roboto, sans-serif',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s, box-shadow 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                    e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
                }}
            >
                {/* Official Google 'G' Logo SVG */}
                <svg width="18" height="18" viewBox="0 0 18 18">
                    <path
                        fill="#4285F4"
                        d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z"
                    />
                    <path
                        fill="#34A853"
                        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.41-1.57-5.13-3.72L.97 13.01C2.47 15.98 5.48 18 9 18z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M3.87 10.8c-.18-.53-.28-1.1-.28-1.8s.1-1.27.28-1.8L.97 4.99C.35 6.22 0 7.57 0 9s.35 2.78.97 4.01l2.9-2.21z"
                    />
                    <path
                        fill="#EA4335"
                        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.47 2.02.97 4.99l2.9 2.21C4.59 5.05 6.62 3.58 9 3.58z"
                    />
                </svg>
                Sign in with Google
            </button>
        </div>
    );
}         