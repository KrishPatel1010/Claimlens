import React from "react";
import { Play, Clock, Sparkles } from "lucide-react";

interface VideoPlayerProps {
  readonly youtubeVideoId: string | null;
  readonly videoTitle: string | null;
  readonly currentSeekSeconds: number | null;
}

const DEMO_YOUTUBE_EMBED_MAP: Record<string, string> = {
  "sample-health-01": "da1vvigy5tQ", // Dr. Sarah Hallberg: Reversing Type 2 Diabetes
  "sample-finance-01": "WEDIj9JBTC8", // The Plain Bagel: Index Funds & Market Returns
  "sample-factcheck-01": "zQGOcOUBi6s", // Kurzgesagt: Immune System & Vaccine Science
};

const resolvePlayableVideoId = (targetVideoId: string): string => {
  return DEMO_YOUTUBE_EMBED_MAP[targetVideoId] ?? targetVideoId;
};

export const VideoPlayer = ({
  youtubeVideoId,
  videoTitle,
  currentSeekSeconds,
}: VideoPlayerProps): React.JSX.Element => {
  const formatSecondsToDisplayTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const isDemoCuratedVideo =
    youtubeVideoId !== null && youtubeVideoId in DEMO_YOUTUBE_EMBED_MAP;

  const buildEmbedUrl = (): string => {
    if (!youtubeVideoId) {
      return "";
    }
    const playableVideoId = resolvePlayableVideoId(youtubeVideoId);
    const seekParam =
      currentSeekSeconds !== null
        ? `&start=${currentSeekSeconds}&autoplay=1`
        : "";
    return `https://www.youtube.com/embed/${playableVideoId}?enablejsapi=1&rel=0${seekParam}`;
  };

  return (
    <div className="glass-panel player-card" id="video-player-container">
      <div className="player-header">
        <div>
          <h2 className="video-title" id="active-video-title">
            {videoTitle ?? "No Video Selected"}
          </h2>
          {isDemoCuratedVideo ? (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "0.72rem",
                color: "#a5b4fc",
                marginTop: "2px",
              }}
            >
              <Sparkles size={11} />
              <span>Curated Demo Video — Synced to Claims Ledger</span>
            </div>
          ) : null}
        </div>

        {currentSeekSeconds !== null ? (
          <div
            id="player-active-seek-indicator"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "0.8rem",
              fontFamily: "var(--font-mono)",
              color: "var(--accent-cyan)",
              background: "rgba(6, 182, 212, 0.12)",
              padding: "4px 8px",
              borderRadius: "6px",
            }}
          >
            <Clock size={12} />
            <span>Seeked to {formatSecondsToDisplayTime(currentSeekSeconds)}</span>
          </div>
        ) : null}
      </div>

      <div className="player-wrapper">
        {youtubeVideoId ? (
          <iframe
            id="youtube-player-iframe"
            key={`${youtubeVideoId}-${currentSeekSeconds ?? 0}`}
            className="player-iframe"
            src={buildEmbedUrl()}
            title={videoTitle ?? "YouTube Video Player"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="player-placeholder" id="player-empty-state">
            <Play size={40} style={{ opacity: 0.3 }} />
            <span>Paste a YouTube video URL above or select a quick demo.</span>
          </div>
        )}
      </div>

      <div className="playback-bar" id="playback-status-bar">
        <span>
          {youtubeVideoId
            ? `Video ID: ${resolvePlayableVideoId(youtubeVideoId)}`
            : "Awaiting video input"}
        </span>
        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
          Click any timestamp in the ledger to jump playback
        </span>
      </div>
    </div>
  );
};
