import nodemailer from 'nodemailer';

/**
 * Mail Service handles all email-related operations.
 */
export const mailService = {
    /**
     * Create a transporter using SMTP configuration from environment variables.
     */
    createTransporter: () => {
        const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
        console.log('📧 Attempting to create transporter with:', { SMTP_HOST, SMTP_PORT, SMTP_USER, hasPass: !!SMTP_PASS });

        if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
            console.warn('⚠️ Mail credentials missing in .env. Email notifications will be disabled.');
            return null;
        }

        return nodemailer.createTransport({
            host: SMTP_HOST,
            port: parseInt(SMTP_PORT),
            secure: SMTP_PORT === '465', // true for 465, false for other ports
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS,
            },
        });
    },

    /**
     * Send an interview invitation email.
     * @param to Candidate email address
     * @param candidateName Candidate's full name
     * @param jobTitle Job title they applied for
     * @param interviewDate Date and time of the interview
     * @param location Office location or online meeting link
     */
    sendInterviewInvitation: async (
        to: string,
        candidateName: string,
        jobTitle: string,
        interviewDate: Date,
        location: string
    ) => {
        const transporter = mailService.createTransporter();
        if (!transporter) return;

        const formattedDate = new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZoneName: 'short'
        }).format(interviewDate);

        const mailOptions = {
            from: process.env.SMTP_FROM || 'HRM System <noreply@hrm.com>',
            to,
            subject: `Interview Invitation: ${jobTitle} Position`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #3b82f6;">Interview Invitation</h2>
          <p>Dear ${candidateName},</p>
          <p>We are pleased to invite you for an interview for the <strong>${jobTitle}</strong> position at our company.</p>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #4b5563;"><strong>Date & Time:</strong> ${formattedDate}</p>
            <p style="margin: 10px 0 0 0; color: #4b5563;"><strong>Location / Link:</strong> ${location}</p>
          </div>

          <p>Please let us know if this time works for you or if we need to reschedule.</p>
          <p>We look forward to speaking with you!</p>
          
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #9ca3af;">This is an automated message from the Recruitment Department.</p>
        </div>
      `,
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('✅ Interview email sent:', info.messageId);
            return info;
        } catch (error: any) {
            console.error('❌ Failed to send interview email. Error details:', {
                message: error.message,
                code: error.code,
                command: error.command,
                response: error.response,
                stack: error.stack
            });
            // We don't throw here to avoid failing the candidate status update if email fails
            return null;
        }
    },
};
