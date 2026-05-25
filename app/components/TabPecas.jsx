"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { SectionTitle, BtnGold, BtnGhost, Field, Badge, StatBox, inputStyle, C, todayStr, Spinner, ErrorMsg } from "./ui";

export default function TabPecas({ user }) {
  const [pecas,   setPecas]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [err,     setErr]     = useState("");
  const [modal,   setModal]   = useState(false);
  const [filter,  setFilter]  = useState("ativas");
  const [form,    setForm]    = useState({ nome:"", orig:"", promo:"", nums:"", foto:null, preview:null });
  const fileRef = useRef();

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("malu_pecas")
      .select("*")
      .order("id", { ascending:false });
    if (error) setErr(error.message);
    else setPecas(data||[]);
    setLoading(false);
  }

  useEffect(()=>{ load(); },[]);

  function handleFoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setForm(f=>({...f, foto:ev.target.result, preview:ev.target.result}));
    reader.readAsDataURL(file);
  }

  async function add() {
    if (!form.nome||!form.orig||!form.promo) { alert("Preencha nome, valor original e promocional."); return; }
    setSaving(true);
    const { error } = await supabase.from("malu_pecas").insert({
      nome:  form.nome,
      orig:  parseFloat(form.orig),
      promo: parseFloat(form.promo),
      nums:  form.nums,
      foto:  form.foto,
      autor: user.role,
      data:  todayStr(),
      ativo: true,
    });
    if (error) setErr(error.message);
    else { setForm({nome:"",orig:"",promo:"",nums:"",foto:null,preview:null}); setModal(false); await load(); }
    setSaving(false);
  }

  async function toggleAtivo(id, current) {
    await supabase.from("malu_pecas").update({ ativo:!current }).eq("id",id);
    await load();
  }

  async function remove(id) {
    if (!confirm("Remover esta peça?")) return;
    await supabase.from("malu_pecas").delete().eq("id",id);
    await load();
  }

  const visible = pecas.filter(p => filter==="todas" || (filter==="ativas"?p.ativo:!p.ativo));
  const ativas  = pecas.filter(p=>p.ativo).length;
  const desc    = p => Math.round((1-p.promo/p.orig)*100);

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))", gap:10, marginBottom:20 }}>
        <StatBox num={pecas.length} label="Peças Cadastradas"/>
        <StatBox num={ativas}       label="Ativas"/>
        <StatBox num={pecas.length-ativas} label="Encerradas"/>
        <StatBox num="34–60"        label="Numerações"/>
      </div>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:10 }}>
        <SectionTitle>Peças Promocionais</SectionTitle>
        <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
          {["ativas","encerradas","todas"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{
              background:filter===f?C.gold:"transparent",
              color:filter===f?C.black:"rgba(255,255,255,0.4)",
              border:`0.5px solid ${filter===f?C.gold:"rgba(255,255,255,0.15)"}`,
              borderRadius:20, padding:"4px 12px", fontSize:11,
              cursor:"pointer", fontFamily:"Verdana,sans-serif",
              fontWeight:filter===f?"bold":"normal", textTransform:"capitalize",
            }}>{f}</button>
          ))}
          <BtnGold onClick={()=>setModal(true)} style={{ fontSize:11, padding:"7px 16px" }}>+ Incluir Peça</BtnGold>
        </div>
      </div>

      {err && <ErrorMsg msg={err}/>}
      {loading ? <Spinner/> : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:14 }}>
          {visible.map(p=>(
            <div key={p.id} style={{
              background:C.bg2, border:`0.5px solid ${p.ativo?C.border:"rgba(255,255,255,0.07)"}`,
              borderRadius:12, overflow:"hidden", opacity:p.ativo?1:0.55,
            }}>
              <div style={{ width:"100%", height:140, background:"#212121",
                display:"flex", alignItems:"center", justifyContent:"center",
                overflow:"hidden", borderBottom:`0.5px solid ${C.border}` }}>
                {p.foto
                  ? <img src={p.foto} alt={p.nome} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                  : <span style={{ fontSize:36, color:"rgba(200,169,110,0.2)" }}>👗</span>
                }
              </div>
              <div style={{ padding:"12px 13px" }}>
                <div style={{ fontWeight:"bold", fontSize:13, color:"#fff", fontFamily:"Verdana,sans-serif", marginBottom:6, lineHeight:1.3 }}>{p.nome}</div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
                  <span style={{ fontSize:11, color:"rgba(255,255,255,0.35)", textDecoration:"line-through", fontFamily:"Verdana,sans-serif" }}>R$ {Number(p.orig).toFixed(2)}</span>
                  <span style={{ fontSize:17, fontWeight:"bold", color:C.gold, fontFamily:"Verdana,sans-serif" }}>R$ {Number(p.promo).toFixed(2)}</span>
                  <span style={{ background:"rgba(34,180,100,0.15)", color:"#4caf7a", border:"0.5px solid rgba(34,180,100,0.3)", borderRadius:20, padding:"1px 7px", fontSize:10, fontFamily:"Verdana,sans-serif", fontWeight:"bold" }}>-{desc(p)}%</span>
                </div>
                {p.nums && <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", fontFamily:"Verdana,sans-serif", marginBottom:8 }}>Nums: {p.nums}</div>}
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", fontFamily:"Verdana,sans-serif", paddingTop:8, borderTop:`0.5px solid rgba(255,255,255,0.07)`, display:"flex", alignItems:"center", gap:4 }}>
                  <Badge variant={p.autor==="lys"?"lys":"malu"} style={{ fontSize:9 }}>{p.autor==="lys"?"Lys":"Malu Modas"}</Badge>
                  <span style={{ marginLeft:4 }}>· {p.data}</span>
                </div>
                <div style={{ display:"flex", gap:6, marginTop:8 }}>
                  <button onClick={()=>toggleAtivo(p.id,p.ativo)} style={{
                    flex:1, background:"transparent",
                    border:`0.5px solid ${p.ativo?"rgba(255,80,80,0.3)":"rgba(34,180,100,0.3)"}`,
                    color:p.ativo?"rgba(255,100,100,0.7)":"rgba(34,180,100,0.7)",
                    borderRadius:6, padding:"5px 0", fontSize:10,
                    cursor:"pointer", fontFamily:"Verdana,sans-serif" }}>
                    {p.ativo?"Encerrar":"Reativar"}
                  </button>
                  <button onClick={()=>remove(p.id)} style={{ background:"transparent", border:"0.5px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.2)", borderRadius:6, padding:"5px 10px", fontSize:10, cursor:"pointer", fontFamily:"Verdana,sans-serif" }}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.78)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:20 }}>
          <div style={{ background:"#1A1A1A", border:`0.5px solid ${C.gold}`, borderRadius:16, padding:"24px 22px", width:"100%", maxWidth:420, position:"relative", maxHeight:"90vh", overflowY:"auto" }}>
            <div style={{ fontSize:11, fontWeight:"bold", color:C.goldDark, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:14, fontFamily:"Verdana,sans-serif" }}>Nova Peça Promocional</div>
            <div style={{ background:user.role==="lys"?"rgba(83,74,183,0.12)":"rgba(200,169,110,0.1)", border:`0.5px solid ${user.role==="lys"?"rgba(175,169,236,0.4)":C.border}`, borderRadius:8, padding:"8px 12px", fontSize:11, color:user.role==="lys"?"#AFA9EC":C.gold, fontFamily:"Verdana,sans-serif", marginBottom:14 }}>
              ✓ Incluindo como: <strong>{user.label}</strong>
            </div>
            <div onClick={()=>fileRef.current&&fileRef.current.click()} style={{ border:`1.5px dashed ${C.gold}`, borderRadius:10, height:90, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", marginBottom:14, overflow:"hidden" }}>
              {form.preview
                ? <img src={form.preview} alt="preview" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                : <span style={{ fontSize:12, color:C.gold, fontFamily:"Verdana,sans-serif" }}>📷 Clique para adicionar foto</span>
              }
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFoto} style={{ display:"none" }}/>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <Field label="NOME DA PEÇA"><input type="text" value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})} placeholder="Ex: Calça Wide Leg Linho" style={inputStyle}/></Field>
              <div style={{ display:"flex", gap:10 }}>
                <Field label="VALOR ORIGINAL (R$)"><input type="number" value={form.orig} onChange={e=>setForm({...form,orig:e.target.value})} placeholder="0.00" step="0.01" style={inputStyle}/></Field>
                <Field label="VALOR PROMOCIONAL (R$)"><input type="number" value={form.promo} onChange={e=>setForm({...form,promo:e.target.value})} placeholder="0.00" step="0.01" style={inputStyle}/></Field>
              </div>
              <Field label="NUMERAÇÕES DISPONÍVEIS"><input type="text" value={form.nums} onChange={e=>setForm({...form,nums:e.target.value})} placeholder="Ex: 38, 40, 42, 44, 46" style={inputStyle}/></Field>
            </div>
            <div style={{ display:"flex", gap:10, marginTop:18 }}>
              <BtnGold onClick={add} disabled={saving}>{saving?"Salvando...":"Salvar Peça"}</BtnGold>
              <BtnGhost onClick={()=>setModal(false)}>Cancelar</BtnGhost>
            </div>
            <button onClick={()=>setModal(false)} style={{ position:"absolute", top:14, right:16, background:"transparent", border:"none", color:"rgba(255,255,255,0.3)", cursor:"pointer", fontSize:18 }}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}
