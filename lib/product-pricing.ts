/** Format integer paise consistently across public pricing displays. */
export const formatInrPaise = (paise: number) => {
  if (!Number.isSafeInteger(paise) || paise < 0) throw new RangeError("Prices must be non-negative integer paise.");
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(paise / 100);
};
