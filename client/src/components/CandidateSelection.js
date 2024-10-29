// CandidateSelection.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CandidateSelection = () => {
  const [candidates, setCandidates] = useState([]);
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    // Fetch candidates from backend (MongoDB)
    const fetchCandidates = async () => {
      try {
        const response = await axios.get('/api/candidates');
        setCandidates(response.data);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };
    fetchCandidates();
  }, []);

  const handleFeedbackChange = (id, field, value) => {
    setFeedback(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const submitFeedback = async (id) => {
    try {
      const { status, round } = feedback[id];
      await axios.put(`/api/candidates/${id}`, { status, round });
      alert('Feedback updated successfully');
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };
  
  return (
    <div>
      <h2>Candidate Selection</h2>
      {candidates.length > 0 ? (
        candidates.map(candidate => (
          <div key={candidate._id} className="candidate-card">
            <h3>{candidate.name}</h3>
            <p>Email: {candidate.email}</p>
            <div>
              <label>
                Status:
                <select
                  value={feedback[candidate._id]?.status || ''}
                  onChange={(e) => handleFeedbackChange(candidate._id, 'status', e.target.value)}
                >
                  <option value="">--Select--</option>
                  <option value="selected">Selected</option>
                  <option value="rejected">Rejected</option>
                </select>
              </label>
              <label>
                Round:
                <select
                  value={feedback[candidate._id]?.round || ''}
                  onChange={(e) => handleFeedbackChange(candidate._id, 'round', e.target.value)}
                >
                  <option value="">--Select Round--</option>
                  <option value="technical">Technical</option>
                  <option value="hr">HR</option>
                  <option value="final">Final</option>
                </select>
              </label>
              <button onClick={() => submitFeedback(candidate._id)}>
                Submit Feedback
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No candidates found.</p>
      )}
    </div>
  );
};

export default CandidateSelection;