export const C = {
  gold:"#C8A96E", goldDark:"#8B6914", beige:"#F5F0E8",
  black:"#1A1A1A", bg:"#0f0f0f", bg2:"#1A1A1A", bg3:"#212121",
  border:"rgba(200,169,110,0.18)", text:"#ffffff",
  textMuted:"rgba(255,255,255,0.45)", textFaint:"rgba(255,255,255,0.2)",
};

export function Card({ children, accent=false, style={} }) {
  return (
    <div style={{ background:C.bg2, border:`0.5px solid ${accent?C.gold:C.border}`,
      borderLeft:accent?`3px solid ${C.gold}`:undefined, borderRadius:12,
      padding:"14px 16px", marginBottom:12, ...style }}>
      {children}
    </div>
  );
}

export function SectionTitle({ children }) {
  return (
    <div style={{ fontSize:11, fontWeight:"bold", color:C.goldDark, letterSpacing:"0.1em",
      textTransform:"uppercase", marginBottom:14, paddingBottom:8,
      borderBottom:`0.5px solid ${C.border}`, fontFamily:"Verdana,sans-serif" }}>
      {children}
    </div>
  );
}

export function BtnGold({ children, onClick, disabled=false, style={} }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ background:disabled?"rgba(200,169,110,0.4)":C.gold, color:C.black, border:"none",
        borderRadius:8, padding:"9px 18px", fontSize:11, fontWeight:"bold",
        letterSpacing:"0.08em", cursor:disabled?"not-allowed":"pointer",
        fontFamily:"Verdana,sans-serif", ...style }}>
      {children}
    </button>
  );
}

export function BtnGhost({ children, onClick, style={} }) {
  return (
    <button onClick={onClick}
      style={{ background:"transparent", color:C.gold, border:`0.5px solid ${C.gold}`,
        borderRadius:8, padding:"8px 16px", fontSize:11, cursor:"pointer",
        fontFamily:"Verdana,sans-serif", letterSpacing:"0.06em", ...style }}>
      {children}
    </button>
  );
}

export function Field({ label, children }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", flex:1, minWidth:140 }}>
      <label style={{ fontSize:10, color:C.textMuted, letterSpacing:"0.08em",
        marginBottom:5, fontFamily:"Verdana,sans-serif" }}>{label}</label>
      {children}
    </div>
  );
}

export const inputStyle = {
  background:"rgba(255,255,255,0.05)", border:"0.5px solid rgba(200,169,110,0.25)",
  borderRadius:8, padding:"9px 12px", color:"#fff", fontSize:13,
  fontFamily:"Verdana,sans-serif", width:"100%", boxSizing:"border-box", outline:"none",
};

export function Badge({ children, variant="gold" }) {
  const s = {
    gold: { bg:"rgba(200,169,110,0.15)", color:C.gold,     border:"0.5px solid rgba(200,169,110,0.4)" },
    lys:  { bg:"rgba(83,74,183,0.15)",   color:"#AFA9EC",  border:"0.5px solid #AFA9EC" },
    malu: { bg:"rgba(200,169,110,0.12)", color:C.goldDark, border:`0.5px solid ${C.gold}` },
  }[variant] || {};
  return (
    <span style={{ display:"inline-block", background:s.bg, color:s.color, border:s.border,
      borderRadius:20, padding:"2px 9px", fontSize:10, fontFamily:"Verdana,sans-serif",
      fontWeight:"bold", letterSpacing:"0.04em" }}>
      {children}
    </span>
  );
}

export function ReadonlyNotice({ children }) {
  return (
    <div style={{ background:"rgba(255,255,255,0.03)", border:"0.5px dashed rgba(255,255,255,0.15)",
      borderRadius:8, padding:"10px 14px", fontSize:11, color:"rgba(255,255,255,0.35)",
      fontFamily:"Verdana,sans-serif", marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
      🔒 {children}
    </div>
  );
}

export function AlertInfo({ children }) {
  return (
    <div style={{ background:"rgba(200,169,110,0.08)", border:`0.5px solid ${C.border}`,
      borderRadius:8, padding:"10px 14px", fontSize:12, color:C.gold,
      fontFamily:"Verdana,sans-serif", marginBottom:14 }}>
      ℹ️ {children}
    </div>
  );
}

export function StatBox({ num, label }) {
  return (
    <div style={{ background:C.bg3, borderRadius:10, padding:"12px 14px", textAlign:"center" }}>
      <div style={{ fontSize:20, fontWeight:"bold", color:C.gold, fontFamily:"Verdana,sans-serif" }}>{num}</div>
      <div style={{ fontSize:10, color:C.textMuted, fontFamily:"Verdana,sans-serif", marginTop:2, letterSpacing:"0.04em" }}>{label}</div>
    </div>
  );
}

export function Spinner() {
  return (
    <div style={{ textAlign:"center", padding:"40px 0", color:"rgba(200,169,110,0.5)",
      fontSize:13, fontFamily:"Verdana,sans-serif", letterSpacing:"0.08em" }}>
      carregando...
    </div>
  );
}

export function ErrorMsg({ msg }) {
  return (
    <div style={{ background:"rgba(220,80,60,0.1)", border:"0.5px solid rgba(220,80,60,0.3)",
      borderRadius:8, padding:"10px 14px", color:"#f88", fontSize:12,
      fontFamily:"Verdana,sans-serif", marginBottom:12 }}>
      ⚠️ {msg}
    </div>
  );
}

export function todayStr() {
  return new Date().toLocaleDateString("pt-BR");
}

export function fmtDate(iso) {
  if (!iso) return todayStr();
  const [y,m,d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
