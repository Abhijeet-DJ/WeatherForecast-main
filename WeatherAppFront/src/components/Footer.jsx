import React from 'react'
import './footer.css'

function Footer() {
    return (
        <footer className="footer-ticker ">
            <div className="ticker-wrap">
                <span className="live-badge">LIVE</span>
                 <div className="ticker-container">
                <div className="ticker">
                    <div className="ticker-item">🚨 Breaking: New product launch tomorrow at 10 AM!</div>
                    <div className="ticker-item">📢 Update: Maintenance scheduled for Sunday midnight.</div>
                    <div className="ticker-item">🌍 News: Global tech conference starts next week.</div>
                    <div className="ticker-item">⚡ Tip: Use our new mobile app for faster access!</div>
                </div>
                </div>
            </div>
        </footer>

    )
}

export default Footer
