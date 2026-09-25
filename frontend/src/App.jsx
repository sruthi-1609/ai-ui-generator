import { useState, useCallback, useRef } from "react";
import JSZip from "jszip";

import PromptBar from "./components/PromptBar.jsx";
import CodeEditor from "./components/CodeEditor.jsx";
import LivePreview from "./components/LivePreview.jsx";
import EditPanel from "./components/EditPanel.jsx";
import ReviewPanel from "./components/ReviewPanel.jsx";
import Toolbar from "./components/Toolbar.jsx";
import Toast from "./components/Toast.jsx";

import {
  generateWebsite,
  editWebsite,
  reviewWebsite,
  fixWebsite,
} from "./services/api.js";

const EMPTY_CODE = { html: "", css: "", javascript: "" };

let toastId = 0;

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState(EMPTY_CODE);
  const [activeTab, setActiveTab] = useState("html");
  const [review, setReview] = useState(null);
  const [toasts, setToasts] = useState([]);

  const [generating, setGenerating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [fixing, setFixing] = useState(false);

  const hasCode = code.html !== "" || code.css !== "" || code.javascript !== "";
  const anyLoading = generating || editing || reviewing || fixing;

  const pushToast = useCallback((message, type = "info") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  async function handleGenerate() {
    if (prompt.trim() === "" || generating) return;
    setGenerating(true);
    setReview(null);
    try {
      const result = await generateWebsite(prompt.trim());
      setCode(result);
      setActiveTab("html");
      pushToast("Website generated successfully.", "success");
    } catch (err) {
      pushToast(err.message || "Unable to generate website. Please check your Gemini API key.", "error");
    } finally {
      setGenerating(false);
    }
  }

  async function handleEdit(instruction) {
    if (!hasCode) {
      pushToast("Generate a website first before editing it.", "error");
      return;
    }
    setEditing(true);
    try {
      const result = await editWebsite({ instruction, ...code });
      setCode(result);
      setReview(null);
      pushToast("Edit applied successfully.", "success");
    } catch (err) {
      pushToast(err.message || "Unable to apply edit.", "error");
    } finally {
      setEditing(false);
    }
  }

  async function handleReview() {
    if (!hasCode) {
      pushToast("Generate a website first before reviewing it.", "error");
      return;
    }
    setReviewing(true);
    try {
      const result = await reviewWebsite(code);
      setReview(result);
      if (result.status === "clean" || result.issues.length === 0) {
        pushToast("No issues found — your code looks good!", "success");
      } else {
        pushToast(`Review found ${result.issues.length} issue(s).`, "info");
      }
    } catch (err) {
      pushToast(err.message || "Unable to review code.", "error");
    } finally {
      setReviewing(false);
    }
  }

  async function handleFix() {
    if (!review || !review.issues || review.issues.length === 0) return;
    setFixing(true);
    try {
      const result = await fixWebsite({ ...code, issues: review.issues });
      setCode(result);
      setReview(null);
      pushToast("Issues fixed successfully.", "success");
    } catch (err) {
      pushToast(err.message || "Unable to fix issues.", "error");
    } finally {
      setFixing(false);
    }
  }

  async function handleDownload() {
    if (!hasCode) {
      pushToast("Generate a website first before downloading.", "error");
      return;
    }
    try {
      const zip = new JSZip();
      const folder = zip.folder("generated-website");
      folder.file("index.html", code.html || "");
      folder.file("style.css", code.css || "");
      folder.file("script.js", code.javascript || "");

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "generated-website.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      pushToast("Project downloaded.", "success");
    } catch (err) {
      pushToast("Unable to create download.", "error");
    }
  }

  return (
    <div className="app">
      <Toast toasts={toasts} onDismiss={dismissToast} />

      <header className="app-header">
        <h1>AI UI Generator</h1>
        <p className="app-subtitle">Describe it. Generate it. Edit it. Ship it.</p>
      </header>

      <PromptBar
        prompt={prompt}
        setPrompt={setPrompt}
        onGenerate={handleGenerate}
        loading={generating}
        hasCode={hasCode}
      />

      <main className="workspace">
        <section className="panel editor-panel">
          <div className="panel-header">
            <span>Code Editor</span>
          </div>
          <CodeEditor
            code={code}
            setCode={setCode}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            disabled={anyLoading}
          />
          <EditPanel onEdit={handleEdit} loading={editing} disabled={!hasCode || anyLoading} />
          <Toolbar
            onReview={handleReview}
            reviewing={reviewing}
            onDownload={handleDownload}
            disabled={!hasCode || anyLoading}
          />
          <ReviewPanel
            review={review}
            onFix={handleFix}
            fixing={fixing}
            onClose={() => setReview(null)}
          />
        </section>

        <section className="panel preview-panel">
          <div className="panel-header">
            <span>Live Preview</span>
          </div>
          <LivePreview code={code} hasCode={hasCode} />
        </section>
      </main>
    </div>
  );
}
