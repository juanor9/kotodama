function StudyArea() {
  return (
    <div className="study-area">
      <h2>Study Arena</h2>
      <div className="study-grid">
        <div className="player-knowledge">
          <h3>Your Knowledge</h3>
          {/* Add player's learned characters here */}
        </div>
        <div className="study-actions">
          <button type="button" className="btn">
            Start Lesson
          </button>
        </div>
        <div className="new-characters">
          <h3>New Characters</h3>
          {/* Add new characters to learn here */}
        </div>
      </div>
    </div>
  );
}

export default StudyArea;
