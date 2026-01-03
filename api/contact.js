// api/contact.js - Vercel Serverless Function
// This file should be placed in the /api folder at the root of your project

const nodemailer = require('nodemailer');

// Configure your email service
// You'll need to set these as Environment Variables in Vercel
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
    },
});

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { name, email, phone, subject, message } = req.body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ 
                message: 'Please fill in all required fields.' 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                message: 'Please provide a valid email address.' 
            });
        }

        // Email to business owner
        const mailToOwner = {
            from: `"Lotus Path Contact Form" <${process.env.EMAIL_USER}>`,
            to: process.env.RECIPIENT_EMAIL || process.env.EMAIL_USER,
            subject: `New Contact Form Submission: ${subject}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Georgia, serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #4a4a4a; color: white; padding: 20px; text-align: center; }
                        .content { background-color: #f8f6f3; padding: 20px; margin-top: 20px; }
                        .field { margin-bottom: 15px; }
                        .label { font-weight: bold; color: #d4af37; }
                        .value { margin-top: 5px; padding: 10px; background-color: white; border-radius: 4px; }
                        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 0.9em; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Lotus Path - New Contact Form Submission</h1>
                        </div>
                        <div class="content">
                            <div class="field">
                                <div class="label">Name:</div>
                                <div class="value">${name}</div>
                            </div>
                            <div class="field">
                                <div class="label">Email:</div>
                                <div class="value"><a href="mailto:${email}">${email}</a></div>
                            </div>
                            <div class="field">
                                <div class="label">Phone:</div>
                                <div class="value">${phone}</div>
                            </div>
                            <div class="field">
                                <div class="label">Subject:</div>
                                <div class="value">${subject}</div>
                            </div>
                            <div class="field">
                                <div class="label">Message:</div>
                                <div class="value">${message.replace(/\n/g, '<br>')}</div>
                            </div>
                        </div>
                        <div class="footer">
                            <p>This message was sent from the Lotus Path contact form.</p>
                            <p>Received on: ${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Phone: ${phone}
Subject: ${subject}

Message:
${message}

Received on: ${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}
            `,
        };

        // Auto-reply email to customer
        const mailToCustomer = {
            from: `"Lotus Path" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Thank you for contacting Lotus Path',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Georgia, serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #4a4a4a; color: white; padding: 20px; text-align: center; }
                        .content { padding: 20px; margin-top: 20px; }
                        .footer { background-color: #f8f6f3; padding: 20px; margin-top: 20px; text-align: center; }
                        .accent { color: #d4af37; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Lotus Path</h1>
                            <p style="margin: 0; font-size: 0.9em; font-style: italic;">Follow the Light of Heritage</p>
                        </div>
                        <div class="content">
                            <p>Dear ${name},</p>
                            <p>Thank you for reaching out to Lotus Path. We have received your message and will respond to your inquiry within 24-48 hours.</p>
                            <p><strong class="accent">Your Message:</strong></p>
                            <p style="background-color: #f8f6f3; padding: 15px; border-radius: 4px;">${message.replace(/\n/g, '<br>')}</p>
                            <p>If you have any urgent questions, please feel free to call us at <strong>+27 31 123 4567</strong> or WhatsApp us at <strong>+27 82 987 6543</strong>.</p>
                            <p>Warm regards,<br><strong>The Lotus Path Team</strong></p>
                        </div>
                        <div class="footer">
                            <p style="margin: 0;"><strong>Lotus Path</strong></p>
                            <p style="margin: 5px 0;">123 Temple Road, Durban, KwaZulu-Natal, 4001</p>
                            <p style="margin: 5px 0;">Phone: +27 31 123 4567 | Email: info@lotuspath.co.za</p>
                            <p style="margin: 10px 0; font-size: 0.9em;">Mon-Fri: 9AM-6PM | Sat: 10AM-4PM</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
Dear ${name},

Thank you for reaching out to Lotus Path. We have received your message and will respond to your inquiry within 24-48 hours.

Your Message:
${message}

If you have any urgent questions, please feel free to call us at +27 31 123 4567 or WhatsApp us at +27 82 987 6543.

Warm regards,
The Lotus Path Team

---
Lotus Path
123 Temple Road, Durban, KwaZulu-Natal, 4001
Phone: +27 31 123 4567 | Email: info@lotuspath.co.za
Mon-Fri: 9AM-6PM | Sat: 10AM-4PM
            `,
        };

        // Send both emails
        await transporter.sendMail(mailToOwner);
        await transporter.sendMail(mailToCustomer);

        return res.status(200).json({ 
            message: 'Message sent successfully!',
            success: true 
        });

    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ 
            message: 'There was an error sending your message. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}