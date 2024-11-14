require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    debug: true,
    logger: true
});

// Test email route
app.post('/send-test', async (req, res) => {
    try {
        const { subject = 'Test Email', text = 'This is a test email' } = req.body;

        const mailOptions = {
            from: process.env.FROM_EMAIL,
            to: process.env.TO_EMAIL,
            subject,
            text
        };

        const info = await transporter.sendMail(mailOptions);
        res.json({
            success: true,
            messageId: info.messageId,
            message: 'Test email sent successfully'
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Verify connection route
app.get('/verify', async (req, res) => {
    try {
        await transporter.verify();
        res.json({
            success: true,
            message: 'SMTP connection verified successfully'
        });
    } catch (error) {
        console.error('Error verifying connection:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});