import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { STUDIO_CONFIG } from "./constants/studio.ts";

const officialEmail = "russatatuadora@gmail.com";
const officialInstagram = "https://www.instagram.com/russatatuadora/";

async function source(path) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

describe("official studio contact channels", () => {
  it("keeps the official email and Instagram handle in the central config", () => {
    assert.equal(STUDIO_CONFIG.email, officialEmail);
    assert.equal(STUDIO_CONFIG.instagram.handle, "@russatatuadora");
    assert.equal(STUDIO_CONFIG.instagram.url, officialInstagram);
    assert.equal(STUDIO_CONFIG.contact.instagramUrl, officialInstagram);
  });

  it("renders the official email as a mailto link in the contact section", async () => {
    const contact = await source("../components/public/ContactSection.tsx");

    assert.match(contact, /\{STUDIO_CONFIG\.email\}/);
    assert.match(contact, /href: `mailto:\$\{STUDIO_CONFIG\.email\}`/);
    assert.match(contact, /href=\{STUDIO_CONFIG\.contact\.instagramUrl\}/);
    assert.match(contact, /target="_blank" rel="noopener noreferrer"/);
  });

  it("uses the official Instagram profile in the header and footer", async () => {
    const [header, footer] = await Promise.all([
      source("../components/public/Header.tsx"),
      source("../components/public/Footer.tsx"),
    ]);

    assert.match(header, /const instagramUrl = STUDIO_CONFIG\.instagram\.url/);
    assert.match(header, /href=\{instagramUrl\}[\s\S]*?target="_blank"[\s\S]*?rel="noopener noreferrer"/);
    assert.match(footer, /const instagramUrl = STUDIO_CONFIG\.instagram\.url/);
    assert.match(footer, /href=\{`mailto:\$\{STUDIO_CONFIG\.email\}`\}/);
    assert.match(footer, /href=\{instagramUrl\}[\s\S]*?target="_blank"[\s\S]*?rel="noopener noreferrer"/);
  });

  it("includes the official email and Instagram in structured data", async () => {
    const layout = await source("../app/layout.tsx");

    assert.match(layout, /email: STUDIO_CONFIG\.email/);
    assert.match(layout, /sameAs: \[STUDIO_CONFIG\.instagram\.url\]/);
  });

  it("puts the official email in both admin notification template footers", async () => {
    const [appointmentEmail, quoteEmail] = await Promise.all([
      source("../emails/AdminNewAppointmentEmail.tsx"),
      source("../emails/AdminQuoteRequestEmail.tsx"),
    ]);

    for (const template of [appointmentEmail, quoteEmail]) {
      assert.match(template, /href=\{`mailto:\$\{STUDIO_CONFIG\.email\}`\}/);
      assert.match(template, /\{STUDIO_CONFIG\.email\}/);
    }
  });

  it("routes quote and appointment alerts to all configured admins plus the official inbox", async () => {
    const [quoteAction, appointmentAction] = await Promise.all([
      source("../server/actions/quotes.actions.tsx"),
      source("../server/actions/appointments.actions.tsx"),
    ]);

    for (const action of [quoteAction, appointmentAction]) {
      assert.match(action, /getAdminNotificationEmails\(STUDIO_CONFIG\.email\)/);
      assert.match(action, /to: adminEmails/);
    }
  });
});
