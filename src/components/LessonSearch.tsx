import { useEffect } from "react";

export default function LessonSearch() {
  useEffect(() => {
    const searchInput = document.getElementById("lesson-search") as HTMLInputElement | null;
    const lessonContainers = Array.from(document.querySelectorAll<HTMLDivElement>("#lessons-list > div"));

    searchInput?.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();

      lessonContainers.forEach((container) => {
        let anyVisible = false;
        const items = Array.from(container.querySelectorAll<HTMLLIElement>("li"));

        items.forEach((item) => {
          const title = item.dataset.title || "";
          const match = title.includes(query);
          (item as HTMLElement).style.display = match ? "block" : "none";
          if (match) anyVisible = true;
        });

        (container as HTMLElement).style.display = anyVisible ? "block" : "none";
      });
    });
  }, []);

  return null;
}
