import { getRating } from '../utils/textUtils'

export default function ResultsPanel({ wpm, accuracy, timeTaken, onRestart }) {
  const rating = getRating(wpm)

  return (
    <div className="results-panel" role="region" aria-label="Test results">
      <div className="results-title">Test Complete!</div>
      <div className="results-subtitle">Here's how you did</div>

      <div className={`rating-badge ${rating.cls}`} style={{ margin: '0 auto 24px' }}>
        {rating.label}
      </div>

      <div className="results-grid">
        <div className="result-item">
          <div className="result-num wpm">{wpm}</div>
          <div className="result-label">WPM</div>
        </div>
        <div className="result-item">
          <div className="result-num acc">{accuracy}%</div>
          <div className="result-label">Accuracy</div>
        </div>
        <div className="result-item">
          <div className="result-num time">{timeTaken}s</div>
          <div className="result-label">Time</div>
        </div>
      </div>

      <div className="controls">
        <button id="restart-btn" className="btn btn-primary" onClick={onRestart}>
          <span>↺</span> Try Again
        </button>
      </div>
    </div>
  )
}
