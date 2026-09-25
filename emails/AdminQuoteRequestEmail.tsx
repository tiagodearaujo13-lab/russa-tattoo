import * as React from "react";
import { STUDIO_CONFIG } from "@/lib/constants/studio";

type AdminQuoteRequestEmailProps = {
  clientName: string;
  clientEmail: string;
  clientWhatsapp: string;
  bodyLocation: string;
  description: string;
  adminPanelUrl: string;
};

export default function AdminQuoteRequestEmail({
  clientName,
  clientEmail,
  clientWhatsapp,
  bodyLocation,
  description,
  adminPanelUrl,
}: AdminQuoteRequestEmailProps) {
  const whatsappNumber = clientWhatsapp.replace(/[^0-9+]/g, "");

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
          fontFamily: "'Bodoni Moda', serif",
          color: "#ffffff",
          fontSize: "28px",
          marginBottom: "8px",
          letterSpacing: "-0.01em",
        }}
      >
        ✨ Novo Pedido de Orçamento
      </h1>

      <p style={{ color: "#a0a0a0", fontSize: "14px", marginBottom: "24px" }}>
        <strong style={{ color: "#f5f5f5" }}>{clientName}</strong> solicitou um
        orçamento de tatuagem através do site.
      </p>

      {/* Dados do Cliente */}
      <div
        style={{
          padding: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "4px",
          marginBottom: "16px",
        }}
      >
        <h3
          style={{
            color: "#ffffff",
            fontSize: "13px",
            marginBottom: "12px",
            textTransform: "uppercase" as const,
            letterSpacing: "2px",
          }}
        >
          Dados do Cliente
        </h3>
        <table style={{ width: "100%", fontSize: "14px" }}>
          <tbody>
            <tr>
              <td style={{ color: "#a0a0a0", padding: "4px 0" }}>👤 Nome:</td>
              <td style={{ fontWeight: 600, padding: "4px 0" }}>
                {clientName}
              </td>
            </tr>
            <tr>
              <td style={{ color: "#a0a0a0", padding: "4px 0" }}>
                📧 E-mail:
              </td>
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
                  href={`https://wa.me/${whatsappNumber}`}
                  style={{ color: "#ffffff" }}
                >
                  {clientWhatsapp}
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Detalhes do Projeto */}
      <div
        style={{
          padding: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          borderRadius: "4px",
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
            letterSpacing: "2px",
          }}
        >
          Projeto de Tatuagem
        </h3>
        <table style={{ width: "100%", fontSize: "14px" }}>
          <tbody>
            <tr>
              <td style={{ color: "#a0a0a0", padding: "4px 0" }}>
                📍 Local do Corpo:
              </td>
              <td style={{ fontWeight: 600, padding: "4px 0" }}>
                {bodyLocation}
              </td>
            </tr>
          </tbody>
        </table>
        <div
          style={{
            marginTop: "12px",
            paddingTop: "12px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <p style={{ color: "#a0a0a0", fontSize: "12px" }}>
            📝 Ideia e Detalhes:
          </p>
          <p
            style={{
              color: "#ccc",
              fontSize: "14px",
              marginTop: "4px",
              lineHeight: "1.6",
              whiteSpace: "pre-wrap" as const,
            }}
          >
            {description}
          </p>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div style={{ marginBottom: "24px" }}>
        <a
          href={`mailto:${clientEmail}?subject=${encodeURIComponent("Re: Orçamento de Tatuagem — Russa Tattoo Studio")}`}
          style={{
            display: "inline-block",
            backgroundColor: "#ffffff",
            color: "#0a0a0a",
            padding: "14px 32px",
            borderRadius: "4px",
            textDecoration: "none",
            fontWeight: 700,
            fontSize: "14px",
            marginRight: "12px",
          }}
        >
          Responder por E-mail
        </a>
        <a
          href={`https://wa.me/${whatsappNumber}`}
          style={{
            display: "inline-block",
            backgroundColor: "transparent",
            color: "#ffffff",
            padding: "12px 28px",
            borderRadius: "4px",
            textDecoration: "none",
            fontWeight: 700,
            fontSize: "14px",
            border: "1px solid rgba(255,255,255,0.3)",
          }}
        >
          Abrir WhatsApp
        </a>
      </div>

      {/* CTA Painel */}
      <a
        href={adminPanelUrl}
        style={{
          display: "inline-block",
          color: "#808080",
          padding: "8px 0",
          textDecoration: "underline",
          fontSize: "13px",
        }}
      >
        Ver no Painel Admin →
      </a>

      <p
        style={{
          marginTop: "32px",
          fontSize: "11px",
          color: "#888",
          textAlign: "center" as const,
        }}
      >
        Contacto oficial: {" "}
        <a href={`mailto:${STUDIO_CONFIG.email}`} style={{ color: "#ffffff" }}>
          {STUDIO_CONFIG.email}
        </a>
        <br />© {new Date().getFullYear()} Russa Tattoo Studio — Pedidos de Orçamento
      </p>
    </div>
  );
}
