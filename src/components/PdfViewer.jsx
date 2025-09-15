import React, { useEffect, useRef } from 'react';

const PDF_VIEW_SCRIPT_URL = "https://acrobatservices.adobe.com/view-sdk/viewer.js";
const ADOBE_CLIENT_ID = "bf958fb9666e4943a0a64fbd4473ab4c";
const VIEWER_ID = "pdf-viewer-div"; // Use a static ID

export default function PdfViewer({ src, title, height = "800px" }) {
  const viewerRef = useRef(null);

  useEffect(() => {
    // Carica lo script di Adobe solo se non è già presente
    const loadAdobeScript = () => {
      return new Promise((resolve) => {
        if (window.AdobeDC) {
          resolve();
          return;
        }

        const existingScript = document.querySelector(`script[src="${PDF_VIEW_SCRIPT_URL}"]`);
        if (existingScript) {
          existingScript.onload = () => resolve();
          return;
        }

        const adobeScript = document.createElement("script");
        adobeScript.src = PDF_VIEW_SCRIPT_URL;
        adobeScript.onload = () => resolve();
        document.body.appendChild(adobeScript);
      });
    };

    // Inizializza il visualizzatore Adobe
    loadAdobeScript().then(() => {
      if (window.AdobeDC) {
        const adobeDCView = new window.AdobeDC.View({
          clientId: ADOBE_CLIENT_ID,
          divId: VIEWER_ID // Use the static ID here
        });

        adobeDCView.previewFile({
          content: { location: { url: src } },
          metaData: { fileName: title }
        }, { embedMode: "IN_LINE" });
      }
    });

  }, [src, title]);

  return (
    <div
      id={VIEWER_ID} // Ensure the ID on the element matches the divId in the script
      ref={viewerRef}
      style={{ height }}
    ></div>
  );
}