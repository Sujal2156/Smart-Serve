export const PASSWORD_RESET_REQUEST = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset - SmartServe</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      color: #333;
      margin: 0;
      padding: 0;
    }

    .email-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .header {
      text-align: center;
      padding: 10px;
      color: #ffffff;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
    }

    .header>img {
      text-align: center;
      padding: 10px;
      color: #ffffff;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
    }

    .logo {
      width: 100px;
      margin: 0 auto;
      display: block;
    }

    .header h1 {
      margin: 10px 0 0;
      background-color: #0073e6;
      padding: 10px;
      font-size: 24px;
    }

    .content {
      padding: 20px;
    }

    .content p {
      font-size: 16px;
      line-height: 1.6;
    }

    .button-container {
      text-align: center;
      margin: 20px 0;
    }

    .button {
      background-color: #0073e6;
      color: #ffffff;
      padding: 12px 24px;
      font-size: 16px;
      border: none;
      border-radius: 5px;
      text-decoration: none;
      display: inline-block;
    }

    .footer {
      text-align: center;
      font-size: 12px;
      color: #777;
      padding: 10px;
      border-top: 1px solid #f0f0f0;
    }

    .footer a {
      color: #0073e6;
      text-decoration: none;
    }
  </style>
</head>

<body>
  <div class="email-container">
    <div class="header">
      <!-- REPLACE THE SRC LINK BELOW WITH YOUR SMARTSERVE LOGO CLOUDINARY LINK -->
      <img src="https://res.cloudinary.com/ddjkxutne/image/upload/v1731096836/scan-dine-logo_dmdllv.jpg"
        alt="SmartServe Logo" class="logo">
      <h1>SmartServe</h1>
    </div>
    <div class="content">
      <p>Hello, {userName}</p>
      <p>We received a request to reset the password for your SmartServe account. Click the button below to set a new
        password:</p>
      <div class="button-container">
        <a href="{reset_link}" class="button">Reset Password</a>
      </div>
      <p>If you did not request a password reset, please ignore this email or contact our support team.</p>
      <p>For any assistance, please feel free to reach out to us at <a
          href="mailto:softpro1712@gmail.com">softpro1712@gmail.com</a>.</p>
      <p>Thank you,<br>The SmartServe Team</p>
    </div>
    <div class="footer">
      <p>© 2026 SmartServe. All rights reserved.</p>
      <p><a href="{{unsubscribe_link}}">Unsubscribe</a> from these notifications.</p>
    </div>
  </div>
</body>

</html>
`

export const PASSWORD_RESET_SUCCESS = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful - SmartServe</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      color: #333;
      margin: 0;
      padding: 0;
    }

    .email-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .header {
      text-align: center;
      padding: 20px;
      color: #ffffff;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
    }

    .logo {
      width: 100px;
      margin: 0 auto;
      display: block;
    }

    .header h1 {
      margin: 10px 0 0;
      background-color: #0073e6;
      font-size: 24px;
    }

    .content {
      padding: 20px;
    }

    .content p {
      font-size: 16px;
      line-height: 1.6;
    }

    .footer {
      text-align: center;
      font-size: 12px;
      color: #777;
      padding: 10px;
      border-top: 1px solid #f0f0f0;
    }

    .footer a {
      color: #0073e6;
      text-decoration: none;
    }
  </style>
</head>

<body>
  <div class="email-container">
    <div class="header">
      <!-- REPLACE THE SRC LINK BELOW WITH YOUR SMARTSERVE LOGO CLOUDINARY LINK -->
      <img src="https://res.cloudinary.com/ddjkxutne/image/upload/v1731096836/scan-dine-logo_dmdllv.jpg"
        alt="SmartServe Logo" class="logo">
      <h1>SmartServe</h1>
    </div>
    <div class="content">
      <p>Hello, {userName}</p>
      <p>Your password has been successfully reset. You can now log in to your SmartServe account using your new
        password.</p>
      <p>If you did not request this change, please contact our support team immediately at <a
          href="mailto:softpro1712@gmail.com">softpro1712@gmail.com</a>.</p>
      <p>Thank you,<br>The SmartServe Team</p>
    </div>
    <div class="footer">
      <p>© 2026 SmartServe. All rights reserved.</p>
      <p><a href="{{unsubscribe_link}}">Unsubscribe</a> from these notifications.</p>
    </div>
  </div>
</body>

</html>
`
export const VERIFICATION_EMAIL = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - SmartServe</title>
</head>

<body style="font-family: Arial, Helvetica, sans-serif;">
    <header style="background-color: #0073e6; color: #ffffff; margin-bottom: 0; text-align: center; padding: 15px 0;">
        <h1 style="margin: 0; font-size: 24px;">SmartServe</h1>
    </header>

    <main
        style="background-color: #f9f9f9; color: #333333; font-size: 1.1rem; padding: 20px; border-radius: 5px;">
        <h3>Hi {username},</h3>
        <p>Thanks for signing up for SmartServe! This email verification step is required to make sure we have an
            accurate email address to communicate important account events to you.</p>
        <p>To confirm your email address, your One Time Password (OTP) is:</p>
        <div style="text-align: center; font-size: 2rem; font-weight: 800; color: #0073e6; margin: 20px 0;">
            <span>{Verification code}</span>
        </div>
        <div>
            <p>This code will expire in 5 minutes for security reasons.</p>
            <p>Please do not reply to this mail.</p>
            <p>
                Thanks,<br>
                Support Team,<br>
                SmartServe
            </p>
        </div>
    </main>
    <footer
        style="background-color: #eeeeee; padding-top: 15px; margin-top: 0; text-align: center; padding-bottom: 15px;">
        <p style="margin: 5px 0; color: #777;">&copy; 2026 SmartServe. All rights reserved.</p>
        <p style="color: #0073e6; font-size: 1rem; margin: 5px 0;">Gandhinagar, Gujarat</p>
    </footer>
</body>

</html>`

export const WELCOME_EMAIL = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to SmartServe</title>
</head>

<body style="font-family: Arial, Helvetica, sans-serif;">
    <header style="background-color: #0073e6; color: #ffffff; margin-bottom: 0; text-align: center; padding: 15px 0;">
        <h1 style="margin: 0; font-size: 24px;">SmartServe</h1>
    </header>

    <main
        style="background-color: #f9f9f9; color: #333333; font-size: 1.1rem; padding: 20px; border-radius: 5px;">
        <h2>Welcome to SmartServe</h2>
        <p>Hi {username},</p>
        <p>Thanks for registering on SmartServe. Your account is verified and you can start using it right now. We
            are all about bringing you the best experience.<br>
            Here is what you can look forward to:</p>
        <ul>
            <li>A seamless and secure platform experience.</li>
            <li>Easy access to all our tools and features.</li>
            <li>Reliable support whenever you need it.</li>
        </ul>
        <p> To get started, <a href="#" style="text-decoration: none; color: #0073e6; font-weight: bold;">log in</a> to
            your account and explore.</p>
        <div>
            <p>Please do not reply to this mail.</p>
            <p>
                Thanks,<br>
                SmartServe Team
            </p>
        </div>
    </main>
    <footer
        style="background-color: #eeeeee; padding-top: 15px; margin-top: 0; text-align: center; padding-bottom: 15px;">
        <p style="margin: 5px 0; color: #777;">&copy; 2026 SmartServe. All rights reserved.</p>
        <p style="color: #0073e6; font-size: 1rem; margin: 5px 0;">Gandhinagar, Gujarat</p>
    </footer>
</body>

</html>`