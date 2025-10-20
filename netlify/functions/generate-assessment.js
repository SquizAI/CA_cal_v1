// Netlify Function to generate comprehensive assessments using Claude AI
// Generates quiz questions, grading rubrics, and in-class activities

const fetch = globalThis.fetch || require('node-fetch');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { lesson, lessons, assessmentType, multiLesson } = JSON.parse(event.body);

    // Check if it's multi-lesson or single lesson
    if (multiLesson) {
      if (!lessons || !Array.isArray(lessons) || lessons.length === 0 || !assessmentType) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'For multi-lesson homework, provide lessons array and assessmentType' })
        };
      }
    } else {
      if (!lesson || !assessmentType) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing required fields: lesson and assessmentType' })
        };
      }
    }

    // Get API key from environment variable
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'API key not configured' })
      };
    }

    // Build rich context from all available lesson data
    const buildLessonContext = () => {
      if (multiLesson) {
        // Multi-lesson context
        let context = `# Multi-Lesson Homework Context\n\n`;
        context += `**Total Lessons:** ${lessons.length}\n\n`;
        context += `---\n\n`;

        lessons.forEach((lessonData, index) => {
          context += `## Lesson ${index + 1}: ${lessonData.title || lessonData.code || 'Untitled'}\n`;
          context += `Subject: ${lessonData.subject || 'General'} | Grade: ${lessonData.grade || 'N/A'}\n\n`;

          if (lessonData.objectives && lessonData.objectives.length > 0) {
            context += `**Learning Objectives:**\n${lessonData.objectives.map(obj => `- ${obj}`).join('\n')}\n\n`;
          }

          if (lessonData.standards) {
            context += `**Standards:** ${lessonData.standards}\n\n`;
          }

          if (lessonData.notes) {
            context += `**Key Content:**\n${lessonData.notes}\n\n`;
          }

          if (lessonData.materials) {
            context += `**Materials:** ${lessonData.materials}\n\n`;
          }

          context += `---\n\n`;
        });

        return context;
      } else {
        // Single lesson context
        let context = `# Lesson Context: ${lesson.title || lesson.code || 'Untitled'}\n`;
        context += `Subject: ${lesson.subject || 'General'} | Grade: ${lesson.grade || 'N/A'}\n\n`;

        if (lesson.objectives && lesson.objectives.length > 0) {
          context += `**Learning Objectives:**\n${lesson.objectives.map(obj => `- ${obj}`).join('\n')}\n\n`;
        }

        if (lesson.standards) {
          context += `**Standards:** ${lesson.standards}\n\n`;
        }

        if (lesson.notes) {
          context += `**Teacher Notes:**\n${lesson.notes}\n\n`;
        }

        if (lesson.materials) {
          context += `**Materials:** ${lesson.materials}\n\n`;
        }

        if (lesson.activities && lesson.activities.length > 0) {
          context += `**Planned Activities:**\n${lesson.activities.map(act => `- ${act}`).join('\n')}\n\n`;
        }

        if (lesson.assessment) {
          context += `**Assessment Notes:** ${lesson.assessment}\n\n`;
        }

        if (lesson.videoUrls && lesson.videoUrls.length > 0) {
          context += `**Video Resources:**\n${lesson.videoUrls.map(url => `- ${url}`).join('\n')}\n\n`;
        }

        if (lesson.documentUrls && lesson.documentUrls.length > 0) {
          context += `**Documentation:**\n${lesson.documentUrls.map(url => `- ${url}`).join('\n')}\n\n`;
        }

        if (lesson.additionalLinks && lesson.additionalLinks.length > 0) {
          context += `**Additional Resources:**\n${lesson.additionalLinks.map(url => `- ${url}`).join('\n')}\n\n`;
        }

        return context;
      }
    };

    const lessonContext = buildLessonContext();

    // Create context-aware structured prompts for different assessment types
    const getPromptForAssessmentType = () => {
      if (multiLesson && assessmentType === 'quiz-questions') {
        return `${lessonContext}
Based on the ${lessons.length} lessons above, create a comprehensive homework assignment that integrates concepts across all lessons.

**Requirements:**
1. Create questions that connect multiple lessons and show relationships between topics
2. Include at least ${Math.min(lessons.length * 2, 10)} questions covering all lessons
3. Clearly label which lesson(s) each question addresses
4. Include a mix of question types: multiple choice, short answer, and application questions
5. Return your response as clean, formatted text (NOT JSON)

**Format your response as:**

# Multi-Lesson Homework Assignment

## Overview
- Total Lessons Covered: ${lessons.length}
- Estimated Time: [time estimate]
- Total Points: 100

## Questions

For each question, use this format:

**Question [number]: [Question Type] ([Points]) - Lesson [number(s)]**
[Question text]

[Additional details like options for MC, sample answers for short answer, etc.]

---

Create engaging questions that help students synthesize learning across these related lessons.`;
      }

      return prompts[assessmentType];
    };

    const prompts = {
      'quiz-questions': `${lessonContext}Based on the lesson context above (objectives, standards, materials, and resources), create a comprehensive quiz. Return ONLY valid JSON:

{
  "quizTitle": "string",
  "totalPoints": 100,
  "estimatedTime": "30-45 minutes",
  "questions": [
    {"id": "q1", "type": "multiple-choice", "question": "...", "points": 20, "options": ["A)...", "B)...", "C)...", "D)..."], "correctAnswer": "A", "explanation": "..."},
    {"id": "q2", "type": "short-answer", "question": "...", "points": 15, "sampleAnswer": "...", "keyPoints": ["...", "..."]},
    {"id": "q3", "type": "essay", "question": "...", "points": 25, "promptGuidance": "...", "requiredLength": "2-3 paragraphs"},
    {"id": "q4", "type": "drawing-diagram", "question": "...", "points": 20, "diagramType": "labeled diagram", "requiredElements": ["...", "..."]},
    {"id": "q5", "type": "external-activity", "question": "...", "points": 20, "activityType": "Gamma/website", "instructions": "...", "submissionFormat": "URL"}
  ]
}

Include 2 multiple-choice, 1 short-answer, 1 essay, 1 drawing, 1 external activity. Align questions with stated objectives.`,

      'grading-rubric': `${lessonContext}Based on the lesson context above (objectives, standards, and activities), create a grading rubric. Return ONLY valid JSON:

{
  "rubricTitle": "string",
  "assessmentType": "Quiz/Assignment",
  "totalPoints": 100,
  "criteria": [
    {
      "category": "Content Knowledge",
      "weight": "40%",
      "levels": [
        {"level": "Exemplary", "points": "90-100%", "description": "..."},
        {"level": "Proficient", "points": "80-89%", "description": "..."},
        {"level": "Developing", "points": "70-79%", "description": "..."},
        {"level": "Beginning", "points": "Below 70%", "description": "..."}
      ]
    }
  ],
  "gradingGuidelines": ["...", "...", "..."],
  "feedbackPrompts": {
    "strengths": ["..."],
    "improvements": ["..."],
    "nextSteps": ["..."]
  }
}

Include 3 criteria: Content Knowledge, Critical Thinking, Communication. Align with lesson objectives.`,

      'in-class-activities': `${lessonContext}Based on the lesson context above (objectives, materials, existing activities, and resources), create engaging in-class activities. Return ONLY valid JSON:

{
  "lessonTitle": "string",
  "activities": [
    {
      "activityId": "activity1",
      "title": "...",
      "type": "whole-class",
      "duration": "15 min",
      "objective": "...",
      "materials": ["..."],
      "setup": "...",
      "procedure": ["Step 1...", "Step 2...", "Step 3..."],
      "differentiation": {"support": "...", "extension": "...", "ell": "..."},
      "assessment": "...",
      "digitalTools": ["..."]
    }
  ],
  "warmUp": {"title": "...", "duration": "5-7 min", "activity": "..."},
  "closure": {"title": "...", "duration": "5 min", "activity": "...", "exitTicket": "..."}
}

Include 3 activities: whole-class discussion, group work, hands-on/tech activity.`
    };

    const systemPrompt = getPromptForAssessmentType();

    if (!systemPrompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid assessment type. Must be: quiz-questions, grading-rubric, or in-class-activities' })
      };
    }

    // Call Claude API with Claude Sonnet 4.5
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 1800,  // Slightly higher for complete JSON structures
        messages: [
          {
            role: 'user',
            content: systemPrompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Claude API error:', errorData);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'AI service error', details: errorData })
      };
    }

    const data = await response.json();
    const generatedContent = data.content[0].text;

    // For multi-lesson homework, return the plain text response
    if (multiLesson && assessmentType === 'quiz-questions') {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(generatedContent)
      };
    }

    // Try to parse the response as JSON for single-lesson assessments
    let structuredData;
    try {
      // Extract JSON from potential markdown code blocks
      let jsonText = generatedContent;

      // Remove markdown code fences if present
      if (jsonText.includes('```json')) {
        jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      } else if (jsonText.includes('```')) {
        jsonText = jsonText.replace(/```\s*/g, '');
      }

      // Try to parse
      structuredData = JSON.parse(jsonText.trim());
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      // If parsing fails, return the raw content
      structuredData = {
        rawContent: generatedContent,
        parseError: parseError.message,
        note: 'AI response could not be parsed as JSON. Returning raw content.'
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        assessmentType: assessmentType,
        data: structuredData
      })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};
