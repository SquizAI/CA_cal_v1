# Curriculum Sequencing & AI Assignment Planning System

## Overview

This system provides intelligent curriculum pacing, standards mastery tracking, and context-aware AI assignment generation for teachers. It solves the critical need to understand **what's been taught, what's being taught now, and what needs to be taught next** - with full awareness of student mastery levels.

---

## 🎯 Key Features

### 1. **Timeline View** - Past, Present, Future Lessons
- **Recently Taught (Past 2 Weeks)**: See what was covered and when
- **Current Week**: What's happening right now
- **Coming Up (Next 2 Weeks)**: What's on the horizon

**Purpose**: Teachers get a visual timeline showing the flow of instruction, helping them plan ahead and identify pacing issues.

### 2. **Standards Coverage Dashboard**
- Track which Florida standards have been covered
- See student mastery levels for each standard (0-4 scale)
- Identify students needing additional practice
- Monitor gaps in standards coverage

**Mastery Levels**:
- **0**: Not Assessed
- **1**: Beginning (below expectations)
- **2**: Developing (approaching expectations)
- **3**: Proficient (meets expectations)
- **4**: Advanced (exceeds expectations)

**Purpose**: Ensure all required standards are being taught and students are mastering content.

### 3. **AI-Powered Assignment Planning**
- Select upcoming lessons that need assignments
- View context about student needs and standards coverage
- Generate assignments with full pedagogical context

**AI Context Awareness**:
- What standards need to be assessed
- Which students need more practice (and on which standards)
- Recent lesson history and pacing
- Previous assignment patterns
- Current mastery levels across the class

**Purpose**: Create assignments that are precisely targeted to student needs, not generic worksheets.

---

## 📊 Database Schema

### New Tables Created

#### `lesson_progress`
Tracks which lessons have been taught and their status.

| Field | Purpose |
|-------|---------|
| `subject_key` | e.g., '7th_civics' |
| `lesson_code` | e.g., '7_civics_1.1.1' |
| `taught_date` | When lesson was actually taught |
| `status` | 'upcoming', 'in_progress', 'completed', 'skipped' |
| `objectives_covered` | Which objectives were actually covered |
| `time_spent_minutes` | How long the lesson took |

**Use Case**: Track actual vs planned pacing, identify lessons that took longer than expected.

#### `standard_mastery`
Tracks individual student mastery of each standard over time.

| Field | Purpose |
|-------|---------|
| `student_id` | Which student |
| `standard_code` | e.g., 'SS.912.CG.1.1' |
| `mastery_level` | 0-4 scale |
| `evidence_count` | How many assessments contributed |
| `scores` | JSONB array of all assessment scores |
| `needs_practice` | Boolean flag |
| `needs_reteach` | Boolean flag (mastery < 2) |

**Use Case**: Identify exactly which students need help with which specific standards.

#### `assignment_standards`
Maps assignments to the standards they assess.

| Field | Purpose |
|-------|---------|
| `assignment_id` | Which assignment |
| `standard_code` | Which standard it assesses |
| `weight` | How heavily weighted (0.0-1.0) |
| `question_numbers` | Which questions assess this standard |

**Use Case**: When grading, automatically update student mastery levels based on performance.

#### `pacing_adjustments`
Track when and why pacing was changed.

| Field | Purpose |
|-------|---------|
| `subject_key` | Which subject |
| `lesson_code` | Which lesson |
| `suggested_days` | Recommended pacing |
| `actual_days` | What actually happened |
| `reason` | Why adjustment was made |

**Use Case**: Learn from experience - if a lesson always takes longer than planned, adjust the pacing guide.

#### `assignment_generation_log`
Track all AI-generated assignments for improvement.

| Field | Purpose |
|-------|---------|
| `standards_addressed` | Which standards covered |
| `student_needs` | Context about student mastery |
| `prompt_used` | Full prompt sent to AI |
| `model_used` | Which AI model |
| `generation_time_ms` | How long it took |

**Use Case**: Analyze which prompts produce the best assignments, improve AI generation over time.

---

## 🤖 How AI Assignment Generation Works

### Step 1: Gather Context
When you select a lesson for assignment creation, the system automatically fetches:

1. **Student Mastery Data**
   - For each standard in the lesson
   - Current mastery levels (0-4)
   - Students who need practice
   - Students who need reteaching

2. **Recent Teaching History**
   - Last 5 lessons taught
   - Time spent on each
   - Which objectives were covered

