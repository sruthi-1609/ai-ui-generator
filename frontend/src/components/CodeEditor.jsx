const TABS = [
  { key: "html", label: "index.html" },
  { key: "css", label: "style.css" },
  { key: "javascript", label: "script.js" },
];

export default function CodeEditor({ code, setCode, activeTab, setActiveTab, disabled }) {
  function handleChange(e) {
    setCode({ ...code, [activeTab]: e.target.value });
  }

  return (
    <div className="code-editor">
      <div className="editor-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`editor-tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <textarea
        className="editor-textarea"
        value={code[activeTab]}
        onChange={handleChange}
        spellCheck={false}
        placeholder={
          code[activeTab] === ""
            ? `Generated ${activeTab} code will appear here...`
            : ""
        }
        disabled={disabled}
      />
    </div>
  );
}
