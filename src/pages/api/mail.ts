import type { APIRoute } from "astro";
import nodemailer from "nodemailer";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { company, name, email, phone, message } = body;

    // Validation
    if (!company || !name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: company, name, email, message" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Beautiful HTML template in SV Sticky branding (Orange #fa6b20 & Charcoal)
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <!-- Header -->
        <div style="background-color: #fa6b20; padding: 24px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Nieuwe Sponsoraanvraag!</h1>
        </div>
        <!-- Body -->
        <div style="padding: 24px; background-color: #ffffff; color: #334155; line-height: 1.6;">
          <p>Beste Extern/Xcom,</p>
          <p>Er is een nieuwe sponsor- of partneraanvraag ingediend via de website. Hieronder vind je de details:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px; margin-bottom: 24px;">
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 0; font-weight: bold; width: 35%;">Bedrijfsnaam:</td>
              <td style="padding: 10px 0; color: #0f172a;">${company}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 0; font-weight: bold;">Contactpersoon:</td>
              <td style="padding: 10px 0; color: #0f172a;">${name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 0; font-weight: bold;">E-mailadres:</td>
              <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #fa6b20; text-decoration: none; font-weight: bold;">${email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 0; font-weight: bold;">Telefoonnummer:</td>
              <td style="padding: 10px 0; color: #0f172a;">${phone || '-'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; vertical-align: top;">Bericht / Vraag:</td>
              <td style="padding: 10px 0; color: #0f172a; white-space: pre-line;">${message}</td>
            </tr>
          </table>
          
          <p style="margin: 0; font-size: 14px; color: #64748b;">Met vriendelijke groet,<br>De website-mailer van SV Sticky</p>
        </div>
        <!-- Footer -->
        <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
          Dit is een automatisch gegenereerd bericht van <a href="https://svsticky.nl" style="color: #fa6b20; text-decoration: none;">svsticky.nl</a>.
        </div>
      </div>
    `;

    const recipient = process.env.SPONSOR_EMAIL_RECIPIENT || "extern@stickyutrecht.nl";
    const sender = process.env.SMTP_FROM || `"SV Sticky Website" <noreply@svsticky.nl>`;

    const isSmtpConfigured = !!process.env.SMTP_HOST;

    if (isSmtpConfigured) {
      const useAuth = !!process.env.SMTP_USER;
      const secure = process.env.SMTP_PORT === "465";

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: secure,
        requireTLS: !secure, // Force STARTTLS on port 587 / 25
        auth: useAuth ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS || "",
        } : undefined,
        tls: {
          rejectUnauthorized: false // Do not fail on self-signed certificates
        }
      });

      await transporter.sendMail({
        from: sender,
        to: recipient,
        subject: `Nieuwe Sponsoraanvraag: ${company}`,
        html: emailHtml,
      });

      console.log(`Email successfully sent via SMTP to: ${recipient}`);
    } else {
      console.warn("--- SMTP Not Configured. Email details outputted below: ---");
      console.log(`To: ${recipient}`);
      console.log(`From: ${sender}`);
      console.log(`Subject: Nieuwe Sponsoraanvraag: ${company}`);
      console.log("HTML Body Preview:\n", emailHtml);
      console.warn("----------------------------------------------------------");
    }

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in /api/send-email endpoint:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send email. Internal Server Error." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
