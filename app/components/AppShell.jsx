"use client";
import { useState } from "react";
import TabGrupo      from "./TabGrupo";
import TabCalendario from "./TabCalendario";
import TabEncontros  from "./TabEncontros";
import TabPecas      from "./TabPecas";

const TABS = [
  { id:"grupo",      label:"Grupo Amigas",       icon:"👥" },
  { id:"calendario", label:"Calendário Editorial",icon:"📅" },
  { id:"encontros",  label:"Resumo Encontros",    icon:"📝" },
  { id:"pecas",      label:"Peças Promocionais",  icon:"🏷️" },
];

const C = { gold:"#C8A96E", goldDark:"#8B6914" };

export default function AppShell({ user, onLogout }) {
  const [active, setActive] = useState("grupo");

  return (
    <div style={{ minHeight:"100vh", background:"#0f0f0f", fontFamily:"Verdana,sans-serif", color:"#fff" }}>
      {/* Header */}
      <header style={{
        background:"#1A1A1A", borderBottom:"0.5px solid rgba(200,169,110,0.2)",
        padding:"0 20px", display:"flex", alignItems:"center",
        justifyContent:"space-between", height:56,
        position:"sticky", top:0, zIndex:50,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:32, height:32, border:"1px solid rgba(200,169,110,0.5)", borderRadius:"50%",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:C.gold, fontSize:13, fontWeight:"bold" }}>M</span>
          </div>
          <div>
            <div style={{ color:C.gold, fontSize:11, letterSpacing:"0.15em", fontWeight:"bold" }}>EU SOU MALU</div>
            <div style={{ color:"rgba(255,255,255,0.3)", fontSize:9, letterSpacing:"0.08em" }}>VI.P & NOUS · Gestão de Comunicação</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{
            background:user.role==="lys"?"rgba(83,74,183,0.2)":"rgba(200,169,110,0.15)",
            border:`0.5px solid ${user.role==="lys"?"rgba(175,169,236,0.5)":"rgba(200,169,110,0.5)"}`,
            borderRadius:20, padding:"4px 12px", fontSize:11,
            color:user.role==="lys"?"#AFA9EC":C.gold, letterSpacing:"0.06em",
          }}>{user.label}</div>
          <button onClick={onLogout} style={{
            background:"transparent", border:"0.5px solid rgba(255,255,255,0.15)",
            borderRadius:6, padding:"5px 12px", color:"rgba(255,255,255,0.4)",
            fontSize:11, cursor:"pointer", fontFamily:"Verdana,sans-serif", letterSpacing:"0.06em",
          }}>SAIR</button>
        </div>
      </header>

      {/* Tabs */}
      <nav style={{ background:"#141414", borderBottom:"0.5px solid rgba(200,169,110,0.12)",
        display:"flex", overflowX:"auto", padding:"0 16px" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)} style={{
            background:"transparent", border:"none",
            borderBottom:active===t.id?"2px solid #C8A96E":"2px solid transparent",
            color:active===t.id?"#fff":"rgba(255,255,255,0.35)",
            padding:"12px 16px 10px", fontSize:11,
            fontWeight:active===t.id?"bold":"normal",
            cursor:"pointer", fontFamily:"Verdana,sans-serif",
            letterSpacing:"0.05em", whiteSpace:"nowrap", transition:"all 0.15s",
          }}>
            <span style={{ marginRight:6 }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </nav>

      <main style={{ maxWidth:1100, margin:"0 auto", padding:"24px 20px" }}>
        {active==="grupo"      && <TabGrupo      user={user}/>}
        {active==="calendario" && <TabCalendario user={user}/>}
        {active==="encontros"  && <TabEncontros  user={user}/>}
        {active==="pecas"      && <TabPecas      user={user}/>}
      </main>
    </div>
  );
}
