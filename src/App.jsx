import { useEffect, useState } from "react";
import "./App.css";

const API = "https://api.freeapi.app/api/v1/users";

export default function App() {
  const [mode, setMode] = useState("login"); // login | register | profile
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [user, setUser] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= GET CURRENT USER =================
  const getCurrentUser = async () => {
    try {
      const res = await fetch(`${API}/current-user`, {
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.data);
        setMode("profile");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  // ================= REGISTER =================
  const register = async () => {
    try {
      setLoading(true);
      setMsg("");

      if (!form.email || !form.username || !form.password) {
        throw new Error("All fields required");
      }

      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          username: form.username.trim(),
          password: form.password,
          role: "ADMIN",
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setMsg("✅ Registered successfully");
      setMode("login");
    } catch (err) {
      setMsg("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGIN =================
  const login = async () => {
    try {
      setLoading(true);
      setMsg("");

      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: form.username,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setMsg("✅ Login successful");
      getCurrentUser();
    } catch (err) {
      setMsg("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGOUT =================
  const logout = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Logout failed");

      setUser(null);
      setMode("login");
      setMsg("👋 Logged out");
    } catch (err) {
      setMsg("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="box">
        <h1>Auth System</h1>
        <p className="sub">FreeAPI Authentication</p>

        {msg && <div className="msg">{msg}</div>}

        {/* ================= PROFILE ================= */}
        {mode === "profile" && user && (
          <div>
            <h3>Welcome 👋</h3>
            <p><b>Username:</b> {user.username}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Role:</b> {user.role}</p>

            <button onClick={logout} disabled={loading}>
              {loading ? "Logging out..." : "Logout"}
            </button>
          </div>
        )}

        {/* ================= LOGIN ================= */}
        {mode === "login" && (
          <>
            <label>Username</label>
            <input name="username" onChange={handleChange} />

            <label>Password</label>
            <input type="password" name="password" onChange={handleChange} />

            <button onClick={login} disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </button>

            <p className="signup">
              No account?{" "}
              <span onClick={() => setMode("register")}>Register</span>
            </p>
          </>
        )}

        {/* ================= REGISTER ================= */}
        {mode === "register" && (
          <>
            <label>Email</label>
            <input name="email" onChange={handleChange} />

            <label>Username</label>
            <input name="username" onChange={handleChange} />

            <label>Password</label>
            <input type="password" name="password" onChange={handleChange} />

            <button onClick={register} disabled={loading}>
              {loading ? "Creating..." : "Register"}
            </button>

            <button className="link" onClick={() => setMode("login")}>
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}