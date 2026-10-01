/** Formatta una data in italiano, es. "1 ott 2026". */
export const getFormattedDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("it-IT", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";
