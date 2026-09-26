import React from "react";
import type { VerifiedClaimEntry } from "../../types/claim-models";
import type { CacheSummary } from "../../types/video-models";
import { CheckCircle2, AlertTriangle, HelpCircle, ShieldAlert, Zap } from "lucide-react";

interface VideoTrustSummaryProps {
  readonly verifiedClaims: readonly VerifiedClaimEntry[];
  readonly cacheSummary: CacheSummary | null;
}

export const VideoTrustSummary = ({
  verifiedClaims,
  cacheSummary,
}: VideoTrustSummaryProps): React.JSX.Element => {
  const highConfidenceCount = verifiedClaims.filter(
    (claimEntry) => claimEntry.confidenceLabel === "high_confidence",
  ).length;

  const contestedCount = verifiedClaims.filter(
    (claimEntry) => claimEntry.confidenceLabel === "contested",
  ).length;

  const unverifiedCount = verifiedClaims.filter(
    (claimEntry) => claimEntry.confidenceLabel === "unverified",
  ).length;

  const averageTrustScore =
    verifiedClaims.length > 0
      ? (
          verifiedClaims.reduce(
            (accumulatedScore, currentClaim) =>
              accumulatedScore + currentClaim.trustScore,
            0,
          ) / verifiedClaims.length
        ).toFixed(2)
      : "0.00";

  return (
    <div className="summary-strip" id="video-trust-summary-metrics">
      <div className="summary-metric-card" id="metric-high-confidence">
        <span
          className="metric-label"
          style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
        >
          <CheckCircle2 size={13} color="var(--verdict-high)" />
          <span>High Confidence</span>
        </span>
        <span className="metric-value" style={{ color: "var(--verdict-high)" }}>
          {highConfidenceCount}
        </span>
      </div>

      <div className="summary-metric-card" id="metric-contested">
        <span
          className="metric-label"
          style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
        >
          <AlertTriangle size={13} color="var(--verdict-contested)" />
          <span>Contested</span>
        </span>
        <span className="metric-value" style={{ color: "var(--verdict-contested)" }}>
          {contestedCount}
        </span>
      </div>

      <div className="summary-metric-card" id="metric-unverified">
        <span
          className="metric-label"
          style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
        >
          <HelpCircle size={13} color="var(--verdict-unverified)" />
          <span>Unverified</span>
        </span>
        <span className="metric-value" style={{ color: "var(--verdict-unverified)" }}>
          {unverifiedCount}
        </span>
      </div>

      <div className="summary-metric-card" id="metric-trust-average">
        <span
          className="metric-label"
          style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
        >
          <ShieldAlert size={13} color="var(--accent-cyan)" />
          <span>Avg Trust Score</span>
        </span>
        <span className="metric-value" style={{ color: "var(--accent-cyan)" }}>
          {averageTrustScore}
        </span>
        {cacheSummary ? (
          <span
            style={{
              fontSize: "0.68rem",
              fontFamily: "var(--font-mono)",
              color: "#a5b4fc",
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
              marginTop: "2px",
            }}
          >
            <Zap size={10} color="#a5b4fc" />
            <span>0 Credits Used (Cached)</span>
          </span>
        ) : null}
      </div>
    </div>
  );
};
