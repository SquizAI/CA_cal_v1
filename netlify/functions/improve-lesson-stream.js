// Netlify Function with Claude Streaming to keep connection alive
// Streams data as it's generated to avoid timeout issues

const fetch = globalThis.fetch || require('node-fetch');

exports.handler = async (event, context) => {
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
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'API key not configured' })
      };
    }

    const prompts = {
      expand: `Expand this lesson plan using proper markdown formatting:
Title: ${lesson.title}
Objective: ${lesson.objective || 'Not specified'}
Notes: ${lesson.notes || 'None'}

Provide in markdown format with clear headings (##) and bullet points:
- 3-4 key concepts to emphasize
- 2-3 real-world applications
- 2-3 common misconceptions to address
- 3-4 effective teaching strategies
- 2 extension ideas for deeper learning

Use ## for section headings and - for bullet points.`,

      simplify: `Simplify this lesson for students using markdown formatting:
Title: ${lesson.title}
Objective: ${lesson.objective || 'Not specified'}

Provide in clean markdown format:
- Main concept explained in simple, student-friendly terms
- 3-4 key points with clear examples
- 1-2 helpful analogies or real-world connections
- Step-by-step teaching approach

Use ## for headings, - for bullets, and **bold** for emphasis.`,

      questions: `Create discussion questions using markdown formatting:
Title: ${lesson.title}
Objective: ${lesson.objective || 'Not specified'}

Provide well-structured markdown:
- 3 warm-up questions (activate prior knowledge)
- 5 main discussion questions (varying difficulty levels)
- 2 extension questions (deeper thinking)
- 2 real-world application questions

Use ## for section headings and numbered lists (1., 2., 3.) for questions.`,

      activities: `Suggest engaging activities in markdown format:
Title: ${lesson.title}
Objective: ${lesson.objective || 'Not specified'}

Provide structured markdown with:
- 2 hands-on activities or experiments
- 1 collaborative group activity
- 1 technology-enhanced activity
- Practical implementation tips for each

Use ## for activity headings, **bold** for activity names, and - for details.`,

      assessment: `Create assessment questions in markdown format:
Title: ${lesson.title}
Objective: ${lesson.objective || 'Not specified'}

Provide formatted markdown:
- 5 multiple choice questions with answer key
- 3 short answer questions
- 2 application/problem-solving questions
- 1 reflection prompt
- Brief rubric criteria with scoring levels

Use ## for sections, numbered lists for questions, and > blockquotes for answer keys.`,

      differentiate: `Provide differentiation strategies in markdown:
Title: ${lesson.title}
Objective: ${lesson.objective || 'Not specified'}

Structured markdown format:
- 3 scaffolding strategies for struggling students
- 3 extension activities for advanced learners
- 2 ELL (English Language Learner) support strategies
- 2 alternative assessment options

Use ## for headings, - for bullet points, and **bold** for strategy names.`
    };

    const systemPrompt = prompts[improvementType];
    if (!systemPrompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid improvement type' })
      };
    }

    // Use Claude streaming API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2000,  // Reduced to prevent timeouts
        stream: true,  // Enable streaming
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

    // Collect streamed response
    let fullContent = '';
    const reader = response.body;

    for await (const chunk of reader) {
      const lines = chunk.toString().split('\n').filter(line => line.trim());

      for (const line of lines) {
        if (line.startsWith('data:')) {
          const data = line.slice(5).trim();
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
              fullContent += parsed.delta.text;
            }
          } catch (e) {
            // Skip parse errors
          }
        }
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        content: fullContent,
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
