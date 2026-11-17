const modal = document.getElementById("toolModal");
const modalOverlay = document.getElementById("modalOverlay");
const closeModal = document.getElementById("closeModal");
const toolContent = document.getElementById("toolContent");

const toolCards = document.querySelectorAll(".tool-card");

const toolNames = {
    merge: "Merge PDF",
    "jpg-to-pdf": "JPG to PDF",
    "pdf-to-jpg": "PDF to JPG",
    split: "Split PDF",
    compress: "Compress PDF",
    rotate: "Rotate PDF",
    "delete-pages": "Delete Pages",
    extract: "Extract Pages",
    watermark: "Watermark PDF",
    "text-to-pdf": "Text to PDF",
    qr: "QR Code",
    "image-compress": "Compress Image"
};


// ===============================
// OPEN TOOL
// ===============================

function openTool(tool) {

    if (!tool) {
        return;
    }

    if (tool === "jpg-to-pdf") {
        openJpgToPdf();
        return;
    }
    if (tool === "merge") {
        openMergePdf();
        return;
    }
    if (tool === "pdf-to-jpg") {
    openPdfToJpg();
    return;
}
if (tool === "split") {
    openSplitPdf();
    return;
}
if (tool === "rotate") {
    openRotatePdf();
    return;
}
if (tool === "delete-pages") {
    openDeletePages();
    return;
}

if (tool === "extract") {
    openExtractPages();
    return;
}

if (tool === "compress") {
    openCompressPdf();
    return;
}
if (tool === "watermark") {
    openWatermarkPdf();
    return;
}

if (tool === "text-to-pdf") {
    openTextToPdf();
    return;
}

if (tool === "qr") {
    openQrCode();
    return;
}

if (tool === "image-compress") {
    openImageCompress();
    return;
}



// ===============================
// SPLIT PDF
// ===============================

function openSplitPdf() {
    toolContent.innerHTML = `
        <h2>Split PDF</h2>

        <p>Select a PDF and choose the pages you want to keep.</p>

        <label class="upload-area">
            <input
                type="file"
                id="splitPdfInput"
                accept="application/pdf"
                hidden
            >

            <span class="upload-icon">↑</span>

            <strong>Choose PDF</strong>

            <small>Select one PDF file</small>
        </label>

        <div id="splitPages"></div>

        <button
            class="process-button"
            id="splitPdfButton"
        >
            Split PDF
        </button>
    `;

    modal.classList.add("active");

    const input = document.getElementById("splitPdfInput");
    const pagesBox = document.getElementById("splitPages");
    const button = document.getElementById("splitPdfButton");

    let pdf = null;

    input.addEventListener("change", async () => {
        if (!input.files.length) return;

        pagesBox.innerHTML = "Loading pages...";

        try {
            const bytes = await input.files[0].arrayBuffer();

            pdf = await PDFLib.PDFDocument.load(bytes);

            pagesBox.innerHTML = "";

            for (let i = 0; i < pdf.getPageCount(); i++) {
                const label = document.createElement("label");

                label.style.display = "block";
                label.style.padding = "10px";
                label.style.margin = "5px 0";
                label.style.background =
                    "rgba(255,255,255,0.05)";
                label.style.borderRadius = "8px";

                label.innerHTML = `
                    <input
                        type="checkbox"
                        value="${i}"
                    >
                    Page ${i + 1}
                `;

                pagesBox.appendChild(label);
            }

        } catch (error) {
            console.error(error);
            pagesBox.innerHTML = "Invalid PDF file.";
        }
    });

    button.addEventListener("click", async () => {
        if (!pdf) {
            alert("Please select a PDF first.");
            return;
        }

        const checked = pagesBox.querySelectorAll(
            'input[type="checkbox"]:checked'
        );

        if (!checked.length) {
            alert("Please select at least one page.");
            return;
        }

        button.disabled = true;
        button.textContent = "Creating PDF...";

        try {
            const newPdf = await PDFLib.PDFDocument.create();

            const pageIndexes = Array.from(checked).map(
                checkbox => Number(checkbox.value)
            );

            const pages = await newPdf.copyPages(
                pdf,
                pageIndexes
            );

            pages.forEach(page => {
                newPdf.addPage(page);
            });

            const pdfBytes = await newPdf.save();

            const blob = new Blob(
                [pdfBytes],
                { type: "application/pdf" }
            );

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = "split.pdf";

            link.click();

            URL.revokeObjectURL(url);

            button.textContent = "PDF Downloaded ✓";

        } catch (error) {
            console.error(error);

            alert("PDF split nahi ho saki.");

            button.disabled = false;
            button.textContent = "Split PDF";
        }
    });
}
// ===============================
// ROTATE PDF
// ===============================

function openRotatePdf() {
    toolContent.innerHTML = `
        <h2>Rotate PDF</h2>

        <p>Upload a PDF and rotate all pages.</p>

        <label class="upload-area">
            <input
                type="file"
                id="rotatePdfInput"
                accept="application/pdf"
                hidden
            >

            <span class="upload-icon">↑</span>

            <strong>Choose PDF</strong>

            <small>Select one PDF file</small>
        </label>

        <select
            id="rotateAngle"
            style="
                width:100%;
                padding:12px;
                margin:15px 0;
                border-radius:8px;
                background:#111827;
                color:white;
                border:1px solid rgba(255,255,255,0.15);
            "
        >
            <option value="90">Rotate 90°</option>
            <option value="180">Rotate 180°</option>
            <option value="270">Rotate 270°</option>
        </select>

        <button
            class="process-button"
            id="rotatePdfButton"
        >
            Rotate PDF
        </button>
    `;

    modal.classList.add("active");

    const input = document.getElementById("rotatePdfInput");
    const angleSelect = document.getElementById("rotateAngle");
    const button = document.getElementById("rotatePdfButton");

    button.addEventListener("click", async () => {

        if (!input.files.length) {
            alert("Please select a PDF file.");
            return;
        }

        button.disabled = true;
        button.textContent = "Rotating...";

        try {
            const bytes = await input.files[0].arrayBuffer();

            const pdf = await PDFLib.PDFDocument.load(bytes);

            const angle = Number(angleSelect.value);

            const pages = pdf.getPages();

            pages.forEach(page => {
                page.setRotation(
                    PDFLib.degrees(angle)
                );
            });

            const pdfBytes = await pdf.save();

            const blob = new Blob(
                [pdfBytes],
                { type: "application/pdf" }
            );

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = "rotated.pdf";

            link.click();

            URL.revokeObjectURL(url);

            button.textContent = "PDF Downloaded ✓";

        } catch (error) {
            console.error(error);

            alert("PDF rotate nahi ho saki.");

            button.disabled = false;
            button.textContent = "Rotate PDF";
        }
    });
}

// ===============================
// DELETE PAGES
// ===============================

function openDeletePages() {
    toolContent.innerHTML = `
        <h2>Delete Pages</h2>

        <p>Select a PDF and choose the pages you want to remove.</p>

        <label class="upload-area">
            <input
                type="file"
                id="deletePagesInput"
                accept="application/pdf"
                hidden
            >

            <span class="upload-icon">↑</span>

            <strong>Choose PDF</strong>

            <small>Select one PDF file</small>
        </label>

        <div id="deletePagesList"></div>

        <button
            class="process-button"
            id="deletePagesButton"
        >
            Delete Selected Pages
        </button>
    `;

    modal.classList.add("active");

    const input = document.getElementById("deletePagesInput");
    const pagesBox = document.getElementById("deletePagesList");
    const button = document.getElementById("deletePagesButton");

    let pdf = null;

    input.addEventListener("change", async () => {
        if (!input.files.length) return;

        pagesBox.innerHTML = "Loading pages...";

        try {
            const bytes = await input.files[0].arrayBuffer();

            pdf = await PDFLib.PDFDocument.load(bytes);

            pagesBox.innerHTML = "";

            for (let i = 0; i < pdf.getPageCount(); i++) {
                const label = document.createElement("label");

                label.style.display = "block";
                label.style.padding = "10px";
                label.style.margin = "5px 0";
                label.style.background =
                    "rgba(255,255,255,0.05)";
                label.style.borderRadius = "8px";

                label.innerHTML = `
                    <input
                        type="checkbox"
                        value="${i}"
                    >
                    Delete Page ${i + 1}
                `;

                pagesBox.appendChild(label);
            }

        } catch (error) {
            console.error(error);
            pagesBox.innerHTML = "Invalid PDF file.";
        }
    });

    button.addEventListener("click", async () => {

        if (!pdf) {
            alert("Please select a PDF first.");
            return;
        }

        const selected = Array.from(
            pagesBox.querySelectorAll(
                'input[type="checkbox"]:checked'
            )
        ).map(checkbox => Number(checkbox.value));

        if (!selected.length) {
            alert("Please select at least one page to delete.");
            return;
        }

        if (selected.length >= pdf.getPageCount()) {
            alert("At least one page must remain.");
            return;
        }

        button.disabled = true;
        button.textContent = "Deleting Pages...";

        try {
            const newPdf = await PDFLib.PDFDocument.create();

            const keepPages = [];

            for (let i = 0; i < pdf.getPageCount(); i++) {
                if (!selected.includes(i)) {
                    keepPages.push(i);
                }
            }

            const pages = await newPdf.copyPages(
                pdf,
                keepPages
            );

            pages.forEach(page => {
                newPdf.addPage(page);
            });

            const pdfBytes = await newPdf.save();

            const blob = new Blob(
                [pdfBytes],
                { type: "application/pdf" }
            );

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = "pages-deleted.pdf";

            link.click();

            URL.revokeObjectURL(url);

            button.textContent = "PDF Downloaded ✓";

        } catch (error) {
            console.error(error);

            alert("Pages delete nahi ho saken.");

            button.disabled = false;
            button.textContent = "Delete Selected Pages";
        }
    });
}

// ===============================
// EXTRACT PAGES
// ===============================

function openExtractPages() {
    toolContent.innerHTML = `
        <h2>Extract Pages</h2>

        <p>Select a PDF and choose the pages you want to extract.</p>

        <label class="upload-area">
            <input
                type="file"
                id="extractPagesInput"
                accept="application/pdf"
                hidden
            >

            <span class="upload-icon">↑</span>

            <strong>Choose PDF</strong>

            <small>Select one PDF file</small>
        </label>

        <div id="extractPagesList"></div>

        <button
            class="process-button"
            id="extractPagesButton"
        >
            Extract Pages
        </button>
    `;

    modal.classList.add("active");

    const input = document.getElementById("extractPagesInput");
    const pagesBox = document.getElementById("extractPagesList");
    const button = document.getElementById("extractPagesButton");

    let pdf = null;

    input.addEventListener("change", async () => {
        if (!input.files.length) return;

        pagesBox.innerHTML = "Loading pages...";

        try {
            const bytes = await input.files[0].arrayBuffer();

            pdf = await PDFLib.PDFDocument.load(bytes);

            pagesBox.innerHTML = "";

            for (let i = 0; i < pdf.getPageCount(); i++) {
                const label = document.createElement("label");

                label.style.display = "block";
                label.style.padding = "10px";
                label.style.margin = "5px 0";
                label.style.background =
                    "rgba(255,255,255,0.05)";
                label.style.borderRadius = "8px";

                label.innerHTML = `
                    <input
                        type="checkbox"
                        value="${i}"
                    >
                    Extract Page ${i + 1}
                `;

                pagesBox.appendChild(label);
            }

        } catch (error) {
            console.error(error);
            pagesBox.innerHTML = "Invalid PDF file.";
        }
    });

    button.addEventListener("click", async () => {

        if (!pdf) {
            alert("Please select a PDF first.");
            return;
        }

        const selected = Array.from(
            pagesBox.querySelectorAll(
                'input[type="checkbox"]:checked'
            )
        ).map(checkbox => Number(checkbox.value));

        if (!selected.length) {
            alert("Please select at least one page.");
            return;
        }

        button.disabled = true;
        button.textContent = "Extracting...";

        try {
            const newPdf = await PDFLib.PDFDocument.create();

            const pages = await newPdf.copyPages(
                pdf,
                selected
            );

            pages.forEach(page => {
                newPdf.addPage(page);
            });

            const pdfBytes = await newPdf.save();

            const blob = new Blob(
                [pdfBytes],
                { type: "application/pdf" }
            );

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = "extracted-pages.pdf";

            link.click();

            URL.revokeObjectURL(url);

            button.textContent = "PDF Downloaded ✓";

        } catch (error) {
            console.error(error);

            alert("Pages extract nahi ho saken.");

            button.disabled = false;
            button.textContent = "Extract Pages";
        }
    });
}

// ===============================
// COMPRESS PDF
// ===============================

function openCompressPdf() {
    toolContent.innerHTML = `
        <h2>Compress PDF</h2>

        <p>Select a PDF and create a smaller optimized copy.</p>

        <label class="upload-area">
            <input
                type="file"
                id="compressPdfInput"
                accept="application/pdf"
                hidden
            >

            <span class="upload-icon">↑</span>

            <strong>Choose PDF</strong>

            <small>Select one PDF file</small>
        </label>

        <button
            class="process-button"
            id="compressPdfButton"
        >
            Compress PDF
        </button>
    `;

    modal.classList.add("active");

    const input = document.getElementById("compressPdfInput");
    const button = document.getElementById("compressPdfButton");

    button.addEventListener("click", async () => {

        if (!input.files.length) {
            alert("Please select a PDF first.");
            return;
        }

        button.disabled = true;
        button.textContent = "Compressing...";

        try {
            const bytes = await input.files[0].arrayBuffer();

            const pdf = await PDFLib.PDFDocument.load(bytes);

            const compressedBytes = await pdf.save({
                useObjectStreams: true,
                addDefaultPage: false
            });

            const blob = new Blob(
                [compressedBytes],
                { type: "application/pdf" }
            );

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = "compressed.pdf";

            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(url);

            button.textContent = "PDF Downloaded ✓";

        } catch (error) {
            console.error(error);

            alert("PDF compress nahi ho saki.");

            button.disabled = false;
            button.textContent = "Compress PDF";
        }
    });
}

// ===============================
// WATERMARK PDF
// ===============================

function openWatermarkPdf() {
    toolContent.innerHTML = `
        <h2>Watermark PDF</h2>

        <p>Add a text watermark to every page.</p>

        <label class="upload-area">
            <input
                type="file"
                id="watermarkPdfInput"
                accept="application/pdf"
                hidden
            >

            <span class="upload-icon">↑</span>

            <strong>Choose PDF</strong>

            <small>Select one PDF file</small>
        </label>

        <input
            type="text"
            id="watermarkText"
            placeholder="Enter watermark text"
            style="
                width:100%;
                padding:12px;
                margin:15px 0;
                border-radius:8px;
                background:#111827;
                color:white;
                border:1px solid rgba(255,255,255,0.15);
            "
        >

        <button
            class="process-button"
            id="watermarkButton"
        >
            Add Watermark
        </button>
    `;

    modal.classList.add("active");

    const input = document.getElementById("watermarkPdfInput");
    const textInput = document.getElementById("watermarkText");
    const button = document.getElementById("watermarkButton");

    button.addEventListener("click", async () => {

        if (!input.files.length) {
            alert("Please select a PDF first.");
            return;
        }

        if (!textInput.value.trim()) {
            alert("Please enter watermark text.");
            return;
        }

        button.disabled = true;
        button.textContent = "Adding Watermark...";

        try {
            const bytes = await input.files[0].arrayBuffer();

            const pdf = await PDFLib.PDFDocument.load(bytes);

            const pages = pdf.getPages();

            const font = await pdf.embedFont(
                PDFLib.StandardFonts.Helvetica
            );

            const watermark = textInput.value.trim();

            pages.forEach(page => {
                const { width, height } = page.getSize();

                page.drawText(watermark, {
                    x: width / 2 - 80,
                    y: height / 2,
                    size: 30,
                    font: font,
                    opacity: 0.25,
                    rotate: PDFLib.degrees(45)
                });
            });

            const pdfBytes = await pdf.save();

            const blob = new Blob(
                [pdfBytes],
                { type: "application/pdf" }
            );

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = "watermarked.pdf";

            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(url);

            button.textContent = "PDF Downloaded ✓";

        } catch (error) {
            console.error(error);

            alert("Watermark add nahi ho saka.");

            button.disabled = false;
            button.textContent = "Add Watermark";
        }
    });
}

// ===============================
// TEXT TO PDF
// ===============================

function openTextToPdf() {
    toolContent.innerHTML = `
        <h2>Text to PDF</h2>

        <p>Write your text and convert it into a PDF.</p>

        <textarea
            id="textToPdfInput"
            placeholder="Write your text here..."
            style="
                width:100%;
                min-height:220px;
                padding:15px;
                margin:15px 0;
                border-radius:10px;
                background:#111827;
                color:white;
                border:1px solid rgba(255,255,255,0.15);
                resize:vertical;
                font-size:16px;
            "
        ></textarea>

        <button
            class="process-button"
            id="textToPdfButton"
        >
            Create PDF
        </button>
    `;

    modal.classList.add("active");

    const textInput =
        document.getElementById("textToPdfInput");

    const button =
        document.getElementById("textToPdfButton");

    button.addEventListener("click", async () => {

        const text = textInput.value.trim();

        if (!text) {
            alert("Please enter some text.");
            return;
        }

        button.disabled = true;
        button.textContent = "Creating PDF...";

        try {
            const pdf = await PDFLib.PDFDocument.create();

            const font = await pdf.embedFont(
                PDFLib.StandardFonts.Helvetica
            );

            const page = pdf.addPage([
                595.28,
                841.89
            ]);

            const fontSize = 14;
            const margin = 50;
            const lineHeight = 22;

            const lines = text.split("\n");

            let y = 790;

            for (const line of lines) {

                if (y < margin) {
                    y = 790;
                    pdf.addPage([
                        595.28,
                        841.89
                    ]);
                }

                page.drawText(line, {
                    x: margin,
                    y: y,
                    size: fontSize,
                    font: font
                });

                y -= lineHeight;
            }

            const pdfBytes = await pdf.save();

            const blob = new Blob(
                [pdfBytes],
                { type: "application/pdf" }
            );

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = "text-document.pdf";

            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(url);

            button.textContent = "PDF Downloaded ✓";

        } catch (error) {

            console.error(error);

            alert("PDF create nahi ho saki.");

            button.disabled = false;
            button.textContent = "Create PDF";
        }
    });
}

    const name = toolNames[tool] || "PDF Tool";

    toolContent.innerHTML = `
        <h2>${name}</h2>

        <p>
            This tool will be added in the next development step.
        </p>
    `;

    modal.classList.add("active");
}
function openMergePdf() {
    toolContent.innerHTML = `
        <h2>Merge PDF</h2>

        <p>
            Select two or more PDF files and combine them
            into one PDF.
        </p>

        <label class="upload-area">
            <input
                type="file"
                id="mergePdfInput"
                accept="application/pdf"
                multiple
                hidden
            >

            <span class="upload-icon">↑</span>

            <strong>Choose PDF Files</strong>

            <small>
                Select 2 or more PDF files
            </small>
        </label>

        <div id="mergeFileList"></div>

        <button
            class="process-button"
            id="mergePdfButton"
        >
            Merge PDFs
        </button>
    `;

    modal.classList.add("active");

    const input = document.getElementById("mergePdfInput");
    const fileList = document.getElementById("mergeFileList");
    const mergeButton = document.getElementById("mergePdfButton");

    input.addEventListener("change", () => {
        fileList.innerHTML = "";

        Array.from(input.files).forEach((file, index) => {
            const item = document.createElement("div");

            item.textContent = `${index + 1}. ${file.name}`;

            item.style.padding = "10px";
            item.style.margin = "6px 0";
            item.style.background = "rgba(255,255,255,0.05)";
            item.style.borderRadius = "8px";

            fileList.appendChild(item);
        });
    });

    mergeButton.addEventListener("click", async () => {
        if (input.files.length < 2) {
            alert("Please select at least 2 PDF files.");
            return;
        }

        mergeButton.disabled = true;
        mergeButton.textContent = "Merging PDFs...";

        try {
            const mergedPdf = await PDFLib.PDFDocument.create();

            for (const file of input.files) {
                const fileBytes = await file.arrayBuffer();

                const pdf = await PDFLib.PDFDocument.load(fileBytes);

                const pages = await mergedPdf.copyPages(
                    pdf,
                    pdf.getPageIndices()
                );

                pages.forEach(page => {
                    mergedPdf.addPage(page);
                });
            }

            const pdfBytes = await mergedPdf.save();

            const blob = new Blob(
                [pdfBytes],
                { type: "application/pdf" }
            );

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = "merged.pdf";

            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(url);

            mergeButton.textContent = "PDF Merged ✓";

        } catch (error) {
            console.error(error);

            alert(
                "PDF merge nahi ho saki. Dobara try karein."
            );

            mergeButton.disabled = false;
            mergeButton.textContent = "Merge PDFs";
        }
    });
}