3. **Previous Assignments**
   - Recent assignments for this subject
   - Patterns in assignment types
   - Point distributions

### Step 2: Build Intelligent Prompt
The system creates a comprehensive prompt for Claude that includes:

```
- Lesson details (title, code, objectives, standards)
- Student mastery data (average level, struggling students)
- Whether reteaching is needed
- Recent lesson history
- Previous assignment patterns
```

### Step 3: Adaptive Generation
Claude generates assignments that adapt to the current class needs:

**If students are struggling (avg mastery < 2)**:
- 60% foundational questions
- 30% application questions
- 10% extended response
- Focus on scaffolding and support

**If students are developing (avg mastery 2-3)**:
- 40% foundational questions
- 40% application questions
- 20% extended response
- Balance practice with challenge

**If students are proficient (avg mastery > 3)**:
- 30% foundational questions
- 40% application questions
- 30% extended response
- Focus on higher-order thinking

### Step 4: Differentiation Built-In
Every generated assignment includes:
- Main assignment for the class
- Support strategies for struggling students
- Extension activities for advanced students
- Complete answer key and rubric

---

## 🔄 Automated Mastery Tracking

### How Mastery Updates Automatically

When you grade an assignment in the system:

1. **Assignment is graded** → Student earns points (e.g., 85/100)

2. **System looks up standards** → Which standards did this assignment assess?

3. **Converts score to mastery** →
   - 90%+ = Mastery Level 4 (Advanced)
   - 75-89% = Mastery Level 3 (Proficient)
   - 60-74% = Mastery Level 2 (Developing)
   - 40-59% = Mastery Level 1 (Beginning)
   - <40% = Mastery Level 0 (Not Yet)

4. **Updates student mastery** → Uses **weighted average** of all evidence
   - Example: Student had Level 2 from first assignment
   - Earns Level 3 on second assignment
   - New mastery: (2 + 3) / 2 = 2.5 → Level 3

5. **Sets flags** →
   - `needs_practice = true` if mastery < 3
   - `needs_reteach = true` if mastery < 2

6. **AI uses this data** → Next assignment generation considers who needs help

---

## 📈 Workflow Example

### Scenario: 7th Grade Civics Teacher

**Monday Morning** - Teacher opens Curriculum Sequencing

1. **Timeline View**:
   - Past 2 weeks: Students learned about Constitutional influences (SS.912.CG.1.1)
   - Current week: Teaching Declaration of Independence (SS.912.CG.1.2)
   - Next 2 weeks: Federalist Papers coming up (SS.912.CG.1.3)

2. **Standards Coverage**:
   - SS.912.CG.1.1: Average mastery 2.8/4 (Developing)
   - 4 students showing "needs practice"
   - These students struggled with Enlightenment concepts

3. **Assignment Planning**:
   - Selects "Federalist Papers" lesson (coming Friday)
   - AI context shows:
     - 4 students need practice on SS.912.CG.1.1
     - Average mastery developing, not yet proficient
     - Previous assignments were 50-75 point quizzes

4. **AI Generation**:
   - Clicks "Generate Assignment with AI"
   - Claude creates:
     - **Title**: "The Federalist Papers: Arguments for Ratification"
     - **75 points** (matches pattern)
     - **Part 1** (45 pts): Multiple choice on key arguments
     - **Part 2** (20 pts): Short answer comparing Federalist 10 & 51
     - **Part 3** (10 pts): Extended response connecting to modern government
     - **Support**: Modified questions for 4 struggling students
     - **Extension**: Additional analysis for advanced students
     - **Answer Key**: Complete with rubric

5. **Teacher Reviews & Publishes**:
   - Makes minor tweaks
   - Adds due date
   - Publishes to students

6. **Students Complete**:
   - Assignment submitted
   - Teacher grades using rubric

7. **Automatic Mastery Update**:
   - System calculates each student's score
   - Updates mastery for SS.912.CG.1.3
   - Flags students who scored < 75%
   - Next AI generation knows who needs help

**Result**: Teacher saves hours of assignment creation, students get precisely targeted practice, and the system learns what works.

---

## 🎓 Pedagogical Benefits

### For Teachers
- **Time Savings**: AI generates first draft in 30 seconds vs 1-2 hours manually
- **Better Planning**: Visual timeline shows pacing issues before they become problems
- **Data-Driven**: See exactly which students need help with which standards
- **Consistent Quality**: Every assignment is standards-aligned and scaffolded

