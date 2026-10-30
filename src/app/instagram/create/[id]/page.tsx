"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "@/components/AppLayout";
import { PageSkeleton } from "@/components/PageSkeleton";
import { InstagramMediaItem } from "@/lib/instagram";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  ArrowLeft,
  Lightbulb,
  Zap,
  Video,
  Image as ImageIcon,
  Check,
  MessageSquare,
  Send,
  CornerDownRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Smartphone,
  ExternalLink,
  Search,
  RefreshCw,
  Mail,
  HelpCircle,
  AlertTriangle,
  Flame,
  Globe,
  Settings2,
  ChevronDown,
} from "lucide-react";
import { showSuccessToast, showPromiseToast } from "@/lib/toast";
import {
  SignalHeader,
  SignalPage,
  SignalPanel,
  StatusChip,
} from "@/components/workspace/signal-ui";

interface InstagramAccount {
  id: string;
  username: string;
  avatar: string | null;
  status: string;
}

export default function AutomationCreatePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = (params?.id as string) || "new";
  const isEditing = id !== "new";

  // Step state: 1 (Goal), 2 (Where to Reply), 3 (Choose Posts), 4 (Choose Words), 5 (Your Message), 6 (Review), 7 (Success)
  const initialStep = Number(searchParams.get("step")) || 1;
  const [currentStep, setCurrentStep] = useState<number>(
    initialStep >= 1 && initialStep <= 7 ? initialStep : 1
  );

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connection, setConnection] = useState<InstagramAccount | null>(null);

  // Return to review state flag (so when user clicks Edit from Review page, it goes straight back to Review after making a change!)
  const [isReturningToReview, setIsReturningToReview] = useState(false);

  // ================= STEP 1: YOUR GOAL =================
  const [goal, setGoal] = useState<"send_messages" | "collect_email">("send_messages");

  // ================= STEP 2: WHERE TO REPLY (COMMENTS, STORIES, OR BOTH) =================
  // Step 2: 3 mutually exclusive comment options:
  // 1 = "comment_dm_and_public" (Comment -> Private DM + Public Comment)
  // 2 = "comment_dm_only" (Only send Private DM)
  // 3 = "comment_public_only" (Only reply to Public Comment)
  const [commentReplyFlow, setCommentReplyFlow] = useState<"comment_dm_and_public" | "comment_dm_only" | "comment_public_only">("comment_dm_and_public");
  // 4 = Story Mentions (can be paired with 1, 2, or 3, or standalone!)
  const [listenOnStories, setListenOnStories] = useState(false);
  // 5 = Forwarded Reel / Post Shares (auto-reply when someone shares/forwards a Reel into DMs)
  const [replyToReelShares, setReplyToReelShares] = useState(false);
  const [reelShareDmText, setReelShareDmText] = useState("Hey! Thanks for sharing this Reel with me! Here is the info you requested 👇");
  const listenOnComments = commentReplyFlow !== undefined;
  const [postSelectionMode, setPostSelectionMode] = useState<"specific" | "all_posts" | "next_post">("specific");
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  const [postSearchTerm, setPostSearchTerm] = useState("");
  const [mediaList, setMediaList] = useState<InstagramMediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);

  // ================= STEP 4: CHOOSE WORDS =================
  const [keywords, setKeywords] = useState<string[]>(["LINK"]);
  const [keywordInput, setKeywordInput] = useState("");
  const [matchWholeMessageOnly, setMatchWholeMessageOnly] = useState(false);
  const [messageLanguage, setMessageLanguage] = useState("English");

  // ================= STEP 5: YOUR MESSAGE =================
  const [automationName, setAutomationName] = useState("");
  
  // Private Message & Alternative
  const [dmText, setDmText] = useState("Hey! Here's the link you requested 👇");
  const [useSecondMessage, setUseSecondMessage] = useState(false);
  const [dmTextVariantB, setDmTextVariantB] = useState("");

  // Link & Button Option
  const [hasLink, setHasLink] = useState(true);
  const [useButton, setUseButton] = useState(true); // If true: Button with Text, if false: Plain URL link
  const [linkUrl, setLinkUrl] = useState("https://example.com");
  const [linkLabel, setLinkLabel] = useState("Tap to Open");
  const [alsoPublicReply, setAlsoPublicReply] = useState(true);
  const [publicReply, setPublicReply] = useState("Check your DM! 🚀");
  const [useSecondPublicReply, setUseSecondPublicReply] = useState(false);
  const [publicReplyVariantB, setPublicReplyVariantB] = useState("Sent you a message! 📬");

  // Story Mention Custom Message
  const [storyDmText, setStoryDmText] = useState("Thanks for tagging me in your story! Here's your gift 👇");

  // URL step synchronization
  const goToStep = (stepNumber: number, returningToReviewFlag?: boolean) => {
    setError(null);
    setCurrentStep(stepNumber);
    if (returningToReviewFlag !== undefined) {
      setIsReturningToReview(returningToReviewFlag);
    }
    router.replace(`/instagram/create/${id}?step=${stepNumber}`, { scroll: false });
  };

  // Fetch initial posts & automations
  const fetchMediaPosts = async () => {
    setLoadingMedia(true);
    setMediaError(null);
    try {
      const res = await fetch("/api/instagram/media");
      if (res.ok) {
        const json = await res.json();
        const list = json.media || json.data || [];
        setMediaList(list);
      } else {
        setMediaError("We couldn't load your posts. Please try again.");
      }
    } catch {
      setMediaError("We couldn't load your posts. Please try again.");
    } finally {
      setLoadingMedia(false);
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [connRes, autoRes, mediaRes] = await Promise.all([
          fetch("/api/instagram/connection"),
          isEditing ? fetch(`/api/automations/${id}`) : Promise.resolve(null),
          fetch("/api/instagram/media"),
        ]);

        if (connRes.ok) {
          const cJson = await connRes.json();
          setConnection(cJson.connection || null);
        }

        if (mediaRes?.ok) {
          const mJson = await mediaRes.json();
          setMediaList(mJson.media || mJson.data || []);
        }

        if (autoRes?.ok) {
          const aJson = await autoRes.json();
          const auto = aJson.automation;
          if (auto) {
            setAutomationName(auto.name || "");
            setKeywords(auto.keywords && auto.keywords.length > 0 ? auto.keywords : ["LINK"]);
            setDmText(auto.dmText || "Hey! Here's the link you requested 👇");
            setDmTextVariantB(auto.dmVariantB || "");
            setUseSecondMessage(Boolean(auto.dmVariantB));

            if (auto.linkUrl) {
              setHasLink(true);
              setLinkUrl(auto.linkUrl);
              setLinkLabel(auto.linkLabel || "Tap to Open");
            } else {
              setHasLink(false);
            }

            if (auto.captureEmail) {
              setGoal("collect_email");
            }

            if (auto.publicReply) {
              setPublicReply(auto.publicReply);
              setAlsoPublicReply(true);
            } else {
              setAlsoPublicReply(false);
            }

            if (auto.listenOnStories || auto.keywords.some((k: string) => k.toLowerCase() === "story")) {
              setListenOnStories(true);
            }
            if (auto.storyDmText) {
              setStoryDmText(auto.storyDmText);
            }
            if (auto.replyToReelShares) {
              setReplyToReelShares(true);
            }
            if (auto.reelShareDmText) {
              setReelShareDmText(auto.reelShareDmText);
            }
            if (auto.mediaId) {
              setPostSelectionMode("specific");
              setSelectedPostIds([auto.mediaId]);
            } else {
              setPostSelectionMode("all_posts");
            }
          }
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, isEditing]);

  // Keyword management
  const handleAddKeyword = () => {
    const trimmed = keywordInput.trim();
    if (!trimmed) return;
    const exists = keywords.some((k) => k.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      setError(`"${trimmed}" has already been added.`);
      return;
    }
    setError(null);
    setKeywords([...keywords, trimmed]);
    setKeywordInput("");
  };

  const handleRemoveKeyword = (targetWord: string) => {
    setKeywords(keywords.filter((k) => k.toLowerCase() !== targetWord.toLowerCase()));
  };

  const handleSuggestWords = () => {
    let suggestions = ["LINK", "SEND", "ACCESS"];
    if (goal === "collect_email") {
      suggestions = ["GUIDE", "FREE", "EBOOK", "EMAIL"];
    }
    const merged = Array.from(new Set([...keywords, ...suggestions]));
    setKeywords(merged);
  };

  const handleTogglePostSelection = (postId: string) => {
    setSelectedPostIds((prev) =>
      prev.includes(postId) ? prev.filter((p) => p !== postId) : [...prev, postId]
    );
  };

  // Navigations with return-to-review support
  const handleContinueFromStep1 = () => {
    if (isReturningToReview) {
      goToStep(6, false);
      return;
    }
    goToStep(2);
  };

  const handleContinueFromStep2 = () => {
    if (!listenOnComments && !listenOnStories) {
      setError("Please select at least one place for FreshDM to reply (Comments, Stories, or Both).");
      return;
    }
    if (isReturningToReview) {
      goToStep(6, false);
      return;
    }
    if (!listenOnComments && listenOnStories) {
      goToStep(4);
    } else {
      goToStep(3);
    }
  };

  const handleContinueFromStep3 = () => {
    if (postSelectionMode === "specific" && selectedPostIds.length === 0) {
      setError("Please choose at least one post from your list below to continue.");
      return;
    }
    setError(null);
    if (isReturningToReview) {
      goToStep(6, false);
      return;
    }
    goToStep(4);
  };

  const handleContinueFromStep4 = () => {
    if (keywords.length === 0) {
      setError("Please add at least one word people can type to get your message.");
      return;
    }
    setError(null);
    if (isReturningToReview) {
      goToStep(6, false);
      return;
    }
    goToStep(5);
  };

  const handleContinueFromStep5 = () => {
    if (listenOnComments && !alsoPublicReply && !dmText.trim()) {
      setError("Please write the private message your followers will receive.");
      return;
    }
    if (hasLink && !linkUrl.trim()) {
      setError("Please enter a valid link (e.g. https://yourwebsite.com).");
      return;
    }
    setError(null);
    goToStep(6, false);
  };

  // Final submit with ReUI c-sonner-7 (Promise toast with loading)
  const handleTurnOnAutomation = async () => {
    if (!connection) {
      setError("Please connect your Instagram account first.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const primaryPostId = selectedPostIds[0] || null;
    const primaryMediaObj = mediaList.find((m) => m.id === primaryPostId);

    // Strictly preserve user-specified keywords (do not add unwanted keywords)
    const finalKeywords = keywords.map((k) => k.toLowerCase().trim()).filter(Boolean);
    const payload = {
      connectionId: connection.id,
      name: automationName.trim() || `Auto-Reply (${finalKeywords[0]?.toUpperCase() || "New"})`,
      mediaId: postSelectionMode === "specific" ? primaryPostId : null,
      mediaThumbnail: primaryMediaObj?.thumbnail_url || primaryMediaObj?.media_url || null,
      mediaCaption: primaryMediaObj?.caption || null,
      keywords: finalKeywords,
      matchMode: matchWholeMessageOnly ? "exact" : "contains",
      dmText: dmText,
      dmVariantB: useSecondMessage && dmTextVariantB.trim() ? dmTextVariantB.trim() : null,
      captureEmail: goal === "collect_email",
      linkUrl: hasLink && linkUrl.trim() ? linkUrl.trim() : null,
      linkLabel: hasLink && useButton ? (linkLabel.trim() || "Tap to Open") : null,
      publicReply:
        alsoPublicReply && publicReply.trim()
          ? useSecondPublicReply && publicReplyVariantB.trim()
            ? `${publicReply.trim()} | ${publicReplyVariantB.trim()}`
            : publicReply.trim()
          : null,
      listenOnStories: listenOnStories,
      storyDmText: listenOnStories ? storyDmText.trim() || dmText : null,
      replyToReelShares: replyToReelShares,
      reelShareDmText: replyToReelShares ? reelShareDmText.trim() || dmText : null,
      isActive: true,
    };
    const endpoint = isEditing ? `/api/automations/${id}` : "/api/automations";
    const method = isEditing ? "PATCH" : "POST";

    const submitPromise = fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(async (res) => {
      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || "Failed to turn on automation");
      }
      return res.json();
    });

    showPromiseToast(submitPromise, {
      loading: isEditing ? "Updating your automation..." : "Activating your automation...",
      success: () => {
        showSuccessToast(
          "Automation is live!",
          "FreshDM is now listening on Instagram and will reply automatically."
        );
        goToStep(7);
        return "Success!";
      },
      error: (err: any) => err.message || "Failed to turn on automation",
    });

    try {
      await submitPromise;
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPosts = mediaList.filter((m) => {
    if (!postSearchTerm.trim()) return true;
    const term = postSearchTerm.toLowerCase();
    return (m.caption || "").toLowerCase().includes(term);
  });

  if (loading) return <AppLayout><div className="signal-page"><PageSkeleton kind="replies" /></div></AppLayout>;

  return (
    <AppLayout>
      <SignalPage>
        <div className="mx-auto w-full max-w-4xl space-y-5">
          <SignalHeader
            title={isEditing ? "Edit automatic reply" : "Set up automatic reply"}
            description="Easy setup for comments, direct messages, and stories."
            badge={
              <StatusChip tone={currentStep >= 6 ? "success" : "violet"}>
                {currentStep >= 7 ? "Live" : currentStep === 6 ? "Review" : `Step ${currentStep} of 5`}
              </StatusChip>
            }
            actions={
              <Link href="/instagram">
                <Button variant="secondary" size="sm" className="h-9 gap-2 px-3.5">
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  Back to replies
                </Button>
              </Link>
            }
          />

        {error && (
          <div role="alert" className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* ========================================================
            5-STEP PROGRESS BAR WITH CHECKMARKS
        ======================================================== */}
        {currentStep <= 5 && (
          <SignalPanel className="space-y-3 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3 text-xs text-[#527060]">
              <span className="font-mono font-semibold text-[#059669]">
                Step {currentStep} of 5
              </span>
              <span className="font-mono uppercase tracking-[0.08em]">
                {currentStep === 1 && "Goal Selection"}
                {currentStep === 2 && "Where to Reply"}
                {currentStep === 3 && "Choose Posts"}
                {currentStep === 4 && "Choose Words"}
                {currentStep === 5 && "Your Message"}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {[
                { step: 1, title: "Your Goal" },
                { step: 2, title: "Where to Reply" },
                { step: 3, title: "Choose Posts" },
                { step: 4, title: "Choose Words" },
                { step: 5, title: "Your Message" },
              ].map((s) => {
                const isCompleted = currentStep > s.step;
                const isCurrent = currentStep === s.step;

                return (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => {
                      if (s.step < currentStep) goToStep(s.step);
                    }}
                    className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all ${
                      isCurrent
                        ? "bg-[#E8F7F0] border-[#059669] ring-1 ring-[#059669]/40 text-[#059669] font-bold shadow-md"
                        : isCompleted
                        ? "bg-[#0A080C] border-emerald-500/30 text-emerald-400 cursor-pointer"
                        : "bg-[#0A080C] border-white/[0.08] text-[#8C8890] opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold block uppercase tracking-wider">
                        {isCompleted ? "Done" : `Step ${s.step}`}
                      </span>
                      {isCompleted && (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      )}
                    </div>
                    <span className="text-xs sm:text-sm font-bold truncate block mt-0.5">
                      {s.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </SignalPanel>
        )}

        <SignalPanel className="space-y-8 p-6 sm:p-10">
          {/* ========================================================
              STEP 1: YOUR GOAL
          ======================================================== */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  What do you want FreshDM to do?
                </h2>
                <p className="text-xs sm:text-sm text-[#8C8890]">
                  Choose what you want to happen when someone interacts with your Instagram account. We&apos;ll guide you through the setup.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Option A */}
                <div
                  onClick={() => setGoal("send_messages")}
                  className={`p-6 rounded-[24px] border cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
                    goal === "send_messages"
                      ? "bg-[#E8F7F0] border-[#059669] ring-1 ring-[#059669]/40"
                      : "bg-[#0A080C] border-white/[0.08] hover:border-white/20"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-xl bg-[#E8F7F0] border border-[#10B981]/30 text-[#059669] flex items-center justify-center">
                        <Send className="h-5 w-5 text-[#059669]" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#E8F7F0] border border-[#10B981]/30 text-[#059669] text-[10px] font-mono font-bold uppercase">
                        Popular
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-white">
                      Send Messages Automatically
                    </h3>
                    <p className="text-xs text-[#8C8890] leading-relaxed">
                      Automatically reply to comments or messages and send people your links, offers, or free resources.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F4FBF7] border border-[#D5EAE0] text-[11px] text-[#3B5D4D]">
                    <strong>Example:</strong> Someone comments &quot;LINK&quot; on your Reel, and AutoDM sends them your link privately.
                  </div>
                </div>

                {/* Option B: Collect Emails (Free for all right now) */}
                <div
                  onClick={() => {
                    setGoal("collect_email");
                    if (dmText.includes("Here's the link you requested") || dmText === "") {
                      setDmText("Hey! What's your best email address? Drop it below and I'll send the guide straight to your inbox ");
                    }
                  }}
                  className={`p-6 rounded-[24px] border cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
                    goal === "collect_email"
                      ? "bg-[#E8F7F0] border-[#059669] ring-1 ring-[#059669]/40"
                      : "bg-[#0A080C] border-white/[0.08] hover:border-white/20"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-xl bg-[#E8F7F0] border border-[#10B981]/30 text-[#059669] flex items-center justify-center">
                        <Mail className="h-5 w-5 text-[#059669]" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold uppercase">
                        Included
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-white">
                      Collect Email Addresses
                    </h3>
                    <p className="text-xs text-[#8C8890] leading-relaxed">
                      Collect email addresses from interested followers so you can manage your leads and share the resources they request.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F4FBF7] border border-[#D5EAE0] text-[11px] text-[#3B5D4D]">
                    <strong>Example:</strong> Ask followers for their email address in DM and save it automatically to your lead list.
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end border-t border-white/[0.06]">
                <Button
                  onClick={handleContinueFromStep1}
                  className="bg-[#059669] hover:bg-[#047857] text-white rounded-xl gap-2 px-6 py-2.5 font-bold cursor-pointer"
                >
                  <span>{isReturningToReview ? "Save Changes & Return to Review" : "Continue"}</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 2: WHERE TO REPLY (BOTH COMMENTS & STORIES SUPPORTED)
          ======================================================== */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Where do you want FreshDM to reply?
                </h2>
                <p className="text-xs sm:text-sm text-[#8C8890]">
                  Select the places you want FreshDM to monitor. You can select comments, stories, or both!
                </p>
              </div>

              <div className="space-y-4">
                {/* SECTION A: COMMENTS REPLY FLOW (Choose 1 of 3) */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-[#8C8890] uppercase tracking-wider block">
                    1. Choose how you want to reply to comments:
                  </label>

                  <div className="grid gap-3">
                    {/* Option 1: Comment -> Send Private DM + Reply Publicly */}
                    <div
                      onClick={() => {
                        setCommentReplyFlow("comment_dm_and_public");
                        setAlsoPublicReply(true);
                      }}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                        commentReplyFlow === "comment_dm_and_public"
                          ? "bg-[#E8F7F0] border-[#059669] ring-1 ring-[#059669]/40"
                          : "bg-[#0A080C] border-white/[0.08] hover:border-white/15"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3.5">
                          <div className="h-10 w-10 rounded-xl bg-[#E8F7F0] border border-[#10B981]/30 text-[#059669] flex items-center justify-center shrink-0">
                            <MessageSquare className="h-5 w-5 text-[#059669]" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-base text-white block">Comment → Send Private DM + Reply Publicly</span>
                              <span className="px-2 py-0.5 rounded-full bg-[#E8F7F0] border border-[#10B981]/30 text-[#059669] text-[9px] font-bold uppercase">
                                Recommended
                              </span>
                            </div>
                            <p className="text-xs text-[#8C8890] leading-relaxed">
                              Sends your follower a private message in DM, and also leaves a friendly comment under their comment so they check their inbox.
                            </p>
                          </div>
                        </div>
                        <div
                          className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${
                            commentReplyFlow === "comment_dm_and_public"
                              ? "bg-[#059669] border-[#059669] text-white"
                              : "border-white/20"
                          }`}
                        >
                          {commentReplyFlow === "comment_dm_and_public" && <Check className="h-3.5 w-3.5" />}
                        </div>
                      </div>
                    </div>

                    {/* Option 2: Only Send Private DM */}
                    <div
                      onClick={() => {
                        setCommentReplyFlow("comment_dm_only");
                        setAlsoPublicReply(false);
                      }}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                        commentReplyFlow === "comment_dm_only"
                          ? "bg-[#E8F7F0] border-[#059669] ring-1 ring-[#059669]/40"
                          : "bg-[#0A080C] border-white/[0.08] hover:border-white/15"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3.5">
                          <div className="h-10 w-10 rounded-xl bg-[#E8F7F0] border border-[#10B981]/30 text-[#059669] flex items-center justify-center shrink-0">
                            <Send className="h-5 w-5 text-[#059669]" />
                          </div>
                          <div className="space-y-1">
                            <span className="font-bold text-base text-white block">Only Send Private DM</span>
                            <p className="text-xs text-[#8C8890] leading-relaxed">
                              Sends your message and link privately to their DM inbox with zero public comment underneath their comment.
                            </p>
                          </div>
                        </div>
                        <div
                          className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${
                            commentReplyFlow === "comment_dm_only"
                              ? "bg-[#059669] border-[#059669] text-white"
                              : "border-white/20"
                          }`}
                        >
                          {commentReplyFlow === "comment_dm_only" && <Check className="h-3.5 w-3.5" />}
                        </div>
                      </div>
                    </div>

                    {/* Option 3: Only Reply to Public Comment */}
                    <div
                      onClick={() => {
                        setCommentReplyFlow("comment_public_only");
                        setAlsoPublicReply(true);
                      }}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                        commentReplyFlow === "comment_public_only"
                          ? "bg-[#E8F7F0] border-[#059669] ring-1 ring-[#059669]/40"
                          : "bg-[#0A080C] border-white/[0.08] hover:border-white/15"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3.5">
                          <div className="h-10 w-10 rounded-xl bg-[#E8F7F0] border border-[#10B981]/30 text-[#059669] flex items-center justify-center shrink-0">
                            <CornerDownRight className="h-5 w-5 text-[#059669]" />
                          </div>
                          <div className="space-y-1">
                            <span className="font-bold text-base text-white block">Only Reply to Public Comment</span>
                            <p className="text-xs text-[#8C8890] leading-relaxed">
                              Replies publicly under their comment on Instagram without sending a private direct message.
                            </p>
                          </div>
                        </div>
                        <div
                          className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${
                            commentReplyFlow === "comment_public_only"
                              ? "bg-[#059669] border-[#059669] text-white"
                              : "border-white/20"
                          }`}
                        >
                          {commentReplyFlow === "comment_public_only" && <Check className="h-3.5 w-3.5" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION B: STORY MENTIONS (Can be toggled alongside Option 1, 2, or 3) */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-semibold text-[#8C8890] uppercase tracking-wider block">
                    2. Also reply to Instagram Stories? (Optional add-on)
                  </label>

                  <div
                    onClick={() => setListenOnStories(!listenOnStories)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      listenOnStories
                        ? "bg-[#E8F7F0] border-[#059669] ring-1 ring-[#059669]/40"
                        : "bg-[#0A080C] border-white/[0.08] hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3.5">
                        <div className="h-10 w-10 rounded-xl bg-[#E8F7F0] border border-[#10B981]/30 text-[#059669] flex items-center justify-center shrink-0">
                          <Zap className="h-5 w-5 text-[#059669]" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base text-white block">Story Mentions &amp; Replies</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold">
                              Viral Growth
                            </span>
                          </div>
                          <p className="text-xs text-[#8C8890] leading-relaxed">
                            Automatically send a private custom thank-you message whenever someone tags your account in their Story or replies to your Story.
                          </p>
                        </div>
                      </div>
                      <div
                        className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 ${
                          listenOnStories ? "bg-[#059669] border-[#059669] text-white" : "border-[#D5EAE0]"
                        }`}
                      >
                        {listenOnStories && <Check className="h-3.5 w-3.5" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION C: FORWARDED REEL / POST SHARES IN DM */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-semibold text-[#8C8890] uppercase tracking-wider block">
                    3. Also reply when someone forwards a Reel or Post in DM? (Optional add-on)
                  </label>

                  <div
                    onClick={() => setReplyToReelShares(!replyToReelShares)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      replyToReelShares
                        ? "bg-[#E8F7F0] border-[#059669] ring-1 ring-[#059669]/40"
                        : "bg-[#0A080C] border-white/[0.08] hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3.5">
                        <div className="h-10 w-10 rounded-xl bg-[#E8F7F0] border border-[#10B981]/30 text-[#059669] flex items-center justify-center shrink-0">
                          <Video className="h-5 w-5 text-[#059669]" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base text-white block">Forwarded Reel &amp; Post Replies</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-semibold">
                              Direct Shares
                            </span>
                          </div>
                          <p className="text-xs text-[#8C8890] leading-relaxed">
                            Automatically send a helpful reply whenever a follower forwards or shares a Reel/Post into your direct message chat.
                          </p>
                        </div>
                      </div>
                      <div
                        className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 ${
                          replyToReelShares ? "bg-[#059669] border-[#059669] text-white" : "border-[#D5EAE0]"
                        }`}
                      >
                        {replyToReelShares && <Check className="h-3.5 w-3.5" />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-white/[0.06]">
                <Button
                  variant="secondary"
                  onClick={() => goToStep(1)}
                  className="bg-[#0A080C] border-white/[0.08] text-white rounded-xl gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button
                  onClick={handleContinueFromStep2}
                  className="bg-[#059669] hover:bg-[#047857] text-white rounded-xl gap-2 font-bold cursor-pointer"
                >
                  <span>{isReturningToReview ? "Save Changes & Return to Review" : "Choose Posts"}</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 3: CHOOSE YOUR POSTS (SCROLLABLE REEL SELECTOR)
          ======================================================== */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Which posts should FreshDM work on?
                </h2>
                <p className="text-xs sm:text-sm text-[#8C8890]">
                  Choose the Instagram posts or Reels where you want FreshDM to reply.
                </p>
              </div>

              {/* 3 Post Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => setPostSelectionMode("specific")}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    postSelectionMode === "specific"
                      ? "bg-[#E8F7F0] border-[#059669] text-[#059669] font-bold"
                      : "bg-[#0A080C] border-white/[0.08] text-[#8C8890]"
                  }`}
                >
                  <h3 className="font-bold text-sm text-white">Choose Specific Posts</h3>
                  <p className="text-xs text-[#8C8890] mt-1">
                    Select specific posts or Reels from your feed.
                  </p>
                </div>

                <div
                  onClick={() => setPostSelectionMode("all_posts")}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    postSelectionMode === "all_posts"
                      ? "bg-[#E8F7F0] border-[#059669] text-[#059669] font-bold"
                      : "bg-[#0A080C] border-white/[0.08] text-[#8C8890]"
                  }`}
                >
                  <h3 className="font-bold text-sm text-white">Use All My Posts</h3>
                  <p className="text-xs text-[#8C8890] mt-1">
                    Listens on all existing and future Reels &amp; posts.
                  </p>
                </div>

                <div
                  onClick={() => setPostSelectionMode("next_post")}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    postSelectionMode === "next_post"
                      ? "bg-[#E8F7F0] border-[#059669] text-[#059669] font-bold"
                      : "bg-[#0A080C] border-white/[0.08] text-[#8C8890]"
                  }`}
                >
                  <h3 className="font-bold text-sm text-white">Use My Next Post</h3>
                  <p className="text-xs text-[#8C8890] mt-1">
                    Automatically applies to your next published post.
                  </p>
                </div>
              </div>

              {/* Specific Post Searchable & Scrollable Grid */}
              {postSelectionMode === "specific" && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="h-4 w-4 text-[#8C8890] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={postSearchTerm}
                        onChange={(e) => setPostSearchTerm(e.target.value)}
                        placeholder="Search posts by caption..."
                        className="w-full h-10 rounded-xl border border-white/[0.08] bg-[#0A080C] pl-10 pr-3 text-xs text-white placeholder-[#6E6A73] outline-none focus:border-[#7A22B0]"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[#059669] font-bold">
                        {selectedPostIds.length} {selectedPostIds.length === 1 ? "post selected" : "posts selected"}
                      </span>

                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={fetchMediaPosts}
                        className="bg-[#0A080C] border-white/[0.08] text-[#8C8890] hover:text-white rounded-xl text-xs gap-1.5"
                      >
                        <RefreshCw className={`h-3 w-3 ${loadingMedia ? "animate-spin text-[#059669]" : ""}`} />
                        <span>Refresh Posts</span>
                      </Button>
                    </div>
                  </div>

                  {loadingMedia ? (
                    <div className="h-56 rounded-2xl bg-[#0A080C] border border-white/[0.08] flex items-center justify-center text-xs text-[#8C8890] animate-pulse">
                      Getting your Instagram posts...
                    </div>
                  ) : mediaError ? (
                    <div className="p-6 rounded-2xl border border-rose-500/20 bg-rose-500/10 text-center text-xs text-rose-300">
                      {mediaError}
                    </div>
                  ) : filteredPosts.length === 0 ? (
                    <div className="p-8 rounded-2xl border border-dashed border-white/[0.12] bg-[#0A080C] text-center space-y-2">
                      <p className="text-xs text-[#8C8890]">
                        No posts found. Refresh your posts or check your Instagram connection.
                      </p>
                      <Button size="sm" onClick={fetchMediaPosts} className="bg-[#059669] hover:bg-[#047857] text-white rounded-xl text-xs">
                        Refresh Posts
                      </Button>
                    </div>
                  ) : (
                    /* Perfectly Scrollable Grid */
                    <div className="p-1 rounded-2xl border border-white/[0.06] bg-[#0A080C]">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[360px] overflow-y-auto p-3" style={{ overscrollBehavior: "contain" }}>
                        {filteredPosts.map((m) => {
                          const isSelected = selectedPostIds.includes(m.id);
                          const thumb = m.thumbnail_url || m.media_url || "";
                          return (
                            <div
                              key={m.id}
                              onClick={() => handleTogglePostSelection(m.id)}
                              className={`group aspect-[9/13] rounded-2xl overflow-hidden border cursor-pointer relative transition-all ${
                                isSelected
                                  ? "border-2 border-[#059669] ring-2 ring-[#059669]/30 shadow-md"
                                  : "border-white/[0.08] hover:border-white/20"
                              }`}
                            >
                              {thumb ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={thumb} alt="Post" className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full bg-zinc-900 flex items-center justify-center text-xs text-zinc-500">
                                  Post
                                </div>
                              )}

                              {/* Badge */}
                              <div className="absolute top-2 left-2 p-1 rounded-md bg-black/60 backdrop-blur-md">
                                {m.media_type === "VIDEO" ? (
                                  <Video className="h-3 w-3 text-white" />
                                ) : (
                                  <ImageIcon className="h-3 w-3 text-white" />
                                )}
                              </div>

                              {/* Checkbox */}
                              <div className="absolute top-2 right-2">
                                <div
                                  className={`h-5 w-5 rounded-md border flex items-center justify-center ${
                                    isSelected ? "bg-[#059669] border-[#059669] text-white" : "border-white/40 bg-black/40"
                                  }`}
                                >
                                  {isSelected && <Check className="h-3.5 w-3.5" />}
                                </div>
                              </div>

                              {/* Caption */}
                              <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black via-black/80 to-transparent">
                                <p className="text-[10px] text-white/90 line-clamp-1">
                                  {m.caption || "Instagram Media"}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 flex items-center justify-between border-t border-white/[0.06]">
                <Button
                  variant="secondary"
                  onClick={() => goToStep(2)}
                  className="bg-[#0A080C] border-white/[0.08] text-white rounded-xl gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button
                  onClick={handleContinueFromStep3}
                  className="bg-[#059669] hover:bg-[#047857] text-white rounded-xl gap-2 font-bold cursor-pointer"
                >
                  <span>{isReturningToReview ? "Save Changes & Return to Review" : "Choose Words"}</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 4: CHOOSE WORDS
          ======================================================== */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  What should someone say to get your message?
                </h2>
                <p className="text-xs sm:text-sm text-[#8C8890]">
                  Choose the words people can comment or send you to receive an automatic reply.
                </p>
                <p className="text-[11px] text-[#059669] font-medium pt-0.5">
                  💡 Not case-sensitive: typing &quot;LINK&quot;, &quot;Link&quot;, or &quot;link&quot; will all trigger the response.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1 space-y-1">
                    <label className="text-xs font-semibold text-[#8C8890]">Words to look for</label>
                    <input
                      type="text"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddKeyword();
                        }
                      }}
                      placeholder="Type a word, like LINK or GUIDE"
                      className="w-full h-12 rounded-xl border border-white/[0.08] bg-[#0A080C] px-4 text-sm text-white placeholder-[#6E6A73] outline-none focus:border-[#7A22B0] transition"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddKeyword}
                    className="h-12 px-5 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-xl self-end cursor-pointer"
                  >
                    Add Word
                  </Button>
                </div>

                {/* Keyword Chips */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {keywords.map((kw) => (
                    <span
                      key={kw}
                      className="px-3 py-1.5 rounded-xl bg-[#E8F7F0] border border-[#10B981]/30 text-[#059669] text-xs font-bold font-mono flex items-center gap-2"
                    >
                      {kw}
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(kw)}
                        className="hover:text-white cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {/* Suggest Words Button */}
                <div className="pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleSuggestWords}
                    className="bg-[#F4FBF7] border-[#D5EAE0] text-[#059669] hover:bg-white rounded-xl text-xs gap-1.5"
                  >
                    <Lightbulb className="h-3.5 w-3.5 text-[#059669]" />
                    <span>Suggest Words</span>
                  </Button>
                </div>

                {/* Match Whole Message Only */}
                <div className="p-4 rounded-2xl border border-white/[0.08] bg-[#130E1A] flex items-start gap-3 mt-4">
                  <input
                    type="checkbox"
                    id="wholeMessageCheck"
                    checked={matchWholeMessageOnly}
                    onChange={(e) => setMatchWholeMessageOnly(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded accent-[#7A22B0] cursor-pointer"
                  />
                  <label htmlFor="wholeMessageCheck" className="text-xs space-y-0.5 cursor-pointer">
                    <span className="font-bold text-white block">Match the whole message only</span>
                    <span className="text-[#8C8890] block leading-relaxed">
                      Use this if you want FreshDM to respond only when someone sends the exact word, rather than a longer message containing it.
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-white/[0.06]">
                <Button
                  variant="secondary"
                  onClick={() => goToStep(listenOnComments ? 3 : 2)}
                  className="bg-[#0A080C] border-white/[0.08] text-white rounded-xl gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button
                  onClick={handleContinueFromStep4}
                  className="bg-[#059669] hover:bg-[#047857] text-white rounded-xl gap-2 font-bold cursor-pointer"
                >
                  <span>{isReturningToReview ? "Save Changes & Return to Review" : "Write My Message"}</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 5: YOUR MESSAGE (CLEAN & SIMPLE FORMAT)
          ======================================================== */}
          {currentStep === 5 && (
            <div className="space-y-8">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  What should FreshDM send?
                </h2>
                <p className="text-xs sm:text-sm text-[#8C8890]">
                  Write the message your followers will receive. You can also add a button with your link.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Input Controls Structured by Context */}
                <div className="lg:col-span-6 space-y-4">
                  {/* Card 1: Basic Automation Identity */}
                  <div className="p-4 rounded-2xl border border-white/[0.08] bg-[#130E1A]/40 space-y-2">
                    <label className="text-xs font-bold text-white block">Automation Name</label>
                    <input
                      type="text"
                      value={automationName}
                      onChange={(e) => setAutomationName(e.target.value)}
                      placeholder="e.g. Free Guide Delivery"
                      className="w-full h-10 rounded-xl border border-white/[0.08] bg-[#0A080C] px-3.5 text-xs text-white outline-none focus:border-[#7A22B0]"
                    />
                  </div>

                  {/* Card 2: Main Direct Message (DM) */}
                  <div className="p-4 rounded-2xl border border-white/[0.08] bg-[#130E1A]/40 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-white">Private Message (DM)</h4>
                        <p className="text-[11px] text-[#8C8890]">Sent to followers in their inbox.</p>
                      </div>
                      <span className="font-mono text-[10px] text-[#6E6A73]">{dmText.length} / 1000</span>
                    </div>

                    <textarea
                      rows={3}
                      value={dmText}
                      onChange={(e) => setDmText(e.target.value)}
                      placeholder="Write a friendly message for your followers..."
                      className="w-full rounded-xl border border-white/[0.08] bg-[#0A080C] p-3 text-xs sm:text-sm text-white placeholder-[#6E6A73] outline-none focus:border-[#7A22B0]"
                    />

                    {/* Alternative Message Toggle */}
                    <div className="pt-1 border-t border-white/[0.04] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#8C8890]">
                          A/B human copy variation (Randomized)
                        </span>
                        <button
                          type="button"
                          onClick={() => setUseSecondMessage(!useSecondMessage)}
                          className="text-xs text-[#059669] hover:underline font-medium cursor-pointer"
                        >
                          {useSecondMessage ? "Remove" : "+ Add alternative DM"}
                        </button>
                      </div>

                      {useSecondMessage && (
                        <textarea
                          rows={2}
                          value={dmTextVariantB}
                          onChange={(e) => setDmTextVariantB(e.target.value)}
                          placeholder="Awesome! Thanks for reaching out. Here's your link:"
                          className="w-full rounded-xl border border-white/[0.1] bg-[#0A080C] p-2.5 text-xs text-white placeholder-[#6E6A73] outline-none focus:border-[#A24BE0]"
                        />
                      )}
                    </div>
                  </div>

                  {/* Card 3: Link & Call to Action Button */}
                  <div className="p-4 rounded-2xl border border-white/[0.08] bg-[#130E1A]/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-white">
                          {goal === "collect_email"
                            ? "Deliver Link After Follower Sends Email?"
                            : "Include a clickable link?"}
                        </h4>
                        <p className="text-[11px] text-[#8C8890]">
                          {goal === "collect_email"
                            ? "Withholds the link until follower replies with their email address."
                            : "Attach a button or web link that people can tap."}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={hasLink}
                        onChange={(e) => setHasLink(e.target.checked)}
                        className="h-4 w-4 rounded accent-[#7A22B0] cursor-pointer shrink-0"
                      />
                    </div>

                    {hasLink && (
                      <div className="space-y-3 pt-2 border-t border-white/[0.04]">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-[#8C8890]">Destination URL</label>
                          <input
                            type="url"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="w-full h-10 rounded-xl border border-white/[0.08] bg-[#0A080C] px-3.5 text-xs text-white outline-none focus:border-[#7A22B0]"
                          />
                        </div>

                        {/* Optional Button Choice */}
                        <div className="p-3 rounded-xl bg-[#0A080C] border border-white/[0.06] space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold text-white block">Display as a Tap Button?</span>
                              <p className="text-[10px] text-[#8C8890]">
                                When on, followers see a clickable pill button. When off, sends the clean URL.
                              </p>
                            </div>
                            <input
                              type="checkbox"
                              checked={useButton}
                              onChange={(e) => setUseButton(e.target.checked)}
                              className="h-4 w-4 rounded accent-[#7A22B0] cursor-pointer shrink-0"
                            />
                          </div>

                          {useButton && (
                            <div className="pt-1 space-y-1">
                              <label className="text-[11px] font-semibold text-[#8C8890]">Button Label</label>
                              <input
                                type="text"
                                value={linkLabel}
                                onChange={(e) => setLinkLabel(e.target.value)}
                                placeholder="Tap to Open"
                                className="w-full h-9 rounded-xl border border-white/[0.08] bg-[#120F18] px-3 text-xs text-white outline-none focus:border-[#7A22B0]"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card 4: Public Comment Reply (Only if comments enabled) */}
                  {listenOnComments && alsoPublicReply && (
                    <div className="p-4 rounded-2xl border border-white/[0.08] bg-[#130E1A]/40 space-y-3">
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-white">Public comment reply</h4>
                        <p className="text-[11px] text-[#8C8890]">
                          Leaves a friendly reply under their comment to tell them to check DM.
                        </p>
                      </div>

                      <input
                        type="text"
                        value={publicReply}
                        onChange={(e) => setPublicReply(e.target.value)}
                        placeholder="Check your DM! 🚀"
                        className="w-full h-10 rounded-xl border border-white/[0.08] bg-[#0A080C] px-3.5 text-xs text-white outline-none focus:border-[#7A22B0]"
                      />

                      <div className="pt-1 border-t border-white/[0.04] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-[#8C8890]">
                            Alternative public reply
                          </span>
                          <button
                            type="button"
                            onClick={() => setUseSecondPublicReply(!useSecondPublicReply)}
                            className="text-xs text-[#059669] hover:underline font-medium cursor-pointer"
                          >
                            {useSecondPublicReply ? "Remove" : "+ Add alternative comment"}
                          </button>
                        </div>

                        {useSecondPublicReply && (
                          <input
                            type="text"
                            value={publicReplyVariantB}
                            onChange={(e) => setPublicReplyVariantB(e.target.value)}
                            placeholder="Sent you a message! 🚀"
                            className="w-full h-10 rounded-xl border border-white/[0.1] bg-[#0A080C] px-3.5 text-xs text-white outline-none focus:border-[#A24BE0]"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Card 5: Story Mention Reply (Only if stories enabled) */}
                  {listenOnStories && (
                    <div className="p-4 rounded-2xl border border-white/[0.08] bg-[#130E1A]/40 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-0.5 min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-white flex items-center gap-2">
                            <Zap className="h-4 w-4 text-[#059669] shrink-0" />
                            <span className="truncate">Story Mentions Reply</span>
                          </h4>
                          <p className="text-[11px] text-[#8C8890]">
                            Sent privately when someone tags your account in their Story.
                          </p>
                        </div>
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#059669] bg-[#E8F7F0] border border-[#10B981]/30 px-2 py-0.5 rounded-full shrink-0">
                          Story Add-on
                        </span>
                      </div>
                      <textarea
                        rows={2}
                        value={storyDmText}
                        onChange={(e) => setStoryDmText(e.target.value)}
                        placeholder="Thanks for tagging me in your story! Here is your gift link:"
                        className="w-full rounded-xl border border-white/[0.08] bg-[#0A080C] p-3 text-xs text-white outline-none focus:border-[#7A22B0]"
                      />
                    </div>
                  )}

                  {/* Card 6: Forwarded Reel / Post DM Reply (Only if enabled) */}
                  {replyToReelShares && (
                    <div className="p-4 rounded-2xl border border-white/[0.08] bg-[#130E1A]/40 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-0.5 min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-white flex items-center gap-2">
                            <Video className="h-4 w-4 text-cyan-400 shrink-0" />
                            <span className="truncate">Forwarded Reel &amp; Post Replies</span>
                          </h4>
                          <p className="text-[11px] text-[#8C8890]">
                            Sent privately when a follower forwards or shares a Reel into your chat.
                          </p>
                        </div>
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 rounded-full shrink-0">
                          Reel Share
                        </span>
                      </div>
                      <textarea
                        rows={2}
                        value={reelShareDmText}
                        onChange={(e) => setReelShareDmText(e.target.value)}
                        placeholder="Hey! Thanks for sharing this Reel with me! Here is your link:"
                        className="w-full rounded-xl border border-white/[0.08] bg-[#0A080C] p-3 text-xs text-white outline-none focus:border-[#7A22B0]"
                      />
                    </div>
                  )}
                </div>
                {/* Right: Live Realistic Instagram Phone Preview */}
                <div className="lg:col-span-6 space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">Here&apos;s what your follower will see</h3>
                    <p className="text-[11px] text-[#8C8890]">
                      Live preview showing the comments and direct message inbox.
                    </p>
                  </div>

                  <div className="rounded-[30px] border border-white/[0.12] bg-black p-3.5 text-left shadow-2xl flex flex-col justify-between h-[420px] overflow-hidden relative">
                    <div>
                      {/* Status bar */}
                      <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-[10px] text-zinc-400">
                        <span className="text-white font-mono font-bold">9:41</span>
                        <span className="font-semibold text-white">Instagram</span>
                        <span>5G</span>
                      </div>

                      {/* Header */}
                      <div className="pt-2 pb-2.5 border-b border-zinc-900 flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-[#059669] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {(connection?.username || "Y")[0].toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-bold text-white truncate">
                            @{connection?.username || "creator"}
                          </p>
                          <p className="text-[10px] text-emerald-400">Active now</p>
                        </div>
                      </div>

                      {/* Comment thread preview */}
                      {listenOnComments && (
                        <div className="py-2.5 border-b border-zinc-900/80 space-y-2">
                          <div className="flex items-start gap-2 text-[10.5px]">
                            <div className="h-5 w-5 rounded-full bg-zinc-800 text-white flex items-center justify-center text-[9px] shrink-0 font-bold">
                              F
                            </div>
                            <div className="text-zinc-300">
                              <span className="font-bold text-white pr-1">follower:</span>
                              &quot;{keywords[0] || "LINK"}&quot;
                            </div>
                          </div>

                          {alsoPublicReply && (
                            <div className="pl-6 flex items-start gap-1.5 text-[10px]">
                              <span className="font-bold text-white">You:</span>
                              <span className="text-zinc-300">&quot;{publicReply}&quot;</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* DM chat bubble preview */}
                      <div className="pt-3 space-y-2">
                        <div className="rounded-2xl rounded-tl-sm bg-[#1A1622] border border-white/[0.08] p-3 text-[11px] text-[#E6E3E8] space-y-2.5">
                          <p className="leading-relaxed whitespace-pre-wrap">{dmText}</p>
                          {hasLink && linkUrl && (
                            useButton ? (
                              <div className="rounded-xl bg-[#E8F7F0] border border-[#10B981]/30 p-2 flex items-center justify-between text-[10.5px]">
                                <span className="text-white font-semibold truncate pr-1">
                                  {linkLabel || "Tap to Open"}
                                </span>
                                <span className="text-[#059669] font-bold text-[10px]">→</span>
                              </div>
                            ) : (
                              <div className="text-[10.5px] text-[#059669] underline break-all font-mono">
                                {linkUrl}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 flex items-center gap-1.5">
                      <Lock className="h-3 w-3 text-[#059669] shrink-0" />
                      <span>Live preview matching your custom messages.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-white/[0.06]">
                <Button
                  variant="secondary"
                  onClick={() => goToStep(4)}
                  className="bg-[#0A080C] border-white/[0.08] text-white rounded-xl gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button
                  onClick={handleContinueFromStep5}
                  className="bg-[#059669] hover:bg-[#047857] text-white rounded-xl gap-2 font-bold cursor-pointer"
                >
                  <span>Review My Automation</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ========================================================
              FINAL REVIEW SCREEN
          ======================================================== */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Check everything before turning it on
                </h2>
                <p className="text-xs sm:text-sm text-[#8C8890]">
                  Make sure your settings look right. You can change anything before starting.
                </p>
              </div>

              <div className="divide-y divide-white/[0.08] border border-white/[0.08] rounded-2xl bg-[#0A080C] overflow-hidden text-xs">
                {/* 1. Name */}
                <div className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[#8C8890] block text-[11px]">Automation Name:</span>
                    <span className="font-bold text-white text-sm">
                      {automationName.trim() || `Auto-Reply (${keywords[0]?.toUpperCase()})`}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => goToStep(5, true)} className="text-[#059669] text-xs font-bold">
                    Edit
                  </Button>
                </div>

                {/* 2. Instagram Account */}
                <div className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[#8C8890] block text-[11px]">Instagram Account:</span>
                    <span className="font-bold text-white">
                      @{connection?.username || "Not connected"}
                    </span>
                  </div>
                  <span className="text-emerald-400 text-[11px] font-semibold">Authorized</span>
                </div>

                {/* 3. Goal */}
                <div className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[#8C8890] block text-[11px]">Goal:</span>
                    <span className="font-bold text-white">
                      {goal === "send_messages" ? "Send Messages Automatically" : "Collect Email Addresses"}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => goToStep(1, true)} className="text-[#059669] text-xs font-bold">
                    Edit
                  </Button>
                </div>

                {/* 4. Reply Type */}
                <div className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[#8C8890] block text-[11px]">Reply Type:</span>
                    <span className="font-bold text-white">
                      {listenOnComments && listenOnStories
                        ? "Both (Comments + Stories)"
                        : listenOnComments
                        ? "Post & Reel Comments"
                        : "Story Mentions & Replies"}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => goToStep(2, true)} className="text-[#059669] text-xs font-bold">
                    Edit
                  </Button>
                </div>

                {/* 5. Posts */}
                {listenOnComments && (
                  <div className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[#8C8890] block text-[11px]">Posts:</span>
                      <span className="font-bold text-white">
                        {postSelectionMode === "specific"
                          ? `${selectedPostIds.length} specific post(s) selected`
                          : postSelectionMode === "all_posts"
                          ? "All published posts & Reels"
                          : "My next published post"}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => goToStep(3, true)} className="text-[#059669] text-xs font-bold">
                      Edit
                    </Button>
                  </div>
                )}

                {/* 6. Words */}
                <div className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[#8C8890] block text-[11px]">Words to look for:</span>
                    <div className="flex gap-1.5 flex-wrap pt-1">
                      {keywords.map((k) => (
                        <span key={k} className="px-2 py-0.5 rounded bg-[#E8F7F0] text-[#059669] font-mono font-bold text-[10.5px] border border-[#10B981]/30">
                          &quot;{k}&quot;
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => goToStep(4, true)} className="text-[#059669] text-xs font-bold">
                    Edit
                  </Button>
                </div>

                {/* 7. Message */}
                <div className="p-4 flex items-center justify-between gap-4">
                  <div className="max-w-lg">
                    <span className="text-[#8C8890] block text-[11px]">Follower receives:</span>
                    <p className="text-white text-xs italic line-clamp-2">
                      &quot;{dmText}&quot;
                    </p>
                    {hasLink && linkUrl && (
                      <span className="text-[11px] text-[#059669] block pt-1 font-semibold">
                        Button: &quot;{linkLabel}&quot; → {linkUrl}
                      </span>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => goToStep(5, true)} className="text-[#059669] text-xs font-bold">
                    Edit
                  </Button>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-white/[0.06]">
                <Button
                  variant="secondary"
                  onClick={() => goToStep(5)}
                  className="bg-[#0A080C] border-white/[0.08] text-white rounded-xl gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" /> Go Back
                </Button>
                <Button
                  onClick={handleTurnOnAutomation}
                  disabled={submitting}
                  className="bg-gradient-to-r from-[#047857] via-[#059669] to-[#10B981] hover:opacity-95 text-white rounded-xl px-8 py-3 font-bold shadow-md shadow-[#059669]/25 cursor-pointer text-sm"
                >
                  {submitting
                    ? isEditing
                      ? "Saving Changes..."
                      : "Turning On..."
                    : isEditing
                    ? "Save Changes"
                    : "Turn On Automation"}
                </Button>
              </div>
            </div>
          )}

          {/* ========================================================
              SUCCESS SCREEN
          ======================================================== */}
          {currentStep === 7 && (
            <div className="p-6 sm:p-10 text-center space-y-6">
              <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Check className="h-8 w-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {isEditing ? "Your changes have been saved!" : "Your automation is turned on!"}
                </h2>
                <p className="text-xs sm:text-sm text-[#8C8890] max-w-md mx-auto">
                  {isEditing
                    ? "Your automation has been updated and is active with your new settings."
                    : "FreshDM is ready to reply automatically when someone matches your settings."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0A080C] border border-white/[0.08] max-w-md mx-auto text-xs space-y-1 text-left">
                <span className="font-bold text-white block">
                  {automationName || "Your New Automation"}
                </span>
                <span className="text-[#8C8890] block">
                  Listening on Instagram for: {keywords.join(", ")}
                </span>
              </div>

              <div className="pt-2">
                <Link href="/dashboard">
                  <Button className="bg-[#059669] hover:bg-[#047857] text-white rounded-xl px-6 py-2.5 font-bold cursor-pointer">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </SignalPanel>
        </div>
      </SignalPage>
    </AppLayout>
  );
}
