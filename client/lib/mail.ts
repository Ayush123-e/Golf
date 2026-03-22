import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.warn("⚠️ RESEND_API_KEY is missing. Email notifications will be disabled.");
}

const resend = new Resend(apiKey || 're_placeholder');

export async function sendWinNotification(email: string, amount: number) {
  if (!process.env.RESEND_API_KEY) return { error: "Email service unconfigured" };
  try {
    const { data, error } = await resend.emails.send({
      from: 'GOLF HERO <onboarding@resend.dev>',
      to: [email],
      subject: '🏆 CHAMPION ALERT: YOU WON!',
      html: `
        <div style="font-family: sans-serif; background: #000; color: #fff; padding: 40px; border-radius: 20px;">
          <h1 style="font-style: italic; font-weight: 900; text-transform: uppercase; letter-spacing: -2px; font-size: 40px;">CHAMPION ALERT</h1>
          <p style="font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: #10b981;">Score Verified. Payout Ready.</p>
          <div style="margin: 40px 0; padding: 30px; border: 1px solid #10b981; border-radius: 20px;">
            <p style="margin: 0; font-size: 12px; font-weight: 900; color: #666; text-transform: uppercase; letter-spacing: 2px;">WINNINGS</p>
            <p style="margin: 10px 0 0; font-size: 48px; font-weight: 900; font-style: italic; letter-spacing: -2px;">£${amount.toLocaleString()}</p>
          </div>
          <p style="font-size: 14px; line-height: 1.6; color: #999;">Log in to your dashboard to upload your scorecard proof and claim your prize.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; margin-top: 20px; padding: 15px 30px; background: #10b981; color: #000; text-decoration: none; font-weight: 900; text-transform: uppercase; border-radius: 10px;">CLAIM PRIZE NOW</a>
        </div>
      `,
    });

    if (error) return { error };
    return { data };
  } catch (error) {
    return { error };
  }
}

export async function sendPaymentNotification(email: string, amount: number) {
  if (!process.env.RESEND_API_KEY) return { error: "Email service unconfigured" };
  try {
    const { data, error } = await resend.emails.send({
      from: 'GOLF HERO <onboarding@resend.dev>',
      to: [email],
      subject: '💰 PAYMENT PROCESSED',
      html: `
        <div style="font-family: sans-serif; background: #000; color: #fff; padding: 40px; border-radius: 20px;">
          <h1 style="font-style: italic; font-weight: 900; text-transform: uppercase; letter-spacing: -2px; font-size: 40px;">PAYMENT SENT</h1>
          <p style="font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: #10b981;">Funds Distributed</p>
          <div style="margin: 40px 0; padding: 30px; border: 1px solid #10b981; border-radius: 20px;">
            <p style="margin: 0; font-size: 12px; font-weight: 900; color: #666; text-transform: uppercase; letter-spacing: 2px;">AMOUNT PAID</p>
            <p style="margin: 10px 0 0; font-size: 48px; font-weight: 900; font-style: italic; letter-spacing: -2px;">£${amount.toLocaleString()}</p>
          </div>
          <p style="font-size: 14px; line-height: 1.6; color: #999;">The funds have been sent to your registered payment method. Thank you for playing GOLF HERO.</p>
        </div>
      `,
    });

    if (error) return { error };
    return { data };
  } catch (error) {
    return { error };
  }
}
