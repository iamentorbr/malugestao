-- ══════════════════════════════════════════════════════════
--  MALU MODAS · VI.P & NOUS — Migration v1
--  Cole este SQL no Supabase Dashboard → SQL Editor → Run
-- ══════════════════════════════════════════════════════════

-- ─── GRUPO AMIGAS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS malu_grupo (
  id         BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  data       TEXT          NOT NULL,
  titulo     TEXT          NOT NULL,
  texto      TEXT          NOT NULL,
  cat        TEXT          NOT NULL DEFAULT 'Geral',
  autor      TEXT          NOT NULL CHECK (autor IN ('lys', 'malu'))
);

-- ─── CALENDÁRIO EDITORIAL ───────────────────────────────────
CREATE TABLE IF NOT EXISTS malu_calendario (
  id         BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  month      SMALLINT      NOT NULL CHECK (month BETWEEN 0 AND 11),
  day        TEXT          NOT NULL,
  name       TEXT          NOT NULL,
  scope      TEXT          NOT NULL DEFAULT 'Brasil',
  rel        TEXT          NOT NULL DEFAULT ''
);

-- ─── RESUMO DOS ENCONTROS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS malu_encontros (
  id         BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  data       TEXT          NOT NULL,
  tipo       TEXT          NOT NULL,
  titulo     TEXT          NOT NULL,
  resumo     TEXT          NOT NULL,
  tags       TEXT[]        NOT NULL DEFAULT '{}',
  autor      TEXT          NOT NULL CHECK (autor IN ('lys', 'malu'))
);

-- ─── PEÇAS PROMOCIONAIS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS malu_pecas (
  id         BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  nome       TEXT          NOT NULL,
  orig       NUMERIC(10,2) NOT NULL,
  promo      NUMERIC(10,2) NOT NULL,
  nums       TEXT          NOT NULL DEFAULT '',
  foto       TEXT,
  autor      TEXT          NOT NULL CHECK (autor IN ('lys', 'malu')),
  data       TEXT          NOT NULL,
  ativo      BOOLEAN       NOT NULL DEFAULT TRUE
);

-- ─── ROW LEVEL SECURITY ─────────────────────────────────────
ALTER TABLE malu_grupo      ENABLE ROW LEVEL SECURITY;
ALTER TABLE malu_calendario ENABLE ROW LEVEL SECURITY;
ALTER TABLE malu_encontros  ENABLE ROW LEVEL SECURITY;
ALTER TABLE malu_pecas      ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all_grupo"
  ON malu_grupo FOR ALL TO anon
  USING (true) WITH CHECK (true);

CREATE POLICY "allow_all_calendario"
  ON malu_calendario FOR ALL TO anon
  USING (true) WITH CHECK (true);

CREATE POLICY "allow_all_encontros"
  ON malu_encontros FOR ALL TO anon
  USING (true) WITH CHECK (true);

CREATE POLICY "allow_all_pecas"
  ON malu_pecas FOR ALL TO anon
  USING (true) WITH CHECK (true);