// ===============================
// PDF TO JPG
// ===============================

function openPdfToJpg() {
   

    toolContent.innerHTML = `
        <h2>PDF to JPG</h2>

        <p>
            Select a PDF and convert its pages into JPG images.
        </p>

        <label class="upload-area">
            <input
                type="file"
                id="pdfToJpgInput"
                accept="application/pdf"
                hidden
            >

            <span class="upload-icon">↑</span>

            <strong>Choose PDF</strong>

            <small>
                Select one PDF file
            </small>
        </label>

        <div id="pdfJpgPreview"></div>

        <button
            class="process-button"
            id="convertPdfToJpgButton"
        >
            Convert to JPG
        </button>
    `;

    modal.classList.add("active");

    const input = document.getElementById("pdfToJpgInput");
    const preview = document.getElementById("pdfJpgPreview");
    const button = document.getElementById("convertPdfToJpgButton");

    button.addEventListener("click", async () => {

        if (!input.files.length) {
            alert("Please select a PDF file.");
            return;
        }

        button.disabled = true;
        button.textContent = "Converting...";

        try {
            const pdfjsLib = await import(
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs"
            );

            pdfjsLib.GlobalWorkerOptions.workerSrc =
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs";

            const file = input.files[0];
            const arrayBuffer = await file.arrayBuffer();

            const pdf = await pdfjsLib.getDocument({
                data: arrayBuffer
            }).promise;

            preview.innerHTML = "";

            for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {

                const page = await pdf.getPage(pageNumber);

                const viewport = page.getViewport({
                    scale: 1.5
                });

                const canvas = document.createElement("canvas");

                const context = canvas.getContext("2d");

                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;

                const imageUrl = canvas.toDataURL(
                    "image/jpeg",
                    0.92
                );

                const container = document.createElement("div");

                container.style.margin = "20px 0";
                container.style.padding = "15px";
                container.style.background =
                    "rgba(255,255,255,0.05)";
                container.style.borderRadius = "12px";

                const image = document.createElement("img");

                image.src = imageUrl;
                image.style.width = "100%";
                image.style.maxWidth = "500px";
                image.style.display = "block";
                image.style.marginBottom = "12px";
                image.style.borderRadius = "8px";

                const downloadButton =
                    document.createElement("button");

                downloadButton.className = "process-button";
                downloadButton.textContent =
                    `Download Page ${pageNumber} JPG`;

                downloadButton.onclick = () => {

                    const link =
                        document.createElement("a");

                    link.href = imageUrl;

                    link.download =
                        `page-${pageNumber}.jpg`;

                    document.body.appendChild(link);

                    link.click();

                    link.remove();
                };

                container.appendChild(image);
                container.appendChild(downloadButton);

                preview.appendChild(container);
            }

            button.textContent = "Conversion Complete ✓";

        } catch (error) {

            console.error(error);

            alert(
                "PDF convert nahi ho saki. Dobara try karein."
            );

            button.disabled = false;
            button.textContent = "Convert to JPG";
        }
    });
}

