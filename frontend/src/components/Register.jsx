import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/hooks/useAuth";
import { useState } from "react";

const Register = () => {
  const navigate = useNavigate();
  const { handleRegister, loading } = useAuth();

  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  // Validation states
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [touched, setTouched] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (formError) setFormError("");
  };

  // Handle blur for validation
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  // Validate individual field
  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        if (!value.trim()) return "Full name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        return "";
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return "";
      default:
        return "";
    }
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    ["fullName", "email", "password"].forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Mark all fields as touched
    setTouched({ fullName: true, email: true, password: true });

    // Validate before submit
    if (!validateForm()) {
      return;
    }

    try {
      const success = await handleRegister({
        username: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      if (success) {
        navigate("/");
      } else {
        setFormError("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setFormError("Something went wrong. Please try again.");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="auth auth--loading">
        <div className="auth__loader">
          <div className="auth__spinner" />
          <p>Creating your account...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="auth auth--register">
      
      {/* Background Gradient */}
      <div className="auth__background" />

      <div className="auth__container">


        {/* Register Form */}
        <form className="auth__form" onSubmit={handleSubmit} noValidate>
          
          {/* Form Error Alert */}
          {formError && (
            <div className="auth__alert auth__alert--error" role="alert">
              ⚠️ {formError}
            </div>
          )}

          {/* Full Name */}
          <div className="auth__field">
            <label htmlFor="fullName" className="auth__label">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className={`auth__input ${touched.fullName && errors.fullName ? "auth__input--error" : ""}`}
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="name"
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
            />
            {touched.fullName && errors.fullName && (
              <span id="fullName-error" className="auth__error" role="alert">
                {errors.fullName}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="auth__field">
            <label htmlFor="email" className="auth__label">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`auth__input ${touched.email && errors.email ? "auth__input--error" : ""}`}
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {touched.email && errors.email && (
              <span id="email-error" className="auth__error" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="auth__field">
            <label htmlFor="password" className="auth__label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className={`auth__input ${touched.password && errors.password ? "auth__input--error" : ""}`}
              placeholder="•••••••• (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {touched.password && errors.password && (
              <span id="password-error" className="auth__error" role="alert">
                {errors.password}
              </span>
            )}
            
            {/* Password Strength Hint */}
            <p className="auth__hint">
              Use at least 6 characters with a mix of letters & numbers
            </p>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="auth__btn auth__btn--primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="auth__btn-spinner" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          {/* Terms */}
          <p className="auth__terms">
            By registering, you agree to our{" "}
            <Link to="/terms">Terms of Service</Link> and{" "}
            <Link to="/privacy">Privacy Policy</Link>
          </p>

        </form>

        {/* Login Link */}
        <div className="auth__switch">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth__link">
              Sign in instead
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
};

export default Register;