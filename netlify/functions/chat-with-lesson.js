// Netlify Function for conversational lesson planning assistance
// Maintains conversation history and provides context-aware responses

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
    const body = JSON.parse(event.body);
    const { lesson, chatHistory, attachments } = body;

    // Debug logging
    console.log('📥 Chat request received:', {
      hasBody: !!body,
      hasLesson: !!lesson,
      hasChatHistory: !!chatHistory,
      bodyKeys: Object.keys(body),
      lessonKeys: lesson ? Object.keys(lesson) : 'N/A'
    });

    if (!lesson) {
      console.error('❌ Lesson missing from request. Body keys:', Object.keys(body));
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing required field: lesson',
          receivedKeys: Object.keys(body),
          debug: 'Lesson object not found in request body'
        })
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

    // Build comprehensive lesson context
    const buildLessonContext = () => {
      let context = `# LESSON CONTEXT\n\n`;
      context += `**Title:** ${lesson.title || lesson.code || 'Untitled'}\n`;
      context += `**Code:** ${lesson.code || 'N/A'}\n`;
      context += `**Subject:** ${lesson.subject || 'General'}\n`;
      context += `**Grade:** ${lesson.grade || 'N/A'}\n\n`;

      if (lesson.objectives && lesson.objectives.length > 0) {
        context += `**Learning Objectives:**\n${lesson.objectives.map(obj => `- ${obj}`).join('\n')}\n\n`;
      }

      if (lesson.standards) {
        context += `**Florida Standards:** ${lesson.standards}\n\n`;
      }

      if (lesson.materials) {
        context += `**Materials:** ${lesson.materials}\n\n`;
      }

      if (lesson.activities && lesson.activities.length > 0) {
        context += `**Planned Activities:**\n${lesson.activities.map(act => `- ${act}`).join('\n')}\n\n`;
      }

      if (lesson.assessment) {
        context += `**Assessment Strategy:** ${lesson.assessment}\n\n`;
      }

      if (lesson.notes) {
        context += `**Current Lesson Notes:**\n${lesson.notes}\n\n`;
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

      // Add attachments context if available
      if (attachments) {
        if (attachments.files && attachments.files.length > 0) {
          context += `**Uploaded Files:**\n${attachments.files.map(f => `- ${f.name} (${(f.size/1024).toFixed(1)}KB)`).join('\n')}\n\n`;
        }

        if (attachments.links && attachments.links.length > 0) {
          context += `**Resource Links:**\n${attachments.links.map(l => `- ${l.label}: ${l.url}`).join('\n')}\n\n`;
        }

        if (attachments.studentWork && attachments.studentWork.length > 0) {
          context += `**Student Submissions to Analyze:**\n`;
          attachments.studentWork.forEach(work => {
            context += `\n**Student:** ${work.studentName}\n`;
            context += `**Assignment:** ${work.assignmentTitle}\n`;
            context += `**Type:** ${work.type}\n`;
            context += `**Submission URL:** ${work.url}\n`;
            context += `**Subject:** ${work.subject} (Grade ${work.grade})\n`;
            context += `**Submitted:** ${new Date(work.submittedDate).toLocaleDateString()}\n`;
            if (work.feedback) {
              context += `**Previous Feedback:** ${work.feedback}\n`;
            }
            context += `\n`;
          });
          context += `\n`;
        }
      }

      return context;
    };

    const lessonContext = buildLessonContext();

    // Create system prompt for chat assistant
    const systemPrompt = `You are an expert educational assistant helping teachers develop high-quality lesson plans for AI Academy @ Centner. Your role is to provide thoughtful, pedagogically sound advice for improving lessons.

${lessonContext}

---

**Your Capabilities:**
- Suggest engaging activities aligned with learning objectives
- Recommend real-world examples and applications
- Provide differentiation strategies for diverse learners
- Align content with Florida B.E.S.T. standards
- Suggest formative assessment checkpoints
- Recommend age-appropriate resources and materials
- Apply best practices from Bloom's Taxonomy and Madeline Hunter lesson design
- **Analyze student submissions** to identify learning gaps and misconceptions
- **Identify struggling concepts** from student work (Gamma, NotebookLM, essays, etc.)
- **Recommend targeted interventions** for specific learning deficiencies
- **Suggest spiraling concepts** into future lessons for spaced repetition
- **Create personalized learning paths** based on class performance patterns

**Output Format Requirements:**
ALWAYS structure your responses using clear, well-organized sections with headers and formatting:

1. **Use Headers**: Start each major section with ## Section Name
2. **Use Bullet Lists**: For activities, materials, or multiple suggestions
3. **Use Numbered Lists**: For sequential steps or procedures
4. **Use Tables**: When comparing options or presenting structured data
5. **Use Code Blocks**: For scripts, templates, or lesson plans
6. **Bold Key Terms**: Important concepts, vocabulary, or objectives

Example Response Structure:
\`\`\`
## Suggested Warm-Up Activity

**Duration:** 5-7 minutes
**Purpose:** Activate prior knowledge and engage students

### Activity Steps:
1. Display thought-provoking question on board
2. Students write response (2 minutes)
3. Think-Pair-Share discussion (3 minutes)

### Materials Needed:
- Whiteboard/projector
- Student notebooks
- Timer

**Alignment:** This addresses the lesson objective by...
\`\`\`

**Response Guidelines:**
1. Keep responses conversational and supportive
2. Focus on actionable, specific suggestions
3. Reference the lesson context when making recommendations
4. Ask clarifying questions when needed
5. Provide brief explanations for your suggestions
6. Use markdown formatting for ALL responses
7. When suggesting activities, include implementation details with clear structure
8. Format lesson plans, activities, and assessments in clean, copy-paste ready formats

**When analyzing student work:**
1. **Identify specific concepts** the student mastered vs. struggled with
2. **Quote or reference** specific parts of their submission as evidence
3. **Determine root causes** - is it conceptual misunderstanding, procedural error, or incomplete knowledge?
4. **Recommend immediate interventions** - what can the teacher do this week?
5. **Suggest spiral learning** - which future lessons should revisit this concept?
6. **Provide specific examples** - concrete activities or questions to reinforce weak areas
7. **Consider the whole class** - if multiple students show the same gap, suggest class-wide reinforcement

**Gap Analysis Output Format (when student work is attached):**
\`\`\`
## Student Work Analysis: [Student Name]

### Strengths
- [Specific concepts mastered with evidence]

### Learning Gaps
- **Gap 1:** [Concept]
  - Evidence: [Quote/reference from submission]
  - Root Cause: [Diagnosis]
  - Impact: [Why this matters for future learning]

### Recommended Interventions

#### Immediate (This Week):
1. [Specific activity/intervention]
2. [One-on-one check-in question]

#### Short-term (Next 2 Weeks):
- Spiral into [Lesson X.Y]: [How to incorporate]
- Review during [Activity type]: [Implementation]

#### Long-term:
- Watch for this in [Future unit]
- Reinforce through [Ongoing practice strategy]

### Suggested Modifications to Future Lessons
[Specific lesson plan adjustments to address identified gaps across the class]
\`\`\`

Remember: You're a collaborative partner helping refine this lesson, not critiquing the teacher's work. Always provide structured, well-formatted output that teachers can directly use or easily adapt. When gaps are identified, focus on constructive, forward-looking solutions that incorporate spaced repetition and spiraling concepts.`;

    // Build messages array with conversation history
    const messages = [];

    // If there's chat history, add it
    if (chatHistory && chatHistory.length > 0) {
      chatHistory.forEach(msg => {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      });
    } else {
      // First message in conversation - should not happen since frontend sends message first
      // But handle gracefully
      messages.push({
        role: 'user',
        content: 'Hello! I\'d like help improving this lesson.'
      });
    }

    // Call Claude API with conversation history and Skills
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'code-execution-2025-08-25,skills-2025-10-02'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2048,  // Allow for detailed responses
        system: systemPrompt,  // System prompt with lesson context
        messages: messages,
        tools: [
          {
            type: 'code_execution_20250825',
            name: 'code_execution'
          }
        ],
        container: {
          skills: [
            {
              type: 'custom',
              skill_id: 'skill_01ToHXoRCy16Ley2KpaNBRNZ',
              version: 'latest'
            }
          ]
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Claude API error:', errorData);
      return {
        statusCode: response.status,
        body: JSON.stringify({
          success: false,
          error: 'AI service error',
          details: errorData
        })
      };
    }

    const data = await response.json();
    const assistantResponse = data.content[0].text;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        response: assistantResponse
      })
    };

  } catch (error) {
    console.error('Chat function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};
