export const otpTemplate = (otp) => {
  return `
  <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
    
    <div style="max-width:600px;margin:auto;background:white;padding:20px;border-radius:10px;">
      
      <h2 style="color:#0ea5e9;text-align:center;">Riveto OTP Verification</h2>

      <p>Dear User,</p>

      <p>Your OTP for email verification is:</p>

      <div style="text-align:center;margin:20px 0;">
        <span style="
          font-size:28px;
          letter-spacing:5px;
          font-weight:bold;
          color:#111;
          background:#e0f2fe;
          padding:10px 20px;
          border-radius:8px;
          display:inline-block;
        ">
          ${otp}
        </span>
      </div>

      <p>This OTP is valid for <b>5 minutes</b>. Do not share it with anyone.</p>

      <hr/>

      <p style="font-size:12px;color:gray;text-align:center;">
        Enterprise-Level Commerce Experience<br/>
        Built for Reliability, Designed for Trust
      </p>

    </div>
  </div>
  `;
};
