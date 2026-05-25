"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Card, SectionTitle, BtnGold, Field, Badge, ReadonlyNotice, StatBox, inputStyle, C, fmtDate, todayStr, Spinner, ErrorMsg } from "./ui";

const CATS = ["Campanha Maio","Data Comemorativa","Produto","Engajamento","Institucional","Campanha Junho","Campanha Julho","Campanha Agosto"];

export default function TabGrupo({ user }) {
  const [msgs, setMsgs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [err, setErr]         = useState("");
  const [form, setForm]       = useState({ data:"", titulo:"", texto:"", cat:"Campanha Maio" });

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("malu_grupo")
      .select("*")
      .order("id", { ascending: false });
    if (error) setErr(error.message);
    else setMsgs(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function add() {
    if (!form.titulo || !form.texto) { alert("Preencha o título e o texto."); return; }
    setSaving(true);
    const { error } = await supabase.from("malu_grupo").insert({
      data:   form.data ? fmtDate(form.data) : todayStr(),
      titulo: form.titulo,
      texto:  form.texto,
      cat:    form.cat,
      autor:  user.role,
    });
    if (error) setErr(error.message);
    else {
      setForm({ data:"", titulo:"", texto:"", cat:"Campanha Maio" });
      await load();
    }
    setSaving(false);
  }

  async function remove(id) {
    if (!confirm("Remover esta mensagem?")) return;
    await supabase.from("malu_grupo").delete().eq("id", id);
    await load();
  }

  const canEdit = user.role === "lys";

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))", gap:10, marginBottom:20 }}>
        <StatBox num={msgs.length} label="Mensagens" />
        <StatBox num={msgs.filter(m=>m.cat.startsWith("Campanha")).length} label="Campanhas" />
        <StatBox num="21" label="Anos de Mercado" />
        <StatBox num="#EuSouMalu" label="Hashtag Âncora" />
      </div>

      <SectionTitle>Mensagens · Grupo Melhores Amigas da Malu</SectionTitle>
      {err && <ErrorMsg msg={err}/>}
      {loading ? <Spinner/> : msgs.map(m => (
        <Card key={m.id} accent>
          <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
            <div style={{ background:C.black, color:C.gold, fontSize:10, padding:"3px 8px", borderRadius:4,
              whiteSpace:"nowrap", letterSpacing:"0.04em", fontFamily:"Verdana,sans-serif",
              minWidth:72, textAlign:"center" }}>{m.data}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:"bold", fontSize:13, color:C.text, fontFamily:"Verdana,sans-serif", marginBottom:4 }}>{m.titulo}</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)", fontFamily:"Verdana,sans-serif", lineHeight:1.5 }}>{m.texto}</div>
              <div style={{ display:"flex", gap:6, marginTop:8, flexWrap:"wrap", alignItems:"center" }}>
                <Badge variant={m.autor==="lys"?"lys":"malu"}>{m.autor==="lys"?"Lys":"Malu Modas"}</Badge>
                <Badge>{m.cat}</Badge>
                {canEdit && (
                  <button onClick={()=>remove(m.id)} style={{ background:"transparent", border:"none",
                    color:"rgba(255,80,80,0.5)", cursor:"pointer", fontSize:11,
                    fontFamily:"Verdana,sans-serif", marginLeft:"auto" }}>remover</button>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}

      {!canEdit && <ReadonlyNotice>Você está acessando como Malu Modas. Novas mensagens são criadas pela VI.P & NOUS.</ReadonlyNotice>}

      {canEdit && (
        <>
          <SectionTitle style={{ marginTop:24 }}>Nova Mensagem para o Grupo</SectionTitle>
          <Card>
            <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:10 }}>
              <Field label="DATA DE ENVIO">
                <input type="date" value={form.data} onChange={e=>setForm({...form,data:e.target.value})} style={inputStyle}/>
              </Field>
              <Field label="CATEGORIA">
                <select value={form.cat} onChange={e=>setForm({...form,cat:e.target.value})} style={inputStyle}>
                  {CATS.map(c=><option key={c}>{c}</option>)}
                </select>
              </Field>
            </div>
            <div style={{ marginBottom:10 }}>
              <Field label="TÍTULO DA MENSAGEM">
                <input type="text" value={form.titulo} onChange={e=>setForm({...form,titulo:e.target.value})} placeholder="Ex: Lançamento Coleção Inverno 2026" style={inputStyle}/>
              </Field>
            </div>
            <div style={{ marginBottom:14 }}>
              <Field label="TEXTO DA MENSAGEM">
                <textarea value={form.texto} onChange={e=>setForm({...form,texto:e.target.value})} placeholder="Texto completo para o grupo Melhores Amigas da Malu..." style={{...inputStyle,minHeight:80,resize:"vertical"}}/>
              </Field>
            </div>
            <BtnGold onClick={add} disabled={saving}>{saving?"Salvando...":"Salvar Mensagem"}</BtnGold>
          </Card>
        </>
      )}
    </div>
  );
}
