"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Check, Eye, EyeOff, KeyRound, LockKeyhole,
  MessageCircle, Send, ShieldCheck, UserRoundCheck,
} from "lucide-react";
import { authClient } from "@/lib/neon";
import { useAuthStore, type UserType } from "@/lib/auth-store";
import { safeInternalPath } from "@/lib/safe-redirect";
import styles from "./login.module.css";

type EmailFlow = "sign-in" | "sign-up" | "verify-email" | "forgot-password" | "reset-password";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function authError(result: unknown) {
  if (!result || typeof result !== "object") return null;
  const error = (result as { error?: { code?: string; message?: string } | null }).error;
  return error ? `${error.code ?? ""} ${error.message ?? ""}`.trim() : null;
}

type NeonAuthResultData = {
  token?: unknown;
  user?: { name?: unknown; image?: unknown; emailVerified?: unknown };
};

function authResultData(result: unknown): NeonAuthResultData | null {
  if (!result || typeof result !== "object") return null;
  const data = (result as { data?: unknown }).data;
  if (!data || typeof data !== "object") return null;
  const direct = data as NeonAuthResultData & {
    session?: {
      token?: unknown;
      access_token?: unknown;
      user?: NeonAuthResultData["user"];
    } | null;
  };
  return {
    token: direct.token ?? direct.session?.token ?? direct.session?.access_token,
    user: direct.user ?? direct.session?.user,
  };
}

function friendlyAuthError(value: unknown, fallback: string) {
  const message = typeof value === "string" ? value : value instanceof Error ? value.message : "";
  const normalized = message.toLowerCase();
  if (normalized.includes("invalid email or password") || normalized.includes("invalid credentials")) {
    return "The email or password is incorrect.";
  }
  if (normalized.includes("too many") || normalized.includes("rate limit")) {
    return "Too many attempts. Wait a few minutes, then try again.";
  }
  if (normalized.includes("expired")) return "That code has expired. Request a new one.";
  if (normalized.includes("invalid otp") || normalized.includes("invalid code")) {
    return "That verification code is not valid. Check the email and try again.";
  }
  if (normalized.includes("enter the 6-digit code")) return "Enter the 6-digit code from your email.";
  if (normalized.includes("enter your password")) return "Enter your password.";
  if (normalized.includes("already exists") || normalized.includes("user already")) {
    return "An account already exists for this email. Sign in or reset the password.";
  }
  if (normalized.includes("password") && normalized.includes("8")) {
    return "Use at least 8 characters for your password.";
  }
  return fallback;
}

