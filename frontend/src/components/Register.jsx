import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/hooks/useAuth";
import { useState } from "react";

const Register = () => {
  const navigate = useNavigate();
  const { handleRegister, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [emailValid, setEmailValid] = useState(true);
  const [usernameValid, setUsernameValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEmailValid = email.includes("@");
    const isUsernameValid = username.trim() !== "";
    const isPasswordValid = password.length >= 6;

    setEmailValid(isEmailValid);
    setUsernameValid(isUsernameValid);
    setPasswordValid(isPasswordValid);

    if (!isEmailValid || !isPasswordValid || !isUsernameValid) return;

    const success = await handleRegister({ email, username, password });

    if (success) {
      navigate("/"); // ✅ Only navigate here
    }
  };

  if (loading) {
    return (
      <main>
        <h1>Loading...</h1>
      </main>
    );
  }

  return (
    <div className="login">
      <div className="holder">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <input
            className="form-control"
            type="text"
            placeholder="Full Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="form-control"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="form-control"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn">Sign Up</button>
        </form>

        <div className="login-signup-now">
          Already have an account? <Link to="/login">Sign in now</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
