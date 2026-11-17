PDFTools Ultimate Office & AI Platform
====================================

CONTENTS
- Existing PDF tools and cinematic intro retained.
- Added Office Productivity cards: Scan to PDF, Invoice, Quotation, Receipt, Letter, CV, OCR, CSV Viewer, Image Resizer, Image to PDF, Word Counter and Text Cleaner.
- Added per-card hover animations and a floating PDFTools Assistant.

HOW TO USE
1. Extract this ZIP.
2. Open the `PDF Tool` folder in VS Code.
3. Run index.html with Live Server, or deploy the folder contents to your GitHub Pages repository.
4. For camera scanning, use HTTPS (GitHub Pages is HTTPS) and allow camera permission. You can also upload photos.
5. Invoice/quotation/receipt/letter/CV use the browser print dialog; choose Save as PDF.

IMPORTANT LIMITATIONS
- The assistant included here is a local guided helper with built-in answers. It is NOT a connected ChatGPT-level generative AI service. For full general AI responses, connect a secure backend/API; never put a secret API key in script.js or public HTML.
- OCR loads Tesseract.js from a CDN and currently recognizes English (eng). Internet is required for the library.
- Camera capture support depends on browser/device permissions. Uploaded images are an alternative.
- Existing PDF features depend on their original browser libraries and the user's browser.
- Test all features before publishing. This package has not been browser-tested on every device.


VERSION 2 ADDITIONS
- Premium hover motion now applies to both original PDF cards and new office cards, with varied icon movement by card position.
- Added tool search/filter, Duplicate Text Remover, Text Case Converter, Image Compressor, QR Code Maker and PDF Page Counter.
- These are browser-side utilities where possible. QR code generation uses the included qrcodejs CDN library.

\nVERSION 3 NOTES\n- Redesigned About section with service descriptions, audience/goal messaging and WhatsApp consultation CTA.\n- WhatsApp consultation number: +92 370 0666959 (wa.me link).\n- Added scroll-triggered reveal and subtle 3D card motion, respecting reduced-motion preferences.\n- Added an honest roadmap section for advanced conversions, editing, password/forms, PDF chat, translation and Urdu OCR; these are labeled as planned/integration-required rather than falsely presented as working.\n
\nVERSION 4 — WORKING TOOLS ONLY\n- Removed the non-functional planned-feature roadmap cards.\n- Removed duplicate QR Code Maker and Image Compressor cards because equivalent original tools already exist.\n- Kept existing PDF tools and office tools that have implemented handlers in script.js.\n- Added missing display names for Duplicate Text Remover, Text Case Converter and PDF Page Counter.\n- Improved mobile card layout and keyboard focus visibility.\n- Note: external libraries/CDNs, browser permissions, pop-up settings and device support may affect individual tools. Test each tool before public launch.\n