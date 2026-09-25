import ExamplePrompts from "./ExamplePrompts.jsx";

export default function PromptBar({ prompt, setPrompt, onGenerate, loading, hasCode }) {
  function handleKeyDown(e) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      onGenerate();
    }
  }

  return (
    <section className="prompt-bar">
      <div className="prompt-input-row">
        <textarea
          className="prompt-textarea"
          placeholder="Describe the website you want... e.g. 'Create a modern portfolio website for a CSE student'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          disabled={loading}
        />
        <button
          className="btn btn-primary generate-btn"
          onClick={onGenerate}
          disabled={loading || prompt.trim() === ""}
          type="button"
        >
          {loading ? (
            <>
              <span className="spinner" /> Generating...
            </>
          ) : hasCode ? (
            "Regenerate"
          ) : (
            "Generate"
          )}
        </button>
      </div>
      <ExamplePrompts onSelect={setPrompt} disabled={loading} />
    </section>
  );
}
