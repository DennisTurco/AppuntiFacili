import { useEffect } from "react";

export default function Toc() {
  useEffect(() => {
    const content = document.getElementById("lesson-content");
    const toc = document.getElementById("toc");
    if (!content || !toc) return;

    toc.innerHTML = ""; // reset ogni volta

    const headers = Array.from(content.querySelectorAll("h2, h3, h4"));
    headers.forEach((header) => {
      const id =
        header.id ||
        header.textContent?.trim().toLowerCase().replace(/\s+/g, "-");
      if (!id) return;
      header.id = id;

      const li = document.createElement("li");
      li.className =
        header.tagName === "H3"
          ? "ml-4"
          : header.tagName === "H4"
          ? "ml-8"
          : "";

      const a = document.createElement("a");
      a.href = `#${id}`;
      a.innerText = header.textContent || "";
      a.className = "hover:text-blue-600 transition";

      li.appendChild(a);
      toc.appendChild(li);
    });
  }, []);

  return null; // non renderizza nulla, solo logica
}
