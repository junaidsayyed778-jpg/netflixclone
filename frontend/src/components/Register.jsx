import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/hooks/useAuth";
import { useState, useEffect } from "react";

const Register = () => {
  const navigate = useNavigate();
  const { handleRegister, loading } = useAuth();

  // Form states
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  // Validation states
  const [emailValid, setEmailValid] = useState(true);
  const [usernameValid, setUsernameValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [otpValid, setOtpValid] = useState(true);

  // OTP Flow states
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [timer, setTimer] = useState(0);
  const [formError, setFormError] = useState("");

  // 🔥 Countdown timer for OTP resend
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // 🔥 Send OTP to email
  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    // Validate email first
    const isValid = email.includes("@") && email.includes(".");
    setEmailValid(isValid);
    
    if (!isValid) {
      setOtpError("Please enter a valid email address");
      return;
    }

    setOtpLoading(true);
    setOtpError("");

    try {
      // 🔥 MOCK API CALL - Replace with your backend endpoint
      // const response = await fetch("/api/auth/send-otp", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email }),
      // });
      // const data = await response.json();

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // ✅ For demo: Log OTP to console (remove in production)
      const demoOTP = Math.floor(100000 + Math.random() * 900000);
      console.log(`🔐 OTP for ${email}: ${demoOTP}`);
      
      setOtpSent(true);
      setTimer(60); // 60 second cooldown
      setOtpError("");
      
    } catch (err) {
      setOtpError("Failed to send OTP. Please try again.");
      console.error("Send OTP error:", err);
    } finally {
      setOtpLoading(false);
    }
  };

  // 🔥 Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (otp.trim().length < 6) {
      setOtpValid(false);
      return;
    }
    setOtpValid(true);
    setOtpLoading(true);
    setOtpError("");

    try {
      // 🔥 MOCK API CALL - Replace with your backend endpoint
      // const response = await fetch("/api/auth/verify-otp", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, otp }),
      // });
      // const data = await response.json();

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // ✅ For demo: Accept any 6-digit OTP (remove in production)
      if (otp.length === 6) {
        setOtpVerified(true);
        setOtpError("");
      } else {
        throw new Error("Invalid OTP");
      }
      
    } catch (err) {
      setOtpError("Invalid OTP. Please try again.");
      console.error("Verify OTP error:", err);
    } finally {
      setOtpLoading(false);
    }
  };

  // 🔥 Final Registration (after OTP verified)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Final validation
    const isEmailValid = email.includes("@");
    const isUsernameValid = username.trim() !== "";
    const isPasswordValid = password.length >= 6;
    const isOtpVerified = otpVerified;

    setEmailValid(isEmailValid);
    setUsernameValid(isUsernameValid);
    setPasswordValid(isPasswordValid);

    if (!isEmailValid || !isUsernameValid || !isPasswordValid || !isOtpVerified) {
      if (!isOtpVerified) setFormError("Please verify your email with OTP first");
      return;
    }

    // Call your existing auth handler
    const success = await handleRegister({ email, username, password });

    if (success) {
      navigate("/"); // ✅ Only navigate on success
    } else {
      setFormError("Registration failed. Please try again.");
    }
  };

  // 🔥 Resend OTP
  const handleResendOTP = () => {
    if (timer === 0) {
      setOtpSent(false);
      setOtpVerified(false);
      setOtp("");
      handleSendOTP({ preventDefault: () => {} });
    }
  };

  // Loading state
  if (loading || otpLoading) {
    return (
      <div className="login">
        <div className="holder">
          <h1>{otpLoading ? "Verifying..." : "Loading..."}</h1>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="login">
      <div className="holder">
        <h1>Sign Up</h1>
        
        {formError && (
          <div className="form-error">{formError}</div>
        )}
        
        <form onSubmit={handleSubmit}>
          
          {/* Full Name */}
          <input
            className={`form-control ${!usernameValid ? "error" : ""}`}
            type="text"
            placeholder="Full Name"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setUsernameValid(true);
            }}
            disabled={otpVerified}
          />
          {!usernameValid && (
            <span className="error-msg">Name is required</span>
          )}

          {/* Email + Send OTP Button */}
          <div className="email-otp-group">
            <input
              className={`form-control ${!emailValid ? "error" : ""}`}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailValid(true);
                setOtpSent(false);
                setOtpVerified(false);
              }}
              disabled={otpSent || otpVerified}
            />
            
            {/* Send OTP Button */}
            {!otpSent && !otpVerified && (
              <button
                type="button"
                className="btn btn-otp"
                onClick={handleSendOTP}
                disabled={otpLoading || !email}
              >
                {otpLoading ? "Sending..." : "Send OTP"}
              </button>
            )}
            
            {/* Timer / Resend */}
            {otpSent && !otpVerified && timer > 0 && (
              <span className="otp-timer">Resend in {timer}s</span>
            )}
            {otpSent && !otpVerified && timer === 0 && (
              <button
                type="button"
                className="btn btn-otp btn-resend"
                onClick={handleResendOTP}
              >
                Resend OTP
              </button>
            )}
          </div>
          {!emailValid && (
            <span className="error-msg">Enter a valid email</span>
          )}
          {otpError && !otpVerified && (
            <span className="error-msg otp-error">{otpError}</span>
          )}

          {/* OTP Input (Shows after OTP sent) */}
          {otpSent && !otpVerified && (
            <div className="otp-section">
              <input
                className={`form-control ${!otpValid ? "error" : ""}`}
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => {
                  // Only allow numbers, max 6 digits
                  const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
                  setOtp(value);
                  setOtpValid(true);
                }}
                maxLength={6}
                inputMode="numeric"
                autoComplete="one-time-code"
              />
              {!otpValid && (
                <span className="error-msg">OTP must be 6 digits</span>
              )}
              
              <button
                type="button"
                className="btn btn-verify"
                onClick={handleVerifyOTP}
                disabled={otpLoading || otp.length < 6}
              >
                {otpLoading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          )}

          {/* Password (Disabled until OTP verified) */}
          <input
            className={`form-control ${!passwordValid ? "error" : ""}`}
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordValid(true);
            }}
            disabled={!otpVerified}
          />
          {!passwordValid && (
            <span className="error-msg">Password must be at least 6 characters</span>
          )}

          {/* Register Button */}
          <button 
            className="btn btn-register"
            type="submit"
            disabled={!otpVerified || loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          
          {/* Helper text */}
          {!otpVerified && (
            <p className="helper-text">
              🔐 Verify your email first to enable registration
            </p>
          )}
          
          {/* Success indicator */}
          {otpVerified && (
            <p className="success-text">✅ Email verified! Complete your registration.</p>
          )}

        </form>

        <div className="login-signup-now">
          Already have an account? <Link to="/login">Sign in now</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;