# Grade Assignment - Quick Reference & Examples

## Quick Start

### 1. Simple Points Grading

```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/grade-assignment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "submission_id": "550e8400-e29b-41d4-a716-446655440000",
    "points_earned": 85,
    "feedback": "Good work!"
  }'
```

### 2. Rubric-Based Grading

```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/grade-assignment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "submission_id": "550e8400-e29b-41d4-a716-446655440000",
    "rubric_scores": {
      "content": {"score": 38, "max": 40},
      "organization": {"score": 27, "max": 30},
      "grammar": {"score": 28, "max": 30}
    },
    "feedback": "Excellent essay!"
  }'
```

## Frontend Integration Examples

### React Component

```jsx
import React, { useState } from 'react';
import { useSupabase } from './SupabaseProvider';

function GradeSubmissionForm({ submissionId, totalPoints }) {
  const { session } = useSupabase();
  const [points, setPoints] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/.netlify/functions/grade-assignment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          submission_id: submissionId,
          points_earned: parseFloat(points),
          feedback: feedback
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to grade submission');
      }

      setResult(data);
      alert(`Grade saved: ${data.letter_grade} (${data.percentage}%)`);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Points Earned (out of {totalPoints}):</label>
        <input
          type="number"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          min="0"
          max={totalPoints}
          step="0.5"
          required
        />
      </div>

      <div>
        <label>Feedback:</label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows="4"
          placeholder="Provide feedback to the student..."
        />
      </div>

      {error && <div className="error">{error}</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Grading...' : 'Submit Grade'}
      </button>

      {result && (
        <div className="result">
          <h3>Grade Submitted Successfully!</h3>
          <p>Grade: {result.letter_grade} ({result.percentage}%)</p>
          <p>Course Grade: {result.updated_course_grade}%</p>
          <p>Class Average: {result.assignment_class_average}%</p>
        </div>
      )}
    </form>
  );
}

export default GradeSubmissionForm;
```

### Rubric-Based Grading Component

