import Link from "next/link";

export default function PrivacyPolicy() {
    return (
        <main style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px", color: "#333", fontFamily: "sans-serif" }}>
            <h1>Privacy Policy for Profile Visualizer</h1>
            <p><strong>Effective Date:</strong> September 7, 2026</p>

            <h2>1. Information We Collect</h2>
            <p>
                Profile Visualizer accesses data from your Google account strictly upon authorization. We request read-only access to your Google Sheets data via the <code>https://www.googleapis.com/auth/spreadsheets.readonly</code> scope.
            </p>

            <h2>2. How We Use Your Data</h2>
            <p>
                The data fetched from your Google Sheets is used exclusively to populate and render interactive 3D visualizations (Table, Sphere, Helix, Grid) in your web browser.
            </p>

            <h2>3. Data Storage and Retention</h2>
            <p>
                We <strong>do not store, transmit, or retain</strong> your Google profile or spreadsheet data on external servers. All processing and rendering occur strictly within your local browser session.
            </p>

            <h2>4. Third-Party Sharing</h2>
            <p>
                We do not sell, trade, or share your personal information or Google Sheets content with third parties.
            </p>

            <h2>5. Contact Us</h2>
            <p>
                If you have questions regarding this privacy policy, you can contact the developer via the official project repository.
            </p>

            <div style={{ marginTop: "30px" }}>
                <Link href="/" style={{ color: "#0070f3", textDecoration: "underline" }}>
                    &larr; Back to Application
                </Link>
            </div>
        </main>
    );
}