import { useState } from "react";
import { useAuth } from "../features/hooks/useAuth";
import "../features/style/authForms.scss";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate();
  const { handleLogin, error } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);

  const validate = (field, value) => {

    switch (field) {

      case "email":
        return value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);

      case "password":
        return value.length >= 6;

      default:
        return true;
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const isEmailValid = validate("email", email);
    const isPasswordValid = validate("password", password);

    setEmailValid(isEmailValid);
    setPasswordValid(isPasswordValid);

    if (!isEmailValid || !isPasswordValid) return;

    try {

      await handleLogin(email, password);

      navigate("/dashboard");

    } catch {}

  };

  return (

    <div className="login">

      <div className="holder">

        <h1 className="text-white">Sign In</h1>

        <form onSubmit={handleSubmit}>

          <input
            className="form-control"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          {!emailValid && (
            <p className="text-danger">Email is invalid</p>
          )}

          <input
            className="form-control"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          {!passwordValid && (
            <p className="text-danger">
              Password must be at least 6 characters
            </p>
          )}

          <button className="btn btn-danger btn-block">
            Sign In
          </button>

        </form>

        {error && (
          <p className="text-danger">{error}</p>
        )}

        <div className="login-signup-now">
          New to Netflix?{" "}
          <Link to="/register">Sign up now</Link>
        </div>

      </div>

    </div>

  );
};

export default Login;
