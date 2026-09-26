import React from "react";
import type { VerifiedClaimEntry } from "../../types/claim-models";
import {
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  FileCode,
  Layers,
} from "lucide-react";

interface EvidenceDrawerProps {
  readonly claimEntry: VerifiedClaimEntry;
}

export const EvidenceDrawer = ({
  claimEntry,
}: EvidenceDrawerProps): React.JSX.Element => {
  const formatEngineLabel = (sourceType: string): string => {
    switch (sourceType) {
      case "google_fact_check":
        return "Google Fact Check Tools API";
      case "google_scholar":
        return "SerpApi — Google Scholar Engine";
      case "google_finance":
        return "SerpApi — Google Finance Engine";
      case "google_search":
        return "SerpApi — Google Search Engine";
      default:
        return sourceType;
    }
  };

  return (
    <div
      className="evidence-section"
      id={`evidence-drawer-${claimEntry.claimId}`}
    >
      {claimEntry.verifiedClaimText ? (
        <div className="verified-truth-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontWeight: 700,
              marginBottom: "3px",
            }}
          >
            <ShieldCheck size={14} color="#10b981" />
            <span>Verified Scientific / Official Consensus:</span>
          </div>
          <div>{claimEntry.verifiedClaimText}</div>
        </div>
      ) : null}

      {claimEntry.conflictingClaims.length > 0 ? (
        <div className="dispute-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontWeight: 700,
              marginBottom: "3px",
            }}
          >
            <AlertCircle size={14} color="#f59e0b" />
            <span>Disputed By Verified Evidence:</span>
          </div>
          {claimEntry.conflictingClaims.map((conflictStatement, conflictIndex) => (
            <div key={`conflict-${conflictIndex}`}>{conflictStatement}</div>
          ))}
        </div>
      ) : null}

      <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", marginTop: "4px" }}>
        Supporting Citations &amp; Grounding Evidence:
      </div>

      {claimEntry.evidence.map((evidenceItem, evidenceIndex) => (
        <div
          key={`evidence-${claimEntry.claimId}-${evidenceIndex}`}
          className="evidence-source-item"
        >
          <div className="evidence-source-header">
            <span className="source-engine-tag">
              {formatEngineLabel(evidenceItem.sourceType)}
            </span>
            <span className="source-authority-tag">
              Authority: {(evidenceItem.sourceAuthorityScore * 100).toFixed(0)}%
            </span>
          </div>

          {evidenceItem.sourceUrl ? (
            <a
              href={evidenceItem.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="evidence-citation-link"
              id={`citation-link-${claimEntry.claimId}-${evidenceIndex}`}
            >
              <span>{evidenceItem.sourceDomain ?? evidenceItem.sourceUrl}</span>
              <ExternalLink size={12} />
            </a>
          ) : null}

          {evidenceItem.matchedText ? (
            <div className="evidence-matched-text">
              &ldquo;{evidenceItem.matchedText}&rdquo;
            </div>
          ) : null}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "4px",
            }}
          >
            <span className="cache-proof-chip">
              <FileCode size={10} style={{ display: "inline", marginRight: "3px" }} />
              {evidenceItem.rawResponseCachePath}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                color: "var(--text-muted)",
              }}
            >
              <Layers size={10} style={{ display: "inline", marginRight: "3px" }} />
              Grounding: {(evidenceItem.groundingSimilarity * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