// ===============================
// JPG TO PDF
// ===============================

function openJpgToPdf() {

    toolContent.innerHTML = `
        <h2>JPG to PDF</h2>

        <p>
            Select one or more JPG/PNG images and convert them into
            a single PDF file.
        </p>

        <label class="upload-area">

            <input
                type="file"
                id="jpgInput"
                accept="image/jpeg,image/png"
                multiple
                hidden
            >

            <span class="upload-icon">↑</span>

            <strong>Choose Images</strong>

            <small>
                JPG or PNG — You can select multiple images
            </small>

        </label>

        <div id="imagePreview"></div>

        <button
            class="process-button"
            id="convertJpgButton"
        >
            Convert to PDF
        </button>
    `;

    modal.classList.add("active");

    const input = document.getElementById("jpgInput");
    const preview = document.getElementById("imagePreview");
    const convertButton =
        document.getElementById("convertJpgButton");


    // ===============================
    // IMAGE PREVIEW
    // ===============================

    input.addEventListener("change", () => {

        preview.innerHTML = "";

        if (!input.files.length) {
            return;
        }

        Array.from(input.files).forEach(file => {

            const image = document.createElement("img");

            image.src = URL.createObjectURL(file);

            image.style.width = "100px";
            image.style.height = "100px";
            image.style.objectFit = "cover";
            image.style.margin = "8px";
            image.style.borderRadius = "10px";

            preview.appendChild(image);

        });

    });


    // ===============================
    // CONVERT JPG TO PDF
    // ===============================

    convertButton.addEventListener("click", async () => {

        if (!input.files.length) {

            alert("Please select at least one image.");

            return;
        }

        convertButton.disabled = true;

        convertButton.textContent =
            "Creating PDF...";


        try {

            const pdfDoc =
                await PDFLib.PDFDocument.create();


            for (const file of input.files) {

                const imageBytes =
                    await file.arrayBuffer();

                let image;


                if (file.type === "image/jpeg") {

                    image =
                        await pdfDoc.embedJpg(imageBytes);

                } else {

                    image =
                        await pdfDoc.embedPng(imageBytes);

                }


                const width = image.width;
                const height = image.height;


                const page =
                    pdfDoc.addPage([
                        width,
                        height
                    ]);


                page.drawImage(image, {

                    x: 0,
                    y: 0,

                    width: width,
                    height: height

                });

            }


            const pdfBytes =
                await pdfDoc.save();


            const blob =
                new Blob(
                    [pdfBytes],
                    {
                        type: "application/pdf"
                    }
                );


            const url =
                URL.createObjectURL(blob);


            const link =
                document.createElement("a");


            link.href = url;

            link.download =
                "converted-images.pdf";


            document.body.appendChild(link);

            link.click();

            link.remove();


            URL.revokeObjectURL(url);


            convertButton.textContent =
                "PDF Downloaded ✓";


        } catch (error) {

            console.error(error);


            alert(
                "PDF create nahi ho saki. Dobara try karein."
            );


            convertButton.disabled = false;

            convertButton.textContent =
                "Convert to PDF";

        }

    });

}


