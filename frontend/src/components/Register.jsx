import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="login">

      <div className="holder">

        <h1>Sign Up</h1>

        <form>

          <input
            className="form-control"
            type="text"
            placeholder="Full Name"
          />

          <input
            className="form-control"
            type="email"
            placeholder="Email Address"
          />

          <input
            className="form-control"
            type="password"
            placeholder="Password"
          />

          <input
            className="form-control"
            type="password"
            placeholder="Confirm Password"
          />

          <button className="btn">
            Sign Up
          </button>

        </form>

        <div className="login-signup-now">
          Already have an account?{" "}
          <Link to="/login">Sign in now</Link>
        </div>

      </div>

    </div>
  );
};

export default Register;