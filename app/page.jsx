"use client";
import { useState } from "react";
import AppShell from "./components/AppShell";

const USERS = {
  lys:  { password: "36166255Senha!", label: "Lys · VI.P & NOUS",   role: "lys"  },
  malu: { password: "951753LeSanMa",  label: "Leticia · Malu Modas", role: "malu" },
};

export default function Page() {
  const [loggedUser, setLoggedUser] = useState(null);
  const [user, setUser]   = useState("");
  const [pass, setPass]   = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const u = USERS[user.trim().toLowerCase()];
      if (u && u.password === pass) {
        setLoggedUser(u);
        setError("");
      } else {
        setError("Usuário ou senha incorretos.");
      }
      setLoading(false);
    }, 600);
  }

  if (loggedUser) return <AppShell user={loggedUser} onLogout={() => setLoggedUser(null)} />;

  return (
    <div style={{
      minHeight: "100vh", background: "#0f0f0f",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Verdana, sans-serif", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `radial-gradient(ellipse at 20% 50%, rgba(200,169,110,0.07) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 20%, rgba(200,169,110,0.04) 0%, transparent 50%)`,
        pointerEvents: "none",
      }}/>

      <div style={{ width: "100%", maxWidth: 400, padding: "0 24px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 56, height: 56,
            border: "1px solid rgba(200,169,110,0.4)", borderRadius: "50%", marginBottom: 20,
          }}>
            <span style={{ color: "#C8A96E", fontSize: 22, fontWeight: "bold" }}>M</span>
          </div>
          <div style={{ color: "#C8A96E", fontSize: 13, letterSpacing: "0.2em", fontWeight: "bold", marginBottom: 4 }}>
            EU SOU MALU
          </div>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, letterSpacing: "0.12em" }}>
            VI.P & NOUS · GESTÃO DE COMUNICAÇÃO
          </div>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "0.5px solid rgba(200,169,110,0.2)",
          borderRadius: 16, padding: "32px 28px",
        }}>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, letterSpacing: "0.1em", marginBottom: 24, textAlign: "center" }}>
            ACESSO RESTRITO
          </div>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", color: "rgba(255,255,255,0.35)", fontSize: 10, letterSpacing: "0.1em", marginBottom: 6 }}>USUÁRIO</label>
              <input
                type="text" value={user} onChange={e => setUser(e.target.value)}
                autoComplete="username"
                style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(200,169,110,0.25)", borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 13, fontFamily: "Verdana, sans-serif", outline: "none" }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", color: "rgba(255,255,255,0.35)", fontSize: 10, letterSpacing: "0.1em", marginBottom: 6 }}>SENHA</label>
              <input
                type="password" value={pass} onChange={e => setPass(e.target.value)}
                autoComplete="current-password"
                style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(200,169,110,0.25)", borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 13, fontFamily: "Verdana, sans-serif", outline: "none" }}
              />
            </div>
            {error && (
              <div style={{ background: "rgba(220,80,60,0.12)", border: "0.5px solid rgba(220,80,60,0.35)", borderRadius: 8, padding: "8px 12px", color: "#f88", fontSize: 12, marginBottom: 16, fontFamily: "Verdana, sans-serif" }}>
                {error}
              </div>
            )}
            <button type="submit" disabled={loading} style={{
              width: "100%", background: loading ? "rgba(200,169,110,0.4)" : "#C8A96E",
              border: "none", borderRadius: 8, padding: "12px",
              color: "#1A1A1A", fontSize: 12, fontWeight: "bold", letterSpacing: "0.1em",
              cursor: loading ? "not-allowed" : "pointer", fontFamily: "Verdana, sans-serif",
            }}>
              {loading ? "VERIFICANDO..." : "ENTRAR"}
            </button>
          </form>
        </div>

        <div style={{ textAlign: "center", marginTop: 24, color: "rgba(255,255,255,0.15)", fontSize: 10, letterSpacing: "0.08em" }}>
          © 2026 VI.P & NOUS Consultoria · Malu Modas
        </div>
      </div>
    </div>
  );
}
