import type { ProcessVideoResponse } from "../types/video-models";
import { DEMO_LEDGERS } from "../lib/demo-data";

const DEFAULT_API_BASE_URL = "http://localhost:4000";

export const getApiBaseUrl = (): string => {
  if (typeof process !== "undefined" && process.env["NEXT_PUBLIC_API_BASE_URL"]) {
    return process.env["NEXT_PUBLIC_API_BASE_URL"];
  }
  return DEFAULT_API_BASE_URL;
};

export const processVideoViaApi = async (
  submittedYoutubeUrl: string,
  videoTitle?: string,
): Promise<ProcessVideoResponse> => {
  const backendBaseUrl = getApiBaseUrl();

  // Check if matching a demo video ID first for instant offline fallback
  for (const demoKey of Object.keys(DEMO_LEDGERS)) {
    const demoPayload = DEMO_LEDGERS[demoKey];
    if (demoPayload && submittedYoutubeUrl.includes(demoPayload.youtubeVideoId)) {
      return demoPayload;
    }
  }

  try {
    const apiResponse = await fetch(`${backendBaseUrl}/api/videos/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        youtubeUrl: submittedYoutubeUrl,
        videoTitle: videoTitle ?? null,
      }),
    });

    if (!apiResponse.ok) {
      const errorJson = (await apiResponse.json().catch(() => null)) as {
        error?: { message?: string };
      } | null;
      const errorMessage =
        errorJson?.error?.message ??
        `Video analysis failed with HTTP status ${apiResponse.status}`;
      throw new Error(errorMessage);
    }

    const jsonResponseBody = (await apiResponse.json()) as ProcessVideoResponse;
    return jsonResponseBody;
  } catch (caughtNetworkError) {
    // If backend is unreachable or local development offline, check if URL matches any demo video
    for (const demoKey of Object.keys(DEMO_LEDGERS)) {
      const demoItem = DEMO_LEDGERS[demoKey];
      if (demoItem && submittedYoutubeUrl.includes(demoItem.youtubeVideoId)) {
        return demoItem;
      }
    }

    const fallbackErrorMessage =
      caughtNetworkError instanceof Error
        ? caughtNetworkError.message
        : "Failed to connect to ClaimLens verification backend service.";

    throw new Error(fallbackErrorMessage);
  }
};

export const fetchVideoDetailsById = async (
  targetVideoId: string,
): Promise<ProcessVideoResponse | null> => {
  const matchingDemoLedger = DEMO_LEDGERS[targetVideoId];
  if (matchingDemoLedger) {
    return matchingDemoLedger;
  }

  const backendBaseUrl = getApiBaseUrl();

  try {
    const apiResponse = await fetch(
      `${backendBaseUrl}/api/videos/${encodeURIComponent(targetVideoId)}`,
    );

    if (!apiResponse.ok) {
      return null;
    }

    const jsonResponseBody = (await apiResponse.json()) as {
      video: {
        id: string;
        youtubeVideoId: string;
        youtubeUrl: string;
        title: string | null;
        processedAt: string | null;
      };
      ledger: ProcessVideoResponse["verifiedLedger"];
    };

    return {
      videoId: jsonResponseBody.video.id,
      youtubeVideoId: jsonResponseBody.video.youtubeVideoId,
      youtubeUrl: jsonResponseBody.video.youtubeUrl,
      title: jsonResponseBody.video.title,
      processedAt: jsonResponseBody.video.processedAt,
      claimsCount: jsonResponseBody.ledger.length,
      verifiedLedger: jsonResponseBody.ledger,
      cacheSummary: {
        videoCacheStatus: "database_hit",
        cachedClaimsCount: jsonResponseBody.ledger.length,
        liveGroundingCount: 0,
      },
    };
  } catch {
    return null;
  }
};
