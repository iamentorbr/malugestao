"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { SectionTitle, BtnGold, BtnGhost, Field, Badge, ReadonlyNotice, inputStyle, C, fmtDate, todayStr, Spinner, ErrorMsg } from "./ui";

const TIPOS = ["Planejamento (Segunda)","Entrega e Análise (Sexta)","Onboarding","Reunião Extraordinária","Sessão de Ajuste"];

export default function TabEncontros({ user }) {
  const [encontros, setEncontros] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [err,       setErr]       = useState("");
  const [expanded,  setExpanded]  = useState(null);
  const [form, setForm] = useState({ data:"", tipo:"Planejamento (Segunda)", titulo:"", resumo:"", tags:"" });

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("malu_encontros")
      .select("*")
      .order("id", { ascending:false });
    if (error) setErr(error.message);
    else setEncontros(data || []);
    setLoading(false);
  }

  useEffect(()=>{ load(); },[]);

  async function add() {
    if (!form.titulo || !form.resumo) { alert("Preencha o título e o resumo."); return; }
    setSaving(true);
    const { error } = await supabase.from("malu_encontros").insert({
      data:   form.data ? fmtDate(form.data) : todayStr(),
      tipo:   form.tipo,
      titulo: form.titulo,
      resumo: form.resumo,
      tags:   form.tags ? form.tags.split(",").map(t=>t.trim()).filter(Boolean) : [],
      autor:  user.role,
    });
    if (error) setErr(error.message);
    else { setForm({ data:"", tipo:"Planejamento (Segunda)", titulo:"", resumo:"", tags:"" }); await load(); }
    setSaving(false);
  }

  async function remove(id) {
    if (!confirm("Remover este encontro?")) return;
    await supabase.from("malu_encontros").delete().eq("id",id);
    await load();
  }

  function pdfHTML(title, bodyHTML) {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>${title}</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:Verdana,sans-serif;background:#fff;color:#1A1A1A;padding:60px 70px}
      .brand{font-size:11px;letter-spacing:.2em;color:#8B6914;font-weight:bold;margin-bottom:4px}
      .brand-sub{font-size:10px;letter-spacing:.1em;color:#aaa}
      .sep{border:none;border-top:2px solid #C8A96E;margin:18px 0 28px}
      h1{font-size:24px;font-weight:bold;color:#1A1A1A;margin-bottom:6px}
      .meta{font-size:11px;color:#888;letter-spacing:.06em;margin-bottom:8px}
      .badge{display:inline-block;background:#F5F0E8;color:#8B6914;border-radius:20px;padding:3px 10px;font-size:10px;margin-right:5px;font-weight:bold}
      .label{font-size:10px;letter-spacing:.12em;color:#C8A96E;font-weight:bold;text-transform:uppercase;margin:22px 0 8px;border-bottom:.5px solid #e8e0d0;padding-bottom:6px}
      .resumo{font-size:14px;line-height:1.9;color:#333}
      .footer{margin-top:60px;border-top:.5px solid #e8e0d0;padding-top:14px;font-size:10px;color:#bbb;display:flex;justify-content:space-between}
      @media print{body{padding:40px 50px}}
    </style></head><body>${bodyHTML}
    <script>window.onload=()=>{window.print()}<\/script></body></html>`;
  }

  function exportOne(enc) {
    const w = window.open("","_blank");
    if (!w) return;
    const body = `
      <div class="brand">EU SOU MALU · MALU MODAS</div>
      <div class="brand-sub">VI.P &amp; NOUS CONSULTORIA · GESTÃO DE COMUNICAÇÃO</div>
      <hr class="sep"/>
      <div class="meta">${enc.tipo} · ${enc.data}</div>
      <h1>${enc.titulo}</h1>
      <div style="margin:8px 0">${(enc.tags||[]).map(t=>`<span class="badge">${t}</span>`).join("")}</div>
      <div class="label">Resumo do Encontro</div>
      <div class="resumo">${enc.resumo.replace(/\n/g,"<br/>")}</div>
      <div class="footer">
        <span>VI.P &amp; NOUS · vipinous.com.br</span>
        <span>Gerado em ${new Date().toLocaleDateString("pt-BR")}</span>
      </div>`;
    w.document.write(pdfHTML(enc.titulo, body));
    w.document.close();
  }

  function exportAll() {
    const w = window.open("","_blank");
    if (!w) return;
    const body = `
      <div class="brand">VI.P &amp; NOUS CONSULTORIA</div>
      <h1 style="font-size:28px;margin:16px 0 6px">Resumo Completo de Encontros<br/>Malu Modas 2026</h1>
      <div class="meta">${encontros.length} encontros registrados · Gerado em ${new Date().toLocaleDateString("pt-BR")}</div>
      <hr class="sep"/>
      ${encontros.map(e=>`
        <div style="margin-bottom:40px;page-break-inside:avoid;border-bottom:.5px solid #e8e0d0;padding-bottom:30px">
          <div class="meta">${e.tipo} · ${e.data}</div>
          <h1 style="font-size:18px;margin:4px 0 8px">${e.titulo}</h1>
          <div>${(e.tags||[]).map(t=>`<span class="badge">${t}</span>`).join("")}</div>
          <div class="label">Resumo</div>
          <div class="resumo">${e.resumo.replace(/\n/g,"<br/>")}</div>
        </div>`).join("")}
      <div class="footer"><span>VI.P &amp; NOUS · vipinous.com.br · Malu Modas / LETS MODA LTDA</span></div>`;
    w.document.write(pdfHTML("Resumo Completo de Encontros — Malu Modas 2026", body));
    w.document.close();
  }

  const canEdit = user.role === "lys";

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16, flexWrap:"wrap", gap:10 }}>
        <SectionTitle>Resumos dos Encontros — Lys × Leticia</SectionTitle>
        {!loading && encontros.length>0 && (
          <BtnGhost onClick={exportAll} style={{ fontSize:11, padding:"6px 14px" }}>Exportar Todos em PDF</BtnGhost>
        )}
      </div>

      {err && <ErrorMsg msg={err}/>}
      {loading ? <Spinner/> : encontros.map(enc=>(
        <div key={enc.id} style={{ background:C.bg3, border:`0.5px solid ${C.border}`, borderRadius:12, padding:"14px 16px", marginBottom:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10, flexWrap:"wrap" }}>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:"bold", fontSize:14, color:"#fff", fontFamily:"Verdana,sans-serif", marginBottom:2 }}>{enc.titulo}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", fontFamily:"Verdana,sans-serif", marginBottom:8 }}>{enc.tipo} · {enc.data}</div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <BtnGhost onClick={()=>exportOne(enc)} style={{ fontSize:11, padding:"5px 12px" }}>PDF</BtnGhost>
              {canEdit && <button onClick={()=>remove(enc.id)} style={{ background:"transparent", border:"none", color:"rgba(255,80,80,0.4)", cursor:"pointer", fontSize:11, fontFamily:"Verdana,sans-serif" }}>remover</button>}
            </div>
          </div>
          <div onClick={()=>setExpanded(expanded===enc.id?null:enc.id)}
            style={{ fontSize:12, color:"rgba(255,255,255,0.5)", fontFamily:"Verdana,sans-serif", lineHeight:1.6,
              maxHeight:expanded===enc.id?"none":"58px", overflow:"hidden", cursor:"pointer" }}>
            {enc.resumo}
          </div>
          <button onClick={()=>setExpanded(expanded===enc.id?null:enc.id)}
            style={{ background:"transparent", border:"none", color:C.gold, fontSize:11, cursor:"pointer", fontFamily:"Verdana,sans-serif", marginTop:4, padding:0 }}>
            {expanded===enc.id?"▲ recolher":"▼ ler mais"}
          </button>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:10 }}>
            {(enc.tags||[]).map(t=><Badge key={t}>{t}</Badge>)}
            <Badge variant={enc.autor==="lys"?"lys":"malu"}>{enc.autor==="lys"?"Lys":"Malu Modas"}</Badge>
          </div>
        </div>
      ))}

      {!canEdit && <ReadonlyNotice>Resumos são registrados pela VI.P & NOUS. Você tem acesso de leitura e exportação de PDF.</ReadonlyNotice>}

      {canEdit && (
        <>
          <SectionTitle style={{ marginTop:24 }}>Registrar Novo Encontro</SectionTitle>
          <div style={{ background:C.bg2, border:`0.5px solid ${C.border}`, borderRadius:12, padding:"14px 16px" }}>
            <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:10 }}>
              <Field label="DATA"><input type="date" value={form.data} onChange={e=>setForm({...form,data:e.target.value})} style={inputStyle}/></Field>
              <Field label="TIPO DE SESSÃO">
                <select value={form.tipo} onChange={e=>setForm({...form,tipo:e.target.value})} style={inputStyle}>
                  {TIPOS.map(t=><option key={t}>{t}</option>)}
                </select>
              </Field>
            </div>
            <div style={{ marginBottom:10 }}>
              <Field label="TÍTULO DO ENCONTRO">
                <input type="text" value={form.titulo} onChange={e=>setForm({...form,titulo:e.target.value})} placeholder="Ex: Planejamento Junho — Coleção Inverno" style={inputStyle}/>
              </Field>
            </div>
            <div style={{ marginBottom:10 }}>
              <Field label="RESUMO DO ENCONTRO">
                <textarea value={form.resumo} onChange={e=>setForm({...form,resumo:e.target.value})} placeholder="Descreva os pontos discutidos, decisões tomadas e próximos passos..." style={{...inputStyle,minHeight:100,resize:"vertical"}}/>
              </Field>
            </div>
            <div style={{ marginBottom:14 }}>
              <Field label="TAGS (separadas por vírgula)">
                <input type="text" value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})} placeholder="Ex: Instagram, Junho, Inverno, NousNUMBER" style={inputStyle}/>
              </Field>
            </div>
            <BtnGold onClick={add} disabled={saving}>{saving?"Salvando...":"Registrar Encontro"}</BtnGold>
          </div>
        </>
      )}
    </div>
  );
}