export default function LoginPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const authUser = useAuthStore((state) => state.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [emailFlow, setEmailFlow] = useState<EmailFlow>("sign-in");
  const [resendAfter, setResendAfter] = useState(0);
  const [loadingProvider, setLoadingProvider] = useState<"google" | "email" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("expired") === "1") {
      setError("Your session expired. Sign in again to continue.");
      return;
    }
    const callbackError = params.get("error");
    if (callbackError) {
      setError(friendlyAuthError(callbackError, "Sign-in could not be completed. Please try again."));
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated && !authUser) return;
    const params = new URLSearchParams(window.location.search);
    window.location.replace(safeInternalPath(params.get("callbackUrl")));
  }, [isAuthenticated, authUser]);

  useEffect(() => {
    if (resendAfter <= 0) return;
    const timer = window.setInterval(() => setResendAfter((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [resendAfter]);

  function validateConsent() {
    if (agreed) return true;
    setError("Agree to the Terms of Service and Privacy Policy to continue.");
    return false;
  }

  function changeFlow(nextFlow: EmailFlow) {
    setEmailFlow(nextFlow);
    setError(null);
    setNotice(null);
    setCode("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
  }

  function validateEmail() {
    const value = normalizeEmail(email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.length > 254) {
      setError("Enter a valid email address.");
      return null;
    }
    setEmail(value);
    return value;
  }

  function validateNewPassword() {
    if (password.length < 8 || password.length > 128) {
      setError("Use a password between 8 and 128 characters.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return false;
    }
    return true;
  }

  async function syncSessionAndContinue(authResult?: unknown) {
    const directData = authResultData(authResult);
    let user = directData?.user;
    let token = typeof directData?.token === "string" ? directData.token : null;

    if (!user || !token) {
      const sessionResult = await authClient.getSession();
      const sessionError = authError(sessionResult);
      if (sessionError || !sessionResult?.data?.user) throw new Error(sessionError || "No session was created.");
      user = sessionResult.data.user;
      const session = sessionResult.data.session as { token?: unknown; access_token?: unknown } | null;
      token = typeof session?.token === "string"
        ? session.token
        : typeof session?.access_token === "string" ? session.access_token : null;
    }

    let appUser: UserType | undefined;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const response = await fetch("/api/auth/sync-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          user: {
            name: typeof user?.name === "string" ? user.name : undefined,
            image: typeof user?.image === "string" ? user.image : undefined,
          },
          ...(token ? { session: { token } } : {}),
        }),
      });
      if (response.ok) {
        const data = (await response.json()) as { user?: UserType };
        appUser = data.user;
        break;
      }
      if (attempt < 2) await new Promise((resolve) => window.setTimeout(resolve, 200 * (attempt + 1)));
    }

    if (!appUser) throw new Error("The account session could not be prepared.");
    useAuthStore.getState().setUser(appUser);
    const params = new URLSearchParams(window.location.search);
    window.location.replace(safeInternalPath(params.get("callbackUrl")));
  }

  async function sendEmailVerification(targetEmail: string) {
    const result = await authClient.emailOtp.sendVerificationOtp({
      email: targetEmail,
      type: "email-verification",
    });
    const resultError = authError(result);
    if (resultError) throw new Error(resultError);
    setResendAfter(60);
  }

  async function handleEmailSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const targetEmail = validateEmail();
    if (!targetEmail) return;
    if ((emailFlow === "sign-up" || emailFlow === "sign-in") && !validateConsent()) return;
    setLoadingProvider("email");
    setError(null);
    setNotice(null);
    let authenticationSucceeded = false;
    let verificationSucceeded = false;

    try {
      if (emailFlow === "sign-in") {
        if (!password) throw new Error("Enter your password.");
        const result = await authClient.signIn.email({ email: targetEmail, password });
        const resultError = authError(result);
        if (resultError) {
          const lowerError = resultError.toLowerCase();
          if (lowerError.includes("not verified") || lowerError.includes("verify your email")) {
            await sendEmailVerification(targetEmail);
            setEmailFlow("verify-email");
            setNotice(`We sent a 6-digit code to ${targetEmail}.`);
            return;
          }
          throw new Error(resultError);
        }
        authenticationSucceeded = true;
        await syncSessionAndContinue(result);
        return;
      }

      if (emailFlow === "sign-up") {
        if (!validateNewPassword()) return;
        const localName = targetEmail.split("@")[0].replace(/[._-]+/g, " ").trim() || "Creator";
        const result = await authClient.signUp.email({ email: targetEmail, password, name: localName });
        const resultError = authError(result);
        if (resultError) throw new Error(resultError);
        const signupData = authResultData(result);
        if (signupData?.user?.emailVerified === true) {
          authenticationSucceeded = true;
          await syncSessionAndContinue(result);
          return;
        }

        // Neon sends the configured verification code during sign-up. Sending
        // another code here would invalidate the code already in the inbox.
        setEmailFlow("verify-email");
        setCode("");
        setResendAfter(60);
        setNotice(`We sent a 6-digit code to ${targetEmail}. It expires shortly.`);
        return;
      }

      if (emailFlow === "verify-email") {
        if (!/^\d{6}$/.test(code)) throw new Error("Enter the 6-digit code from your email.");
        const result = await authClient.emailOtp.verifyEmail({ email: targetEmail, otp: code });
        const resultError = authError(result);
        if (resultError) throw new Error(resultError);
        verificationSucceeded = true;
        const verifiedData = authResultData(result);
        if (typeof verifiedData?.token === "string") {
          authenticationSucceeded = true;
          await syncSessionAndContinue(result);
          return;
        }
        const signInResult = await authClient.signIn.email({ email: targetEmail, password });
        const signInError = authError(signInResult);
        if (signInError) {
          setEmailFlow("sign-in");
          setCode("");
          setNotice("Email verified. Sign in to open your workspace.");
          return;
        }
        authenticationSucceeded = true;
        await syncSessionAndContinue(signInResult);
        return;
      }

      if (emailFlow === "forgot-password") {
        const result = await authClient.emailOtp.requestPasswordReset({ email: targetEmail });
        const resultError = authError(result);
        if (resultError) throw new Error(resultError);
        setEmailFlow("reset-password");
        setResendAfter(60);
        setNotice(`If an account exists for ${targetEmail}, a 6-digit reset code is on its way.`);
        return;
      }

      if (!validateNewPassword()) return;
      if (!/^\d{6}$/.test(code)) throw new Error("Enter the 6-digit code from your email.");
      const result = await authClient.emailOtp.resetPassword({ email: targetEmail, otp: code, password });
      const resultError = authError(result);
      if (resultError) throw new Error(resultError);
      setEmailFlow("sign-in");
      setCode("");
      setConfirmPassword("");
      setNotice("Password updated. Sign in with your new password.");
    } catch (caughtError) {
      if (verificationSucceeded) {
        setEmailFlow("sign-in");
        setCode("");
        setError(null);
        setNotice("Email verified. Sign in to open your workspace.");
      } else if (authenticationSucceeded) {
        setError(null);
        setNotice("You’re signed in. Press Enter workspace once more to finish opening it.");
      } else {
        setError(friendlyAuthError(caughtError, "We couldn’t complete that request. Check your details and try again."));
      }
    } finally {
      setLoadingProvider(null);
    }
  }

  async function resendCode() {
    if (resendAfter > 0 || loadingProvider) return;
    const targetEmail = validateEmail();
    if (!targetEmail) return;
    setLoadingProvider("email");
    setError(null);
    try {
      if (emailFlow === "reset-password") {
        const result = await authClient.emailOtp.requestPasswordReset({ email: targetEmail });
        const resultError = authError(result);
        if (resultError) throw new Error(resultError);
      } else {
        await sendEmailVerification(targetEmail);
      }
      setResendAfter(60);
      setNotice("A new code has been sent. Only the latest code will work.");
    } catch (caughtError) {
      setError(friendlyAuthError(caughtError, "We couldn’t send another code. Try again in a moment."));
    } finally {
      setLoadingProvider(null);
    }
  }

  async function handleGoogleLogin() {
    if (!validateConsent()) return;
    setLoadingProvider("google");
    setError(null);
    try {
      const params = new URLSearchParams(window.location.search);
      const callbackPath = safeInternalPath(params.get("callbackUrl"));
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}${callbackPath}`,
      });
      const resultError = authError(result);
      if (resultError) throw new Error(resultError);
    } catch (caughtError) {
      setError(friendlyAuthError(caughtError, "Google sign-in couldn’t start. Please try again."));
      setLoadingProvider(null);
    }
  }

  const isLoading = loadingProvider !== null;
  const isEntryFlow = emailFlow === "sign-in" || emailFlow === "sign-up";
  const heading = emailFlow === "sign-up"
    ? "Create your account."
    : emailFlow === "verify-email"
      ? "Check your inbox."
      : emailFlow === "forgot-password" || emailFlow === "reset-password"
        ? "Reset your password."
        : "Welcome back.";
  const description = emailFlow === "sign-up"
    ? "Set up secure access, then verify your email."
    : emailFlow === "verify-email"
      ? "Enter the six-digit code we sent to finish securing your account."
      : emailFlow === "forgot-password"
        ? "We’ll email you a one-time code to recover your account."
        : emailFlow === "reset-password"
          ? "Enter the code and choose a new password."
          : "Your automations have been working while you were away.";

  return (
    <main className={styles.page}>
      <div className={styles.ambient} aria-hidden="true" />
      <div className={styles.shell}>
        <section className={styles.authPane} aria-labelledby="login-title">
          <header className={styles.navbar}>
            <Link href="/" className={styles.wordmark} aria-label="AutoDM home">
              <span>Auto</span><span>DM</span>
            </Link>
            <Link href="/" className={styles.backLink}><ArrowLeft aria-hidden="true" />Home</Link>
          </header>

          <div className={styles.formWrap}>
            <div className={styles.intro}>
              <h1 id="login-title">{heading}</h1>
              <p>{description}</p>
            </div>

            <div className={styles.mobileSignal} aria-label="AutoDM automation flow">
              <span><MessageCircle aria-hidden="true" /> Comment</span>
              <i aria-hidden="true" />
              <span><Send aria-hidden="true" /> Private reply</span>
              <i aria-hidden="true" />
              <span><UserRoundCheck aria-hidden="true" /> Lead saved</span>
            </div>

            {error && (
              <div className={styles.error} role="alert" aria-live="polite">
                <span aria-hidden="true">!</span><p>{error}</p>
              </div>
            )}

            {notice && (
              <div className={styles.notice} role="status" aria-live="polite">
                <Check aria-hidden="true" /><p>{notice}</p>
              </div>
            )}

            {isEntryFlow && (
              <>
                <button type="button" onClick={handleGoogleLogin} disabled={isLoading} className={styles.googleButton}>
                  {loadingProvider === "google" ? <Spinner /> : <GoogleIcon />}
                  <span>{loadingProvider === "google" ? "Opening Google…" : "Continue with Google"}</span>
                  {loadingProvider !== "google" && <ArrowRight aria-hidden="true" />}
                </button>

                <div className={styles.divider}><span>or continue with email</span></div>

                <div className={styles.authTabs} aria-label="Email access type">
                  <button type="button" aria-pressed={emailFlow === "sign-in"} onClick={() => changeFlow("sign-in")}>Sign in</button>
                  <button type="button" aria-pressed={emailFlow === "sign-up"} onClick={() => changeFlow("sign-up")}>Create account</button>
                </div>
              </>
            )}

            <form onSubmit={handleEmailSubmit} className={`${styles.form} ${!isEntryFlow ? styles.flowForm : ""}`}>
              <Field label="Email address" htmlFor="login-email">
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  maxLength={254}
                  required
                  readOnly={emailFlow === "verify-email" || emailFlow === "reset-password"}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@studio.com"
                />
              </Field>

              {(emailFlow === "verify-email" || emailFlow === "reset-password") && (
                <Field label="Verification code" htmlFor="verification-code">
                  <div className={styles.codeField}>
                    <KeyRound aria-hidden="true" />
                    <input
                      id="verification-code"
                      name="code"
                      type="text"
                      autoComplete="one-time-code"
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      required
                      value={code}
                      onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="000000"
                      aria-describedby="code-help"
                    />
                  </div>
                  <div id="code-help" className={styles.codeHelp}>
                    <span>Code is valid for a limited time.</span>
                    <button type="button" onClick={resendCode} disabled={resendAfter > 0 || isLoading}>
                      {resendAfter > 0 ? `Resend in ${resendAfter}s` : "Send a new code"}
                    </button>
                  </div>
                </Field>
              )}

              {(emailFlow === "sign-in" || emailFlow === "sign-up" || emailFlow === "reset-password") && (
                <Field
                  label={emailFlow === "reset-password" ? "New password" : "Password"}
                  htmlFor="login-password"
                  action={emailFlow === "sign-in" ? (
                    <button type="button" className={styles.recoveryLink} onClick={() => changeFlow("forgot-password")}>
                      Forgot password?
                    </button>
                  ) : undefined}
                >
                  <div className={styles.passwordField}>
                    <input
                      id="login-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete={emailFlow === "sign-in" ? "current-password" : "new-password"}
                      minLength={emailFlow === "sign-in" ? undefined : 8}
                      maxLength={128}
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder={emailFlow === "sign-in" ? "Enter your password" : "At least 8 characters"}
                    />
                    <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>
                      {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                    </button>
                  </div>
                </Field>
              )}

              {(emailFlow === "sign-up" || emailFlow === "reset-password") && (
                <Field label="Confirm password" htmlFor="confirm-password">
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={128}
                    required
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Enter it again"
                  />
                </Field>
              )}

              {isEntryFlow && (
                <label className={styles.consent}>
                  <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
                  <span aria-hidden="true"><Check /></span>
                  <p>I agree to the <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.</p>
                </label>
              )}

              <button type="submit" disabled={isLoading} className={styles.submitButton}>
                {loadingProvider === "email" ? <><Spinner /> Please wait…</> : (
                  <>
                    {emailFlow === "sign-up" && "Create secure account"}
                    {emailFlow === "sign-in" && "Enter workspace"}
                    {emailFlow === "verify-email" && "Verify and continue"}
                    {emailFlow === "forgot-password" && "Send reset code"}
                    {emailFlow === "reset-password" && "Update password"}
                    <ArrowRight aria-hidden="true" />
                  </>
                )}
              </button>

              {!isEntryFlow && (
                <div className={styles.flowActions}>
                  <button type="button" onClick={() => changeFlow("sign-in")}><ArrowLeft aria-hidden="true" /> Back to sign in</button>
                  {emailFlow === "verify-email" && <button type="button" onClick={() => changeFlow("sign-up")}>Use a different email</button>}
                </div>
              )}
            </form>

            <div className={styles.trustRow}>
              <span><ShieldCheck aria-hidden="true" />Official Meta API</span>
              <span><LockKeyhole aria-hidden="true" />Encrypted tokens</span>
              <span>Safe rate pacing enabled</span>
            </div>
          </div>
        </section>
        <SignalPreview />
      </div>
    </main>
  );
}

function Field({ label, htmlFor, action, children }: { label: string; htmlFor: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className={styles.field}>
      <div className={styles.fieldLabel}><label htmlFor={htmlFor}>{label}</label>{action}</div>
      {children}
    </div>
  );
}

function SignalPreview() {
  return (
    <section className={styles.preview} aria-label="AutoDM automation preview">
      <div className={styles.previewNav}>
        <span>AutoDM / Signal 01</span>
        <span className={styles.runningState}><i /> Automation running</span>
      </div>

      <div className={styles.previewStatement}>
        <h2>One comment becomes a conversation.</h2>
        <p>AutoDM catches the signal, sends the right reply, and keeps every outcome visible.</p>
      </div>

      <div className={styles.signalScene}>
        <svg className={styles.signalPath} viewBox="0 0 720 410" fill="none" aria-hidden="true">
          <path className={styles.pathBase} d="M36 52C190 52 183 197 358 197C533 197 526 358 684 358" />
          <path className={styles.pathPulse} d="M36 52C190 52 183 197 358 197C533 197 526 358 684 358" />
        </svg>

        <article className={`${styles.signalMoment} ${styles.momentComment}`}>
          <div className={styles.momentIcon}><MessageCircle aria-hidden="true" /></div>
          <div><span>Comment received</span><strong>@mira.design</strong><p>GUIDE</p></div>
          <time>Just now</time>
        </article>

        <article className={`${styles.signalMoment} ${styles.momentReply}`}>
          <div className={styles.momentIcon}><Send aria-hidden="true" /></div>
          <div><span>Private reply</span><strong>Sent automatically</strong><p>Here’s the creator kit you asked for.</p></div>
          <em><Check aria-hidden="true" /> Delivered</em>
        </article>

        <article className={`${styles.signalMoment} ${styles.momentLead}`}>
          <div className={styles.momentIcon}><UserRoundCheck aria-hidden="true" /></div>
          <div><span>Lead captured</span><strong>mira@studio.com</strong><p>Creator kit delivery</p></div>
          <em><Check aria-hidden="true" /> Saved</em>
        </article>
      </div>

      <div className={styles.previewFoot}>
        <span>Illustrative workflow</span>
        <p>Official Meta Graph API · Encrypted account tokens</p>
      </div>
    </section>
  );
}

function Spinner() { return <span className={styles.spinner} aria-hidden="true" />; }

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" fill="#34A853" />
      <path d="M5.84 14.1a6.42 6.42 0 0 1 0-4.2V7.06H2.18A10.96 10.96 0 0 0 1 12c0 1.78.43 3.45 1.18 4.94l3.66-2.84Z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" fill="#EB4335" />
    </svg>
  );
}
