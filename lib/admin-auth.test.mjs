import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { getAllowedAdminEmails, isAllowedAdminEmail } from "./admin-auth.ts";

const originalAdminEmails = process.env.ADMIN_EMAIL;

afterEach(() => {
  if (originalAdminEmails === undefined) {
    delete process.env.ADMIN_EMAIL;
  } else {
    process.env.ADMIN_EMAIL = originalAdminEmails;
  }
});

describe("admin email authorization", () => {
  it("authorizes both configured administrator addresses", () => {
    process.env.ADMIN_EMAIL =
      "tiagodearaujo13@gmail.com,russatatuadora@gmail.com";

    assert.equal(isAllowedAdminEmail("tiagodearaujo13@gmail.com"), true);
    assert.equal(isAllowedAdminEmail("russatatuadora@gmail.com"), true);
  });

  it("blocks addresses that are not configured as administrators", () => {
    process.env.ADMIN_EMAIL =
      "tiagodearaujo13@gmail.com,russatatuadora@gmail.com";

    assert.equal(isAllowedAdminEmail("invasor@qualquer.com"), false);
  });

  it("normalizes whitespace and letter casing in configured and user emails", () => {
    process.env.ADMIN_EMAIL =
      " tiagodearaujo13@gmail.com , RUSSatatuadora@gmail.com ";

    assert.deepEqual(getAllowedAdminEmails(), [
      "tiagodearaujo13@gmail.com",
      "russatatuadora@gmail.com",
    ]);
    assert.equal(isAllowedAdminEmail(" TIAGODEARAUJO13@GMAIL.COM "), true);
    assert.equal(isAllowedAdminEmail(" RUSSATATUADORA@GMAIL.COM "), true);
  });

  it("blocks users when the admin list is empty or the email is missing", () => {
    process.env.ADMIN_EMAIL = " ,  ";

    assert.deepEqual(getAllowedAdminEmails(), []);
    assert.equal(isAllowedAdminEmail("tiagodearaujo13@gmail.com"), false);
    assert.equal(isAllowedAdminEmail(null), false);
    assert.equal(isAllowedAdminEmail(undefined), false);
  });

  it("supports a single configured administrator address", () => {
    process.env.ADMIN_EMAIL = "tiagodearaujo13@gmail.com";

    assert.equal(isAllowedAdminEmail("tiagodearaujo13@gmail.com"), true);
    assert.equal(isAllowedAdminEmail("russatatuadora@gmail.com"), false);
  });
});
