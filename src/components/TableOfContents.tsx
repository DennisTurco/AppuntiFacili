import { useEffect } from "react";

export default function Toc() {
  useEffect(() => {
    const content = document.getElementById("lesson-content");
    const tocContainer = document.getElementById("toc-container");
    if (!content || !tocContainer) return;

    tocContainer.innerHTML = ""; // reset TOC

    // 👉 Creo UL senza pallini
    const ul = document.createElement("ul");
    ul.className = "list-none space-y-2 text-sm"; // 👈 niente bullet + spaziatura
    tocContainer.appendChild(ul);

    const headers = Array.from(
      content.querySelectorAll("h2, h3, h4")
    ) as HTMLElement[];
    const links: HTMLAnchorElement[] = [];

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
      ul.appendChild(li); // 👈 adesso dentro UL, non container
      links.push(a);
    });

    // Funzione per evidenziare la sezione corrente
    const onScroll = () => {
      const scrollPos = window.scrollY + 120; // offset per top
      let currentIndex = -1;

      headers.forEach((header, idx) => {
        if (header.offsetTop <= scrollPos) {
          currentIndex = idx;
        }
      });

      links.forEach((link, idx) => {
        if (idx === currentIndex) {
          link.classList.add("font-bold", "text-blue-600");
        } else {
          link.classList.remove("font-bold", "text-blue-600");
        }
      });
    };

    window.addEventListener("scroll", onScroll);
    onScroll(); // run iniziale

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
