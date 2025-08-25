const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const ContactMessage = require("../models/ContactMessage");

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD 
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/attachments');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: timestamp-random-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, fileExtension);
    cb(null, `${uniqueSuffix}-${baseName}${fileExtension}`);
  }
});

// File filter for security
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed. Allowed types: Images, PDF, Word, Excel, Text files`), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files
  }
});

// Send and save contact message (unchanged)
const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    // Validate environment variables
    if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
      console.error("Missing email configuration:");
      console.error("EMAIL_USERNAME:", process.env.EMAIL_USERNAME ? "SET" : "MISSING");
      console.error("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "SET" : "MISSING");
      return res.status(500).json({ 
        success: false, 
        message: "Email service configuration error" 
      });
    }

    // Save to database
    const newMessage = new ContactMessage({
      name,
      email,
      subject,
      message,
      read: false,
      starred: false,
      status: 'open'
    });
    await newMessage.save();

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: process.env.EMAIL_USERNAME,
      replyTo: email,
      subject: `New Contact Form Submission: ${subject}`,
      text: `You have received a new contact form submission:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #f5f5f5; padding: 15px; margin: 10px 0; border-left: 4px solid #007bff;">
          ${message.replace(/\n/g, "<br>")}
        </div>
        <hr>
        <p><small>This message was sent from your website contact form.</small></p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending contact message:", error);
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
};

// Get all messages for admin
const getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ success: false, message: "Failed to fetch messages" });
  }
};

// Admin reply to message with attachments - UPDATED
const replyToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyMessage } = req.body;

    if (!replyMessage) {
      return res.status(400).json({ success: false, message: "Reply message is required" });
    }

    const message = await ContactMessage.findById(id);
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    // Process uploaded files
    const attachments = [];
    const nodemailerAttachments = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // Create attachment object for database
        const attachment = {
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path,
          url: `${req.protocol}://${req.get('host')}/uploads/attachments/${file.filename}`,
        };
        attachments.push(attachment);

        // Create attachment object for nodemailer
        nodemailerAttachments.push({
          filename: file.originalname,
          path: file.path,
          contentType: file.mimetype
        });
      }
    }

    // Send reply email with attachments
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: message.email,
      subject: `Re: ${message.subject}`,
      text: `Dear ${message.name},\n\n${replyMessage}\n\nBest regards,\n${process.env.EMAIL_SENDER_NAME || "WV Support Team"}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <p>Dear ${message.name},</p>
          <div style="background: #f8f9fa; padding: 20px; margin: 15px 0; border-radius: 5px;">
            ${replyMessage.replace(/\n/g, "<br>")}
          </div>
          ${attachments.length > 0 ? `
            <div style="margin: 15px 0;">
              <p><strong>Attachments:</strong></p>
              <ul>
                ${attachments.map(att => `<li>${att.originalName} (${(att.size / 1024).toFixed(1)} KB)</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          <p>Best regards,<br><strong>${process.env.EMAIL_SENDER_NAME || "WV Support Team"}</strong></p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
            <p><strong>Your original message:</strong></p>
            <p><strong>Subject:</strong> ${message.subject}</p>
            <p><strong>Message:</strong> ${message.message}</p>
          </div>
        </div>
      `,
      attachments: nodemailerAttachments
    };

    await transporter.sendMail(mailOptions);

    // Update message in database with reply and attachments
    message.replied = true;
    message.replyMessage = replyMessage;
    message.replyAttachments = attachments;
    message.lastReplyAt = new Date();
    message.read = true;
    await message.save();

    res.status(200).json({ 
      success: true, 
      message: "Reply sent successfully", 
      data: message,
      attachments: attachments
    });
  } catch (error) {
    console.error("Error replying to message:", error);
    
    // Clean up uploaded files if email sending failed
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      });
    }
    
    res.status(500).json({ success: false, message: "Failed to send reply" });
  }
};

// Mark message as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const message = await ContactMessage.findByIdAndUpdate(
      id, 
      { read: true }, 
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    res.status(200).json({ success: true, message: "Message marked as read", data: message });
  } catch (error) {
    console.error("Error marking message as read:", error);
    res.status(500).json({ success: false, message: "Failed to mark message as read" });
  }
};

// Toggle starred status
const toggleStar = async (req, res) => {
  try {
    const { id } = req.params;
    const { starred } = req.body;
    
    const message = await ContactMessage.findByIdAndUpdate(
      id, 
      { starred }, 
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    res.status(200).json({ 
      success: true, 
      message: starred ? "Message starred" : "Message unstarred", 
      data: message 
    });
  } catch (error) {
    console.error("Error toggling star:", error);
    res.status(500).json({ success: false, message: "Failed to toggle star" });
  }
};

// Delete message
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const message = await ContactMessage.findById(id);
    
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    // Delete associated attachment files
    if (message.replyAttachments && message.replyAttachments.length > 0) {
      message.replyAttachments.forEach(attachment => {
        fs.unlink(attachment.path, (err) => {
          if (err) console.error("Error deleting attachment file:", err);
        });
      });
    }

    await ContactMessage.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ success: false, message: "Failed to delete message" });
  }
};

// Close a message manually
const closeMessage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const updatedMessage = await ContactMessage.findByIdAndUpdate(
      id,
      { 
        status: 'closed',
        closedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message closed successfully',
      data: updatedMessage
    });

  } catch (error) {
    console.error('Error closing message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to close message',
      error: error.message
    });
  }
};

// Reopen a closed message
const reopenMessage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const updatedMessage = await ContactMessage.findByIdAndUpdate(
      id,
      { 
        status: 'open',
        reopenedAt: new Date(),
        closedAt: null,
      },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message reopened successfully',
      data: updatedMessage
    });

  } catch (error) {
    console.error('Error reopening message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reopen message',
      error: error.message
    });
  }
};

// Middleware for file upload
const uploadAttachments = upload.array('attachments', 5);

module.exports = {
  sendContactMessage,
  getAllMessages,
  replyToMessage,
  markAsRead,
  toggleStar,
  deleteMessage,
  closeMessage,
  reopenMessage,
  uploadAttachments // Export middleware
};