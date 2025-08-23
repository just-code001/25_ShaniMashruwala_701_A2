import bcrypt from "bcrypt";

export function generateEmpId() {
  const now = new Date();
  const ymd =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(-5).toUpperCase();
  return `EMP-${ymd}-${rand}`;
}

export function generateRawPassword() {
  const base = Math.random().toString(36).slice(-6) + Math.random().toString(36).slice(-6);
  return (base.slice(0, 8) + "9A");
}

export async function hashPassword(raw) {
  return bcrypt.hash(raw, 10);
}

export function calcTotal({ basic = 0, hra = 0, da = 0, bonus = 0, deductions = 0 }) {
  return Number(basic) + Number(hra) + Number(da) + Number(bonus) - Number(deductions);
}
