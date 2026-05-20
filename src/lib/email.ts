// Email sender with graceful degradation.
//
// If RESEND_API_KEY is set we send through Resend; otherwise we log the message
// to the server console. The console path keeps password-reset workable on dev
// machines and during initial setup before Resend is configured.

import { Resend } from "resend";

const FROM = process.env.EMAIL_FROM || "ALTEREGO OS <onboarding@resend.dev>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

let resend: Resend | null = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

export function isEmailConfigured(): boolean {
  return resend !== null;
}

export function getAppUrl(): string {
  return APP_URL;
}

interface SendOpts {
  to: string;
  subject: string;
  html: string;
  text: string;
}

/**
 * Send an email. Returns true if delivered, false if logged to console only.
 * Never throws — callers should treat both outcomes as success and tell the
 * user "if an account exists, we sent a reset link" (preserving privacy).
 */
export async function sendEmail(opts: SendOpts): Promise<boolean> {
  if (!resend) {
    console.log(
      "\n========== EMAIL (console fallback — set RESEND_API_KEY to deliver) ==========\n" +
      `To:      ${opts.to}\n` +
      `From:    ${FROM}\n` +
      `Subject: ${opts.subject}\n` +
      `------------------------------------------------------------------------------\n` +
      opts.text +
      `\n==============================================================================\n`
    );
    return false;
  }
  try {
    await resend.emails.send({
      from: FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
    });
    return true;
  } catch (e) {
    console.error("[email] Resend send failed:", e);
    return false;
  }
}

export function passwordResetEmail(opts: { resetUrl: string; appName?: string }) {
  const app = opts.appName || "ALTEREGO OS";
  const text = `${app} — Reset your password

Someone (hopefully you) requested a password reset for your ${app} account.

Click this link to set a new password:
${opts.resetUrl}

The link expires in 1 hour and can be used once.

If you didn't request this, you can safely ignore this email — your password won't change.
`;
  const html = `<!doctype html>
<html><body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #FFF8EC; color: #3D3D3D; margin: 0; padding: 32px 16px;">
  <div style="max-width: 520px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 24px rgba(245,166,35,0.12);">
    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: #F5A623; font-weight: 600;">${app}</div>
    <h1 style="font-size: 22px; margin: 8px 0 16px; color: #3D3D3D;">Reset your password</h1>
    <p style="font-size: 15px; line-height: 1.5; color: #555;">Someone (hopefully you) requested a password reset for your ${app} account. Click the button below to set a new password.</p>
    <p style="margin: 24px 0;">
      <a href="${opts.resetUrl}" style="display: inline-block; background: #F5A623; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Set a new password</a>
    </p>
    <p style="font-size: 13px; color: #6B6B6B;">The link expires in 1 hour and can be used once. If the button doesn't work, paste this URL into your browser:</p>
    <p style="font-size: 12px; color: #888; word-break: break-all;">${opts.resetUrl}</p>
    <hr style="border: 0; border-top: 1px solid #F4ECD9; margin: 24px 0;" />
    <p style="font-size: 12px; color: #888;">If you didn't request this, you can safely ignore this email — your password won't change.</p>
  </div>
</body></html>`;
  return { text, html };
}
