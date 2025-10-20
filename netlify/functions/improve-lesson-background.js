// Netlify Background Function to improve lesson content using Claude AI
// Background functions can run up to 15 minutes (vs 26 seconds for regular functions)
// This keeps API keys secure on the server side

// Use native fetch if available (Node 18+), otherwise use node-fetch
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
    const { lesson, improvementType } = JSON.parse(event.body);

    if (!lesson || !improvementType) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields: lesson and improvementType' })
      };
    }

    // Get API key from environment variable
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'API key not configured' })
      };
    }

    // Create prompts for different improvement types
    const prompts = {
      expand: `You are an expert educator. Expand and enrich this lesson plan with detailed teaching notes, real-world connections, and deeper explanations.

Lesson Title: ${lesson.title}
Objective: ${lesson.objective || 'Not specified'}
Current Notes: ${lesson.notes || 'None'}

Provide:
- Key concepts to emphasize
- Real-world applications and connections
- Common misconceptions to address
- Detailed teaching notes with scaffolding techniques
- Extension ideas for advanced students
- Cross-curricular connections

Format your response with clear headings and bullet points.`,

      simplify: `You are an expert at making complex topics accessible to students. Simplify this lesson into clear, easy-to-understand language.

Lesson Title: ${lesson.title}
Objective: ${lesson.objective || 'Not specified'}

Provide:
- Simplified explanation of the main concept
- Key points in simple terms (3-5 points)
- Easy-to-remember analogies or examples
- A simple explanation students can understand
- Step-by-step approach to teaching this

Keep language appropriate for the grade level. Use concrete examples.`,

      questions: `You are an expert at creating engaging discussion questions. Generate thought-provoking discussion questions for this lesson.

Lesson Title: ${lesson.title}
Objective: ${lesson.objective || 'Not specified'}

Create:
- 3 warm-up questions (activate prior knowledge)
- 5 main discussion questions (varying difficulty levels)
- 2 extension questions (for deeper thinking)
- 2 real-world application questions

Make questions open-ended and encourage critical thinking.`,

      activities: `You are an expert at designing engaging learning activities. Suggest creative, hands-on activities for this lesson.

Lesson Title: ${lesson.title}
Objective: ${lesson.objective || 'Not specified'}

Suggest:
- 2-3 hands-on activities or experiments
- 1 collaborative group activity
- 1 technology-enhanced activity
- 1 creative project option
- Implementation tips for each activity

Activities should be practical and align with the learning objective.`,

      assessment: `You are an expert at creating effective assessments. Generate quiz questions and assessment items for this lesson.

Lesson Title: ${lesson.title}
Objective: ${lesson.objective || 'Not specified'}

Create:
- 5 multiple choice questions (with answer key)
- 3 short answer questions
- 2 application/problem-solving questions
- 1 reflection prompt
- Rubric criteria for assessing understanding

Include clear learning objectives being assessed.`,

      differentiate: `You are an expert at differentiated instruction. Provide strategies to support diverse learners in this lesson.

Lesson Title: ${lesson.title}
Objective: ${lesson.objective || 'Not specified'}

Provide:
- Scaffolds for struggling students (3-4 strategies)
- Extensions for advanced learners (3-4 ideas)
- Accommodations for different learning styles
- ELL support strategies
- Modifications for students with special needs
- Assessment alternatives

Be specific and practical.`
    };

    const systemPrompt = prompts[improvementType];

    if (!systemPrompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid improvement type' })
      };
    }

    // Call Claude API with Claude Sonnet 4.5 (October 2025)
    // Background function allows up to 15 minutes execution time
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
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
    const improvedContent = data.content[0].text;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        content: improvedContent,
        improvementType: improvementType
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
