export type ClaimCategory = "health" | "financial" | "general";

export type ConfidenceLabel = "high_confidence" | "contested" | "unverified";

export type SourceType =
  | "google_fact_check"
  | "google_scholar"
  | "google_finance"
  | "google_search";

export interface EvidenceItem {
  readonly sourceType: SourceType;
  readonly sourceUrl: string | null;
  readonly sourceDomain: string | null;
  readonly sourceAuthorityScore: number;
  readonly matchedText: string | null;
  readonly groundingSimilarity: number;
  readonly rawResponseCachePath: string;
}

export interface VerifiedClaimEntry {
  readonly claimId: string;
  readonly timestampSeconds: number;
  readonly rawText: string;
  readonly category: ClaimCategory;
  readonly trustScore: number;
  readonly confidenceLabel: ConfidenceLabel;
  readonly verifiedClaimText: string | null;
  readonly evidence: readonly EvidenceItem[];
  readonly conflictingClaims: readonly string[];
}