// ===============================
// ALL TOOL CARDS CLICKABLE
// ===============================

toolCards.forEach(card => {

    card.addEventListener("click", event => {

        // Agar card ke andar button/link ho
        // to uska normal action bhi card ke through chalega

        const tool =
            card.dataset.tool;


        if (tool) {

            openTool(tool);

        }

    });

});


// ===============================
// CLOSE MODAL
// ===============================

function closeTool() {

    modal.classList.remove("active");

}


// Close button

closeModal.addEventListener(
    "click",
    closeTool
);


// Close when clicking outside modal

modalOverlay.addEventListener(
    "click",
    event => {

        if (event.target === modalOverlay) {

            closeTool();

        }

    }
);


// Close with Escape key

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeTool();

        }

    }
);


// ===============================
// NAVIGATION FIX
// ===============================

const toolsLink = document.querySelector('.nav-links a[href="#tools"]');

const aboutLink = document.querySelector('.nav-links a[href="#about"]');


// TOOLS NAVIGATION

if (toolsLink) {

    toolsLink.addEventListener("click", function(event) {

        event.preventDefault();

        closeTool();

        document.getElementById("tools").scrollIntoView({
            behavior: "smooth"
        });

    });

}


// ABOUT NAVIGATION

if (aboutLink) {

    aboutLink.addEventListener("click", function(event) {

        event.preventDefault();

        closeTool();

        document.getElementById("about").scrollIntoView({
            behavior: "smooth"
        });

    });

}
function openQrCode() {
    toolContent.innerHTML = `
        <h2>QR Code Generator</h2>
        <p>Enter text or a link and generate a QR code.</p>

        <input
            type="text"
            id="qrInput"
            placeholder="Enter text or URL..."
            style="
                width:100%;
                padding:14px;
                margin:15px 0;
                border-radius:10px;
                background:#111827;
                color:white;
                border:1px solid rgba(255,255,255,0.15);
                font-size:16px;
            "
        >

        <button class="process-button" id="qrButton">
            Generate QR Code
        </button>

        <div id="qrResult" style="
            margin-top:20px;
            text-align:center;
        "></div>
    `;

    modal.classList.add("active");

    const input = document.getElementById("qrInput");
    const button = document.getElementById("qrButton");
    const result = document.getElementById("qrResult");

    button.addEventListener("click", () => {

        const text = input.value.trim();

        if (!text) {
            alert("Please enter text or a URL.");
            return;
        }

        const qrUrl =
            "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" +
            encodeURIComponent(text);

        result.innerHTML = `
            <img
                src="${qrUrl}"
                alt="Generated QR Code"
                style="
                    width:300px;
                    max-width:100%;
                    border-radius:12px;
                    background:white;
                    padding:10px;
                "
            >

            <br><br>

            <button
    id="downloadQrButton"
    class="process-button"
    style="display:inline-block;"
>
    Download QR Code
</button>
        `;
    });
}


