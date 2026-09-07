import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                width: '100%',
                padding: '32px 20px',
                backgroundColor: '#080b10',
                boxSizing: 'border-box',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
        >
            <div
                style={{
                    maxWidth: '720px',
                    width: '100%',
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    padding: '40px 36px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                    textAlign: 'left',
                    boxSizing: 'border-box',
                }}
            >
                <h1
                    style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        color: '#0f172a',
                        marginBottom: '6px',
                        letterSpacing: '-0.5px',
                    }}
                >
                    Privacy Policy
                </h1>
                <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '28px' }}>
                    <strong>Effective Date:</strong> September 7, 2026
                </p>

                <section style={{ marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                        1. Information We Collect
                    </h2>
                    <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                        Profile Visualizer accesses data from your Google account strictly upon authorization. We request read-only access to your Google Sheets data via the{' '}
                        <code style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '2px 6px', borderRadius: '4px', fontSize: '13px' }}>
                            https://www.googleapis.com/auth/spreadsheets.readonly
                        </code>{' '}
                        scope.
                    </p>
                </section>

                <section style={{ marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                        2. How We Use Your Data
                    </h2>
                    <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                        The data fetched from your Google Sheets is used exclusively to populate and render interactive 3D visualizations (Table, Sphere, Helix, Grid) in your web browser.
                    </p>
                </section>

                <section style={{ marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                        3. Data Storage and Retention
                    </h2>
                    <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                        We <strong>do not store, transmit, or retain</strong> your Google profile or spreadsheet data on external servers. All processing and rendering occur strictly within your local browser session.
                    </p>
                </section>

                <section style={{ marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                        4. Third-Party Sharing
                    </h2>
                    <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                        We do not sell, trade, or share your personal information or Google Sheets content with third parties.
                    </p>
                </section>

                <section style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                        5. Contact Us
                    </h2>
                    <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                        If you have questions regarding this privacy policy, you can contact the developer via the official project repository.
                    </p>
                </section>

                <div style={{ paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                    <Link
                        href="/"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#2563eb',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: '600',
                        }}
                    >
                        &larr; Back to Application
                    </Link>
                </div>
            </div>
        </div>
    );
}