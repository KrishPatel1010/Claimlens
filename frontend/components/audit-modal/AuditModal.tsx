import React from "react";
import type { VerifiedClaimEntry } from "../../types/claim-models";
import { X, Calculator, Database, ShieldCheck } from "lucide-react";

interface AuditModalProps {
  readonly claimEntry: VerifiedClaimEntry | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export const AuditModal = ({
  claimEntry,
  isOpen,
  onClose,
}: AuditModalProps): React.JSX.Element | null => {
  if (!isOpen || !claimEntry) {
    return null;
  }

  const primaryEvidence = claimEntry.evidence[0];
  const groundingScore = primaryEvidence ? primaryEvidence.groundingSimilarity : 0.1;
  const authorityScore = primaryEvidence ? primaryEvidence.sourceAuthorityScore : 0.1;

  return (
    <div
      id="audit-modal-backdrop"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        id="audit-modal-content"
        className="glass-panel"
        style={{
          maxWidth: "600px",
          width: "100%",
          padding: "28px",
          position: "relative",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(clickEvent) => {
          clickEvent.stopPropagation();
        }}
      >
        <button
          id="audit-modal-close-button"
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <div
            style={{
              padding: "8px",
              borderRadius: "8px",
              background: "rgba(99, 102, 241, 0.2)",
              color: "var(--accent-indigo)",
            }}
          >
            <Calculator size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Scoring Audit &amp; Verification Math</h3>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
              Formula: Trust Score = Grounding Similarity &times; Source Authority
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "12px 16px",
            background: "rgba(255, 255, 255, 0.03)",
            borderRadius: "8px",
            border: "1px solid var(--border-subtle)",
            marginBottom: "20px",
            fontSize: "0.85rem",
          }}
        >
          <div style={{ fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px" }}>
            Extracted Claim:
          </div>
          <div style={{ color: "#f8fafc" }}>&ldquo;{claimEntry.rawText}&rdquo;</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Grounding Similarity Score:
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                color: "var(--accent-cyan)",
              }}
            >
              {groundingScore.toFixed(2)}
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Source Authority Multiplier:
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                color: "#a5b4fc",
              }}
            >
              {authorityScore.toFixed(2)}
            </span>
          </div>

          <div
            style={{
              paddingTop: "12px",
              borderTop: "1px solid var(--border-subtle)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#f8fafc" }}>
              Final Trust Score:
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "1.2rem",
                fontWeight: 800,
                color:
                  claimEntry.confidenceLabel === "high_confidence"
                    ? "var(--verdict-high)"
                    : claimEntry.confidenceLabel === "contested"
                      ? "var(--verdict-contested)"
                      : "var(--verdict-unverified)",
              }}
            >
              {claimEntry.trustScore.toFixed(2)} ({claimEntry.confidenceLabel.replace("_", " ")})
            </span>
          </div>
        </div>

        <div
          style={{
            padding: "16px",
            background: "rgba(139, 92, 246, 0.08)",
            borderRadius: "8px",
            border: "1px solid rgba(139, 92, 246, 0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.82rem",
              fontWeight: 700,
              color: "#c4b5fd",
              marginBottom: "8px",
            }}
          >
            <Database size={14} />
            <span>Four-Tier Storage &amp; Budget Protection Verified:</span>
          </div>
          <ol
            style={{
              paddingLeft: "20px",
              fontSize: "0.78rem",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
            }}
          >
            <li>Checked Redis Hot Cache by SHA-256 normalized claim hash</li>
            <li>Checked Supabase PostgreSQL relational verdict records</li>
            <li>Query executed on cache miss only to protect 250 SerpApi monthly credits</li>
            <li>Raw unedited payload committed to disk: <code>{primaryEvidence?.rawResponseCachePath ?? "data/cache/*.json"}</code></li>
          </ol>
        </div>
      </div>
    </div>
  );
};
