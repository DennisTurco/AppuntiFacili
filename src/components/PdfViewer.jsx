import React, { useEffect, useRef } from 'react';

const PDF_VIEW_SCRIPT_URL = "https://acrobatservices.adobe.com/view-sdk/viewer.js";
const ADOBE_CLIENT_ID = "bf958fb9666e4943a0a64fbd4473ab4c";

export default function PdfViewer({ src, title, height = "800px" }) {
  const viewerRef = useRef(null);
  const viewerId = useRef(`adobe-pdf-viewer-${Math.random().toString(36).substring(2, 9)}`);

  useEffect(() => {
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

    loadAdobeScript().then(() => {
      if (viewerRef.current && window.AdobeDC) {
        const adobeDCView = new window.AdobeDC.View({
          clientId: ADOBE_CLIENT_ID,
          divId: viewerId.current // Usa l'ID unico
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
      id={viewerId.current} // Assegna l'ID unico all'elemento DOM
      ref={viewerRef}
      style={{ height }}
    ></div>
  );
}