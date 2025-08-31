import { Toaster } from "react-hot-toast";

export default function ToasterProvider({ children }) {
  return (
    <>
      {children}
      <Toaster
        position="top-center"
        reverseOrder={false}  // opzionale: mantiene l'ordine normale dei toast
        gutter={8}            // spazio tra i toast
      />
    </>
  );
}
