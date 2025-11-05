document.addEventListener("astro:page-load", () => {
  const input = document.getElementById("lessonFilter");
  const langSelect = document.getElementById("languageFilter");
  const groups = document.querySelectorAll(".lesson-group");

  function applyFilters() {
    const textValue = input.value.toLowerCase();
    const langValue = langSelect.value;
    groups.forEach((group) => {
      const g = group;
      const lang = g.dataset.lang;
      const items = g.querySelectorAll(".lesson-item");
      let visibleCount = 0;

      items.forEach((li) => {
        const text = li.textContent?.toLowerCase() ?? "";
        const matchesText = text.includes(textValue);
        const matchesLang = !langValue || lang === langValue;
        const visible = matchesText && matchesLang;
        li.style.display = visible ? "list-item" : "none";
        if (visible) visibleCount++;
      });

      g.style.display = visibleCount > 0 ? "block" : "none";
    });
  }

  input?.addEventListener("input", applyFilters);
  langSelect?.addEventListener("change", applyFilters);

  document.getElementById("toggleAll")?.addEventListener("click", () => {
    const details = document.querySelectorAll("details");
    const allOpen = Array.from(details).every((d) => d.open);
    details.forEach((d) => (d.open = !allOpen));
  });
});
