import nodemailer from 'nodemailer';
/**
 * Mail Service handles all email-related operations.
 */
export declare const mailService: {
    /**
     * Create a transporter using SMTP configuration from environment variables.
     */
    createTransporter: () => nodemailer.Transporter<import("nodemailer/lib/smtp-transport").SentMessageInfo, import("nodemailer/lib/smtp-transport").Options> | null;
    /**
     * Send an interview invitation email.
     * @param to Candidate email address
     * @param candidateName Candidate's full name
     * @param jobTitle Job title they applied for
     * @param interviewDate Date and time of the interview
     * @param location Office location or online meeting link
     */
    sendInterviewInvitation: (to: string, candidateName: string, jobTitle: string, interviewDate: Date, location: string) => Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo | null | undefined>;
};
//# sourceMappingURL=mail.service.d.ts.map