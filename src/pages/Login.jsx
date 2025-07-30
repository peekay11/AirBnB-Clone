import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Nav from "../components/Nav/Nav";
import "./Login.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", password: "", confirmPassword: "" });
  const navigate = useNavigate();
  const location = useLocation();
  const isHostLogin = new URLSearchParams(location.search).get('host') === 'true';

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setForm({ username: "", password: "", confirmPassword: "" });
  };

  const validateEmail = (email) => {
    // Simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password || (!isLogin && !form.confirmPassword)) {
      toast.error("Please fill in all the fields.");
      return;
    }
    if (!validateEmail(form.username)) {
      toast.error("Invalid email address.");
      return;
    }
    if (!isLogin && form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      if (isLogin) {
        // Login: check credentials
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users?username=${form.username}`);
        const users = await res.json();
        if (users.length === 0) {
          toast.error("Account does not exist. Please sign up.");
          return;
        }
        if (users[0].password !== form.password) {
          toast.error("Incorrect password.");
          return;
        }
        localStorage.setItem('airbnb_user', JSON.stringify(users[0]));
        toast.success("Login successful!");
        setTimeout(() => {
          navigate('/');
        }, 1200);
      } else {
        // Signup: check if user exists
        const res = await fetch(`http://localhost:4000/users?username=${form.username}`);
        const users = await res.json();
        if (users.length > 0) {
          toast.error("Account already exists. Please log in.");
          return;
        }
        // Add user
        const newUser = { username: form.username, password: form.password };
        await fetch(`${import.meta.env.VITE_API_URL}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser)
        });
        localStorage.setItem('airbnb_user', JSON.stringify(newUser));
        toast.success("Sign up successful!");
        setTimeout(() => {
          setIsLogin(true);
        }, 1200);
      }
    } catch {
      toast.error("Server error. Please try again.");
    }
  };

  return (
    <>
      <Nav isLogin={true} user={JSON.parse(localStorage.getItem('airbnb_user') || '{}')} />

      <main className="login-container">
        <div className="login-box">
          <div className="welcome-text">{isHostLogin ? 'Welcome to Airbnb Hosts' : 'Welcome to Airbnb'}</div>
          <h1 className="login-title">{isLogin ? "Login" : "Sign Up"}</h1>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                placeholder="Enter your email"
                value={form.username}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            {!isLogin ? (
              <div className="form-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            ) : null}

            <div className="form-footer">
              <a href="#" className="forgot-link" style={{ marginBottom: '0.75rem', display: 'block' }}>
                {isLogin ? "Forgot Password?" : "\u00A0"}
              </a>
              <button type="submit" className="login-button">
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </div>
          </form>

          <p className="toggle-text">
            {isLogin ? "Don't have an account?" : "Already have an account?"} {" "}
            <span className="toggle-link" onClick={toggleMode}>
              {isLogin ? "Sign Up" : "Login"}
            </span>
          </p>
        </div>
      </main>
      <ToastContainer position="bottom-right" style={{ marginBottom: '3rem' }} />
    </>
  );
}
