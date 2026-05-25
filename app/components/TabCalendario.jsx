"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { SectionTitle, BtnGold, Field, ReadonlyNotice, AlertInfo, inputStyle, C, Spinner, ErrorMsg } from "./ui";

const MONTHS      = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const MONTHS_SHORT= ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const SCOPES      = ["Brasil","Adamantina/SP","Mundial","Malu Modas"];
const SCOPE_COLOR = {
  "Brasil":        { bg:"rgba(34,180,100,0.12)",   color:"#4caf7a", border:"rgba(34,180,100,0.3)"    },
  "Adamantina/SP": { bg:"rgba(200,169,110,0.12)",  color:"#C8A96E", border:"rgba(200,169,110,0.3)"   },
  "Mundial":       { bg:"rgba(80,140,220,0.12)",   color:"#7aaae8", border:"rgba(80,140,220,0.3)"    },
  "Malu Modas":    { bg:"rgba(139,105,20,0.18)",   color:"#C8A96E", border:"rgba(200,169,110,0.5)"   },
};

export default function TabCalendario({ user }) {
  const [dates,   setDates]   = useState([]);
  const [selMonth,setSelMonth]= useState(new Date().getMonth());
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [err,     setErr]     = useState("");
  const [form,    setForm]    = useState({ month:new Date().getMonth(), day:"", name:"", scope:"Brasil", rel:"" });

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("malu_calendario")
      .select("*")
      .order("day", { ascending:true });
    if (error) setErr(error.message);
    else setDates(data || []);
    setLoading(false);
  }

  useEffect(()=>{ load(); },[]);

  async function add() {
    if (!form.name || !form.day) { alert("Preencha o dia e o nome."); return; }
    setSaving(true);
    const { error } = await supabase.from("malu_calendario").insert({
      month: parseInt(form.month),
      day:   String(form.day).padStart(2,"0"),
      name:  form.name,
      scope: form.scope,
      rel:   form.rel,
    });
    if (error) setErr(error.message);
    else { setForm({month:selMonth,day:"",name:"",scope:"Brasil",rel:""}); await load(); }
    setSaving(false);
  }

  async function remove(id) {
    if (!confirm("Remover esta data?")) return;
    await supabase.from("malu_calendario").delete().eq("id",id);
    await load();
  }

  const visible = dates.filter(d=>d.month===selMonth).sort((a,b)=>parseInt(a.day)-parseInt(b.day));
  const canEdit = user.role==="lys";

  return (
    <div>
      <SectionTitle>Calendário Editorial 2026</SectionTitle>
      <AlertInfo>Datas estratégicas para Adamantina/SP, Brasil e Mundo — integradas ao planejamento @eusoumalu.modas</AlertInfo>

      {/* Month selector */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:20 }}>
        {MONTHS_SHORT.map((m,i)=>(
          <button key={i} onClick={()=>setSelMonth(i)} style={{
            background:selMonth===i?C.gold:"transparent",
            color:selMonth===i?C.black:"rgba(255,255,255,0.45)",
            border:`0.5px solid ${selMonth===i?C.gold:"rgba(255,255,255,0.15)"}`,
            borderRadius:20, padding:"5px 12px", fontSize:11,
            cursor:"pointer", fontFamily:"Verdana,sans-serif",
            fontWeight:selMonth===i?"bold":"normal", transition:"all 0.15s",
          }}>{m}</button>
        ))}
      </div>

      <div style={{ marginBottom:8, fontSize:12, color:C.gold, fontFamily:"Verdana,sans-serif", fontWeight:"bold", letterSpacing:"0.06em" }}>
        {MONTHS[selMonth].toUpperCase()} · {visible.length} {visible.length===1?"data":"datas"}
      </div>

      {err && <ErrorMsg msg={err}/>}
      {loading ? <Spinner/> : (
        <>
          {visible.length===0 && (
            <div style={{ color:"rgba(255,255,255,0.25)", fontSize:13, padding:"20px 0", fontFamily:"Verdana,sans-serif" }}>
              Nenhuma data cadastrada para {MONTHS[selMonth]}.
            </div>
          )}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:10, marginBottom:20 }}>
            {visible.map(d => {
              const sc = SCOPE_COLOR[d.scope] || SCOPE_COLOR["Brasil"];
              return (
                <div key={d.id} style={{ background:C.bg3, borderRadius:10, padding:"12px 14px", borderLeft:`3px solid ${C.gold}`, position:"relative" }}>
                  <div style={{ fontSize:10, color:C.goldDark, letterSpacing:"0.1em", fontWeight:"bold", fontFamily:"Verdana,sans-serif", textTransform:"uppercase", marginBottom:2 }}>{MONTHS[d.month]}</div>
                  <div style={{ fontSize:26, fontWeight:"bold", color:"#fff", fontFamily:"Verdana,sans-serif", lineHeight:1 }}>{d.day}</div>
                  <div style={{ fontSize:13, color:"#fff", fontFamily:"Verdana,sans-serif", margin:"4px 0 4px" }}>{d.name}</div>
                  <div style={{ display:"inline-block", background:sc.bg, color:sc.color, border:`0.5px solid ${sc.border}`, borderRadius:20, padding:"2px 8px", fontSize:10, fontFamily:"Verdana,sans-serif", marginBottom:4 }}>{d.scope}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", fontFamily:"Verdana,sans-serif", lineHeight:1.4 }}>{d.rel}</div>
                  {canEdit && (
                    <button onClick={()=>remove(d.id)} style={{ position:"absolute", top:8, right:8, background:"transparent", border:"none", color:"rgba(255,80,80,0.4)", cursor:"pointer", fontSize:12 }}>✕</button>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {!canEdit && <ReadonlyNotice>Calendário gerenciado pela VI.P & NOUS. Visualização disponível para Malu Modas.</ReadonlyNotice>}

      {canEdit && (
        <>
          <SectionTitle>Adicionar Data ao Calendário</SectionTitle>
          <div style={{ background:C.bg2, border:`0.5px solid ${C.border}`, borderRadius:12, padding:"14px 16px" }}>
            <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:10 }}>
              <Field label="MÊS">
                <select value={form.month} onChange={e=>setForm({...form,month:e.target.value})} style={inputStyle}>
                  {MONTHS.map((m,i)=><option key={i} value={i}>{m}</option>)}
                </select>
              </Field>
              <Field label="DIA">
                <input type="number" min="1" max="31" value={form.day} onChange={e=>setForm({...form,day:e.target.value})} placeholder="Ex: 15" style={inputStyle}/>
              </Field>
              <Field label="ESCOPO">
                <select value={form.scope} onChange={e=>setForm({...form,scope:e.target.value})} style={inputStyle}>
                  {SCOPES.map(s=><option key={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:14 }}>
              <Field label="NOME DA DATA">
                <input type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Ex: Dia dos Namorados" style={inputStyle}/>
              </Field>
              <Field label="RELEVÂNCIA PARA A MALU">
                <input type="text" value={form.rel} onChange={e=>setForm({...form,rel:e.target.value})} placeholder="Ex: Curadoria de looks para presentear" style={inputStyle}/>
              </Field>
            </div>
            <BtnGold onClick={add} disabled={saving}>{saving?"Salvando...":"Adicionar Data"}</BtnGold>
          </div>
        </>
      )}
    </div>
  );
}
