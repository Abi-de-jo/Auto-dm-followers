"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./hero-motion.module.css";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  ChevronLeft,
  Search,
  MoreVertical,
  Phone,
  Video,
  Tag,
  Camera,
  Mic,
  Image as ImageIcon,
  Smile,
  PlusCircle,
} from "lucide-react";

// --- AVATARS (ONLINE HEADSHOTS & AESTHETIC CREATOR PROFILES) ---
const AVATARS = {
  owner: "/avatars/owner.png",
  commenter: "/avatars/commenter.png",
  delhiLens: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=150&auto=format&fit=crop&q=80",
  rohanSharma: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
  techBites: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&auto=format&fit=crop&q=80",
  snehaKapoor: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  desiDev: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&auto=format&fit=crop&q=80",
};

// --- 3 DISTINCT POSTS WITH DIFFERENT KEYWORDS ---
const FEED_POSTS = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
    badge: "Auto-DM Engine",
    headline: "Automate your Instagram\nDMs on autopilot",
    captionText: 'Automate your Instagram DMs on autopilot. Comment "PRICE" for instant bot setup access ⚡',
    likes: "412 likes",
    commentsCount: "24 comments",
    keyword: "price",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80",
    badge: "24/7 Creator Pipeline",
    headline: "Stop losing leads in\nyour DMs while sleeping",
    captionText: 'Stop losing leads while sleeping. Drop "LINK" below to test our automated Instagram workflow 🚀',
    likes: "839 likes",
    commentsCount: "48 comments",
    keyword: "link",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    badge: "Meta Compliant",
    headline: "Instant DM delivery in\nunder 0.5 seconds",
    captionText: 'Built a system that replies in <0.5s. Comment "ACCESS" to get the instant access link 🎯',
    likes: "1.2k likes",
    commentsCount: "62 comments",
    keyword: "access",
  },
];

// --- ANIMATION STAGES ---
type AnimationStage =
  | "FEED_SHOW"         // 0.0s - 2.0s: First 2 seconds show feed stably!
  | "FEED_SCROLL"       // 2.0s - 3.2s: Smoothly scroll down to target post
  | "COMMENT_TAP"       // 3.2s - 3.8s: Touch feedback on comment icon
  | "COMMENTS_OPEN"     // 3.8s - 5.0s: Comments sheet opens with existing community comments
  | "TYPING_INPUT"      // 5.0s - 6.2s: Types keyword into comment input
  | "SUBMIT_TAP"        // 6.2s - 6.6s: Clicks "Post" button
  | "USER_COMMENT"      // 6.6s - 7.6s: @abi_de_jo's comment appears in list
  | "OWNER_REPLY"       // 7.6s - 9.2s: codebyabi replies "Sent you a DM 👍"
  | "INBOX"             // 9.2s - 10.4s: Transitions to Abi's realistic inbox
  | "INBOX_HIGHLIGHT"   // 10.4s - 11.6s: codebyabi message highlighted with unread dot
  | "CHAT_OPENING"      // 11.6s - 12.4s: User opens chat thread
  | "CHAT_TYPING"       // 12.4s - 13.4s: Typing indicator (...)
  | "DM_VISIBLE";       // 13.4s - 17.5s: Automated DM appears (Hold & Next Loop)