-- ─── DADOS INICIAIS: CALENDÁRIO ─────────────────────────────
INSERT INTO malu_calendario (month, day, name, scope, rel) VALUES
(0,  '01', 'Confraternização Universal',          'Brasil',         'Abertura de ano — post institucional'),
(0,  '25', 'Dia do Feirante',                     'Brasil',         'Relevância para comércio local'),
(2,  '08', 'Dia Internacional da Mulher',         'Mundial',        'Post de empoderamento — pilar central da marca'),
(2,  '22', 'Aniversário de Leticia Santos',       'Malu Modas',     'Data pessoal da empresária'),
(2,  '25', 'Aniversário de Adamantina',           'Adamantina/SP',  'Post comemorativo local — fidelização'),
(3,  '21', 'Tiradentes',                          'Brasil',         'Feriado — oportunidade de campanha'),
(4,  '01', 'Dia do Trabalho',                     'Brasil',         'Campanha Ela Merece Se Ver — Aquecimento'),
(4,  '10', 'Dia das Mães',                        'Brasil',         'Pico da Campanha Maio — maior data do ano'),
(4,  '16', 'Fundação da Malu Modas',              'Malu Modas',     '21 anos — post institucional comemorativo'),
(5,  '12', 'Dia dos Namorados',                   'Brasil',         'Curadoria de looks para presentear'),
(5,  '24', 'Festa Junina / São João',             'Brasil',         'Look caipira chic — conteúdo de engajamento'),
(6,  '25', 'Dia do Comerciante',                  'Brasil',         'Post de valorização do comércio local'),
(7,  '11', 'Dia dos Pais',                        'Brasil',         'Curadoria de looks masculinos — presente para ele'),
(8,  '07', 'Independência do Brasil',             'Brasil',         'Post patriótico — look verde e amarelo'),
(8,  '21', 'Início da Primavera',                 'Brasil',         'Coleção primavera/verão — renovação de peças'),
(9,  '12', 'N. Sra. Aparecida / Dia das Crianças','Brasil',        'Conteúdo de fé e família'),
(9,  '31', 'Halloween',                           'Mundial',        'Post de engajamento lúdico'),
(10, '02', 'Finados',                             'Brasil',         'Pausa em campanhas de venda'),
(10, '20', 'Dia da Consciência Negra',            'Brasil',         'Post de diversidade, inclusão e representatividade'),
(11, '01', 'Início do Natal — Aquecimento',       'Malu Modas',     'Abertura da campanha de fim de ano'),
(11, '25', 'Natal',                               'Mundial',        'Pico da campanha de fim de ano — maior ticket médio'),
(11, '31', 'Réveillon',                           'Mundial',        'Post de retrospectiva, gratidão e projeção 2027');

-- ─── DADOS INICIAIS: GRUPO ──────────────────────────────────
INSERT INTO malu_grupo (data, titulo, texto, cat, autor) VALUES
('25/05/2026', 'Campanha Ela Merece Se Ver — Continuidade', 'Hoje tem novidade esperando por você na loja, Amiga. Passa lá ou chama no WhatsApp 💛', 'Campanha Maio', 'lys'),
('10/05/2026', 'Dia das Mães — Mensagem Especial', 'Para a mulher que cuida de todo mundo e muitas vezes esquece de cuidar de si. Hoje é o seu dia.', 'Data Comemorativa', 'lys'),
('01/05/2026', 'Dia do Trabalho — Aquecimento Campanha', 'Você trabalha tanto. Hoje é sua vez de ser celebrada.', 'Campanha Maio', 'lys');

-- ─── DADOS INICIAIS: ENCONTROS ──────────────────────────────
INSERT INTO malu_encontros (data, tipo, titulo, resumo, tags, autor) VALUES
('25/05/2026', 'Planejamento (Segunda)', 'Sessão de Planejamento — Maio 2026',
 'Revisão da campanha "Ela Merece Se Ver" — análise de engajamento das fases Aquecimento e Intensificação. Ajuste de copy para a Fase Virada com foco no pós-Dia das Mães. Definição de pauta para junho: pré-inverno e lançamento de novas peças. Alinhamento sobre perfil @eusoumalu.modas: crescimento orgânico em andamento.',
 ARRAY['Campanha Maio','Instagram','Planejamento Junho'], 'lys'),
('Fevereiro 2026', 'Onboarding', 'Onboarding NousNUMBER — Leticia & Malu Modas',
 'Entrega e apresentação do Mapa Numerológico Pessoal de Leticia dos Santos e do Mapa Empresarial da Malu Modas. Apresentação do relatório de Numerologia Geográfica do ponto comercial (Av. Rio Branco 570/574). Alinhamento de acerto de assinatura (Leticia S.) e leitura do Mapa Arquetípico e Comportamental.',
 ARRAY['NousNUMBER','Onboarding','Estratégia'], 'lys');

-- ─── DADOS INICIAIS: PEÇAS ──────────────────────────────────
INSERT INTO malu_pecas (nome, orig, promo, nums, autor, data, ativo) VALUES
('Blazer Alfaiataria Clássico', 289.90, 219.90, '38, 40, 42, 44', 'lys', '20/05/2026', true),
('Conjunto Tricot Inverno',     199.90, 149.90, '34, 36, 38, 40, 42', 'malu', '18/05/2026', true),
('Vestido Midi Floral',         259.00, 189.00, '36, 38, 40, 42, 44, 46', 'lys', '15/05/2026', true);
