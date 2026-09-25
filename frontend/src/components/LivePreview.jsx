import { useMemo } from "react";

function buildDocument({ html, css, javascript }) {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>${css || ""}</style>
  </head>
  <body>
    ${html || ""}
    <script>
      try {
        ${javascript || ""}
      } catch (err) {
        console.error("Preview script error:", err);
      }
    <\/script>
  </body>
</html>`;
}

export default function LivePreview({ code, hasCode }) {
  const srcDoc = useMemo(() => buildDocument(code), [code]);

  return (
    <div className="live-preview">
      {hasCode ? (
        <iframe
          key={srcDoc}
          title="Live website preview"
          className="preview-iframe"
          srcDoc={srcDoc}
          sandbox="allow-scripts"
        />
      ) : (
        <div className="preview-empty">
          <p>Your generated website will appear here.</p>
          <p className="preview-empty-hint">Describe a website above and click Generate.</p>
        </div>
      )}
    </div>
  );
}
