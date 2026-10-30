import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface SendCapturedLeadEmailParams {
  toEmail: string;
  creatorName?: string;
  automationName?: string;
  linkUrl?: string | null;
  linkLabel?: string | null;
}

/**
 * Dispatches an automated delivery email to a captured follower lead using Resend.
 */
export async function sendLeadDeliveryEmail({
  toEmail,
  creatorName = "Creator",
  automationName = "Your Requested Guide",
  linkUrl,
  linkLabel = "Access Your Resource",
}: SendCapturedLeadEmailParams): Promise<{ success: boolean; id?: string; error?: string }> {
  const brevoApiKey = process.env.BREVO_API_KEY;
  if (!brevoApiKey && !resend) {
    console.warn("[Email] Neither BREVO_API_KEY nor RESEND_API_KEY is configured. Skipping email dispatch.");
    return { success: false, error: "No email provider configured" };
  }

  try {
    const fromAddress = process.env.RESEND_FROM_EMAIL || "FreshDM <onboarding@resend.dev>";
    const subject = `Your requested resource from ${creatorName} 🎁`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A080C; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E6E3E8;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0A080C; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="560" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #130E1A; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; overflow: hidden; padding: 36px 32px;">
          <!-- Header -->
          <tr>
            <td align="left" style="padding-bottom: 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
              <span style="font-size: 13px; font-weight: bold; letter-spacing: 0.05em; text-transform: uppercase; color: #A24BE0;">FreshDM • Automated Delivery</span>
              <h1 style="margin: 8px 0 0; font-size: 24px; font-weight: 800; color: #FFFFFF; line-height: 1.2;">
                Here is your requested link! 🎉
              </h1>
            </td>
          </tr>
          
          <!-- Body Text -->
          <tr>
            <td style="padding: 24px 0; font-size: 14px; line-height: 1.6; color: #BDB9C2;">
              <p style="margin: 0 0 16px;">Hey there!</p>
              <p style="margin: 0 0 16px;">
                Thanks for reaching out on Instagram to <strong style="color: #FFFFFF;">${creatorName}</strong>. As promised, your exclusive resource <strong style="color: #FFFFFF;">"${automationName}"</strong> is ready for you below.
              </p>
              ${
                linkUrl
                  ? `
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <a href="${linkUrl}" style="display: inline-block; background: linear-gradient(135deg, #8E2CCB 0%, #7A22B0 100%); color: #FFFFFF; text-decoration: none; font-size: 14px; font-weight: 700; padding: 14px 32px; border-radius: 12px; box-shadow: 0 4px 16px rgba(122, 34, 176, 0.4);">
                      ${linkLabel} →
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0; font-size: 12px; color: #8C8890; text-align: center;">
                Direct link: <a href="${linkUrl}" style="color: #A24BE0; word-break: break-all;">${linkUrl}</a>
              </p>
              `
                  : ""
              }
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.06); font-size: 11px; color: #6E6A73; text-align: center;">
              You received this email because you requested it via Instagram DM.<br>
              Powered by FreshDM Platform
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    // 1. Try Brevo API if configured
    if (brevoApiKey) {
      const senderEmail = process.env.BREVO_SENDER_EMAIL || "support@codebyabi.com";
      const senderName = process.env.BREVO_SENDER_NAME || "FreshDM Support";

      const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": brevoApiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: [{ email: toEmail }],
          subject,
          htmlContent,
        }),
      });

      const brevoData = (await brevoRes.json()) as { messageId?: string; message?: string };
      if (!brevoRes.ok) {
        console.error("[Brevo] Failed to send email:", brevoData);
        return { success: false, error: brevoData.message || "Failed to send email via Brevo" };
      }

      console.log(`[Brevo] Successfully dispatched email to ${toEmail}, ID: ${brevoData.messageId}`);
      return { success: true, id: brevoData.messageId };
    }

    // 2. Fallback to Resend
    if (resend) {
      const { data, error } = await resend.emails.send({
        from: fromAddress,
        to: toEmail,
        subject,
        html: htmlContent,
      });

      if (error) {
        console.error("[Resend] Failed to send email:", error);
        return { success: false, error: error.message };
      }

      console.log(`[Resend] Successfully dispatched email to ${toEmail}, ID: ${data?.id}`);
      return { success: true, id: data?.id };
    }

    return { success: false, error: "No email provider available" };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Email] Error in sendLeadDeliveryEmail:", message);
    return { success: false, error: message };
  }
}
