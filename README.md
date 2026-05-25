# Malu Gestão · VI.P & NOUS
Sistema de Gestão de Comunicação — Malu Modas

**URL:** https://gestaomalu.vercel.app

## Setup

### 1. Supabase (só uma vez)
- Dashboard → SQL Editor → New query
- Cole o conteúdo de `supabase_migration.sql` → Run

### 2. Deploy
Conecte o repositório `iamentorbr/malugestao` no Vercel. Sem variáveis de ambiente necessárias.

## Credenciais
| Perfil | Usuário | Acesso |
|--------|---------|--------|
| VI.P & NOUS | `lys` | Total |
| Malu Modas | `malu` | Visualização + peças |

## Estrutura
```
app/
  page.jsx          ← login + sistema
  layout.jsx
  lib/
    supabase.js
  components/
    AppShell.jsx
    TabGrupo.jsx
    TabCalendario.jsx
    TabEncontros.jsx
    TabPecas.jsx
    ui.jsx
supabase_migration.sql
package.json
next.config.js
```
