import { useState } from "react";

export default function EditPanel({ onEdit, loading, disabled }) {
  const [instruction, setInstruction] = useState("");

  function handleSubmit() {
    if (instruction.trim() === "") return;
    onEdit(instruction.trim());
    setInstruction("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  }

  return (
    <div className="edit-panel">
      <input
        className="edit-input"
        type="text"
        placeholder="Edit with AI... e.g. 'Add a dark mode button'"
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled || loading}
      />
      <button
        className="btn btn-secondary"
        onClick={handleSubmit}
        disabled={disabled || loading || instruction.trim() === ""}
        type="button"
      >
        {loading ? <span className="spinner" /> : "Apply Edit"}
      </button>
    </div>
  );
}
