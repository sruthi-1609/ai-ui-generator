export default function ReviewPanel({ review, onFix, fixing, onClose }) {
  if (!review) return null;

  const { status, issues } = review;

  return (
    <div className="review-panel">
      <div className="review-header">
        <h3>AI Code Review</h3>
        <button className="review-close" onClick={onClose} aria-label="Close review" type="button">
          ×
        </button>
      </div>

      {status === "clean" || issues.length === 0 ? (
        <p className="review-clean">✓ No issues found. Your code looks good!</p>
      ) : (
        <>
          <ul className="review-issues">
            {issues.map((issue, i) => (
              <li key={i} className={`review-issue severity-${issue.severity}`}>
                <div className="review-issue-header">
                  <span className={`severity-badge severity-${issue.severity}`}>
                    {issue.severity}
                  </span>
                  <span className="review-issue-file">{issue.file}</span>
                </div>
                <p className="review-issue-desc">{issue.description}</p>
                <p className="review-issue-suggestion">💡 {issue.suggestion}</p>
              </li>
            ))}
          </ul>
          <button
            className="btn btn-primary"
            onClick={onFix}
            disabled={fixing}
            type="button"
          >
            {fixing ? (
              <>
                <span className="spinner" /> Fixing...
              </>
            ) : (
              `Fix with AI (${issues.length} issue${issues.length === 1 ? "" : "s"})`
            )}
          </button>
        </>
      )}
    </div>
  );
}