### For Students
- **Targeted Practice**: Assignments address their specific needs
- **Appropriate Challenge**: Difficulty adjusts to class mastery level
- **Clear Objectives**: Always know which standards are being assessed
- **Fair Grading**: Rubrics are built-in and consistent

### For School Leadership
- **Standards Coverage**: See which standards are being taught across all classes
- **Pacing Insights**: Identify lessons that consistently take too long
- **Intervention Data**: Know exactly which students need support on which topics
- **Quality Assurance**: All assignments are pedagogically sound

---

## 🚀 Getting Started

### For Teachers

1. **First Time Setup**:
   - Go to Teacher Dashboard
   - Click "📊 Curriculum Sequencing & AI Assignment Planning ✨"
   - Select your subject from dropdown

2. **Explore Timeline**:
   - See what you've taught recently
   - Review what's coming up
   - Click any lesson for details

3. **Check Standards Coverage**:
   - Switch to "Standards Coverage" tab
   - Review mastery levels
   - Identify students needing help

4. **Create Your First AI Assignment**:
   - Switch to "Assignment Planning" tab
   - Click an upcoming lesson
   - Review AI context summary
   - Click "Generate Assignment with AI"
   - Wait 30-60 seconds
   - Review and customize
   - Publish!

### For Administrators

1. **Review Standards Coverage Across Classes**:
   - Ask teachers to mark lessons as "taught"
   - Monitor which standards are covered
   - Identify gaps in curriculum

2. **Analyze Pacing Data**:
   - Look for lessons that consistently run long
   - Adjust pacing guides accordingly
   - Share successful pacing with other teachers

3. **Intervention Planning**:
   - Use mastery data to identify struggling students
   - Provide targeted support
   - Monitor progress over time

---

## ⚙️ Technical Details

### API Endpoints

#### Generate Assignment
```
POST /.netlify/functions/generate-assignment
Body: {
  lesson: { code, title, standards, objectives, ... },
  subject: 'subjectKey',
  context: { standards, objectives }
}
Response: {
  assignment: "markdown formatted assignment",
  generationTime: 45000,
  context: { ... }
}
```

### Environment Variables Required

```bash
ANTHROPIC_API_KEY=your_api_key_here
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Database Migration

Run migration to create tables:
```sql
-- Run this in Supabase SQL Editor
\i supabase/migrations/005_curriculum_sequencing_schema.sql
```

---

## 📝 Future Enhancements

### Planned Features
- [ ] **Real-time Collaboration**: Multiple teachers co-planning
- [ ] **Parent Portal**: Parents see what's being taught and student mastery
- [ ] **Predictive Analytics**: AI predicts which students will struggle based on patterns
- [ ] **Intervention Suggestions**: Auto-generate intervention plans for struggling students
- [ ] **Cross-Subject Connections**: Identify opportunities for interdisciplinary projects
- [ ] **State Testing Prep**: Auto-generate practice tests based on gaps
- [ ] **Mobile App**: Teachers can update lesson progress from anywhere

### Enhancement Ideas
- Voice input for lesson notes
- Photo upload of student work for instant grading suggestions
- Integration with Google Classroom / Canvas
- Standards alignment checker for custom assignments
- Peer comparison (anonymous) - how are other teachers pacing this course?

---

## 🆘 Troubleshooting

### "No mastery data showing"
**Solution**: Mastery data is populated when assignments are graded. Create and grade a few assignments first.

### "AI generation is slow"
**Solution**: First generation takes 30-60 seconds. This is normal. Claude needs time to analyze context and generate quality content.

### "Standards not showing in dropdown"
**Solution**: Standards are pulled from curriculum data. Make sure your subject has lessons with standards defined.

### "Assignment generation failed"
**Solution**:
1. Check that ANTHROPIC_API_KEY is set in Netlify environment variables
2. Check Claude API usage limits
3. Look at Netlify function logs for specific error

---

## 📞 Support

For questions or issues:
1. Check this documentation first
2. Review the inline code comments in `curriculum-sequencing.html`
3. Check Supabase database logs for errors
4. Review Netlify function logs

---

## 🎉 Summary

This system transforms how teachers plan and create assignments by:
- Providing complete visibility into curriculum pacing
- Tracking student mastery at the standards level
- Generating context-aware assignments with AI
- Automating mastery updates based on grades
- Giving teachers actionable data for intervention

**Result**: Less time creating assignments, more time teaching. Better targeted instruction based on real student needs.
