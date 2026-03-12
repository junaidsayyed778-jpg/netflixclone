import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../features/hooks/useAuth";


const Login = () => {
  const navigate = useNavigate();
  const { handleLogin, loading, error } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation (your original logic)
    const isEmailValid = email.includes("@");
    const isPasswordValid = password.length >= 6;

    setEmailValid(isEmailValid);
    setPasswordValid(isPasswordValid);

    if (!isEmailValid || !isPasswordValid) return;

    const success = await handleLogin({ email, password });

    if (success) {
      navigate("/");
    }
  };

  // Loading state with unified spinner
  if (loading) {
    return (
      <main className="auth auth--loading">
        <div className="auth__spinner" />
        <p>Signing in...</p>
      </main>
    );
  }

  return (
    <main className="auth">
      <div className="auth__container">
        
        {/* Header */}
        <div className="auth__header">
          <h1>Sign In</h1>
        </div>

        {/* Global Error Alert */}
        {error && (
          <div className="auth__alert" role="alert">
            ⚠️ {error}
          </div>
        )}

        {/* Login Form */}
        <form className="auth__form" onSubmit={handleSubmit}>
          
          {/* Email Field */}
          <div className="auth__field">
            <label htmlFor="email" className="auth__label">Email</label>
            <input
              id="email"
              type="email"
              className={`auth__input ${!emailValid ? "auth__input--error" : ""}`}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailValid(true);
              }}
              autoComplete="email"
            />
            {!emailValid && (
              <span className="auth__error">Email is invalid</span>
            )}
          </div>

          {/* Password Field */}
          <div className="auth__field">
            <label htmlFor="password" className="auth__label">Password</label>
            <input
              id="password"
              type="password"
              className={`auth__input ${!passwordValid ? "auth__input--error" : ""}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordValid(true);
              }}
              autoComplete="current-password"
            />
            {!passwordValid && (
              <span className="auth__error">
                Password must be at least 6 characters
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="auth__btn" disabled={loading}>
            Sign In
          </button>

        </form>

        {/* Sign Up Link */}
        <div className="auth__footer">
          <p>
            New to MovieApp?{" "}
            <Link to="/register" className="auth__link">
              Sign up now
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
};

export default Login;