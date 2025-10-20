/**
 * AI-Powered Assignment Generator
 * Context-aware assignment creation based on:
 * - Standards coverage
 * - Student mastery levels
 * - Lesson objectives
 * - Previous assignments
 */

const Anthropic = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { lesson, subject, context } = JSON.parse(event.body);

        if (!lesson || !subject) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }

        // 1. Gather context from database
        const assignmentContext = await gatherAssignmentContext(lesson, subject);

        // 2. Build AI prompt with full context
        const prompt = buildContextAwarePrompt(lesson, subject, context, assignmentContext);

        // 3. Generate assignment with Claude
        const startTime = Date.now();
        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-5-20250929',
            max_tokens: 4000,
            temperature: 0.7,
            messages: [{
                role: 'user',
                content: prompt
            }]
        });

        const generationTime = Date.now() - startTime;
        const assignment = message.content[0].text;

        // 4. Log generation for future improvement
        await logAssignmentGeneration({
            lesson,
            subject,
            context: assignmentContext,
            prompt,
            generationTime,
            modelUsed: 'claude-sonnet-4-5'
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                assignment,
                generationTime,
                context: assignmentContext
            })
        };

    } catch (error) {
        console.error('Error generating assignment:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Failed to generate assignment',
                details: error.message
            })
        };
    }
};

/**
 * Gather comprehensive context for assignment generation
 */
async function gatherAssignmentContext(lesson, subjectKey) {
    const context = {
        previousLessons: [],
        upcomingLessons: [],
        standardsMastery: [],
        studentsNeedingPractice: [],
        previousAssignments: []
    };

    try {
        // Get student mastery data for this lesson's standards
        if (lesson.standards) {
            const standards = lesson.standards.split(',').map(s => s.trim());

            const { data: masteryData, error: masteryError } = await supabase
                .from('standard_mastery')
                .select('*')
                .eq('subject_key', subjectKey)
                .in('standard_code', standards);

            if (masteryError) throw masteryError;

            if (masteryData) {
                context.standardsMastery = masteryData;

                // Identify students needing practice
                const studentsNeedingHelp = masteryData.filter(m => m.needs_practice || m.mastery_level < 3);
                context.studentsNeedingPractice = studentsNeedingHelp.map(s => ({
                    standardCode: s.standard_code,
                    masteryLevel: s.mastery_level,
                    evidenceCount: s.evidence_count
                }));
            }
        }

        // Get recently taught lessons (lesson progress)
        const { data: recentLessons, error: lessonsError } = await supabase
            .from('lesson_progress')
            .select('*')
            .eq('subject_key', subjectKey)
            .eq('status', 'completed')
            .order('taught_date', { ascending: false })
            .limit(5);

        if (!lessonsError && recentLessons) {
            context.previousLessons = recentLessons;
        }

        // Get previous assignments for this subject
        const { data: subjects } = await supabase
            .from('subjects')
            .select('id')
            .eq('subject_key', subjectKey)
            .single();

        if (subjects) {
            const { data: assignments, error: assignmentsError } = await supabase
                .from('assignments')
                .select('title, description, total_points, created_at')
                .eq('subject_id', subjects.id)
                .order('created_at', { ascending: false })
                .limit(3);

            if (!assignmentsError && assignments) {
                context.previousAssignments = assignments;
            }
        }

    } catch (error) {
        console.error('Error gathering context:', error);
        // Continue with whatever context we have
    }

    return context;
}

/**
 * Build context-aware prompt for Claude
 */
