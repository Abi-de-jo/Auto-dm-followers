"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Clock3, CornerDownRight, Instagram, MessageCircle, Pause, Play, Send } from "lucide-react";
import styles from "./reels-showcase.module.css";

export interface ReelData {
  id: number;
  video: string;
  poster: string;
  height: number; // Small organic height differences (mostly vertical 9:16)
}

export const REELS_DATA: ReelData[] = [
  {
    id: 1,
    video: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4",
    poster: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    height: 470,
  },
  {
    id: 2,
    video: "https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-the-rain-41275-large.mp4",
    poster: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
    height: 455,
  },
  {
    id: 3,
    video: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-skater-skating-at-sunset-41444-large.mp4",
    poster: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80",
    height: 480,
  },
  {
    id: 4,
    video: "https://assets.mixkit.co/videos/preview/mixkit-woman-holding-a-sparkler-in-a-field-at-night-42171-large.mp4",
    poster: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80",
    height: 460,
  },
  {
    id: 5,
    video: "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-neon-illuminated-city-street-41460-large.mp4",
    poster: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80",
    height: 475,
  },
  {
    id: 6,
    video: "https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-woman-in-a-pool-42512-large.mp4",
    poster: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80",
    height: 450,
  },
  {
    id: 7,
    video: "https://assets.mixkit.co/videos/preview/mixkit-young-man-playing-basketball-under-the-sun-41316-large.mp4",
    poster: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&auto=format&fit=crop&q=80",
    height: 465,
  },
];

export const REEL_EXAMPLES = [
  {
    topic: "Beauty routine",
    keyword: "ROUTINE",
    username: "maya.glow",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    comment: "ROUTINE please! What do you use?",
    replies: ["Check your DMs! 📩", "Sent you a DM! 💜"],
  },
  {
    topic: "Creator guide",
    keyword: "GUIDE",
    username: "alex.creates",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80",
    comment: "GUIDE — I want to try this!",
    replies: ["Check your DMs for the guide! 📩", "Sent to your inbox! ✨"],
  },
  {
    topic: "Travel itinerary",
    keyword: "TRIP",
    username: "elena_travels",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
    comment: "TRIP! Can you share the itinerary?",
    replies: ["Check your DMs! ✈️", "Itinerary sent to your inbox! 📩"],
  },
  {
    topic: "Editing preset",
    keyword: "PRESET",
    username: "lucas_edit",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    comment: "Love these colors. PRESET please!",
    replies: ["Check your DMs! 🎨", "Preset link sent to inbox! 📩"],
  },
  {
    topic: "New collection",
    keyword: "SHOP",
    username: "chloe.style",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    comment: "SHOP — where can I find this?",
    replies: ["Check your DMs! 🛍️", "Collection sent to your inbox! 📩"],
  },
  {
    topic: "Consultation",
    keyword: "CALL",
    username: "marcus_biz",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    comment: "CALL. How do I book a session?",
    replies: ["Check your DMs for the link! 📩", "Sent booking link to DM! 📅"],
  },
  {
    topic: "Training plan",
    keyword: "PLAN",
    username: "jordan_fit",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80",
    comment: "PLAN please. Ready to get started!",
    replies: ["Check your DMs! 💪", "Plan sent straight to your inbox! 📩"],
  },
];


function ReelPreview({ reel, active, playing, visible }: { reel: ReelData; active: boolean; playing: boolean; visible: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const shouldLoad = active && visible && !failed;

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (active && playing && !failed) {
      video.play().catch(() => setReady(false));
    } else {
      video.pause();
    }
    return () => video.pause();
  }, [active, playing, failed, shouldLoad]);

  return (
    <>
      <img className={styles.poster} src={reel.poster} alt="" draggable={false} loading="lazy" />
      {!failed && <video
        ref={ref}
        src={shouldLoad ? reel.video : undefined}
        className={styles.video}
        data-ready={ready && shouldLoad}
        muted
        loop
        playsInline
        preload="none"
        onPlaying={() => setReady(true)}
        onError={() => { setFailed(true); setReady(false); }}
      />}
    </>
  );
}

