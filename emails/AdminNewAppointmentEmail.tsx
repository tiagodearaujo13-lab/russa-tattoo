import * as React from "react";

type AdminNewAppointmentEmailProps = {
  clientName: string;
  clientEmail: string;
  clientWhatsapp: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  tattooStyle: string;
  bodyLocation: string;
  approxSizeCm: string;
  description?: string | null;
  referenceImageUrl?: string | null;
  adminPanelUrl: string;
};

export default function AdminNewAppointmentEmail({
  clientName,
  clientEmail,
  clientWhatsapp,
  date,
  timeStart,
  timeEnd,
  tattooStyle,
  bodyLocation,
  approxSizeCm,
  description,
  referenceImageUrl,
  adminPanelUrl,
}: AdminNewAppointmentEmailProps) {
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
          fontSize: "28px",
          marginBottom: "8px",
        }}
      >
        🔔 Nova Solicitação!
      </h1>

      <p style={{ color: "#a0a0a0", fontSize: "14px", marginBottom: "24px" }}>
        <strong style={{ color: "#f5f5f5" }}>{clientName}</strong> enviou uma
        solicitação de agendamento.
      </p>

      {/* Dados do Cliente */}
      <div
        style={{
          padding: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "12px",
          marginBottom: "16px",
        }}
      >
        <h3
          style={{
            color: "#ffffff",
            fontSize: "13px",
            marginBottom: "12px",
            textTransform: "uppercase" as const,
            letterSpacing: "1px",
          }}
        >
          Dados do Cliente
        </h3>
        <table style={{ width: "100%", fontSize: "14px" }}>
          <tbody>
            <tr>
              <td style={{ color: "#a0a0a0", padding: "4px 0" }}>👤 Nome:</td>
              <td style={{ fontWeight: 600, padding: "4px 0" }}>{clientName}</td>
            </tr>
            <tr>
              <td style={{ color: "#a0a0a0", padding: "4px 0" }}>📧 E-mail:</td>
              <td style={{ padding: "4px 0" }}>
                <a href={`mailto:${clientEmail}`} style={{ color: "#ffffff" }}>
                  {clientEmail}
                </a>
              </td>
            </tr>
            <tr>
              <td style={{ color: "#a0a0a0", padding: "4px 0" }}>
                📱 WhatsApp:
              </td>
              <td style={{ padding: "4px 0" }}>
                <a
                  href={`https://wa.me/${clientWhatsapp.replace(/[^0-9+]/g, "")}`}
                  style={{ color: "#ffffff" }}
                >
                  {clientWhatsapp}
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Detalhes da Tattoo */}
      <div
        style={{
          padding: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          marginBottom: "16px",
        }}
      >
        <h3
          style={{
            color: "#f5f5f5",
            fontSize: "13px",
            marginBottom: "12px",
            textTransform: "uppercase" as const,
            letterSpacing: "1px",
          }}
        >
          Detalhes da Tatuagem
        </h3>
        <table style={{ width: "100%", fontSize: "14px" }}>
          <tbody>
            <tr>
              <td style={{ color: "#a0a0a0", padding: "4px 0" }}>📅 Data:</td>
              <td style={{ fontWeight: 600, padding: "4px 0" }}>{date}</td>
            </tr>
            <tr>
              <td style={{ color: "#a0a0a0", padding: "4px 0" }}>
                🕐 Horário:
              </td>
              <td style={{ fontWeight: 600, padding: "4px 0" }}>
                {timeStart} — {timeEnd}
              </td>
            </tr>
            <tr>
              <td style={{ color: "#a0a0a0", padding: "4px 0" }}>🎨 Estilo:</td>
              <td style={{ fontWeight: 600, padding: "4px 0" }}>{tattooStyle}</td>
            </tr>
            <tr>
              <td style={{ color: "#a0a0a0", padding: "4px 0" }}>📍 Local:</td>
              <td style={{ fontWeight: 600, padding: "4px 0" }}>
                {bodyLocation}
              </td>
            </tr>
            <tr>
              <td style={{ color: "#a0a0a0", padding: "4px 0" }}>
                📏 Tamanho:
              </td>
              <td style={{ fontWeight: 600, padding: "4px 0" }}>
                {approxSizeCm}
              </td>
            </tr>
          </tbody>
        </table>
        {description && (
          <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <p style={{ color: "#a0a0a0", fontSize: "12px" }}>📝 Descrição:</p>
            <p style={{ color: "#ccc", fontSize: "14px", marginTop: "4px" }}>
              {description}
            </p>
          </div>
        )}
      </div>

      {/* Reference Image */}
      {referenceImageUrl && (
        <div style={{ marginBottom: "24px" }}>
          <p style={{ color: "#a0a0a0", fontSize: "12px", marginBottom: "8px" }}>
            🖼️ Imagem de Referência:
          </p>
          <a href={referenceImageUrl} style={{ color: "#ffffff", fontSize: "14px" }}>
            Ver imagem →
          </a>
        </div>
      )}

      {/* CTA */}
      <a
        href={adminPanelUrl}
        style={{
          display: "inline-block",
          backgroundColor: "#ffffff",
          color: "#0a0a0a",
          padding: "14px 32px",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: 700,
          fontSize: "14px",
        }}
      >
        Ver no Painel Admin
      </a>

      <p
        style={{
          marginTop: "32px",
          fontSize: "11px",
          color: "#444",
          textAlign: "center" as const,
        }}
      >
        © {new Date().getFullYear()} Russa Tattoo Studio — Sistema de
        Agendamento
      </p>
    </div>
  );
}
