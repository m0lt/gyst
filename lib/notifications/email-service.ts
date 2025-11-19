import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Gyst <noreply@gyst.app>';
const DAILY_LIMIT = parseInt(process.env.EMAIL_DAILY_LIMIT_PER_USER || '10', 10);

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface TaskReminderData {
  userName: string;
  taskTitle: string;
  taskDescription?: string;
  dueTime?: string;
  taskUrl: string;
}

export interface WeeklyDigestData {
  userName: string;
  startDate: string;
  endDate: string;
  completedTasksCount: number;
  totalTasksCount: number;
  completionRate: number;
  longestStreak: number;
  topCategories: Array<{
    name: string;
    completedCount: number;
  }>;
  upcomingTasks: Array<{
    title: string;
    dueDate: string;
  }>;
}

/**
 * Send a generic email
 */
export async function sendEmail(options: EmailOptions) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('⚠️ RESEND_API_KEY not configured. Email not sent.');
      return { success: false, error: 'Email service not configured' };
    }

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    console.log('✅ Email sent successfully:', result.data?.id);
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Send task reminder email
 */
export async function sendTaskReminder(to: string, data: TaskReminderData) {
  const html = generateTaskReminderHTML(data);
  const text = `Hi ${data.userName},\n\nReminder: ${data.taskTitle}\n${data.taskDescription || ''}\n\nComplete it here: ${data.taskUrl}`;

  return sendEmail({
    to,
    subject: `⏰ Reminder: ${data.taskTitle}`,
    html,
    text,
  });
}

/**
 * Send weekly digest email
 */
export async function sendWeeklyDigest(to: string, data: WeeklyDigestData) {
  const html = generateWeeklyDigestHTML(data);
  const text = `Hi ${data.userName},\n\nYour weekly summary (${data.startDate} - ${data.endDate}):\n\nCompleted: ${data.completedTasksCount}/${data.totalTasksCount} tasks (${data.completionRate}%)\nLongest streak: ${data.longestStreak} days\n\nKeep it up!`;

  return sendEmail({
    to,
    subject: `📊 Your Weekly Gyst Summary`,
    html,
    text,
  });
}

/**
 * Check if user has exceeded daily email limit
 */
export async function checkEmailLimit(userId: string): Promise<boolean> {
  // TODO: Implement database check for email count today
  // For now, return true (allowed)
  return true;
}

/**
 * Generate HTML for task reminder email
 */
function generateTaskReminderHTML(data: TaskReminderData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Task Reminder</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #faf8f5;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #8B4789 0%, #6B3668 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .content {
            padding: 40px 30px;
          }
          .task-title {
            font-size: 24px;
            font-weight: 600;
            color: #8B4789;
            margin-bottom: 16px;
          }
          .task-description {
            color: #666;
            margin-bottom: 24px;
          }
          .due-time {
            background: #f0edf9;
            border-left: 4px solid #8B4789;
            padding: 12px 16px;
            margin-bottom: 24px;
            border-radius: 4px;
          }
          .button {
            display: inline-block;
            background: #8B4789;
            color: white;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 8px;
            font-weight: 600;
            margin-top: 16px;
          }
          .button:hover {
            background: #6B3668;
          }
          .footer {
            background: #faf8f5;
            padding: 24px 30px;
            text-align: center;
            color: #999;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Task Reminder</h1>
          </div>
          <div class="content">
            <p>Hi ${data.userName},</p>
            <p>This is a friendly reminder about your task:</p>

            <div class="task-title">${data.taskTitle}</div>

            ${data.taskDescription ? `<div class="task-description">${data.taskDescription}</div>` : ''}

            ${data.dueTime ? `
              <div class="due-time">
                <strong>Due:</strong> ${data.dueTime}
              </div>
            ` : ''}

            <a href="${data.taskUrl}" class="button">Complete Task</a>
          </div>
          <div class="footer">
            <p>You're receiving this because you enabled task reminders in Gyst.</p>
            <p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/protected/settings/notifications" style="color: #8B4789; text-decoration: none;">Manage notification settings</a>
              ·
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/protected/settings/notifications?unsubscribe=true" style="color: #999; text-decoration: none;">Unsubscribe</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Generate HTML for weekly digest email
 */
function generateWeeklyDigestHTML(data: WeeklyDigestData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Weekly Digest</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #faf8f5;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #8B4789 0%, #6B3668 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .date-range {
            color: rgba(255, 255, 255, 0.9);
            margin-top: 8px;
            font-size: 14px;
          }
          .content {
            padding: 40px 30px;
          }
          .stat-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 32px;
          }
          .stat-card {
            background: #faf8f5;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
          }
          .stat-value {
            font-size: 32px;
            font-weight: 700;
            color: #8B4789;
            display: block;
          }
          .stat-label {
            color: #666;
            font-size: 14px;
            margin-top: 4px;
          }
          .section {
            margin-bottom: 32px;
          }
          .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #8B4789;
            margin-bottom: 16px;
          }
          .category-item {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #f0f0f0;
          }
          .task-item {
            padding: 12px 16px;
            background: #faf8f5;
            margin-bottom: 8px;
            border-radius: 6px;
          }
          .footer {
            background: #faf8f5;
            padding: 24px 30px;
            text-align: center;
            color: #999;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Your Weekly Summary</h1>
            <div class="date-range">${data.startDate} - ${data.endDate}</div>
          </div>
          <div class="content">
            <p>Hi ${data.userName},</p>
            <p>Here's how your week went:</p>

            <div class="stat-grid">
              <div class="stat-card">
                <span class="stat-value">${data.completionRate}%</span>
                <div class="stat-label">Completion Rate</div>
              </div>
              <div class="stat-card">
                <span class="stat-value">${data.longestStreak}</span>
                <div class="stat-label">Longest Streak</div>
              </div>
              <div class="stat-card">
                <span class="stat-value">${data.completedTasksCount}</span>
                <div class="stat-label">Tasks Completed</div>
              </div>
              <div class="stat-card">
                <span class="stat-value">${data.totalTasksCount}</span>
                <div class="stat-label">Total Tasks</div>
              </div>
            </div>

            ${data.topCategories.length > 0 ? `
              <div class="section">
                <div class="section-title">🏆 Top Categories</div>
                ${data.topCategories.map(cat => `
                  <div class="category-item">
                    <span>${cat.name}</span>
                    <strong>${cat.completedCount} tasks</strong>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${data.upcomingTasks.length > 0 ? `
              <div class="section">
                <div class="section-title">📅 Upcoming This Week</div>
                ${data.upcomingTasks.map(task => `
                  <div class="task-item">
                    <div>${task.title}</div>
                    <div style="color: #666; font-size: 14px;">${task.dueDate}</div>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <p style="margin-top: 32px;">Keep up the great work! 🎉</p>
          </div>
          <div class="footer">
            <p>You're receiving this weekly digest from Gyst.</p>
            <p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/protected/settings/notifications" style="color: #8B4789; text-decoration: none;">Manage notification settings</a>
              ·
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/protected/settings/notifications?unsubscribe=digest" style="color: #999; text-decoration: none;">Unsubscribe from digest</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}
