import React from "react";
import { ShieldCheck, Award } from "lucide-react";

export const Header = (): React.JSX.Element => {
  return (
    <header className="site-header" id="claimlens-header">
      <div className="header-brand">
        <div className="brand-icon-wrapper">
          <ShieldCheck size={24} color="#ffffff" />
        </div>
        <div>
          <div className="brand-title">ClaimLens</div>
          <div className="brand-tagline">
            Automated YouTube Health & Finance Claim Verification
          </div>
        </div>
      </div>

      <div className="header-badges">
        <div className="badge-hackathon" id="badge-hackathon-info">
          <Award size={14} />
          <span>SerpApi Hackathon 2026</span>
        </div>
        <div className="badge-track" id="badge-track-info">
          <span>Track: Knowledge & Public Interest</span>
        </div>
      </div>
    </header>
  );
};
