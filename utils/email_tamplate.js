// utils/emailTemplates.js

export const welcomeEmail = (name) => ({
    subject: `Welcome to Taskr, ${name}! 🎉`,
    html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #6C63FF; padding: 32px; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0;">✓ Taskr</h1>
            </div>

            <div style="padding: 32px; background: #fff; border: 1px solid #e5e7eb;">
                <h2>Welcome aboard, ${name}! 👋</h2>
                <p style="color: #6b7280; line-height: 1.6;">
                    Your account is ready. Start organizing your tasks and
                    tracking your progress today.
                </p>
                <a href="${process.env.CLIENT_URL}/todo"
                    style="display: inline-block; background: #6C63FF;
                  color: white; padding: 12px 24px; border-radius: 8px;
                  text-decoration: none; font-weight: 600; margin-top: 16px;">
                    Go to my tasks →
                </a>
            </div>

            <div style="padding: 16px; color: #9ca3af; font-size: 12px; text-align: center;">
                You received this because you created a Taskr account.
            </div>
        </div>`

})


export const passwordResetEmail = ({ name, url }) => ({
    subject: "Reset your Taskr password",
    html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #6C63FF; padding: 32px; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0;">✓ Taskr</h1>
            </div>

            <div style="padding: 32px; background: #fff; border: 1px solid #e5e7eb;">
                <h2>Hi ${name}, reset your password</h2>
                <p style="color: #6b7280; line-height: 1.6;">
                    You requested a password reset. Click the button below —
                    this link expires in <strong>10 minutes.</strong>
                </p>
                <a href="${url}"
                    style="display: inline-block; background: #ef4444;
                  color: white; padding: 12px 24px; border-radius: 8px;
                  text-decoration: none; font-weight: 600; margin-top: 16px;">
                    Reset my password →
                </a>
                <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
                    If you didn't request this, ignore this email.
                    Your password won't change.
                </p>
            </div>
        </div>
`
})
