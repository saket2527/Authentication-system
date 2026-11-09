// Runtime validation coverage for email verification tokens.
import { describe, expect, it } from "vitest";
import {
  createVerificationToken,
  hashVerificationToken,
  isVerificationToken,
} from "./emailVerificationToken";

describe("email verification tokens", () => {
  it("creates a random token and stores only its matching hash", () => {
    const first = createVerificationToken();
    const second = createVerificationToken();

    expect(isVerificationToken(first.token)).toBe(true);
    expect(first.tokenHash).toBe(hashVerificationToken(first.token));
    expect(first.tokenHash).not.toBe(first.token);
    expect(second.token).not.toBe(first.token);
  });

  it("rejects malformed or non-string tokens", () => {
    expect(isVerificationToken("")).toBe(false);
    expect(isVerificationToken("not-a-token")).toBe(false);
    expect(isVerificationToken(42)).toBe(false);
  });
});
