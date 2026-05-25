export const metadata = {
  title: "Malu Gestão · VI.P & NOUS",
  description: "Sistema de Gestão de Comunicação — Malu Modas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, padding: 0, background: "#0f0f0f" }}>
        {children}
      </body>
    </html>
  );
}