export function Reels3DCarouselSection() {
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [altIndex, setAltIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAltIndex(current => (current === 0 ? 1 : 0));
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setAltIndex(0);
  }, [selected]);
  const sectionRef = useRef<HTMLElement>(null);
  const dragStart = useRef<number | null>(null);
  const dragged = useRef(false);
  const playing = visible && pageVisible && !paused && !reducedMotion;
  const advancing = playing && !hovered && !focused;
  const example = REEL_EXAMPLES[selected];

  const changeReel = useCallback((direction: number) => {
    setSelected(current => (current + direction + REELS_DATA.length) % REELS_DATA.length);
  }, []);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(element);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReducedMotion(preference.matches);
    const syncVisibility = () => setPageVisible(!document.hidden);
    syncPreference();
    syncVisibility();
    preference.addEventListener("change", syncPreference);
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", syncPreference);
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, []);

  useEffect(() => {
    if (!advancing) return;
    const timer = setTimeout(() => changeReel(1), 6500);
    return () => clearTimeout(timer);
  }, [advancing, selected, changeReel]);

  const finishDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null) return;
    const distance = event.clientX - dragStart.current;
    dragStart.current = null;
    if (Math.abs(distance) > 40) {
      dragged.current = true;
      changeReel(distance < 0 ? 1 : -1);
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <section ref={sectionRef} id="reels-showcase" className={styles.section} aria-labelledby="reels-heading" data-playing={playing} data-advancing={advancing}>
      <div className={styles.header}>
        <h2 id="reels-heading" className={styles.heading}>Reels that<br /><span>reply</span> for you.</h2>
        <div className={styles.intro}>
          <p>Your content starts the conversation.<br />FreshDM keeps it going.</p>
          <span>Turn Instagram comments into personal DMs, even when you&apos;re away.</span>
        </div>
      </div>

      <div
        className={styles.gallery}
        role="region"
        aria-roledescription="carousel"
        aria-label="Reel automation examples"
        tabIndex={0}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            changeReel(event.key === "ArrowRight" ? 1 : -1);
          }
        }}
        onPointerDown={(event) => {
          if (event.pointerType === "mouse" && event.button !== 0) return;
          dragStart.current = event.clientX;
          dragged.current = false;
        }}
        onPointerMove={(event) => {
          if (dragStart.current !== null && Math.abs(event.clientX - dragStart.current) > 12) {
            dragged.current = true;
            if (!event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.setPointerCapture(event.pointerId);
          }
        }}
        onPointerUp={finishDrag}
        onPointerCancel={() => { dragStart.current = null; dragged.current = false; }}
      >
        <div className={styles.stageLight} aria-hidden="true" />
        <div className={styles.cards}>
          {REELS_DATA.map((reel, index) => {
            let offset = (index - selected + REELS_DATA.length) % REELS_DATA.length;
            if (offset > Math.floor(REELS_DATA.length / 2)) offset -= REELS_DATA.length;
            const distance = Math.abs(offset);
            const active = offset === 0;
            return (
              <button
                key={reel.id}
                type="button"
                className={styles.reel}
                data-active={active}
                data-distant={distance > 2}
                aria-label={`View reel ${index + 1}`}
                aria-pressed={active}
                aria-hidden={distance > 2}
                tabIndex={distance > 2 ? -1 : 0}
                style={{ "--offset": offset, "--distance": distance, "--dim": active ? 0 : Math.min(0.62, distance * 0.26), zIndex: 10 - distance } as React.CSSProperties}
                onClick={() => {
                  if (dragged.current) { dragged.current = false; return; }
                  setSelected(index);
                }}
              >
                <span className={styles.reelMedia} data-reel-media><ReelPreview reel={reel} active={active} playing={playing} visible={visible && pageVisible && !reducedMotion} /></span>
                <span className={styles.reelDim} aria-hidden="true" />
                <span className={styles.imageShade} />
                <span className={styles.reelTop}><Instagram size={19} strokeWidth={1.5} aria-hidden="true" /><span>Reels</span><Play size={13} fill="currentColor" aria-hidden="true" /></span>
                <span className={styles.reelBottom}><span>Example reel</span><span>{String(index + 1).padStart(2, "0")}</span></span>
              </button>
            );
          })}
        </div>

        <div className={styles.conversation} aria-label={`Example automation: ${example.topic}`}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={selected}
              className={styles.thread}
              initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
              transition={{ duration: reducedMotion ? 0.15 : 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.commentRow}>
                <img
                  src={example.avatar}
                  alt={example.username}
                  className={styles.userAvatar}
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/avatars/commenter.png";
                  }}
                />
                <div className={styles.commentBody}>
                  <div className={styles.commentHeader}>
                    <span className={styles.commentUser}>{example.username}</span>
                    <span className={styles.commentTime}>2m</span>
                  </div>
                  <p className={styles.commentText}>{example.comment}</p>
                </div>
              </div>

              <div
                className={styles.replyRow}
                onClick={(e) => {
                  e.stopPropagation();
                  setAltIndex(current => (current === 0 ? 1 : 0));
                }}
                title="Click to toggle alternative reply"
              >
                <CornerDownRight size={13} className={styles.replyArrow} aria-hidden="true" />
                <img
                  src="/avatars/owner.png"
                  alt="codebyabi"
                  className={styles.replyAvatar}
                  loading="lazy"
                />
                <div className={styles.replyContent}>
                  <div className={styles.replyMeta}>
                    <span className={styles.replyUser}>codebyabi</span>
                  </div>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={altIndex}
                      className={styles.replyText}
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -3 }}
                      transition={{ duration: 0.2 }}
                    >
                      {example.replies[altIndex % example.replies.length]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className={styles.galleryFooter}>
        <p>Example automation <span>Comment → Reply → DM</span></p>
        <div className={styles.controls}>
          <button type="button" aria-label="Previous reel" onClick={() => changeReel(-1)}><ArrowLeft size={17} aria-hidden="true" /></button>
          <span className={styles.counter} aria-live={advancing ? "off" : "polite"}><strong>{String(selected + 1).padStart(2, "0")}</strong><span>/</span>{String(REELS_DATA.length).padStart(2, "0")}</span>
          <button type="button" aria-label="Next reel" onClick={() => changeReel(1)}><ArrowRight size={17} aria-hidden="true" /></button>
          <button type="button" className={styles.pause} aria-label={paused ? "Play reels" : "Pause reels"} aria-pressed={paused} onClick={() => setPaused(current => !current)} disabled={reducedMotion}>
            {paused || reducedMotion ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div className={styles.capabilities}>
        <span><MessageCircle size={17} strokeWidth={1.5} aria-hidden="true" />Instant Comment Triggers</span>
        <span><Clock3 size={17} strokeWidth={1.5} aria-hidden="true" />Human-Speed Timing</span>
        <span><Send size={17} strokeWidth={1.5} aria-hidden="true" />24/7 Conversion Pipeline</span>
      </div>
    </section>
  );
}
export default Reels3DCarouselSection;
