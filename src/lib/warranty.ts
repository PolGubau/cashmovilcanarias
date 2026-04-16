/** Returns warranty status for a given expiry date string */
export function getWarrantyStatus(warrantyExpiresAt: string | null): {
  active: boolean;
  label: string;
  daysLeft: number | null;
} {
  if (!warrantyExpiresAt) {
    return { active: false, label: "Sin garantía", daysLeft: null };
  }
  const now = new Date();
  const expiry = new Date(warrantyExpiresAt);
  const diff = expiry.getTime() - now.getTime();
  const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (daysLeft > 0) {
    return { active: true, label: `En garantía (${daysLeft} días)`, daysLeft };
  }
  return { active: false, label: `Caducó hace ${Math.abs(daysLeft)} días`, daysLeft };
}
