import { useState } from "react";
import { useAuth } from "../features/hooks/useAuth";
import "../features/style/authForms.scss";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate();
  const { handleLogin, loading , error} = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // simple validation
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
  if(loading){
    return (<main><h1>Loading...</h1></main>)
  }
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
            onChange={(e) => setEmail(e.target.value)}
          />

          {!emailValid && (
            <p className="text-danger">Email is invalid</p>
          )}

          <input
            className="form-control"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {!passwordValid && (
            <p className="text-danger">
              Password must be at least 6 characters
            </p>
          )}

          <button className="btn">
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