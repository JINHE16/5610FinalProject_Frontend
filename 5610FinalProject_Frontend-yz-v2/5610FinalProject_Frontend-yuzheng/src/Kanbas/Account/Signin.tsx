import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";
import * as client from "./client";

interface Credentials {
  username: string;
  password: string;
}

export default function Signin() {
  const [credentials, setCredentials] = useState<Credentials>({
    username: "",
    password: ""
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signin = async () => {
    try {
      if (!credentials.username || !credentials.password) {
        alert("Please enter both username and password");
        return;
      }

      const user = await client.signin(credentials);
      if (!user) {
        throw new Error("No user returned from server");
      }
      dispatch(setCurrentUser(user));
      navigate("/Kanbas/Dashboard");
    } catch (error: any) {
      console.error("Signin failed:", error.response?.data?.message || error.message);
      alert("Signin failed: " + (error.response?.data?.message || "Please try again"));
    }
  };

  return (
    <div id="wd-signin-screen" className="row container">
      <div className="col-md-6 col-lg-4">
        <h1>Sign in</h1>
        <input
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          className="form-control mb-2"
          placeholder="username"
          id="wd-username"
        />
        <input
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          className="form-control mb-2"
          placeholder="password"
          type="password"
          id="wd-password"
        />
        <button
          onClick={signin}
          id="wd-signin-btn"
          className="btn btn-primary w-100"
        >
          Sign in
        </button>
        <Link id="wd-signup-link" to="/Kanbas/Account/Signup">
          Sign up
        </Link>
      </div>
    </div>
  );
}