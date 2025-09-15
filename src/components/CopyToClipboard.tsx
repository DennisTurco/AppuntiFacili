import { useEffect } from "react";

export default function CopyToClipboard() {
  useEffect(() => {
    const copyButtonLabel = "Copia il codice";
    const codeBlocks = Array.from(document.querySelectorAll("pre"));

    for (const codeBlock of codeBlocks) {
      if (!codeBlock.parentNode) continue;

      const codeEl = codeBlock.querySelector("code");
      if (!codeEl) continue;

      // Salta i blocchi mermaid
      if (codeEl.className.toLowerCase().includes("mermaid")) continue;

      // Wrapper per contenere blocco e bottone
      const wrapper = document.createElement("div");
      wrapper.style.position = "relative";

      // Bottone copia
      const copyButton = document.createElement("button");
      copyButton.className = "copy-code";
      copyButton.innerHTML = copyButtonLabel;
      copyButton.style.position = "absolute";
      copyButton.style.top = "5px";
      copyButton.style.right = "5px";

      codeBlock.setAttribute("tabindex", "0");

      codeBlock.parentNode.insertBefore(wrapper, codeBlock);
      wrapper.appendChild(codeBlock);
      wrapper.appendChild(copyButton);

      copyButton.addEventListener("click", async () => {
        await copyCode(codeBlock, copyButton);
      });
    }

    async function copyCode(block: HTMLPreElement, button: HTMLButtonElement) {
      const code = block.querySelector("code");
      if (!code) return;

      const text = code.textContent || "";

      try {
        await navigator.clipboard.writeText(text);
        button.innerText = "Codice copiato";
        setTimeout(() => {
          button.innerText = copyButtonLabel;
        }, 700);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  }, []);

  return null;
}
