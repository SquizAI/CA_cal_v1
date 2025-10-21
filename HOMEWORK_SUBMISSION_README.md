# Homework Submission System - Documentation

## Overview

The Homework Submission System provides a comprehensive interface for students to submit homework assignments with file uploads, text responses, and link submissions. The system integrates seamlessly with the existing student dashboard and connects to Supabase Storage for file management.

## Features

### 1. Multiple Submission Types
- **File Upload**: Upload PDF, DOC, DOCX, JPG, PNG files (max 10MB per file, up to 5 files)
- **Text Response**: Write text-based responses with character counter
- **Link Submission**: Submit links to Google Docs, YouTube videos, or other resources

### 2. File Upload Capabilities
- Drag-and-drop interface
- Browse files button
- File type validation
- File size validation (10MB limit)
- Multiple file support (up to 5 files)
- Upload progress bar
- File preview with remove functionality

### 3. Draft Management
- Auto-save every 30 seconds
- Manual "Save Draft" button
- Draft restoration when reopening assignment
- Auto-clear draft after successful submission

### 4. User Experience
- Large, professional modal (800px wide)
- Assignment metadata display (subject, due date, points, period)
- Late submission warnings
- Due date countdown
- Instructions display
- Confirmation dialog before submission
- Success/error messages
- Loading overlays

### 5. Supabase Integration
- Files uploaded to `homework-submissions` bucket
- Folder structure: `{student_id}/{assignment_id}/filename.ext`
- Public URLs generated for submitted files
- Upload error handling

## Files Modified/Created

### 1. **student-dashboard.html**
- Added homework submission modal HTML (line ~1518-1524)
- Added CSS styles for homework modal (line ~1524-1908)
- Integrated "Start Assignment" button into assignment checklist (line ~2608-2630)
- Added script tag to include homework-submission.js (line ~2209)

### 2. **homework-submission.js** (NEW FILE)
- Complete homework submission logic
- File upload handling with drag-and-drop
- Supabase Storage integration
- Draft management (localStorage)
- Form validation
- Tab switching (file/text/link)
- Error handling and user feedback

## Usage

### For Students

1. **Opening the Homework Modal**:
   - Navigate to a lesson in the student dashboard
   - Click the "Start Assignment" button in the assignment checklist
   - The homework submission modal will open

2. **Submitting Files**:
   - Click the "Upload Files" tab (default)
   - Drag and drop files onto the dropzone, OR
   - Click the dropzone to browse files
   - Review uploaded files in the list
   - Remove unwanted files using the × button

3. **Submitting Text Response**:
   - Click the "Text Response" tab
   - Type your response in the textarea
   - Character count is displayed below

4. **Submitting Links**:
   - Click the "Submit Link" tab
   - Paste a URL (Google Docs, YouTube, etc.)
   - Link preview will appear below

5. **Adding Notes** (Optional):
   - Scroll to "Additional Notes" section
   - Add any comments for your teacher

6. **Saving Draft**:
   - Click "Save Draft" button to save progress
   - Draft auto-saves every 30 seconds
   - Draft is restored when you reopen the assignment

7. **Final Submission**:
   - Click "Submit Assignment" button
   - Confirm the submission in the dialog
   - Wait for files to upload and submission to complete
   - Success message will appear
   - Page will refresh after 2 seconds

### For Developers

#### Integrating Homework Submission Button

The system automatically adds a "Start Assignment" button to any lesson that has:
- A quiz (`enhancement.quiz`)
- A rubric (`enhancement.rubric`)
- Teacher notes (`enhancement.notes`)

The button is added in the `getAssignmentChecklist()` function around line 2608.

#### Manual Integration

To manually add a homework button anywhere in the UI:

```javascript
// Use the helper function
const homeworkBtn = window.createHomeworkButton(
    lessonKey,           // e.g., "2025-09-01_7th_math_3"
    enhancement,         // Enhancement object with notes/quiz/rubric
    'Mathematics',       // Subject name
    '2025-09-01',       // Date key
    3                    // Period number
);

// Or call the modal directly
openHomeworkModal({
    id: 'unique_assignment_id',
    title: 'Homework Assignment',
    subject: 'Mathematics',
    dueDate: '2025-09-01',
    period: 3,
    points: 100,
    instructions: 'Complete problems 1-10 from the textbook'
});
```

## Supabase Setup Requirements

### 1. Storage Bucket Configuration

Create a storage bucket named `homework-submissions`:

```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('homework-submissions', 'homework-submissions', true);
```

### 2. Row Level Security (RLS) Policies

```sql
-- Allow students to upload to their own folder
CREATE POLICY "Students can upload to their folder"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'homework-submissions' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow students to read their own files
CREATE POLICY "Students can read their files"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'homework-submissions' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow teachers to read all submissions
CREATE POLICY "Teachers can read all submissions"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'homework-submissions' AND
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'teacher'
    )
);

-- Allow students to delete their own files
CREATE POLICY "Students can delete their files"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'homework-submissions' AND
    (storage.foldername(name))[1] = auth.uid()::text
);
```

