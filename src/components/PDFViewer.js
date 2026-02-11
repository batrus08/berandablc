export function renderPDFViewer(url) {
  if (!url) return '';
  return `
    <div class="pdf-viewer">
      <iframe src="${url}" title="PDF viewer"></iframe>
      <div class="pdf-viewer__actions">
        <span>Unduh PDF</span>
        <a class="btn secondary" href="${url}" download>Download</a>
      </div>
    </div>
  `;
}
