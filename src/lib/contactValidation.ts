// Checks for the contact form. The browser's own type="email" check accepts things like "a@b", so the address
// is checked here properly: one @, a sensible part before it, and a domain with a dot and a real-looking ending.

export type ContactFields = { name: string; email: string; subject: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactFields, string>>;

export const LIMITS = { name: [2, 80], subject: [3, 120], message: [10, 2000] } as const;

const LOCAL = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/;
const LABEL = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/;

/** a plain-language reason the address is not usable, or null when it looks like a real address */
export function emailProblem(raw: string): string | null {
  const email = raw.trim();
  if (!email) return "Enter your email address.";
  if (/\s/.test(email)) return "An email address can't contain spaces.";
  if (email.length > 254) return "That email address is too long.";
  const at = email.lastIndexOf("@");
  if (at < 0) return "Your email needs an @, like name@example.com.";
  if (email.indexOf("@") !== at) return "An email address can only have one @.";
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  if (!local) return "Add the part before the @, like name@example.com.";
  if (local.length > 64 || !LOCAL.test(local) || local.startsWith(".") || local.endsWith(".") || local.includes("..")) {
    return "The part before the @ doesn't look right.";
  }
  if (!domain) return "Add the part after the @, like example.com.";
  const labels = domain.split(".");
  if (labels.length < 2) return "The part after the @ needs a dot, like example.com.";
  if (!labels.every((l) => LABEL.test(l))) return "The part after the @ doesn't look right.";
  if (!/^[A-Za-z]{2,}$/.test(labels[labels.length - 1])) return "The ending (like .com) doesn't look right.";
  return null;
}

/** the problem with one field, or null */
export function fieldProblem(key: keyof ContactFields, value: string): string | null {
  const v = value.trim();
  if (key === "email") return emailProblem(value);
  if (key === "name") {
    if (v.length < LIMITS.name[0]) return "Enter your name.";
    if (v.length > LIMITS.name[1]) return `Keep your name under ${LIMITS.name[1]} characters.`;
  }
  if (key === "subject") {
    if (v.length < LIMITS.subject[0]) return "Add a short subject, at least 3 characters.";
    if (v.length > LIMITS.subject[1]) return `Keep the subject under ${LIMITS.subject[1]} characters.`;
  }
  if (key === "message") {
    if (v.length < LIMITS.message[0]) return "Write at least 10 characters so we know how to help.";
    if (v.length > LIMITS.message[1]) return `Keep the message under ${LIMITS.message[1]} characters.`;
  }
  return null;
}

export function validateContact(f: ContactFields): ContactErrors {
  const out: ContactErrors = {};
  for (const key of ["name", "email", "subject", "message"] as const) {
    const problem = fieldProblem(key, f[key]);
    if (problem) out[key] = problem;
  }
  return out;
}
