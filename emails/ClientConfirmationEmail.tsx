import * as React from "react";

type ClientConfirmationEmailProps = {
  clientName: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  tattooStyle: string;
  bodyLocation: string;
  approxSizeCm: string;
};

export default function ClientConfirmationEmail({
  clientName,
  date,
  timeStart,
  timeEnd,
  tattooStyle,
  bodyLocation,
  approxSizeCm,
}: ClientConfirmationEmailProps) {
  return (
    <div
      style={{
        fontFamily: "'Montserrat', 'Helvetica Neue', sans-serif",
        backgroundColor: "#0a0a0a",
        color: "#f5f5f5",
        padding: "40px 20px",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          fontFamily: "'Permanent Marker', cursive",
          color: "#ffffff",
          fontSize: "32px",
          marginBottom: "8px",
          textAlign: "center" as const,
        }}
      >
        Russa Tattoo Studio
      </h1>

      <p style={{ textAlign: "center" as const, color: "#a0a0a0", fontSize: "14px" }}>
        A sua solicitação foi recebida com sucesso ✨
      </p>

      <div
        style={{
          margin: "32px 0",
          padding: "24px",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "12px",
        }}
      >
        <p style={{ fontSize: "16px", marginBottom: "16px" }}>
          Olá <strong>{clientName}</strong>!
        </p>
        <p style={{ fontSize: "14px", color: "#a0a0a0", lineHeight: "1.6" }}>
          Recebemos o seu pedido de agendamento. A Russa irá avaliar a
          solicitação e entrará em contacto para confirmação.
        </p>
      </div>

      <div
        style={{
          padding: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <h3 style={{ color: "#ffffff", fontSize: "14px", marginBottom: "12px" }}>
          Detalhes da Sessão
        </h3>
        <table style={{ width: "100%", fontSize: "14px" }}>
          <tbody>
            <tr>
              <td style={{ color: "#a0a0a0", padding: "6px 0" }}>📅 Data:</td>
              <td style={{ fontWeight: 600, padding: "6px 0" }}>{date}</td>
            </tr>
            <tr>
              <td style={{ color: "#a0a0a0", padding: "6px 0" }}>🕐 Horário:</td>
              <td style={{ fontWeight: 600, padding: "6px 0" }}>
                {timeStart} — {timeEnd}
              </td>
            </tr>
            <tr>
              <td style={{ color: "#a0a0a0", padding: "6px 0" }}>🎨 Estilo:</td>
              <td style={{ fontWeight: 600, padding: "6px 0" }}>{tattooStyle}</td>
            </tr>
            <tr>
              <td style={{ color: "#a0a0a0", padding: "6px 0" }}>📍 Local:</td>
              <td style={{ fontWeight: 600, padding: "6px 0" }}>{bodyLocation}</td>
            </tr>
            <tr>
              <td style={{ color: "#a0a0a0", padding: "6px 0" }}>📏 Tamanho:</td>
              <td style={{ fontWeight: 600, padding: "6px 0" }}>{approxSizeCm}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p
        style={{
          marginTop: "32px",
          fontSize: "12px",
          color: "#666",
          textAlign: "center" as const,
          lineHeight: "1.6",
        }}
      >
        Este é um e-mail automático. Não responda diretamente.
        <br />
        Para dúvidas, entre em contacto pelo WhatsApp.
      </p>

      <p
        style={{
          marginTop: "24px",
          fontSize: "11px",
          color: "#444",
          textAlign: "center" as const,
        }}
      >
        © {new Date().getFullYear()} Russa Tattoo Studio — Algarve, Portugal
      </p>
    </div>
  );
}