function openQrCode() {
    toolContent.innerHTML = `
        <h2>QR Code Generator</h2>
        <p>Enter text or a link and generate a QR code.</p>

        <input
            type="text"
            id="qrInput"
            placeholder="Enter text or URL..."
            style="
                width:100%;
                padding:14px;
                margin:15px 0;
                border-radius:10px;
                background:#111827;
                color:white;
                border:1px solid rgba(255,255,255,0.15);
                font-size:16px;
            "
        >

        <button class="process-button" id="qrButton">
            Generate QR Code
        </button>

        <div id="qrResult" style="
            margin-top:20px;
            text-align:center;
        "></div>
    `;

    modal.classList.add("active");

    const input = document.getElementById("qrInput");
    const button = document.getElementById("qrButton");
    const result = document.getElementById("qrResult");

    button.addEventListener("click", () => {
        const text = input.value.trim();

        if (!text) {
            alert("Please enter text or a URL.");
            return;
        }

        result.innerHTML = `
            <div id="qrCodeBox"></div>

            <br>

            <button
                id="downloadQrButton"
                class="process-button"
            >
                Download QR Code
            </button>
        `;

        const qrBox = document.getElementById("qrCodeBox");

        new QRCode(qrBox, {
            text: text,
            width: 300,
            height: 300,
            correctLevel: QRCode.CorrectLevel.H
        });

        const downloadButton =
            document.getElementById("downloadQrButton");

        downloadButton.addEventListener("click", () => {
            const canvas = qrBox.querySelector("canvas");

            if (!canvas) {
                alert("QR Code ready nahi hua.");
                return;
            }

            const link = document.createElement("a");

            link.download = "qr-code.png";
            link.href = canvas.toDataURL("image/png");

            document.body.appendChild(link);
            link.click();
            link.remove();
        });
    });
}



