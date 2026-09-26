import React from "react";
import { Database, Search, FileText } from "lucide-react";

export const Footer = (): React.JSX.Element => {
  return (
    <footer className="site-footer" id="claimlens-footer">
      <div>
        <span>
          Powered by <strong>SerpApi</strong> (YouTube Transcript, Scholar, Finance, Search engines) &amp; <strong>Google Fact Check Tools API</strong>.
        </span>
      </div>

      <div className="footer-links">
        <span className="footer-link" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
          <Database size={14} />
          <span>Four-Tier Write-Through Cache</span>
        </span>
        <span className="footer-link" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
          <Search size={14} />
          <span>Zero-Credit Re-runs</span>
        </span>
        <span className="footer-link" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
          <FileText size={14} />
          <span>Verbatim Raw Responses Committed</span>
        </span>
      </div>
    </footer>
  );
};
