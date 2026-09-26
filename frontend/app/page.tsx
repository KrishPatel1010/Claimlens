"use client";

import React, { useState } from "react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { VideoInputBar } from "../components/video-input/VideoInputBar";
import { DemoVideoSelector } from "../components/demo-selector/DemoVideoSelector";
import { VideoPlayer } from "../components/video-player/VideoPlayer";
import { VideoTrustSummary } from "../components/summary/VideoTrustSummary";
import { ClaimLedger } from "../components/claim-ledger/ClaimLedger";
import { AuditModal } from "../components/audit-modal/AuditModal";
import { DEMO_VIDEOS, DEMO_LEDGERS } from "../lib/demo-data";
import { processVideoViaApi } from "../services/video-api-service";
import type { DemoVideoItem, CacheSummary } from "../types/video-models";
import type { VerifiedClaimEntry } from "../types/claim-models";
import { AlertCircle } from "lucide-react";

const HomePage = (): React.JSX.Element => {
  const initialDemoPayload = DEMO_LEDGERS["sample-health-01"];

  const [activeVideoId, setActiveVideoId] = useState<string | null>(
    initialDemoPayload?.youtubeVideoId ?? null,
  );
  const [activeVideoTitle, setActiveVideoTitle] = useState<string | null>(
    initialDemoPayload?.title ?? null,
  );
  const [activeSeekSeconds, setActiveSeekSeconds] = useState<number | null>(null);
  const [verifiedLedger, setVerifiedLedger] = useState<readonly VerifiedClaimEntry[]>(
    initialDemoPayload?.verifiedLedger ?? [],
  );
  const [cacheSummary, setCacheSummary] = useState<CacheSummary | null>(
    initialDemoPayload?.cacheSummary ?? null,
  );
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [pipelineStatusMessage, setPipelineStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [auditTargetClaim, setAuditTargetClaim] = useState<VerifiedClaimEntry | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);

  const handleSelectDemoVideo = (selectedDemo: DemoVideoItem): void => {
    setErrorMessage(null);
    setActiveSeekSeconds(null);
    setSelectedClaimId(null);

    const matchingLedgerPayload = DEMO_LEDGERS[selectedDemo.youtubeVideoId];
    if (matchingLedgerPayload) {
      setActiveVideoId(matchingLedgerPayload.youtubeVideoId);
      setActiveVideoTitle(matchingLedgerPayload.title);
      setVerifiedLedger(matchingLedgerPayload.verifiedLedger);
      setCacheSummary(matchingLedgerPayload.cacheSummary);
    }
  };

  const handleAnalyzeUrl = async (submittedUrl: string): Promise<void> => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    setActiveSeekSeconds(null);
    setSelectedClaimId(null);
    setPipelineStatusMessage("Stage 1/7: Fetching transcript via SerpApi & inspecting cache...");

    try {
      const responsePayload = await processVideoViaApi(submittedUrl);
      setActiveVideoId(responsePayload.youtubeVideoId);
      setActiveVideoTitle(responsePayload.title);
      setVerifiedLedger(responsePayload.verifiedLedger);
      setCacheSummary(responsePayload.cacheSummary);
    } catch (caughtExecutionError) {
      const displayErrorMessage =
        caughtExecutionError instanceof Error
          ? caughtExecutionError.message
          : "An unexpected error occurred during verification.";
      setErrorMessage(displayErrorMessage);
    } finally {
      setIsAnalyzing(false);
      setPipelineStatusMessage(null);
    }
  };

  const handleSeekToTimestamp = (targetSeconds: number): void => {
    setActiveSeekSeconds(targetSeconds);
  };

  const handleSelectClaim = (targetClaim: VerifiedClaimEntry): void => {
    setSelectedClaimId(targetClaim.claimId);
  };

  const handleOpenAuditModal = (targetClaim: VerifiedClaimEntry): void => {
    setAuditTargetClaim(targetClaim);
    setIsAuditModalOpen(true);
  };

  const handleCloseAuditModal = (): void => {
    setIsAuditModalOpen(false);
    setAuditTargetClaim(null);
  };

  return (
    <div className="app-container" id="claimlens-app-root">
      <Header />

      <main>
        <VideoInputBar
          onAnalyzeUrl={handleAnalyzeUrl}
          isAnalyzing={isAnalyzing}
          pipelineStatusMessage={pipelineStatusMessage}
        />

        <DemoVideoSelector
          demoVideos={DEMO_VIDEOS}
          selectedVideoId={activeVideoId}
          onSelectDemoVideo={handleSelectDemoVideo}
          isDisabled={isAnalyzing}
        />

        {errorMessage ? (
          <div
            id="analysis-error-banner"
            style={{
              marginTop: "16px",
              padding: "14px 18px",
              borderRadius: "12px",
              background: "var(--verdict-unverified-bg)",
              border: "1px solid var(--verdict-unverified-border)",
              color: "var(--verdict-unverified)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "0.85rem",
            }}
          >
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        ) : null}

        <div className="main-grid" style={{ marginTop: "24px" }}>
          <div>
            <VideoPlayer
              youtubeVideoId={activeVideoId}
              videoTitle={activeVideoTitle}
              currentSeekSeconds={activeSeekSeconds}
            />

            <VideoTrustSummary
              verifiedClaims={verifiedLedger}
              cacheSummary={cacheSummary}
            />
          </div>

          <div>
            <ClaimLedger
              verifiedClaims={verifiedLedger}
              selectedClaimId={selectedClaimId}
              onSelectClaim={handleSelectClaim}
              onSeekToTimestamp={handleSeekToTimestamp}
              onOpenAuditModal={handleOpenAuditModal}
            />
          </div>
        </div>
      </main>

      <Footer />

      <AuditModal
        claimEntry={auditTargetClaim}
        isOpen={isAuditModalOpen}
        onClose={handleCloseAuditModal}
      />
    </div>
  );
};

export default HomePage;
