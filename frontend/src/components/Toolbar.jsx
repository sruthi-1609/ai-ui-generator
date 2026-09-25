export default function Toolbar({ onReview, reviewing, onDownload, disabled }) {
  return (
    <div className="toolbar">
      <button
        className="btn btn-outline"
        onClick={onReview}
        disabled={disabled || reviewing}
        type="button"
      >
        {reviewing ? (
          <>
            <span className="spinner" /> Reviewing...
          </>
        ) : (
          "AI Code Review"
        )}
      </button>
      <button
        className="btn btn-outline"
        onClick={onDownload}
        disabled={disabled}
        type="button"
      >
        Download Project
      </button>
    </div>
  );
}
