import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import Link from "next/link";

interface LoginProps {
    onSuccess: (credentialResponse: any) => void;
    onError: () => void;
}

export default function Login({ onSuccess, onError }: LoginProps) {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "20px", textAlign: "center" }}>
            <div style={{ maxWidth: "600px", background: "#f9f9f9", border: "1px solid #eaeaea", borderRadius: "12px", padding: "40px" }}>
                <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>Kasatria Profile Visualizer</h1>
                <p style={{ color: "#666", fontSize: "1.1rem", marginBottom: "20px" }}>
                    An interactive 3D spatial visualization engine that transforms static Google Sheets profile records into dynamic Table, Sphere, Helix, and Grid views.
                </p>

                <div style={{ textAlign: "left", background: "#fff", padding: "15px 20px", borderRadius: "8px", border: "1px solid #ddd", marginBottom: "25px" }}>
                    <h3 style={{ margin: "0 0 10px 0", fontSize: "1rem" }}>Why authentication is required:</h3>
                    <ul style={{ margin: 0, paddingLeft: "20px", color: "#444", fontSize: "0.95rem" }}>
                        <li>Requests read-only access to render your Google Sheet profile rows.</li>
                        <li>No data is saved on external servers; all processing is client-side.</li>
                    </ul>
                </div>

                <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                    <GoogleLogin onSuccess={onSuccess} onError={onError} />
                </div>

                <footer style={{ marginTop: "20px", fontSize: "0.85rem", color: "#888" }}>
                    <Link href="/privacy" style={{ color: "#0070f3", textDecoration: "underline" }}>
                        Privacy Policy
                    </Link>
                </footer>
            </div>
        </div>
    );
}