```jsx
import React, { useState } from 'react';
import { useSupabase } from './SupabaseProvider';

function RubricGradingForm({ submissionId, rubricTemplate }) {
  const { session } = useSupabase();
  const [scores, setScores] = useState({});
  const [feedback, setFeedback] = useState('');
  const [comments, setComments] = useState([]);

  const handleScoreChange = (criterion, score) => {
    setScores({
      ...scores,
      [criterion]: {
        score: parseFloat(score),
        max: rubricTemplate[criterion].max
      }
    });
  };

  const addComment = (type) => {
    setComments([...comments, { type, text: '' }]);
  };

  const updateComment = (index, text) => {
    const updated = [...comments];
    updated[index].text = text;
    setComments(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/.netlify/functions/grade-assignment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          submission_id: submissionId,
          rubric_scores: scores,
          feedback: feedback,
          comments: comments.filter(c => c.text.trim())
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Grade saved: ${data.letter_grade} (${data.percentage}%)`);
      } else {
        alert(`Error: ${data.error}`);
      }

    } catch (error) {
      alert(`Failed to submit grade: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Rubric Grading</h3>

      {Object.entries(rubricTemplate).map(([criterion, config]) => (
        <div key={criterion}>
          <label>{config.label}:</label>
          <input
            type="number"
            min="0"
            max={config.max}
            step="0.5"
            onChange={(e) => handleScoreChange(criterion, e.target.value)}
            placeholder={`Out of ${config.max}`}
          />
          <span> / {config.max} points</span>
        </div>
      ))}

      <div>
        <label>Overall Feedback:</label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows="4"
        />
      </div>

      <div>
        <h4>Comments</h4>
        <button type="button" onClick={() => addComment('strength')}>
          Add Strength
        </button>
        <button type="button" onClick={() => addComment('improvement')}>
          Add Area for Improvement
        </button>

        {comments.map((comment, index) => (
          <div key={index}>
            <label>{comment.type}:</label>
            <input
              type="text"
              value={comment.text}
              onChange={(e) => updateComment(index, e.target.value)}
              placeholder={`Add ${comment.type} comment...`}
            />
          </div>
        ))}
      </div>

      <button type="submit">Submit Grade</button>
    </form>
  );
}

export default RubricGradingForm;
```

## JavaScript/TypeScript Examples

### Using Fetch API

```javascript
async function gradeSubmission(submissionId, points, feedback, authToken) {
  try {
    const response = await fetch('/.netlify/functions/grade-assignment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        submission_id: submissionId,
        points_earned: points,
        feedback: feedback
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Grading failed');
    }

    const result = await response.json();
    console.log('Grade saved:', result);
    return result;

  } catch (error) {
    console.error('Error grading submission:', error);
    throw error;
  }
}

// Usage
gradeSubmission(
  '550e8400-e29b-41d4-a716-446655440000',
  87.5,
  'Great work!',
  'your-auth-token'
)
.then(result => {
  console.log(`Grade: ${result.letter_grade} (${result.percentage}%)`);
  console.log(`Course Grade: ${result.updated_course_grade}%`);
})
.catch(error => {
  console.error('Failed:', error.message);
});
```

### Using Axios

```javascript
import axios from 'axios';

async function gradeWithRubric(submissionId, rubricScores, feedback, authToken) {
  try {
    const response = await axios.post(
      '/.netlify/functions/grade-assignment',
      {
        submission_id: submissionId,
        rubric_scores: rubricScores,
        feedback: feedback,
        comments: [
          { type: 'strength', text: 'Excellent analysis' },
          { type: 'improvement', text: 'Watch grammar' }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      }
    );

    return response.data;

  } catch (error) {
    if (error.response) {
      // Server responded with error
      console.error('Server error:', error.response.data);
      throw new Error(error.response.data.error);
    } else if (error.request) {
      // Request made but no response
      console.error('No response:', error.request);
      throw new Error('No response from server');
    } else {
      // Request setup error
      console.error('Request error:', error.message);
      throw error;
    }
  }
}

// Usage
const rubric = {
  content: { score: 38, max: 40 },
  organization: { score: 28, max: 30 },
  grammar: { score: 27, max: 30 }
};

gradeWithRubric(
  '550e8400-e29b-41d4-a716-446655440000',
  rubric,
  'Strong essay overall',
  'your-auth-token'
)
.then(result => console.log('Graded:', result))
.catch(error => console.error('Failed:', error));
```

## Common Use Cases

### 1. Batch Grading Multiple Submissions

```javascript
async function batchGrade(submissions, authToken) {
  const results = [];
  const errors = [];

  for (const submission of submissions) {
    try {
      const result = await fetch('/.netlify/functions/grade-assignment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          submission_id: submission.id,
          points_earned: submission.points,
          feedback: submission.feedback
        })
      });

      const data = await result.json();

      if (result.ok) {
        results.push(data);
      } else {
        errors.push({ submission: submission.id, error: data.error });
      }

    } catch (error) {
      errors.push({ submission: submission.id, error: error.message });
    }
  }

  return { results, errors };
}

// Usage
const submissions = [
  { id: 'uuid-1', points: 85, feedback: 'Good work' },
  { id: 'uuid-2', points: 92, feedback: 'Excellent!' },
  { id: 'uuid-3', points: 78, feedback: 'Needs improvement' }
];

batchGrade(submissions, authToken)
  .then(({ results, errors }) => {
    console.log(`Graded ${results.length} submissions`);
    if (errors.length > 0) {
      console.log(`${errors.length} errors:`, errors);
    }
  });
```

### 2. Grade with Validation

```javascript
function validateGradeInput(points, maxPoints) {
  if (points < 0) {
    throw new Error('Points cannot be negative');
  }
  if (points > maxPoints) {
    throw new Error(`Points cannot exceed ${maxPoints}`);
  }
  if (isNaN(points)) {
    throw new Error('Points must be a number');
  }
}

async function gradeWithValidation(submissionId, points, maxPoints, authToken) {
  try {
    // Validate before sending
    validateGradeInput(points, maxPoints);

    const response = await fetch('/.netlify/functions/grade-assignment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        submission_id: submissionId,
        points_earned: points
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    return data;

  } catch (error) {
    console.error('Validation or grading error:', error.message);
    throw error;
  }
}
```

### 3. Update Existing Grade

```javascript
async function updateGrade(submissionId, newPoints, reason, authToken) {
  const response = await fetch('/.netlify/functions/grade-assignment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      submission_id: submissionId,
      points_earned: newPoints,
      feedback: `Grade updated: ${reason}`
    })
  });

  const data = await response.json();

  if (response.ok) {
    console.log(`Grade updated from previous to ${data.percentage}%`);
  }

  return data;
}
```

## Error Handling Best Practices

```javascript
async function safeGradeSubmission(submissionId, gradeData, authToken) {
  try {
    const response = await fetch('/.netlify/functions/grade-assignment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        submission_id: submissionId,
        ...gradeData
      })
    });

    const data = await response.json();

    // Handle different error types
    switch (response.status) {
      case 200:
        return { success: true, data };

      case 400:
        return {
          success: false,
          error: 'Validation Error',
          details: data.details,
          userMessage: 'Please check your input and try again.'
        };

      case 401:
        return {
          success: false,
          error: 'Authentication Error',
          userMessage: 'Please log in and try again.'
        };

      case 403:
        return {
          success: false,
          error: 'Permission Error',
          userMessage: 'You do not have permission to grade this assignment.'
        };

      case 404:
        return {
          success: false,
          error: 'Not Found',
          userMessage: 'Submission not found.'
        };

      case 500:
        return {
          success: false,
          error: 'Server Error',
          userMessage: 'An error occurred. Please try again later.',
          details: data.message
        };

      default:
        return {
          success: false,
          error: 'Unknown Error',
          userMessage: 'An unexpected error occurred.'
        };
    }

  } catch (error) {
    return {
      success: false,
      error: 'Network Error',
      userMessage: 'Could not connect to server. Check your internet connection.',
      details: error.message
    };
  }
}

// Usage with user-friendly error messages
safeGradeSubmission('uuid', { points_earned: 85 }, authToken)
  .then(result => {
    if (result.success) {
      alert(`Success! Grade: ${result.data.letter_grade}`);
    } else {
      alert(`Error: ${result.userMessage}`);
      console.error('Details:', result.details);
    }
  });
```

## Tips & Best Practices

1. **Always validate input client-side** before sending to reduce server load
2. **Handle all error cases** gracefully with user-friendly messages
3. **Use rubric grading** for consistency across multiple graders
4. **Provide meaningful feedback** to help students improve
5. **Batch operations carefully** to avoid overwhelming the server
6. **Cache auth tokens** securely but refresh as needed
7. **Log errors** for debugging but don't expose sensitive info to users
