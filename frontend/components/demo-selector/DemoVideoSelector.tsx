import React from "react";
import type { DemoVideoItem } from "../../types/video-models";
import { Sparkles, Activity, TrendingUp, CheckCircle } from "lucide-react";

interface DemoVideoSelectorProps {
  readonly demoVideos: readonly DemoVideoItem[];
  readonly selectedVideoId: string | null;
  readonly onSelectDemoVideo: (selectedDemo: DemoVideoItem) => void;
  readonly isDisabled: boolean;
}

export const DemoVideoSelector = ({
  demoVideos,
  selectedVideoId,
  onSelectDemoVideo,
  isDisabled,
}: DemoVideoSelectorProps): React.JSX.Element => {
  const getCategoryIcon = (category: DemoVideoItem["category"]): React.JSX.Element => {
    switch (category) {
      case "health":
        return <Activity size={14} color="#06b6d4" />;
      case "financial":
        return <TrendingUp size={14} color="#f59e0b" />;
      default:
        return <CheckCircle size={14} color="#10b981" />;
    }
  };

  return (
    <div className="demo-row" id="demo-video-selector-row">
      <span className="demo-row-label">
        <Sparkles size={14} style={{ display: "inline", marginRight: "4px" }} />
        Quick Demos:
      </span>
      {demoVideos.map((demoVideo) => {
        const isCurrentActive = selectedVideoId === demoVideo.youtubeVideoId;
        return (
          <button
            key={demoVideo.youtubeVideoId}
            id={`demo-chip-${demoVideo.youtubeVideoId}`}
            type="button"
            className={`demo-chip ${isCurrentActive ? "active" : ""}`}
            onClick={() => {
              onSelectDemoVideo(demoVideo);
            }}
            disabled={isDisabled}
          >
            {getCategoryIcon(demoVideo.category)}
            <span>{demoVideo.title}</span>
          </button>
        );
      })}
    </div>
  );
};
