<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f4f7; margin: 0; padding: 40px 20px; }
        .container { max-width: 520px; margin: 0 auto; background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); overflow: hidden; }
        .header { background: linear-gradient(135deg, #1e3a5f, #2563eb); padding: 32px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
        .body { padding: 32px; }
        .body p { color: #4a5568; line-height: 1.7; margin: 0 0 16px; font-size: 15px; }
        .token-box { background: #f7fafc; border: 2px dashed #cbd5e0; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
        .token { font-family: 'Courier New', monospace; font-size: 18px; font-weight: 700; color: #1e3a5f; word-break: break-all; letter-spacing: 1px; }
        .footer { text-align: center; padding: 20px 32px; border-top: 1px solid #edf2f7; }
        .footer p { color: #a0aec0; font-size: 12px; margin: 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏠 SeeItHome</h1>
        </div>
        <div class="body">
            <p>Hi there,</p>
            <p>We received a request to reset the password for your SeeItHome account (<strong>{{ $email }}</strong>).</p>
            <p>Use the following token to reset your password:</p>
            <div class="token-box">
                <span class="token">{{ $token }}</span>
            </div>
            <p>This token will expire in <strong>60 minutes</strong>.</p>
            <p>If you did not request a password reset, you can safely ignore this email.</p>
        </div>
        <div class="footer">
            <p>© {{ date('Y') }} SeeItHome. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
