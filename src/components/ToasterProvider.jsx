import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      gutter={8}
      toastOptions={{
        className: "rounded-xl! text-sm! shadow-lg! dark:bg-slate-800! dark:text-slate-100!",
      }}
    />
  );
}