/* =========================================
   PDFTOOLS CINEMATIC INTRO CONTROLLER
========================================= */
(function initPdfToolsIntro() {
    if (window.__pdfToolsIntroInitialized) return;
    window.__pdfToolsIntroInitialized = true;

    const screen = document.getElementById("introScreen");
    if (!screen) return;

    document.body.classList.add("intro-active");

    let finished = false;
    const finishIntro = () => {
        if (finished) return;
        finished = true;
        screen.classList.add("is-leaving");
        document.body.classList.remove("intro-active");
        window.setTimeout(() => screen.remove(), 900);
    };

    const skipButton = document.getElementById("introSkip");
    if (skipButton) skipButton.addEventListener("click", finishIntro);

    // Play on every page opening as requested; auto-finish after the brand reveal.
    window.setTimeout(finishIntro, 5700);
})();


/* ===== PDFTOOLS OFFICE SUITE EXTENSIONS ===== */
(function(){
 const $=id=>document.getElementById(id);
 const modal=$('toolModal'), content=$('toolContent');
 const extraNames={'duplicate-remover':'Duplicate Text Remover','case-converter':'Text Case Converter','page-counter':'PDF Page Counter',scanner:'Scan to PDF',invoice:'Invoice Maker',quotation:'Quotation Maker',receipt:'Receipt Maker',letter:'Letter & Application',resume:'Resume / CV Maker','image-text':'Image to Text (OCR)','word-counter':'Word & Character Counter',csv:'CSV Viewer','image-resize':'Image Resizer','image-to-pdf':'Multiple Images to PDF','text-cleaner':'Text Cleaner'};
 function show(title,body){content.innerHTML=`<h2>${title}</h2><div class="office-tool-form">${body}</div>`;modal.classList.add('active');}
 function downloadBlob(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1500)}
 function printable(title,body){const w=window.open('','_blank');if(!w){alert('Please allow pop-ups to print or save as PDF.');return}w.document.write(`<html><head><title>${title}</title><style>body{font:15px Arial;padding:40px;color:#182235}h1{color:#176ee0}table{width:100%;border-collapse:collapse}td,th{padding:10px;border:1px solid #ccd3df;text-align:left}.meta{white-space:pre-wrap}</style></head><body>${body}<script>window.onload=()=>window.print()<\/script></body></html>`);w.document.close()}
 document.querySelectorAll('[data-extra-tool]').forEach(card=>{card.addEventListener('click',e=>{const key=card.dataset.extraTool;openExtra(key)});card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect();card.style.setProperty('--mx',`${e.clientX-r.left}px`);card.style.setProperty('--my',`${e.clientY-r.top}px`)})});
 function openExtra(k){
 if(k==='scanner'||k==='image-to-pdf'){show(k==='scanner'?'Scan to PDF':'Multiple Images to PDF',`<p>Use your camera to capture a page (on supported devices), or select existing images. You can add several pages.</p><label>Camera capture<input id="scanCamera" type="file" accept="image/*" capture="environment"></label><label>Upload page images<input id="scanFiles" type="file" accept="image/*" multiple></label><div class="scan-preview" id="scanPreview"></div><button class="process-button" id="makeScannedPdf">Create PDF</button><p class="office-result" id="scanStatus"></p>`);let picked=[];const add=f=>{[...f].forEach(x=>{if(x.type.startsWith('image/'))picked.push(x)});$('scanPreview').innerHTML=picked.map(x=>`<img src="${URL.createObjectURL(x)}">`).join('')};$('scanCamera').onchange=e=>add(e.target.files);$('scanFiles').onchange=e=>add(e.target.files);$('makeScannedPdf').onclick=async()=>{if(!picked.length)return $('scanStatus').textContent='Please add at least one image.';try{const pdf=await PDFLib.PDFDocument.create();for(const f of picked){const b=await f.arrayBuffer();let im; if(f.type==='image/png') im=await pdf.embedPng(b);else im=await pdf.embedJpg(await toJpegBytes(f));const page=pdf.addPage([595,842]);const scale=Math.min(555/im.width,802/im.height);page.drawImage(im,{x:(595-im.width*scale)/2,y:(842-im.height*scale)/2,width:im.width*scale,height:im.height*scale})}downloadBlob(new Blob([await pdf.save()],{type:'application/pdf'}),'scanned-document.pdf');$('scanStatus').textContent='Your PDF is ready.'}catch(err){$('scanStatus').textContent='Could not create PDF: '+err.message}};return}
 if(k==='invoice'||k==='quotation'||k==='receipt'){const title=extraNames[k];show(title,`<label>Business / Company name<input id="bizName" placeholder="Your company"></label><label>Customer name<input id="custName" placeholder="Customer"></label><label>Document number<input id="docNo" placeholder="INV-001"></label><label>Date<input id="docDate" type="date"></label><label>Description<input id="itemDesc" placeholder="Service or product"></label><label>Quantity<input id="itemQty" type="number" value="1" min="1"></label><label>Unit price (PKR)<input id="itemPrice" type="number" value="0" min="0"></label><button class="process-button" id="makeOfficeDoc">Generate & Print / Save PDF</button>`);$('docDate').value=new Date().toISOString().slice(0,10);$('makeOfficeDoc').onclick=()=>{let qty=+$('itemQty').value||0,price=+$('itemPrice').value||0;printable(title,`<h1>${title}</h1><p><b>${esc($('bizName').value)}</b></p><p>${title} No: ${esc($('docNo').value)}<br>Date: ${esc($('docDate').value)}<br>Customer: ${esc($('custName').value)}</p><table><tr><th>Description</th><th>Qty</th><th>Unit price</th><th>Total</th></tr><tr><td>${esc($('itemDesc').value)}</td><td>${qty}</td><td>PKR ${price.toFixed(2)}</td><td>PKR ${(qty*price).toFixed(2)}</td></tr></table><h2>Grand Total: PKR ${(qty*price).toFixed(2)}</h2>`)};return}
 if(k==='letter'||k==='resume'){show(extraNames[k],k==='letter'?`<label>Recipient<input id="letterTo" placeholder="The Manager"></label><label>Subject<input id="letterSubject" placeholder="Application for..."></label><label>Your name<input id="letterName" placeholder="Your name"></label><label>Message<textarea id="letterBody" placeholder="Write your letter here..."></textarea></label><button class="process-button" id="printLetter">Print / Save as PDF</button>`:`<label>Full name<input id="cvName" placeholder="Your name"></label><label>Contact details<input id="cvContact" placeholder="Phone | Email | City"></label><label>Professional summary<textarea id="cvSummary"></textarea></label><label>Skills<textarea id="cvSkills" placeholder="One skill per line"></textarea></label><label>Education & experience<textarea id="cvExp"></textarea></label><button class="process-button" id="printCV">Print / Save as PDF</button>`);if(k==='letter')$('printLetter').onclick=()=>printable('Letter',`<h2>${esc($('letterSubject').value)}</h2><p>To: ${esc($('letterTo').value)}</p><p class="meta">${esc($('letterBody').value)}</p><p>Sincerely,<br>${esc($('letterName').value)}</p>`);else $('printCV').onclick=()=>printable('Resume',`<h1>${esc($('cvName').value)}</h1><p>${esc($('cvContact').value)}</p><h2>Profile</h2><p class="meta">${esc($('cvSummary').value)}</p><h2>Skills</h2><p class="meta">${esc($('cvSkills').value)}</p><h2>Education & Experience</h2><p class="meta">${esc($('cvExp').value)}</p>`);return}
 if(k==='word-counter'||k==='text-cleaner'){show(extraNames[k],`<label>Paste or type text<textarea id="textWork" placeholder="Type or paste your text..."></textarea></label><p class="office-result" id="textStats"></p><button class="process-button" id="textAction">${k==='word-counter'?'Update Count':'Clean & Copy Text'}</button>`);const update=()=>{let t=$('textWork').value;$('textStats').textContent=`Words: ${(t.trim().match(/\\S+/g)||[]).length} · Characters: ${t.length} · Sentences: ${(t.match(/[.!?]+/g)||[]).length}`};$('textWork').oninput=update;$('textAction').onclick=()=>{if(k==='text-cleaner'){$('textWork').value=$('textWork').value.replace(/[ \\t]+/g,' ').replace(/\\n{3,}/g,'\\n\\n').trim();navigator.clipboard?.writeText($('textWork').value);update()}else update()};return}
 if(k==='csv'){show('CSV Viewer',`<label>Choose CSV file<input id="csvFile" type="file" accept=".csv,text/csv"></label><div id="csvTable"></div>`);$('csvFile').onchange=async e=>{let t=await e.target.files[0].text();let rows=t.split(/\\r?\\n/).filter(Boolean).slice(0,100).map(r=>r.split(','));$('csvTable').innerHTML='<div style="overflow:auto"><table>'+rows.map((r,i)=>'<tr>'+r.map(c=>`<${i?'td':'th'}>${esc(c)}</${i?'td':'th'}>`).join('')+'</tr>').join('')+'</table></div>';};return}
 if(k==='image-resize'){show('Image Resizer',`<label>Choose image<input id="resizeFile" type="file" accept="image/*"></label><label>Width (px)<input id="resizeW" type="number" value="1200"></label><label>Height (px)<input id="resizeH" type="number" value="1200"></label><button class="process-button" id="resizeGo">Resize & Download JPG</button>`);$('resizeGo').onclick=()=>{let f=$('resizeFile').files[0];if(!f)return;let im=new Image();im.onload=()=>{let c=document.createElement('canvas');c.width=+$('resizeW').value;c.height=+$('resizeH').value;c.getContext('2d').drawImage(im,0,0,c.width,c.height);c.toBlob(b=>downloadBlob(b,'resized-image.jpg'),'image/jpeg',.9)};im.src=URL.createObjectURL(f)};return}
 if(k==='image-text'){show('Image to Text (OCR)',`<p>OCR uses a third-party browser library loaded when needed. Internet connection is required for the library.</p><label>Choose image<input id="ocrFile" type="file" accept="image/*"></label><button class="process-button" id="ocrGo">Extract Text</button><textarea id="ocrResult" placeholder="Recognized text will appear here..."></textarea><p class="office-result" id="ocrStatus"></p>`);$('ocrGo').onclick=async()=>{let f=$('ocrFile').files[0];if(!f)return; $('ocrStatus').textContent='Loading OCR…';try{if(!window.Tesseract){await new Promise((res,rej)=>{let s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';s.onload=res;s.onerror=rej;document.head.appendChild(s)})}let r=await Tesseract.recognize(f,'eng',{logger:m=>$('ocrStatus').textContent=m.status});$('ocrResult').value=r.data.text;$('ocrStatus').textContent='Text extraction complete.'}catch(e){$('ocrStatus').textContent='OCR could not load. Check your internet connection.'}};return}
 }
 function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
 async function toJpegBytes(file){const bmp=await createImageBitmap(file);const c=document.createElement('canvas');c.width=bmp.width;c.height=bmp.height;c.getContext('2d').drawImage(bmp,0,0);const blob=await new Promise(r=>c.toBlob(r,'image/jpeg',.92));return await blob.arrayBuffer()}

 if(k==='duplicate-remover'||k==='case-converter'){show(extraNames[k],`<label>Paste your text<textarea id="bulkText" placeholder="Paste names or text, one item per line..."></textarea></label><label>Action<select id="bulkMode">${k==='duplicate-remover'?'<option value="exact">Remove exact duplicate lines</option><option value="ignore">Ignore upper/lowercase duplicates</option>':'<option value="upper">UPPERCASE</option><option value="lower">lowercase</option><option value="title">Title Case</option><option value="sentence">Sentence case</option>'}</select></label><button class="process-button" id="bulkGo">Process Text</button><label>Result<textarea id="bulkResult" readonly></textarea></label><button class="process-button" id="bulkCopy">Copy Result</button>`);$('bulkGo').onclick=()=>{let t=$('bulkText').value,mode=$('bulkMode').value;if(k==='duplicate-remover'){let seen=new Set();$('bulkResult').value=t.split(/\\r?\\n/).filter(line=>{let key=mode==='ignore'?line.trim().toLowerCase():line.trim();if(!key)return false;if(seen.has(key))return false;seen.add(key);return true}).join('\\n')}else{$('bulkResult').value=t.split(/\\r?\\n/).map(line=>mode==='upper'?line.toUpperCase():mode==='lower'?line.toLowerCase():mode==='title'?line.toLowerCase().replace(/\\b\\w/g,m=>m.toUpperCase()):line.charAt(0).toUpperCase()+line.slice(1).toLowerCase()).join('\\n')}};$('bulkCopy').onclick=()=>navigator.clipboard?.writeText($('bulkResult').value);return}
 if(k==='image-compress'){show('Image Compressor',`<label>Choose image<input id="icFile" type="file" accept="image/*"></label><label>Output quality (lower = smaller)<input id="icQuality" type="range" min=".3" max=".95" step=".05" value=".75"></label><button class="process-button" id="icGo">Compress & Download JPG</button><p id="icStatus" class="office-result"></p>`);$('icGo').onclick=()=>{let f=$('icFile').files[0];if(!f)return;let im=new Image();im.onload=()=>{let c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;c.getContext('2d').drawImage(im,0,0);c.toBlob(b=>{downloadBlob(b,'compressed-image.jpg');$('icStatus').textContent=`Original: ${(f.size/1024).toFixed(0)} KB · New: ${(b.size/1024).toFixed(0)} KB`},'image/jpeg',+$('icQuality').value)};im.src=URL.createObjectURL(f)};return}
 if(k==='qr-maker'){show('QR Code Maker',`<label>Website URL or text<input id="qrText" placeholder="https://example.com"></label><button class="process-button" id="qrGo">Generate QR Code</button><div id="qrOutput"></div>`);$('qrGo').onclick=()=>{if(!window.QRCode){$('qrOutput').textContent='QR library is unavailable. Check your internet connection.';return}$('qrOutput').innerHTML='';new QRCode($('qrOutput'),{text:$('qrText').value,width:220,height:220})};return}
 if(k==='page-counter'){show('PDF Page Counter',`<label>Choose PDF<input id="pcFile" type="file" accept="application/pdf"></label><button class="process-button" id="pcGo">Count Pages</button><p class="office-result" id="pcResult"></p>`);$('pcGo').onclick=async()=>{let f=$('pcFile').files[0];if(!f)return;try{let d=await PDFLib.PDFDocument.load(await f.arrayBuffer());$('pcResult').textContent=`This PDF contains ${d.getPageCount()} pages.`}catch(e){$('pcResult').textContent='Unable to read this PDF.'}};return}

 // AI assistant: useful built-in guidance, not falsely presented as a connected LLM.
 const panel=$('aiPanel'),fab=$('aiFab');fab?.addEventListener('click',()=>panel.classList.toggle('open'));$('aiClose')?.addEventListener('click',()=>panel.classList.remove('open'));
 document.querySelectorAll('[data-ai-prompt]').forEach(b=>b.addEventListener('click',()=>sendAI(b.dataset.aiPrompt)));
 function addMsg(t,who){let d=document.createElement('div');d.className='ai-bubble '+who;d.textContent=t;$('aiMessages').appendChild(d);$('aiMessages').scrollTop=$('aiMessages').scrollHeight}
 function answer(q){let s=q.toLowerCase();if(/scan|camera|photo/.test(s))return'Open Scan to PDF in Office Tools. Capture pages with your camera or upload images, then select Create PDF. Camera access depends on your browser and device.';if(/merge|join/.test(s))return'Choose Merge PDF in the PDF Toolkit, select your PDF files and run the merge process.';if(/split|page/.test(s))return'Use Split PDF to separate pages, or Extract Pages if you only need selected pages.';if(/compress|size/.test(s))return'Choose Compress PDF to reduce file size. Results depend on the PDF contents.';if(/invoice|quotation|receipt/.test(s))return'Open the matching maker under Office Productivity Suite. Fill in the details and choose Generate & Print / Save PDF.';if(/cv|resume|job/.test(s))return'Open Resume / CV Maker, add your contact details, summary, skills and experience, then print or save as PDF.';if(/email|letter|application/.test(s))return'Use Letter & Application to prepare a draft, or tell me the recipient, subject and purpose and I can suggest wording.';if(/translate|urdu/.test(s))return'I can help explain or draft text. For accurate translation, paste the text and specify the target language.';if(/hello|salam|assalam/.test(s))return'Wa Alaikum Assalam! Tell me what you need help with—PDF, office documents, writing or file conversion.';return'I can guide you around PDFTools and help with common office tasks. Try asking about scanning, merging, splitting, compressing PDFs, invoices, CVs or office letters. For general live AI answers, a secure AI API backend still needs to be connected.'}
 function sendAI(q){if(!q.trim())return;addMsg(q,'user');setTimeout(()=>addMsg(answer(q),'bot'),180)}

 const toolSearch=$('toolSearch');toolSearch?.addEventListener('input',()=>{let q=toolSearch.value.trim().toLowerCase();document.querySelectorAll('.tools-grid .tool-card,.office-grid .tool-card').forEach(card=>{card.classList.toggle('filtered-out',q&&!card.innerText.toLowerCase().includes(q))})});

 $('aiForm')?.addEventListener('submit',e=>{e.preventDefault();sendAI($('aiInput').value);$('aiInput').value=''});
})();

/* Reveal 3D content as it enters the viewport; gracefully falls back without IntersectionObserver */
(function(){
 const revealItems=document.querySelectorAll('.about-card,.roadmap-card,.about-promise');
 if(!('IntersectionObserver' in window)){revealItems.forEach(el=>el.classList.add('is-visible'));return;}
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.14});
 revealItems.forEach((el,i)=>{el.style.transitionDelay=(i%4)*65+'ms';observer.observe(el)});
})();
