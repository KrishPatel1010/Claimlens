import type { ClaimCategory, ConfidenceLabel, VerifiedClaimEntry } from "./claim-models";

export interface VideoDetails {
  readonly id: string;
  readonly youtubeVideoId: string;
  readonly youtubeUrl: string;
  readonly title: string | null;
  readonly processedAt: string | null;
  readonly createdAt: string;
}

export interface CacheSummary {
  readonly videoCacheStatus: string;
  readonly cachedClaimsCount: number;
  readonly liveGroundingCount: number;
}

export interface ProcessVideoResponse {
  readonly videoId: string;
  readonly youtubeVideoId: string;
  readonly youtubeUrl: string;
  readonly title: string | null;
  readonly processedAt: string | null;
  readonly claimsCount: number;
  readonly verifiedLedger: readonly VerifiedClaimEntry[];
  readonly cacheSummary: CacheSummary;
}

export interface DemoVideoItem {
  readonly youtubeVideoId: string;
  readonly youtubeUrl: string;
  readonly title: string;
  readonly category: ClaimCategory;
  readonly targetOutcome: ConfidenceLabel;
  readonly notes: string;
}