### 3. Serverless Function

Create a Netlify function at `netlify/functions/submit-assignment.js`:

```javascript
// netlify/functions/submit-assignment.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

exports.handler = async (event) => {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const data = JSON.parse(event.body);

        // Validate required fields
        if (!data.assignment_id || !data.student_id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }

        // Insert submission into database
        const { data: submission, error } = await supabase
            .from('homework_submissions')
            .insert([
                {
                    assignment_id: data.assignment_id,
                    student_id: data.student_id,
                    submission_type: data.submission_type,
                    file_urls: data.file_urls || [],
                    text_response: data.text_response || null,
                    link_url: data.link_url || null,
                    student_notes: data.student_notes || null,
                    submitted_at: data.submitted_at,
                    status: 'submitted'
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Failed to save submission' })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                submission_id: submission.id
            })
        };
    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
```

### 4. Database Table

Create the `homework_submissions` table:

```sql
CREATE TABLE homework_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    assignment_id TEXT NOT NULL,
    student_id TEXT NOT NULL,
    submission_type TEXT NOT NULL,
    file_urls TEXT[] DEFAULT '{}',
    text_response TEXT,
    link_url TEXT,
    student_notes TEXT,
    submitted_at TIMESTAMPTZ NOT NULL,
    graded_at TIMESTAMPTZ,
    status TEXT DEFAULT 'submitted',
    score NUMERIC,
    teacher_feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_homework_submissions_student ON homework_submissions(student_id);
CREATE INDEX idx_homework_submissions_assignment ON homework_submissions(assignment_id);
CREATE INDEX idx_homework_submissions_status ON homework_submissions(status);

-- Enable RLS
ALTER TABLE homework_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Students can insert their submissions"
ON homework_submissions FOR INSERT
WITH CHECK (student_id = auth.uid()::text);

CREATE POLICY "Students can view their submissions"
ON homework_submissions FOR SELECT
USING (student_id = auth.uid()::text);

CREATE POLICY "Teachers can view all submissions"
ON homework_submissions FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'teacher'
    )
);

CREATE POLICY "Teachers can update submissions"
ON homework_submissions FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'teacher'
    )
);
```

## File Structure

```
homework-submissions/
├── {student_id}/
│   ├── {assignment_id}/
│   │   ├── 1729123456789_homework.pdf
│   │   ├── 1729123456790_diagram.jpg
│   │   └── ...
```

## Testing

### Test File Upload

1. Open student dashboard
2. Click "Start Assignment" on any lesson
3. Upload a test PDF file
4. Verify file appears in file list
5. Submit the assignment
6. Check Supabase Storage for uploaded file
7. Check `homework_submissions` table for entry

### Test Text Response

1. Open homework modal
2. Switch to "Text Response" tab
3. Type some text
4. Click "Save Draft"
5. Close and reopen modal
6. Verify draft is restored
7. Submit the assignment

### Test Link Submission

1. Open homework modal
2. Switch to "Submit Link" tab
3. Paste a Google Docs URL
4. Verify link preview appears
5. Submit the assignment

## Error Handling

The system handles these error scenarios:

- **Invalid file type**: Shows error message, doesn't add file
- **File too large**: Shows error message, doesn't add file
- **Too many files**: Shows error message, stops upload
- **Network error**: Shows error message, allows retry
- **Invalid URL**: Shows error message, prevents submission
- **Missing required data**: Shows error message, prevents submission
- **Upload failure**: Shows specific error, allows retry

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

All modern browsers support the File API and drag-and-drop.

## Performance Considerations

- Files are uploaded sequentially (not in parallel) to avoid overwhelming the connection
- Progress bar shows upload progress
- Large files (>5MB) may take longer - progress indicator helps user know status
- Draft auto-save is throttled to every 30 seconds to avoid excessive localStorage writes

## Security

- File type validation on client-side (additional server-side validation recommended)
- File size limits enforced
- Supabase RLS policies prevent unauthorized access
- Student can only upload to their own folder
- Teachers can read all submissions but students can only read their own

## Future Enhancements

Potential improvements:

1. **Resubmission**: Allow students to resubmit if teacher allows
2. **Peer Review**: Enable students to review each other's work
3. **Rubric Grading**: Auto-populate rubric for teacher grading
4. **File Preview**: Show PDF/image previews in modal
5. **Collaboration**: Multiple students submit to group assignment
6. **Version History**: Track submission versions
7. **Notifications**: Email notifications on submission
8. **Mobile App**: Native mobile app support
9. **Offline Mode**: Allow offline drafts, sync when online
10. **Rich Text Editor**: Add formatting options for text responses

## Support

For issues or questions:
- Check browser console for JavaScript errors
- Verify Supabase connection and credentials
- Check RLS policies are correctly configured
- Verify storage bucket exists and is public
- Test serverless function independently

## Changelog

### Version 1.0 (2025-10-20)
- Initial release
- File upload with drag-and-drop
- Text response submission
- Link submission
- Draft management
- Supabase Storage integration
- Auto-save functionality
- Progress indicators
- Error handling
