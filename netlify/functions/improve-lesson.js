// Netlify Function to improve lesson content using Claude AI
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

    // Build rich context from all available lesson data
    const buildLessonContext = () => {
      let context = `# Lesson: ${lesson.title || lesson.code || 'Untitled'}\n`;
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
        context += `**Assessment:** ${lesson.assessment}\n\n`;
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
    };

    const lessonContext = buildLessonContext();

    // Create context-aware prompts that leverage ALL available data
    const prompts = {
      expand: `${lessonContext}Based on the lesson context above (including any videos, documents, and resources provided), expand this lesson with:

Brief markdown:
- 3 key concepts (reference videos/docs if available)
- 2 real-world applications
- 2 teaching strategies`,

      simplify: `${lessonContext}Based on the lesson context above, simplify this lesson for students:

Brief markdown:
- Main concept (simple terms)
- 3 key points with examples (use provided resources as examples when relevant)`,

      questions: `${lessonContext}Based on the lesson context above (objectives, materials, videos, and resources), create discussion questions:

Brief markdown:
- 3 warm-up questions
- 4 main questions (align with objectives)
- 2 extension questions (reference additional resources if provided)`,

      activities: `${lessonContext}Based on the lesson context above (materials, existing activities, and resources), suggest engaging activities:

Brief markdown:
- 2 hands-on activities (use listed materials when available)
- 1 group activity
- Tips for each (incorporate videos/docs if provided)`,

      assessment: `${lessonContext}Based on the lesson context above (objectives and standards), create assessment items:

Brief markdown:
- 4 multiple choice (with answers, aligned to objectives)
- 2 short answer questions
- 1 reflection prompt`,

      differentiate: `${lessonContext}Based on the lesson context above (objectives, materials, resources), provide differentiation strategies:

Brief markdown:
- 2 scaffolds for struggling students (use videos/resources)
- 2 extensions for advanced learners
- 2 ELL supports (leverage visual resources if available)`
    };

    const systemPrompt = prompts[improvementType];

    if (!systemPrompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid improvement type' })
      };
    }

    // Call Claude API with Claude Sonnet 4.5 (October 2025)
    // Concise prompts with 2000 tokens for faster responses under Netlify timeout
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 800,  // Reduced to 800 to stay well under timeout
        messages: [
          {
            role: 'user',
            content: systemPrompt
          }
        ],
        temperature: 1.0  // Faster generation
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
