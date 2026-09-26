import React, { useState } from "react";
import type { VerifiedClaimEntry, ClaimCategory } from "../../types/claim-models";
import { EvidenceDrawer } from "../evidence-drawer/EvidenceDrawer";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
} from "lucide-react";

interface ClaimLedgerProps {
  readonly verifiedClaims: readonly VerifiedClaimEntry[];
  readonly selectedClaimId: string | null;
  readonly onSelectClaim: (claimEntry: VerifiedClaimEntry) => void;
  readonly onSeekToTimestamp: (timestampSeconds: number) => void;
  readonly onOpenAuditModal: (claimEntry: VerifiedClaimEntry) => void;
}

export const ClaimLedger = ({
  verifiedClaims,
  selectedClaimId,
  onSelectClaim,
  onSeekToTimestamp,
  onOpenAuditModal,
}: ClaimLedgerProps): React.JSX.Element => {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");
  const [expandedClaimIds, setExpandedClaimIds] = useState<Set<string>>(new Set());

  const toggleClaimExpansion = (targetClaimId: string): void => {
    setExpandedClaimIds((previousSet) => {
      const updatedSet = new Set(previousSet);
      if (updatedSet.has(targetClaimId)) {
        updatedSet.delete(targetClaimId);
      } else {
        updatedSet.add(targetClaimId);
      }
      return updatedSet;
    });
  };

  const formatSecondsToDisplayTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const filteredClaims = verifiedClaims.filter((claimEntry) => {
    if (activeCategoryFilter === "all") {
      return true;
    }
    return claimEntry.category === activeCategoryFilter;
  });

  const renderVerdictBadge = (
    confidenceLabel: VerifiedClaimEntry["confidenceLabel"],
  ): React.JSX.Element => {
    switch (confidenceLabel) {
      case "high_confidence":
        return (
          <span className="verdict-badge high_confidence">
            <CheckCircle2 size={13} />
            <span>High Confidence</span>
          </span>
        );
      case "contested":
        return (
          <span className="verdict-badge contested">
            <AlertTriangle size={13} />
            <span>Contested</span>
          </span>
        );
      case "unverified":
        return (
          <span className="verdict-badge unverified">
            <HelpCircle size={13} />
            <span>Unverified</span>
          </span>
        );
    }
  };

  return (
    <div className="glass-panel ledger-card" id="claim-ledger-container">
      <div className="ledger-header">
        <div className="ledger-title-group">
          <h2 className="ledger-title">Verified Claims Ledger</h2>
          <span className="claims-count-badge" id="ledger-total-claims-count">
            {filteredClaims.length} Claims
          </span>
        </div>

        <div className="ledger-filters" id="ledger-category-filters">
          {(["all", "health", "financial", "general"] as const).map(
            (categoryOption) => (
              <button
                key={categoryOption}
                id={`filter-btn-${categoryOption}`}
                type="button"
                className={`filter-btn ${activeCategoryFilter === categoryOption ? "active" : ""}`}
                onClick={() => {
                  setActiveCategoryFilter(categoryOption);
                }}
              >
                {categoryOption.charAt(0).toUpperCase() + categoryOption.slice(1)}
              </button>
            ),
          )}
        </div>
      </div>

      {filteredClaims.length === 0 ? (
        <div
          id="ledger-empty-state"
          style={{
            padding: "40px 20px",
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: "0.9rem",
          }}
        >
          No claims found matching this category filter.
        </div>
      ) : (
        <div className="claim-list" id="claim-list-scroll-area">
          {filteredClaims.map((claimEntry) => {
            const isSelected = selectedClaimId === claimEntry.claimId;
            const isExpanded = expandedClaimIds.has(claimEntry.claimId);

            return (
              <div
                key={claimEntry.claimId}
                id={`claim-card-${claimEntry.claimId}`}
                className={`claim-item ${isSelected ? "selected" : ""}`}
                onClick={() => {
                  onSelectClaim(claimEntry);
                }}
              >
                <div className="claim-top-row">
                  <div className="claim-meta">
                    <button
                      id={`timestamp-jump-button-${claimEntry.claimId}`}
                      type="button"
                      className="timestamp-btn"
                      onClick={(clickEvent) => {
                        clickEvent.stopPropagation();
                        onSeekToTimestamp(claimEntry.timestampSeconds);
                      }}
                      title="Jump to video timestamp"
                    >
                      <Clock size={11} />
                      <span>{formatSecondsToDisplayTime(claimEntry.timestampSeconds)}</span>
                    </button>
                    <span className="category-tag">{claimEntry.category}</span>
                  </div>

                  {renderVerdictBadge(claimEntry.confidenceLabel)}
                </div>

                <div className="claim-text" id={`claim-text-${claimEntry.claimId}`}>
                  &ldquo;{claimEntry.rawText}&rdquo;
                </div>

                <div className="score-row">
                  <div className="score-meter-wrap">
                    <div
                      className={`score-meter-fill ${claimEntry.confidenceLabel}`}
                      style={{ width: `${Math.max(claimEntry.trustScore * 100, 8)}%` }}
                    />
                  </div>
                  <span className="score-number">
                    Trust: {(claimEntry.trustScore * 100).toFixed(0)}%
                  </span>

                  <button
                    id={`audit-math-button-${claimEntry.claimId}`}
                    type="button"
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--accent-indigo)",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      padding: "2px 6px",
                      borderRadius: "4px",
                    }}
                    onClick={(clickEvent) => {
                      clickEvent.stopPropagation();
                      onOpenAuditModal(claimEntry);
                    }}
                    title="Audit Trust Score Formula"
                  >
                    <SlidersHorizontal size={12} />
                    <span>Audit Math</span>
                  </button>

                  <button
                    id={`toggle-evidence-button-${claimEntry.claimId}`}
                    type="button"
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--text-muted)",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "2px",
                    }}
                    onClick={(clickEvent) => {
                      clickEvent.stopPropagation();
                      toggleClaimExpansion(claimEntry.claimId);
                    }}
                    title={isExpanded ? "Hide evidence" : "Show evidence"}
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>

                {isExpanded ? <EvidenceDrawer claimEntry={claimEntry} /> : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
