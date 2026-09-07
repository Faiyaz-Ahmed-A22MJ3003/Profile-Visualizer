'use client';

import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import Link from 'next/link';

interface LoginProps {
    onSuccess: (accessToken: string) => void;
    onError?: () => void;
}

export default function Login({ onSuccess, onError }: LoginProps) {
    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            onSuccess(tokenResponse.access_token);
        },
        onError: () => {
            console.error('Google Login Failed');
            if (onError) onError();
        },
        scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    });

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                width: '100%',
                padding: '24px',
                backgroundColor: '#080b10',
                boxSizing: 'border-box',
            }}
        >
            <div
                style={{
                    maxWidth: '520px',
                    width: '100%',
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    padding: '40px 32px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                    textAlign: 'center',
                }}
            >
                <h1
                    style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        color: '#0f172a',
                        marginBottom: '10px',
                        letterSpacing: '-0.5px',
                    }}
                >
                    Profile Visualizer
                </h1>
                <p
                    style={{
                        color: '#475569',
                        fontSize: '15px',
                        lineHeight: '1.5',
                        marginBottom: '28px',
                    }}
                >
                    An interactive 3D spatial visualization engine that transforms static Google Sheets profile records into dynamic Table, Sphere, Helix, and Grid views.
                </p>

                <div
                    style={{
                        textAlign: 'left',
                        backgroundColor: '#f8fafc',
                        padding: '16px 20px',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        marginBottom: '28px',
                    }}
                >
                    <h3
                        style={{
                            margin: '0 0 8px 0',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#1e293b',
                        }}
                    >
                        Why authentication is required:
                    </h3>
                    <ul
                        style={{
                            margin: 0,
                            paddingLeft: '20px',
                            color: '#64748b',
                            fontSize: '13px',
                            lineHeight: '1.6',
                        }}
                    >
                        <li>Requests read-only access to render your Google Sheet profile rows.</li>
                        <li>No data is saved on external servers; all processing is client-side.</li>
                    </ul>
                </div>

                <button
                    onClick={() => login()}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        width: '100%',
                        padding: '14px 28px',
                        backgroundColor: '#ffffff',
                        color: '#1e293b',
                        border: '1px solid #cbd5e1',
                        borderRadius: '9999px',
                        fontSize: '15px',
                        fontWeight: '600',
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f8fafc';
                        e.currentTarget.style.borderColor = '#94a3b8';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.borderColor = '#cbd5e1';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.06)';
                    }}
                >
                    {/* Official Google 'G' Logo SVG */}
                    <svg width="20" height="20" viewBox="0 0 18 18">
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

                <footer style={{ marginTop: '24px', fontSize: '13px' }}>
                    <Link
                        href="/privacy"
                        style={{
                            color: '#2563eb',
                            textDecoration: 'none',
                            fontWeight: '500',
                        }}
                    >
                        Privacy Policy
                    </Link>
                </footer>
            </div>
        </div>
    );
}