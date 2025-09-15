import { useEffect } from "react";

export default function ScrollOnTop() {
  useEffect(() => {
    const scrollTopBtn = document.getElementById("scrollTopBtn");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
        scrollTopBtn?.classList.remove("hidden");
        } else {
        scrollTopBtn?.classList.add("hidden");
        }
    });

    scrollTopBtn?.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }, []);

  return null;
}