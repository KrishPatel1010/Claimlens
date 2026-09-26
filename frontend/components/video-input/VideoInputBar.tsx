import React, { useState } from "react";
import { Search, Loader2 } from "lucide-react";

interface VideoInputBarProps {
  readonly onAnalyzeUrl: (targetUrl: string) => Promise<void>;
  readonly isAnalyzing: boolean;
  readonly pipelineStatusMessage: string | null;
}

export const VideoInputBar = ({
  onAnalyzeUrl,
  isAnalyzing,
  pipelineStatusMessage,
}: VideoInputBarProps): React.JSX.Element => {
  const [inputUrl, setInputUrl] = useState<string>("");
  const [inputValidationError, setInputValidationError] = useState<string | null>(null);

  const handleSubmit = async (submitEvent: React.FormEvent<HTMLFormElement>): Promise<void> => {
    submitEvent.preventDefault();
    setInputValidationError(null);

    const trimmedUrl = inputUrl.trim();
    if (trimmedUrl.length === 0) {
      setInputValidationError("Please enter a valid YouTube video URL.");
      return;
    }

    if (
      !trimmedUrl.includes("youtube.com") &&
      !trimmedUrl.includes("youtu.be")
    ) {
      setInputValidationError("Only official YouTube URLs (youtube.com or youtu.be) are accepted.");
      return;
    }

    await onAnalyzeUrl(trimmedUrl);
  };

  return (
    <section className="input-section" id="video-input-section">
      <form onSubmit={(submitEvent) => { void handleSubmit(submitEvent); }}>
        <div className="input-container">
          <input
            id="youtube-url-input-field"
            type="text"
            className="url-input-field"
            placeholder="Paste YouTube video URL (e.g. https://www.youtube.com/watch?v=sample-health-01)..."
            value={inputUrl}
            onChange={(changeEvent) => {
              setInputUrl(changeEvent.target.value);
              if (inputValidationError) {
                setInputValidationError(null);
              }
            }}
            disabled={isAnalyzing}
          />
          <button
            id="analyze-video-submit-button"
            type="submit"
            className="btn-primary"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 size={16} className="pulse-spinner" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <Search size={16} />
                <span>Verify Claims</span>
              </>
            )}
          </button>
        </div>
      </form>

      {inputValidationError ? (
        <div
          id="url-validation-error-message"
          style={{
            color: "var(--verdict-unverified)",
            fontSize: "0.82rem",
            marginTop: "8px",
            paddingLeft: "16px",
          }}
        >
          {inputValidationError}
        </div>
      ) : null}

      {isAnalyzing && pipelineStatusMessage ? (
        <div className="pipeline-status-banner" id="pipeline-progress-banner">
          <div className="pulse-spinner" />
          <span style={{ fontSize: "0.85rem", color: "#c7d2fe", fontWeight: 500 }}>
            {pipelineStatusMessage}
          </span>
        </div>
      ) : null}
    </section>
  );
};