export function HeroInstagramAutomation() {
  const [stage, setStage] = useState<AnimationStage>("FEED_SHOW");
  const [targetPostIndex, setTargetPostIndex] = useState(1); // Alternates between 0, 1, 2
  const [typedInput, setTypedInput] = useState("");

  const currentPost = FEED_POSTS[targetPostIndex];

  useEffect(() => {
    let isMounted = true;
    const timeouts: NodeJS.Timeout[] = [];

    const schedule = (s: AnimationStage, delay: number) => {
      const t = setTimeout(() => {
        if (isMounted) setStage(s);
      }, delay);
      timeouts.push(t);
    };

    const runSequence = () => {
      if (!isMounted) return;
      setStage("FEED_SHOW");
      setTypedInput("");

      // First 2 seconds stable on initial feed
      schedule("FEED_SCROLL", 2000);
      schedule("COMMENT_TAP", 3200);
      schedule("COMMENTS_OPEN", 3800);

      // Typing simulation for current keyword
      const kw = currentPost.keyword;
      const typeStart = 5000;
      for (let i = 1; i <= kw.length; i++) {
        const t = setTimeout(() => {
          if (isMounted) {
            setStage("TYPING_INPUT");
            setTypedInput(kw.slice(0, i));
          }
        }, typeStart + (i * 220));
        timeouts.push(t);
      }

      // Submit comment
      schedule("SUBMIT_TAP", 6200);
      const clearTimer = setTimeout(() => {
        if (isMounted) setTypedInput("");
      }, 6500);
      timeouts.push(clearTimer);
      schedule("USER_COMMENT", 6600);
      schedule("OWNER_REPLY", 7600);
      schedule("INBOX", 9200);
      schedule("INBOX_HIGHLIGHT", 10400);
      schedule("CHAT_OPENING", 11600);
      schedule("CHAT_TYPING", 12400);
      schedule("DM_VISIBLE", 13400);

      // Reset and loop with next post
      const loopTimeout = setTimeout(() => {
        if (isMounted) {
          setTargetPostIndex((prev) => (prev + 1) % FEED_POSTS.length);
          runSequence();
        }
      }, 17500);
      timeouts.push(loopTimeout);
    };

    runSequence();

    return () => {
      isMounted = false;
      timeouts.forEach(clearTimeout);
    };
  }, [targetPostIndex]);

  const isCommentsOpen =
    stage === "COMMENTS_OPEN" ||
    stage === "TYPING_INPUT" ||
    stage === "SUBMIT_TAP" ||
    stage === "USER_COMMENT" ||
    stage === "OWNER_REPLY";
  const isInputVisible =
    stage === "COMMENTS_OPEN" ||
    stage === "TYPING_INPUT" ||
    stage === "SUBMIT_TAP";

  const isInboxView =
    stage === "INBOX" || stage === "INBOX_HIGHLIGHT";

  const isChatView =
    stage === "CHAT_OPENING" ||
    stage === "CHAT_TYPING" ||
    stage === "DM_VISIBLE";

  // Calculate feed scroll position:
  // During FEED_SHOW (first 2s): show at top (0px).
  // Once FEED_SCROLL starts: smoothly scroll down to targetPostIndex!
  const scrollOffset = stage === "FEED_SHOW" ? 0 : targetPostIndex * 335;

  return (
    <div className="relative mx-auto flex items-center justify-center select-none">
      {/* Subtle Phone Ambient Glow */}
      <div className="absolute -inset-4 rounded-[54px] bg-gradient-to-tr from-[#10B981]/30 via-[#0F1A14]/60 to-transparent blur-2xl pointer-events-none" />
      <HeroOrbit />
      <div className="relative z-10 w-[285px] sm:w-[305px] h-[550px] sm:h-[575px] rounded-[48px] bg-[#0A080C] p-[10px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.14),inset_0_0_2px_1px_rgba(255,255,255,0.15)]">
        
        {/* Left Side Volume Buttons */}
        <div className="absolute -left-[3px] top-[115px] w-[3px] h-[28px] rounded-l-sm bg-zinc-700/80 shadow-sm" />
        <div className="absolute -left-[3px] top-[155px] w-[3px] h-[28px] rounded-l-sm bg-zinc-700/80 shadow-sm" />
        
        {/* Right Side Power Button */}
        <div className="absolute -right-[3px] top-[135px] w-[3px] h-[45px] rounded-r-sm bg-zinc-700/80 shadow-sm" />

        {/* --- INNER SCREEN CONTAINER --- */}
        <div className="relative h-full w-full rounded-[38px] bg-black overflow-hidden flex flex-col text-white shadow-inner">
          
          {/* --- TOP STATUS BAR & DYNAMIC ISLAND --- */}
          <div className="relative z-30 h-10 w-full bg-black flex items-center justify-between px-6 pt-1 text-white">
            <span className="text-[12px] font-semibold text-white tracking-tight">9:41</span>
            
            {/* Dynamic Island */}
            <div className="absolute left-1/2 -translate-x-1/2 top-2 h-[22px] w-[86px] rounded-full bg-black flex items-center justify-end px-2.5">
              <div className="h-2.5 w-2.5 rounded-full bg-[#121924] border border-zinc-800" />
            </div>

            {/* Status Icons */}
            <div className="flex items-center gap-1.5 text-white">
              <div className="flex items-end gap-[1.5px] h-2.5">
                <span className="w-[2.5px] h-1 bg-white rounded-[0.5px]" />
                <span className="w-[2.5px] h-1.5 bg-white rounded-[0.5px]" />
                <span className="w-[2.5px] h-2 bg-white rounded-[0.5px]" />
                <span className="w-[2.5px] h-2.5 bg-white rounded-[0.5px]" />
              </div>
              <span className="text-[10px] font-bold">5G</span>
              <div className="w-4 h-2 border border-black rounded-[2px] p-[1px] flex items-center">
                <div className="h-full w-full bg-white rounded-[1px]" />
              </div>
            </div>
          </div>

          {/* --- SCREEN CONTENT AREA --- */}
          <div className="relative flex-1 w-full overflow-hidden bg-black text-white">

            {/* ========================================================
                VIEW 1: INSTAGRAM FEED (First 2s Stable, Then Smooth Scroll)
            ======================================================== */}
            <div className="absolute inset-0 flex flex-col bg-black text-white">
              {/* Instagram Top Nav */}
              <div className="h-10 border-b border-[#262626] flex items-center justify-between px-3 shrink-0 bg-black text-white z-10">
                <div className="flex items-center gap-2">
                  <ChevronLeft className="h-5 w-5 text-white" />
                  <span className="text-sm font-bold tracking-tight text-white">Posts</span>
                </div>
                <MoreVertical className="h-4 w-4 text-zinc-400" />
              </div>

              {/* Scrollable Feed Container */}
              <div className="flex-1 overflow-hidden relative">
                <div
                  className="w-full transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
                  style={{
                    transform: `translateY(-${scrollOffset}px)`,
                  }}
                >
                  {FEED_POSTS.map((post, idx) => (
                    <div key={post.id} className="w-full h-[335px] flex flex-col border-b border-[#262626] pb-2">
                      {/* Author Header */}
                      <div className="flex items-center justify-between px-3 py-1.5">
                        <div className="flex items-center gap-2">
                          <div className="relative h-7 w-7 rounded-full p-[1.5px] bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600">
                            <img
                              src={AVATARS.owner}
                              alt="codebyabi"
                              className="h-full w-full rounded-full object-cover border border-black"
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[11.5px] font-bold text-white">codebyabi</span>
                            <VerifiedBadge />
                          </div>
                        </div>
                        <span className="text-xs text-zinc-400">•••</span>
                      </div>

                      {/* Post Creative Card */}
                      <div className="relative w-full h-[180px] bg-gradient-to-br from-[#0E0C1A] via-[#21123A] to-[#140A24] flex flex-col items-center justify-center p-3 text-center overflow-hidden">
                        <div className="absolute inset-0 opacity-40 bg-cover bg-center mix-blend-overlay" style={{ backgroundImage: `url(${post.image})` }} />
                        <div className="relative z-10 space-y-1.5">
                          <div className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wider text-[#ffcd75] border border-black/15">
                            {post.badge}
                          </div>
                          <h4 className="text-[13px] font-extrabold text-white leading-tight whitespace-pre-line">
                            {post.headline}
                          </h4>
                        </div>
                      </div>

                      {/* Action Buttons Row */}
                      <div className="flex items-center justify-between px-3 pt-2 pb-1">
                        <div className="flex items-center gap-3">
                          <Heart className="h-4.5 w-4.5 text-white" />
                          
                          {/* Comment Bubble (Touch feedback on active post) */}
                          <div className="relative">
                            <MessageCircle className="h-4.5 w-4.5 text-white" />
                            {stage === "COMMENT_TAP" && targetPostIndex === idx && (
                              <span className="absolute -inset-2 rounded-full bg-zinc-900/20 animate-ping duration-300" />
                            )}
                          </div>
                          
                          <Send className="h-4.5 w-4.5 text-white" />
                        </div>
                        <Bookmark className="h-4.5 w-4.5 text-white" />
                      </div>

                      {/* Likes & Caption */}
                      <div className="px-3 space-y-0.5 text-left">
                        <span className="text-[10px] font-bold text-white">{post.likes}</span>
                        <p className="text-[10.5px] text-zinc-300 leading-tight line-clamp-2">
                          <span className="font-bold text-white">codebyabi</span> {post.captionText}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ========================================================
                VIEW 2: COMMENTS SHEET WITH MULTIPLE COMMUNITY REPLIES + INPUT FLOW
            ======================================================== */}
            {isCommentsOpen && (
              <div className="absolute inset-0 z-20 flex flex-col justify-end bg-black/75 transition-opacity duration-500">
                <div className="w-full h-[66%] rounded-t-[24px] bg-[#121212] border-t border-[#262626] text-white shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  
                  {/* Sheet Drag Handle */}
                  <div className="w-9 h-1 rounded-full bg-zinc-700 mx-auto mt-2.5 mb-1" />
                  
                  {/* Sheet Header */}
                  <div className="flex items-center justify-center border-b border-[#262626] py-1.5">
                    <span className="text-xs font-bold text-white">Comments</span>
                  </div>

                  {/* Comments Body with Real Existing People & Replies */}
                  <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-3">
                    
                    {/* Fresh Live User Comment (Always at the TOP): @abi_de_jo */}
                    {(stage === "USER_COMMENT" || stage === "OWNER_REPLY") && (
                      <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300 pb-2 border-b border-[#262626]">
                        <div className="flex items-start gap-2 text-left">
                          <img
                            src={AVATARS.commenter}
                            alt="abi_de_jo"
                            className="h-6 w-6 rounded-full object-cover shrink-0 border border-zinc-700 mt-0.5"
                          />
                          <div className="flex-1 space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10.5px] font-bold text-white">abi_de_jo</span>
                              <span className="text-[9px] text-zinc-400">just now</span>
                            </div>
                            <p className="text-[11px] font-medium text-white no-underline">{currentPost.keyword}</p>
                          </div>
                        </div>

                        {/* Automated Owner Reply to @abi_de_jo */}
                        {stage === "OWNER_REPLY" && (
                          <div className="ml-7 flex items-start gap-2 text-left animate-in fade-in slide-in-from-top-1 duration-400">
                            <img
                              src={AVATARS.owner}
                              alt="codebyabi"
                              className="h-5 w-5 rounded-full object-cover shrink-0 border border-zinc-700 mt-0.5"
                            />
                            <div className="flex-1 space-y-0.5">
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] font-bold text-white">codebyabi</span>
                                <VerifiedBadge />
                                <span className="rounded bg-[#10B981]/25 px-1 text-[7.5px] font-semibold text-[#A7F3D0]">
                                  Author
                                </span>
                              </div>
                              <p className="text-[10.5px] text-zinc-200">
                                Sent you a DM 👍
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Existing Community Comment 1: Rohan */}
                    <div className="space-y-1.5">
                      <div className="flex items-start gap-2 text-left">
                        <img
                          src={AVATARS.rohanSharma}
                          alt="rohan.dev"
                          className="h-6 w-6 rounded-full object-cover shrink-0 border border-zinc-700 mt-0.5"
                        />
                        <div className="flex-1 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10.5px] font-bold text-white">rohan.dev</span>
                            <span className="text-[9px] text-zinc-400">2h</span>
                          </div>
                          <p className="text-[11px] text-zinc-300">Does this integrate with Shopify?</p>
                        </div>
                      </div>
                      {/* Owner Reply to Rohan */}
                      <div className="ml-7 flex items-start gap-2 text-left">
                        <img
                          src={AVATARS.owner}
                          alt="codebyabi"
                          className="h-5 w-5 rounded-full object-cover shrink-0 border border-zinc-700 mt-0.5"
                        />
                        <div className="flex-1 space-y-0.5">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-bold text-white">codebyabi</span>
                            <VerifiedBadge />
                            <span className="rounded bg-[#10B981]/25 px-1 text-[7.5px] font-semibold text-[#A7F3D0]">
                              Author
                            </span>
                          </div>
                          <p className="text-[10.5px] text-zinc-200">
                            Yes! Works with Shopify & Stripe. Sent you a DM 👍
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Existing Community Comment 2: Sneha */}
                    <div className="space-y-1.5">
                      <div className="flex items-start gap-2 text-left">
                        <img
                          src={AVATARS.snehaKapoor}
                          alt="sneha_creates"
                          className="h-6 w-6 rounded-full object-cover shrink-0 border border-zinc-700 mt-0.5"
                        />
                        <div className="flex-1 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10.5px] font-bold text-white">sneha_creates</span>
                            <span className="text-[9px] text-zinc-400">45m</span>
                          </div>
                          <p className="text-[11px] text-zinc-300">Game changer for creators 🔥</p>
                        </div>
                      </div>
                      {/* Owner Reply to Sneha */}
                      <div className="ml-7 flex items-start gap-2 text-left">
                        <img
                          src={AVATARS.owner}
                          alt="codebyabi"
                          className="h-5 w-5 rounded-full object-cover shrink-0 border border-zinc-700 mt-0.5"
                        />
                        <div className="flex-1 space-y-0.5">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-bold text-white">codebyabi</span>
                            <VerifiedBadge />
                            <span className="rounded bg-[#10B981]/25 px-1 text-[7.5px] font-semibold text-[#A7F3D0]">
                              Author
                            </span>
                          </div>
                          <p className="text-[10.5px] text-zinc-200">
                            Sent you a DM 👍
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>


                  {/* Interactive Comment Input (Empties and Hides after Post) */}
                  {isInputVisible && (
                    <div className="border-t border-[#262626] p-2.5 flex items-center gap-2 bg-[#121212] animate-in fade-in duration-200">
                      <img
                        src={AVATARS.commenter}
                        alt="abi_de_jo"
                        className="h-6 w-6 rounded-full object-cover border border-zinc-200"
                      />
                      <div className="flex-1 rounded-full bg-[#1e1e1e] border border-[#2e2e2e] px-3 py-1.5 text-[10.5px] text-left flex items-center justify-between">
                        <span className={typedInput ? "text-white font-medium" : "text-zinc-400"}>
                          {typedInput || "Add a comment..."}
                        </span>
                        {/* Blue "Post" button appears when user is typing */}
                        {typedInput && (
                          <button
                            type="button"
                            className={`text-[10px] font-bold text-[#10B981] transition-transform ${
                              stage === "SUBMIT_TAP" ? "scale-90 opacity-70" : "scale-100"
                            }`}
                          >
                            Post
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================
                VIEW 3: EXPANDED REALISTIC INBOX (Aesthetic Indian Creators)
            ======================================================== */}
            {isInboxView && (
              <div className="absolute inset-0 z-30 flex flex-col bg-black text-white transition-opacity duration-400 animate-in fade-in">
                {/* Inbox Top Bar */}
                <div className="h-10 border-b border-[#262626] flex items-center justify-between px-3">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-white">abi_de_jo</span>
                    <span className="text-[10px] text-zinc-500">▾</span>
                  </div>
                  <span className="text-xs font-bold text-white">Messages</span>
                </div>

                {/* Search Bar */}
                <div className="px-3 py-2">
                  <div className="flex items-center gap-2 rounded-lg bg-[#1e1e1e] border border-[#2e2e2e] px-2.5 py-1.5 text-[11px] text-zinc-400 text-left">
                    <Search className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Search</span>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-[#262626] px-3 text-xs">
                  <span className="border-b-2 border-zinc-500 pb-1.5 font-bold text-white">
                    Primary
                  </span>
                  <span className="pb-1.5 ml-4 font-semibold text-zinc-400">
                    General
                  </span>
                </div>

                {/* Conversations List */}
                <div className="flex-1 divide-y divide-[#1e1e1e] overflow-y-auto">
                  
                  {/* Conversation 1: codebyabi */}
                  <div
                    className={`flex items-center gap-3 px-3 py-2.5 transition-all duration-300 ${
                      stage === "INBOX_HIGHLIGHT"
                        ? "bg-[#0d281e] ring-1 ring-[#10B981]/40"
                        : "bg-black"
                    }`}
                  >
                    <div className="relative h-10 w-10 shrink-0">
                      <img
                        src={AVATARS.owner}
                        alt="codebyabi"
                        className="h-full w-full rounded-full object-cover border border-zinc-200"
                      />
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#16C784] border-2 border-black" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="text-[12px] font-bold text-white truncate">codebyabi</span>
                          <VerifiedBadge />
                        </div>
                        <span className="text-[9px] font-bold text-[#A7F3D0]">Now</span>
                      </div>
                      <p className="text-[11px] font-semibold text-zinc-200 truncate">
                        Hey Abi! Thanks for your interest...
                      </p>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-[#10B981] shrink-0" />
                  </div>

                  {/* Conversation 2: the_delhi_lens */}
                  <div className="flex items-center gap-3 px-3 py-2 opacity-85">
                    <img
                      src={AVATARS.delhiLens}
                      alt="the_delhi_lens"
                      className="h-10 w-10 rounded-full object-cover border border-zinc-800 shrink-0"
                    />
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-white block truncate">the_delhi_lens</span>
                        <span className="text-[9px] text-zinc-400">42m</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 block truncate">Sent a reel by @travelgram</span>
                    </div>
                  </div>

                  {/* Conversation 3: Rohan Sharma */}
                  <div className="flex items-center gap-3 px-3 py-2 opacity-80">
                    <img
                      src={AVATARS.rohanSharma}
                      alt="Rohan Sharma"
                      className="h-10 w-10 rounded-full object-cover border border-zinc-800 shrink-0"
                    />
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-white block truncate">Rohan Sharma</span>
                        <span className="text-[9px] text-zinc-400">2h</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 block truncate">Haan bhai kal pakka milte hain</span>
                    </div>
                  </div>

                  {/* Conversation 4: tech_bites_india */}
                  <div className="flex items-center gap-3 px-3 py-2 opacity-70">
                    <img
                      src={AVATARS.techBites}
                      alt="tech_bites_india"
                      className="h-10 w-10 rounded-full object-cover border border-zinc-800 shrink-0"
                    />
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-white block truncate">tech_bites_india</span>
                        <span className="text-[9px] text-zinc-400">5h</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 block truncate">New collab draft ready for review</span>
                    </div>
                  </div>

                  {/* Conversation 5: Sneha Kapoor */}
                  <div className="flex items-center gap-3 px-3 py-2 opacity-60">
                    <img
                      src={AVATARS.snehaKapoor}
                      alt="Sneha Kapoor"
                      className="h-10 w-10 rounded-full object-cover border border-zinc-800 shrink-0"
                    />
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-white block truncate">Sneha Kapoor</span>
                        <span className="text-[9px] text-zinc-400">1d</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 block truncate">Shared a story</span>
                    </div>
                  </div>

                  {/* Conversation 6: desi.dev.club */}
                  <div className="flex items-center gap-3 px-3 py-2 opacity-50">
                    <img
                      src={AVATARS.desiDev}
                      alt="desi.dev.club"
                      className="h-10 w-10 rounded-full object-cover border border-zinc-800 shrink-0"
                    />
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-white block truncate">desi.dev.club</span>
                        <span className="text-[9px] text-zinc-400">2d</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 block truncate">Voice call ended (24 mins)</span>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ========================================================
                VIEW 4: DM CONVERSATION (Plain Native Instagram Format)
            ======================================================== */}
            {isChatView && (
              <div className="absolute inset-0 z-40 flex flex-col bg-black text-white transition-all duration-400 ease-out animate-in slide-in-from-right">
                {/* Chat Top Header */}
                <div className="h-12 border-b border-[#262626] flex items-center justify-between px-3 bg-black text-white shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <ChevronLeft className="h-5 w-5 text-white shrink-0 cursor-pointer" />
                    <img
                      src={AVATARS.owner}
                      alt="codebyabi"
                      className="h-7 w-7 rounded-full object-cover shrink-0 border border-zinc-200"
                    />
                    <div className="text-left min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] font-bold text-white truncate">codebyabi</span>
                        <VerifiedBadge />
                      </div>
                      <span className="text-[9px] text-[#16C784] font-medium block truncate leading-none">Active now</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-300 shrink-0">
                    <Phone className="h-4 w-4 text-zinc-300 cursor-pointer" />
                    <Video className="h-4 w-4 text-zinc-300 cursor-pointer" />
                    <div className="relative cursor-pointer">
                      <Tag className="h-4 w-4 text-zinc-800" />
                      <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
                    </div>
                  </div>
                </div>

                {/* Chat Body with Top Center Profile Showcase */}
                <div className="flex-1 p-3 flex flex-col justify-between overflow-y-auto bg-black text-white">
                  {/* Top Center Profile Showcase */}
                  <div className="flex flex-col items-center justify-center pt-3 pb-2 space-y-1 text-center">
                    <img
                      src={AVATARS.owner}
                      alt="codebyabi"
                      className="h-14 w-14 rounded-full object-cover shadow-sm border border-zinc-200"
                    />
                    <div className="flex items-center justify-center gap-1">
                      <h5 className="text-[12px] font-bold text-white tracking-tight">
                        codebyabi
                      </h5>
                      <VerifiedBadge />
                    </div>
                    <span className="text-[9.5px] text-zinc-400">Instagram · 48K followers</span>
                  </div>

                  {/* Messages Section at Bottom */}
                  <div className="space-y-2 mt-auto">
                    {/* Timestamp */}
                    <div className="text-center">
                      <span className="text-[9px] font-medium text-zinc-400">
                        1:09 PM
                      </span>
                    </div>

                    {/* Typing Indicator */}
                    {stage === "CHAT_TYPING" && (
                      <div className="flex items-end gap-2 self-start animate-in fade-in duration-200">
                        <img
                          src={AVATARS.owner}
                          alt="codebyabi"
                          className="h-6 w-6 rounded-full object-cover shrink-0 mb-0.5 border border-zinc-200"
                        />
                        <div className="rounded-[18px] rounded-bl-[4px] bg-[#262626] px-3.5 py-2.5 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-pulse" />
                          <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-pulse [animation-delay:200ms]" />
                          <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-pulse [animation-delay:400ms]" />
                        </div>
                      </div>
                    )}

                    {/* Automated DM Bubble (Plain Borderless Instagram Format) */}
                    {stage === "DM_VISIBLE" && (
                      <div className="flex items-end gap-2 max-w-[85%] self-start text-left animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <img
                          src={AVATARS.owner}
                          alt="codebyabi"
                          className="h-6 w-6 rounded-full object-cover shrink-0 mb-0.5 border border-zinc-200"
                        />
                        <div className="rounded-[20px] rounded-bl-[4px] bg-[#262626] border border-[#333333] px-3.5 py-2.5 text-white space-y-1">
                          <p className="text-[11.5px] font-medium leading-snug">
                            Hey Abi!
                          </p>
                          <p className="text-[11px] text-zinc-300 leading-snug">
                            Thanks for your interest.
                          </p>
                          <div className="pt-1.5">
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#10B981] hover:bg-[#059669] px-3 py-1 text-[9.5px] font-bold text-black shadow-md">
                              Get access link →
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Input Bar */}
                <div className="h-12 border-t border-[#262626] px-2.5 flex items-center gap-2 bg-black shrink-0">
                  <div className="h-7 w-7 rounded-full bg-[#10B981] flex items-center justify-center text-black shrink-0 shadow-sm cursor-pointer">
                    <Camera className="h-3.5 w-3.5 text-black" />
                  </div>
                  <div className="flex-1 h-8 rounded-full bg-[#1e1e1e] border border-[#2e2e2e] px-3 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400">Message...</span>
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Mic className="h-3.5 w-3.5 cursor-pointer hover:text-white" />
                      <ImageIcon className="h-3.5 w-3.5 cursor-pointer hover:text-white" />
                      <Smile className="h-3.5 w-3.5 cursor-pointer hover:text-white" />
                      <PlusCircle className="h-3.5 w-3.5 cursor-pointer hover:text-white" />
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* --- HOME INDICATOR BAR --- */}
          <div className="h-5 w-full bg-black flex items-center justify-center pb-1">
            <div className="h-1 w-24 rounded-full bg-zinc-700" />
          </div>

        </div>
      </div>
    </div>
  );
}

// The icon centers and visible track share one circular motion path.
function HeroOrbit() {
  const ref = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let visible = false;
    const sync = () => setPlaying(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const icons = [InstagramOrbitIcon, MetaOrbitIcon, MessengerOrbitIcon, FacebookOrbitIcon, BroadcastOrbitIcon, UserOrbitIcon];
  return (
    <div ref={ref} className={styles.orbitScene} data-playing={playing} aria-hidden="true">
      <div className={styles.orbit}>
        <div className={styles.orbitTrack} />
        <div className={styles.orbitInner} />
        {icons.map((Icon, index) => (
          <div key={index} className={styles.orbitIcon} style={{ "--orbit-start": `${index * (100 / icons.length) + 8}%` } as React.CSSProperties}>
            <Icon />
          </div>
        ))}
      </div>
    </div>
  );
}

// --- VERIFIED BADGE HELPER ---
function VerifiedBadge() {
  return (
    <svg className="h-3 w-3 text-[#10B981] fill-current shrink-0" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}


// --- REVOLVING ORBIT ICONS PROVIDED BY USER ---
function MetaOrbitIcon() {
  return (
    <svg fill="#0082FB" viewBox="0 0 32 32" className="h-7 w-7 sm:h-8 sm:w-8" stroke="#0082FB">
      <path d="M5,19.5c0-4.6,2.3-9.4,5-9.4c1.5,0,2.7,0.9,4.6,3.6c-1.8,2.8-2.9,4.5-2.9,4.5c-2.4,3.8-3.2,4.6-4.5,4.6 C5.9,22.9,5,21.7,5,19.5 M20.7,17.8L19,15c-0.4-0.7-0.9-1.4-1.3-2c1.5-2.3,2.7-3.5,4.2-3.5c3,0,5.4,4.5,5.4,10.1 c0,2.1-0.7,3.3-2.1,3.3S23.3,22,20.7,17.8 M16.4,11c-2.2-2.9-4.1-4-6.3-4C5.5,7,2,13.1,2,19.5c0,4,1.9,6.5,5.1,6.5 c2.3,0,3.9-1.1,6.9-6.3c0,0,1.2-2.2,2.1-3.7c0.3,0.5,0.6,1,0.9,1.6l1.4,2.4c2.7,4.6,4.2,6.1,6.9,6.1c3.1,0,4.8-2.6,4.8-6.7 C30,12.6,26.4,7,22.1,7C19.8,7,18,8.8,16.4,11" />
    </svg>
  );
}

function FacebookOrbitIcon() {
  return (
    <svg fill="#0082FB" viewBox="0 0 24 24" className="h-7 w-7 sm:h-8 sm:w-8" stroke="#0082FB">
      <path d="M12 2.03998C6.5 2.03998 2 6.52998 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.84998C10.44 7.33998 11.93 5.95998 14.22 5.95998C15.31 5.95998 16.45 6.14998 16.45 6.14998V8.61998H15.19C13.95 8.61998 13.56 9.38998 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9164 21.5878 18.0622 20.3855 19.6099 18.57C21.1576 16.7546 22.0054 14.4456 22 12.06C22 6.52998 17.5 2.03998 12 2.03998Z" />
    </svg>
  );
}
function InstagramOrbitIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="h-7 w-7 sm:h-8 sm:w-8">
      <rect x="2" y="2" width="28" height="28" rx="6" fill="url(#ig-orbit-0)" />
      <rect x="2" y="2" width="28" height="28" rx="6" fill="url(#ig-orbit-1)" />
      <rect x="2" y="2" width="28" height="28" rx="6" fill="url(#ig-orbit-2)" />
      <path d="M23 10.5C23 11.3284 22.3284 12 21.5 12C20.6716 12 20 11.3284 20 10.5C20 9.67157 20.6716 9 21.5 9C22.3284 9 23 9.67157 23 10.5Z" fill="white" />
      <path fillRule="evenodd" clipRule="evenodd" d="M16 21C18.7614 21 21 18.7614 21 16C21 13.2386 18.7614 11 16 11C13.2386 11 11 13.2386 11 16C11 18.7614 13.2386 21 16 21ZM16 19C17.6569 19 19 17.6569 19 16C19 14.3431 17.6569 13 16 13C14.3431 13 13 14.3431 13 16C13 17.6569 14.3431 19 16 19Z" fill="white" />
      <path fillRule="evenodd" clipRule="evenodd" d="M6 15.6C6 12.2397 6 10.5595 6.65396 9.27606C7.2292 8.14708 8.14708 7.2292 9.27606 6.65396C10.5595 6 12.2397 6 15.6 6H16.4C19.7603 6 21.4405 6 22.7239 6.65396C23.8529 7.2292 24.7708 8.14708 25.346 9.27606C26 10.5595 26 12.2397 26 15.6V16.4C26 19.7603 26 21.4405 25.346 22.7239C24.7708 23.8529 23.8529 24.7708 22.7239 25.346C21.4405 26 19.7603 26 16.4 26H15.6C12.2397 26 10.5595 26 9.27606 25.346C8.14708 24.7708 7.2292 23.8529 6.65396 22.7239C6 21.4405 6 19.7603 6 16.4V15.6ZM15.6 8H16.4C18.1132 8 19.2777 8.00156 20.1779 8.0751C21.0548 8.14674 21.5032 8.27659 21.816 8.43597C22.5686 8.81947 23.1805 9.43139 23.564 10.184C23.7234 10.4968 23.8533 10.9452 23.9249 11.8221C23.9984 12.7223 24 13.8868 24 15.6V16.4C24 18.1132 23.9984 19.2777 23.9249 20.1779C23.8533 21.0548 23.7234 21.5032 23.564 21.816C23.1805 22.5686 22.5686 23.1805 21.816 23.564C21.5032 23.7234 21.0548 23.8533 20.1779 23.9249C19.2777 23.9984 18.1132 24 16.4 24H15.6C13.8868 24 12.7223 23.9984 11.8221 23.9249C10.9452 23.8533 10.4968 23.7234 10.184 23.564C9.43139 23.1805 8.81947 22.5686 8.43597 21.816C8.27659 21.5032 8.14674 21.0548 8.0751 20.1779C8.00156 19.2777 8 18.1132 8 16.4V15.6C8 13.8868 8.00156 12.7223 8.0751 11.8221C8.14674 10.9452 8.27659 10.4968 8.43597 10.184C8.81947 9.43139 9.43139 8.81947 10.184 8.43597C10.4968 8.27659 10.9452 8.14674 11.8221 8.0751C12.7223 8.00156 13.8868 8 15.6 8Z" fill="white" />
      <defs>
        <radialGradient id="ig-orbit-0" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12 23) rotate(-55.3758) scale(25.5196)">
          <stop stopColor="#B13589" />
          <stop offset="0.79309" stopColor="#C62F94" />
          <stop offset="1" stopColor="#8A3AC8" />
        </radialGradient>
        <radialGradient id="ig-orbit-1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(11 31) rotate(-65.1363) scale(22.5942)">
          <stop stopColor="#E0E8B7" />
          <stop offset="0.444662" stopColor="#FB8A2E" />
          <stop offset="0.71474" stopColor="#E2425C" />
          <stop offset="1" stopColor="#E2425C" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ig-orbit-2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0.500002 3) rotate(-8.1301) scale(38.8909 8.31836)">
          <stop offset="0.156701" stopColor="#406ADC" />
          <stop offset="0.467799" stopColor="#6A45BE" />
          <stop offset="1" stopColor="#6A45BE" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function UserOrbitIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-6 w-6 sm:h-7 sm:w-7" stroke="#ffffff">
      <path d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z" fill="#ffffff" />
      <path d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z" fill="#ffffff" />
    </svg>
  );
}

function MessengerOrbitIcon() {
  return (
    <svg fill="#0084FF" viewBox="-3.12 -3.12 30.24 30.24" className="h-6 w-6 sm:h-7 sm:w-7" stroke="#0084FF" strokeWidth="0.00024">
      <path d="M13.207,11.479l3.853-2.1L12.8,13.912l-2.036-2.138-3.9,2.138,4.281-4.533ZM22,3V21a1,1,0,0,1-1,1H3a1,1,0,0,1-1-1V3A1,1,0,0,1,3,2H21A1,1,0,0,1,22,3Zm-2.061,8.407A7.686,7.686,0,0,0,12,4a7.686,7.686,0,0,0-7.939,7.407A7.216,7.216,0,0,0,6.985,17.15V20L9.65,18.485a8.477,8.477,0,0,0,2.35.33A7.687,7.687,0,0,0,19.939,11.407Z" />
    </svg>
  );
}

function BroadcastOrbitIcon() {
  return (
    <svg fill="#ffffff" viewBox="-51.2 -51.2 614.40 614.40" className="h-6 w-6 sm:h-7 sm:w-7" stroke="#ffffff" strokeWidth="0.00512">
      <path d="M33.391,155.826C14.984,155.826,0,170.793,0,189.217v133.565c0,18.424,14.984,33.391,33.391,33.391 c18.408,0,33.391-14.967,33.391-33.391V189.217C66.783,170.793,51.799,155.826,33.391,155.826z" />
      <path d="M478.609,55.652c-18.424,0-33.391,14.967-33.391,33.391v333.913c0,18.424,14.967,33.391,33.391,33.391 c18.424,0,33.391-14.967,33.391-33.391V89.044C512,70.619,497.033,55.652,478.609,55.652z" />
      <path d="M100.174,183.489v145.023l33.391,10.017v29.548c0,22.272,14.348,41.543,35.706,47.934l100.174,30.066 c14.801,4.53,31.164,1.972,44.282-7.794c12.677-9.417,19.967-23.89,20.126-39.667l77.972,20.052V93.332L100.174,183.489z M300.522,398.108c0,10.833-10.301,19.238-21.49,16.011l-100.174-30.066c-7.109-2.153-11.902-8.576-11.902-15.978v-19.531 l133.565,40.07V398.108z" />
    </svg>
  );
}
export default HeroInstagramAutomation;
