import { useState, useEffect } from "react";
import { electionsAPI } from "../services/api";

function Elections() {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [votedElections, setVotedElections] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await electionsAPI.getElections({ status: "active" });
      
      if (response.success) {
        setElections(response.elections);
        if (response.elections.length > 0) {
          setSelectedElection(response.elections[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching elections:', err);
      setError('Could not load elections. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCandidateSelect = (electionId, candidateId) => {
    if (votedElections.has(electionId)) return;
    
    setSelectedCandidates(prev => ({
      ...prev,
      [electionId]: candidateId
    }));
  };

  const handleVote = async (electionId) => {
    const candidateId = selectedCandidates[electionId];
    if (!candidateId) return;

    try {
      setSubmitting(true);
      const response = await electionsAPI.vote(electionId, [candidateId]);
      
      if (response.success) {
        setVotedElections(prev => new Set([...prev, electionId]));
        // Refresh to get updated vote counts
        fetchElections();
      }
    } catch (err) {
      console.error('Error voting:', err);
      setError('Could not submit vote. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  };

  const calculatePercentage = (votes, total) => {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  const getTotalVotes = (candidates) => {
    return candidates?.reduce((sum, c) => sum + (c.votes || 0), 0) || 0;
  };

  if (loading) {
    return (
      <div className="feed">
        <h2>🗳️ Student Elections</h2>
        <div className="loading-posts">
          <div className="spinner"></div>
          <p>Loading elections...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feed">
        <h2>🗳️ Student Elections</h2>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchElections}>Retry</button>
        </div>
      </div>
    );
  }

  if (elections.length === 0) {
    return (
      <div className="feed">
        <h2>🗳️ Student Elections</h2>
        <div className="empty-feed">
          <p>📭 No active elections</p>
          <p>Check back when voting opens!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feed">
      <h2>🗳️ Student Elections 2026</h2>
      
      {/* Election Tabs */}
      {elections.length > 1 && (
        <div className="election-tabs">
          {elections.map((election) => (
            <button
              key={election._id}
              className={`election-tab ${selectedElection?._id === election._id ? "active" : ""}`}
              onClick={() => setSelectedElection(election)}
            >
              {election.title.split(" ").slice(0, 2).join(" ")}
            </button>
          ))}
        </div>
      )}

      {selectedElection && (
        <>
          {/* Election Info */}
          <div className="election-info-card">
            <h3>{selectedElection.title}</h3>
            <p className="election-description">{selectedElection.description}</p>
            <div className="election-dates">
              <span>📅 Ends: {formatDate(selectedElection.endDate)}</span>
              <span>👥 {getTotalVotes(selectedElection.candidates)} votes cast</span>
            </div>
          </div>

          {/* Voting Section */}
          {!votedElections.has(selectedElection._id) && !selectedElection.hasVoted ? (
            <div className="election-container">
              <h4>Select your candidate:</h4>
              <div className="candidates-list">
                {selectedElection.candidates?.map((candidate) => (
                  <div
                    key={candidate._id || candidate.user}
                    className={`candidate-card ${selectedCandidates[selectedElection._id] === (candidate._id || candidate.user) ? "selected" : ""}`}
                    onClick={() => handleCandidateSelect(selectedElection._id, candidate._id || candidate.user)}
                  >
                    <div className="candidate-avatar">👤</div>
                    <div className="candidate-info">
                      <h4>{candidate.name}</h4>
                      <p className="manifesto">{candidate.manifesto}</p>
                    </div>
                    <div className="candidate-select">
                      {selectedCandidates[selectedElection._id] === (candidate._id || candidate.user) && (
                        <span className="check-mark">✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {selectedCandidates[selectedElection._id] && (
                <button 
                  className="vote-confirm-btn" 
                  onClick={() => handleVote(selectedElection._id)}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Confirm Vote"}
                </button>
              )}
            </div>
          ) : (
            <div className="vote-success">
              <h3>✅ Vote Submitted Successfully</h3>
              <p>Your vote has been securely recorded. Thank you for participating!</p>
              <p className="vote-note">Live results are shown below.</p>
              
              {/* Live Results */}
              <div className="live-results">
                <h4>📊 Live Results</h4>
                {selectedElection.candidates?.map((candidate) => {
                  const totalVotes = getTotalVotes(selectedElection.candidates);
                  const percentage = calculatePercentage(candidate.votes || 0, totalVotes);
                  
                  return (
                    <div key={candidate._id || candidate.user} className="result-bar">
                      <div className="result-info">
                        <span className="result-name">{candidate.name}</span>
                        <span className="result-votes">{candidate.votes || 0} votes ({percentage}%)</span>
                      </div>
                      <div className="progress">
                        <div
                          className="progress-fill"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Elections;