function buildContextAwarePrompt(lesson, subject, basicContext, databaseContext) {
    const { previousLessons, standardsMastery, studentsNeedingPractice, previousAssignments } = databaseContext;

    // Calculate overall mastery level
    const avgMastery = standardsMastery.length > 0
        ? standardsMastery.reduce((sum, s) => sum + s.mastery_level, 0) / standardsMastery.length
        : 0;

    const needsPracticeCount = studentsNeedingPractice.length;
    const needsReteach = standardsMastery.some(s => s.needs_reteach);

    return `You are an expert educational content creator helping a teacher create an assignment for their students.

# LESSON CONTEXT

**Subject:** ${subject}
**Lesson Code:** ${lesson.code}
**Lesson Title:** ${lesson.title}
**Standards:** ${lesson.standards || 'Not specified'}

**Learning Objectives:**
${lesson.objectives ? lesson.objectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n') : 'Not specified'}

# STUDENT MASTERY DATA

**Overall Standards Mastery:** ${avgMastery.toFixed(1)}/4.0 ${
    avgMastery >= 3 ? '(Proficient)' :
    avgMastery >= 2 ? '(Developing)' :
    avgMastery >= 1 ? '(Beginning)' : '(Not Yet Assessed)'
}

**Students Needing Additional Practice:** ${needsPracticeCount} ${needsPracticeCount > 0 ? `
These students are struggling with:
${studentsNeedingPractice.map(s => `- ${s.standardCode} (Current level: ${s.masteryLevel}/4, Evidence: ${s.evidenceCount} assessment${s.evidenceCount !== 1 ? 's' : ''})`).join('\n')}
` : '(All students are performing well)'}

**Needs Reteaching?** ${needsReteach ? 'YES - Some students scored below 2/4 and need reteaching' : 'NO - Students are ready for new challenges'}

# RECENT TEACHING HISTORY

${previousLessons.length > 0 ? `Recently taught lessons:
${previousLessons.map(l => `- ${l.lesson_code} (Taught: ${l.taught_date}, Time: ${l.time_spent_minutes || 'N/A'} min)`).join('\n')}
` : 'No recent lesson history available'}

# PREVIOUS ASSIGNMENTS

${previousAssignments.length > 0 ? `Recent assignments for this subject:
${previousAssignments.map((a, i) => `${i + 1}. "${a.title}" (${a.total_points} points, created ${new Date(a.created_at).toLocaleDateString()})`).join('\n')}
` : 'No previous assignments on record'}

# ASSIGNMENT GENERATION TASK

Create a comprehensive, standards-aligned assignment that:

1. **Addresses the specific standards and objectives** listed above
2. **Adapts to student mastery levels:**
   ${avgMastery < 2 ? '- Focus on foundational practice and scaffolding since students are still developing' :
     avgMastery < 3 ? '- Provide guided practice with some challenge problems to build proficiency' :
     '- Include higher-order thinking questions and extension activities for advanced students'}
3. **Provides differentiation** for students who need more practice (${needsPracticeCount} students)
4. **Includes varied question types:** multiple choice, short answer, and at least one extended response
5. **Aligns with the lesson objectives** and provides formative assessment data

# OUTPUT FORMAT

Please provide the assignment in the following markdown format:

## Assignment Title

**Due Date:** [Suggest: 2-3 days from lesson date]
**Points:** [Recommend based on complexity]
**Standards:** ${lesson.standards}

### Instructions for Students

[Clear, student-friendly instructions explaining what they need to do]

### Part 1: Foundational Knowledge (${needsPracticeCount > 3 ? '60%' : '40%'} of grade)

[Multiple choice and short answer questions testing basic understanding of standards]

1. [Question 1]
2. [Question 2]
...

### Part 2: Application & Analysis (${needsPracticeCount > 3 ? '30%' : '40%'} of grade)

[Questions requiring students to apply concepts in new situations]

### Part 3: Extended Response (${needsPracticeCount > 3 ? '10%' : '20%'} of grade)

[One comprehensive question demonstrating deeper understanding]

### Differentiation Notes for Teacher

**For Students Needing Support:**
- [Specific scaffolds, hints, or modified questions]

**For Advanced Students:**
- [Extension activities or challenge questions]

### Answer Key & Rubric

[Provide answers and scoring rubric]

---

Please generate this assignment now, ensuring it is rigorous, standards-aligned, and appropriately challenging for the current mastery level of the students.`;
}

/**
 * Log assignment generation for analysis
 */
async function logAssignmentGeneration(data) {
    try {
        const { data: result, error } = await supabase
            .from('assignment_generation_log')
            .insert({
                subject_key: data.subject,
                standards_addressed: data.lesson.standards ? data.lesson.standards.split(',').map(s => s.trim()) : [],
                lessons_covered: [data.lesson.code],
                student_needs: data.context.studentsNeedingPractice || {},
                prompt_used: data.prompt,
                model_used: data.modelUsed,
                generation_time_ms: data.generationTime
            });

        if (error) throw error;
    } catch (error) {
        console.error('Error logging assignment generation:', error);
        // Non-critical, don't throw
    }
}
