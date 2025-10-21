// ======================================
// HOMEWORK SUBMISSION SYSTEM
// ======================================

let currentHomeworkData = null;
let uploadedFiles = [];
let currentSubmissionTab = 'file';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 5;
const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/jpg'
];

// Auto-save draft every 30 seconds
let autoSaveInterval = null;

function openHomeworkModal(assignmentData) {
    currentHomeworkData = assignmentData;
    const modal = document.getElementById('homeworkModal');
    const modalBody = document.getElementById('homeworkModalBody');

    // Load draft if exists
    const draft = loadDraft(assignmentData.id);

    // Calculate due date status
    const dueDate = new Date(assignmentData.dueDate);
    const now = new Date();
    const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
    const isPastDue = daysUntilDue < 0;
    const isDueSoon = daysUntilDue >= 0 && daysUntilDue <= 2;

    let dueDateClass = 'hw-meta-item';
    if (isPastDue) dueDateClass += ' past-due';
    else if (isDueSoon) dueDateClass += ' due-soon';

    modalBody.innerHTML = `
        <div class="hw-modal-header">
            <h2 class="hw-modal-title">${assignmentData.title || 'Homework Assignment'}</h2>
            <div class="hw-modal-meta">
                <div class="hw-meta-item">
                    <span>📚</span>
                    <span>${assignmentData.subject || 'Subject'}</span>
                </div>
                <div class="${dueDateClass}">
                    <span>📅</span>
                    <span>Due: ${dueDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </div>
                <div class="hw-meta-item">
                    <span>⭐</span>
                    <span>${assignmentData.points || 100} points</span>
                </div>
                <div class="hw-meta-item">
                    <span>⏰</span>
                    <span>Period ${assignmentData.period || 'N/A'}</span>
                </div>
            </div>
        </div>

        ${isPastDue ? `
            <div class="hw-warning">
                <strong>⚠️ Past Due!</strong> This assignment was due ${Math.abs(daysUntilDue)} day(s) ago. Late submissions may receive reduced points.
            </div>
        ` : ''}

        ${assignmentData.instructions ? `
            <div class="hw-instructions">
                <h4>📋 Instructions</h4>
                <p>${assignmentData.instructions}</p>
            </div>
        ` : ''}

        <div class="hw-tabs">
            <button class="hw-tab active" onclick="switchSubmissionTab('file')">
                📎 Upload Files
            </button>
            <button class="hw-tab" onclick="switchSubmissionTab('text')">
                📝 Text Response
            </button>
            <button class="hw-tab" onclick="switchSubmissionTab('link')">
                🔗 Submit Link
            </button>
        </div>

        <!-- File Upload Tab -->
        <div id="fileTab" class="hw-tab-content active">
            <div class="hw-dropzone" id="dropzone" onclick="document.getElementById('fileInput').click()">
                <div class="hw-dropzone-icon">📁</div>
                <div class="hw-dropzone-text">Drag and drop files here or click to browse</div>
                <div class="hw-dropzone-hint">PDF, DOC, DOCX, JPG, PNG - Max 10MB per file (up to 5 files)</div>
            </div>
            <input type="file" id="fileInput" style="display: none;" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onchange="handleFileSelect(event)">
            <div id="fileList" class="hw-file-list"></div>
            <div id="uploadProgress" style="display: none;">
                <div class="hw-progress-bar">
                    <div class="hw-progress-fill" id="uploadProgressFill"></div>
                </div>
                <div class="hw-progress-text" id="uploadProgressText">Uploading...</div>
            </div>
        </div>

        <!-- Text Response Tab -->
        <div id="textTab" class="hw-tab-content">
            <div class="hw-form-section">
                <label class="hw-form-label">Your Response</label>
                <textarea
                    id="textResponse"
                    class="hw-textarea"
                    placeholder="Type your response here..."
                    oninput="updateCharCounter()"
                >${draft?.textResponse || ''}</textarea>
                <div class="hw-char-counter" id="charCounter">0 characters</div>
            </div>
        </div>

        <!-- Link Submission Tab -->
        <div id="linkTab" class="hw-tab-content">
            <div class="hw-form-section">
                <label class="hw-form-label">Link URL</label>
                <input
                    type="url"
                    id="linkUrl"
                    class="hw-url-input"
                    placeholder="https://docs.google.com/... or https://youtu.be/..."
                    oninput="validateUrl()"
                    value="${draft?.linkUrl || ''}"
                >
                <div id="linkPreview" class="hw-link-preview" style="display: none;">
                    <strong>Preview:</strong>
                    <div id="linkPreviewContent"></div>
                </div>
            </div>
        </div>

        <!-- Student Notes (Optional) -->
        <div class="hw-form-section" style="margin-top: 25px;">
            <label class="hw-form-label">Additional Notes (Optional)</label>
            <textarea
                id="studentNotes"
                class="hw-textarea"
                style="min-height: 80px;"
                placeholder="Any comments or notes for your teacher..."
            >${draft?.studentNotes || ''}</textarea>
        </div>

        <div id="submissionMessage"></div>

        <div class="hw-actions">
            <button class="hw-btn hw-btn-secondary" onclick="saveDraft()">
                💾 Save Draft
            </button>
            <button class="hw-btn hw-btn-primary" id="submitBtn" onclick="submitHomework()">
                <span>✅</span>
                <span>Submit Assignment</span>
            </button>
        </div>
    `;

    modal.style.display = 'flex';
    modal.classList.add('active');

    // Setup drag and drop
    setupDragAndDrop();

    // Update character counter
    updateCharCounter();

    // Start auto-save
    startAutoSave();
}

function closeHomeworkModal() {
    const modal = document.getElementById('homeworkModal');
    modal.style.display = 'none';
    modal.classList.remove('active');

    // Clear data
    currentHomeworkData = null;
    uploadedFiles = [];

    // Stop auto-save
    stopAutoSave();
}

function switchSubmissionTab(tab) {
    currentSubmissionTab = tab;

    // Update tab buttons
    document.querySelectorAll('.hw-tab').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Update tab content
    document.querySelectorAll('.hw-tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tab + 'Tab').classList.add('active');
}

function setupDragAndDrop() {
    const dropzone = document.getElementById('dropzone');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, () => {
            dropzone.classList.add('dragging');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, () => {
            dropzone.classList.remove('dragging');
        }, false);
    });

    dropzone.addEventListener('drop', handleDrop, false);
}

function handleDrop(e) {
    const files = e.dataTransfer.files;
    handleFiles(files);
}

function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

function handleFiles(files) {
    const fileArray = Array.from(files);

    // Check max files
    if (uploadedFiles.length + fileArray.length > MAX_FILES) {
        showError(`You can only upload up to ${MAX_FILES} files`);
        return;
    }

    for (let file of fileArray) {
        // Validate file type
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            showError(`File type not allowed: ${file.name}`);
            continue;
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            showError(`File too large: ${file.name} (Max 10MB)`);
            continue;
        }

        uploadedFiles.push(file);
    }

    renderFileList();
}

function renderFileList() {
    const fileList = document.getElementById('fileList');

    if (uploadedFiles.length === 0) {
        fileList.innerHTML = '';
        return;
    }

    fileList.innerHTML = uploadedFiles.map((file, index) => `
        <div class="hw-file-item">
            <div class="hw-file-icon">${getFileIcon(file.type)}</div>
            <div class="hw-file-info">
                <div class="hw-file-name">${file.name}</div>
                <div class="hw-file-size">${formatFileSize(file.size)}</div>
            </div>
            <button class="hw-file-remove" onclick="removeFile(${index})">×</button>
        </div>
    `).join('');
}

function removeFile(index) {
    uploadedFiles.splice(index, 1);
    renderFileList();
}

function getFileIcon(type) {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('image')) return '🖼️';
    return '📎';
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function updateCharCounter() {
    const textarea = document.getElementById('textResponse');
    const counter = document.getElementById('charCounter');
    if (textarea && counter) {
        counter.textContent = `${textarea.value.length} characters`;
    }
}

function validateUrl() {
    const urlInput = document.getElementById('linkUrl');
    const preview = document.getElementById('linkPreview');
    const previewContent = document.getElementById('linkPreviewContent');

    const url = urlInput.value.trim();

    if (!url) {
        preview.style.display = 'none';
        return;
    }

    try {
        new URL(url);
        preview.style.display = 'block';

        // Simple preview
        if (url.includes('docs.google.com')) {
            previewContent.innerHTML = '📄 Google Docs document';
        } else if (url.includes('youtu.be') || url.includes('youtube.com')) {
            previewContent.innerHTML = '📺 YouTube video';
        } else {
            previewContent.innerHTML = `🔗 ${url}`;
        }
    } catch (e) {
        preview.style.display = 'none';
    }
}

async function uploadFilesToSupabase() {
    if (uploadedFiles.length === 0) return [];

    const progressBar = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('uploadProgressFill');
    const progressText = document.getElementById('uploadProgressText');

    progressBar.style.display = 'block';

    const fileUrls = [];
    const studentId = window.currentStudent?.id || 'demo-student';
    const assignmentId = currentHomeworkData.id;

    for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        const progress = ((i + 1) / uploadedFiles.length) * 100;

        progressFill.style.width = progress + '%';
        progressText.textContent = `Uploading ${i + 1} of ${uploadedFiles.length}...`;

        try {
            const fileName = `${Date.now()}_${file.name}`;
            const filePath = `${studentId}/${assignmentId}/${fileName}`;

            const { data, error } = await window.supabase.storage
                .from('homework-submissions')
                .upload(filePath, file);

            if (error) {
                console.error('Upload error:', error);
                showError(`Failed to upload ${file.name}`);
                continue;
            }

            // Get public URL
            const { data: urlData } = window.supabase.storage
                .from('homework-submissions')
                .getPublicUrl(filePath);

            fileUrls.push(urlData.publicUrl);
        } catch (error) {
            console.error('Upload error:', error);
            showError(`Failed to upload ${file.name}`);
        }
    }

    progressBar.style.display = 'none';
    return fileUrls;
}

async function submitHomework() {
    const submitBtn = document.getElementById('submitBtn');
    const messageDiv = document.getElementById('submissionMessage');

    // Validate submission
    const textResponse = document.getElementById('textResponse')?.value.trim() || '';
    const linkUrl = document.getElementById('linkUrl')?.value.trim() || '';
    const studentNotes = document.getElementById('studentNotes')?.value.trim() || '';

    if (uploadedFiles.length === 0 && !textResponse && !linkUrl) {
        showError('Please provide at least one file, text response, or link before submitting.');
        return;
    }

    // Validate URL if provided
    if (linkUrl) {
        try {
            new URL(linkUrl);
        } catch (e) {
            showError('Please enter a valid URL.');
            return;
        }
    }

    // Show confirmation dialog
    const confirmMsg = `Are you sure you want to submit this assignment? You won't be able to edit it after submission.`;
    if (!confirm(confirmMsg)) {
        return;
    }

    // Show loading overlay
    showLoadingOverlay('Submitting your homework...');
    submitBtn.disabled = true;

    try {
        // Step 1: Upload files to Supabase Storage
        const fileUrls = await uploadFilesToSupabase();

        // Step 2: Submit to serverless function
        const submissionData = {
            assignment_id: currentHomeworkData.id,
            student_id: window.currentStudent?.id || 'demo-student',
            submission_type: 'homework',
            file_urls: fileUrls,
            text_response: textResponse,
            link_url: linkUrl,
            student_notes: studentNotes,
            submitted_at: new Date().toISOString()
        };

        const response = await fetch('/.netlify/functions/submit-assignment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(submissionData)
        });

        const result = await response.json();

        hideLoadingOverlay();

        if (response.ok && result.success) {
            // Clear draft
            clearDraft(currentHomeworkData.id);

            // Show success message
            messageDiv.innerHTML = `
                <div class="hw-success-message">
                    <h3 style="margin: 0 0 10px 0;">✅ Assignment Submitted Successfully!</h3>
                    <p style="margin: 0;">Your homework has been submitted. You can view it in your assignments list.</p>
                </div>
            `;

            // Close modal after 2 seconds
            setTimeout(() => {
                closeHomeworkModal();
                // Refresh the page or update UI
                location.reload();
            }, 2000);
        } else {
            throw new Error(result.error || 'Submission failed');
        }
    } catch (error) {
        console.error('Submission error:', error);
        hideLoadingOverlay();
        submitBtn.disabled = false;
        showError('Failed to submit homework. Please try again.');
    }
}

function saveDraft() {
    const textResponse = document.getElementById('textResponse')?.value.trim() || '';
    const linkUrl = document.getElementById('linkUrl')?.value.trim() || '';
    const studentNotes = document.getElementById('studentNotes')?.value.trim() || '';

    const draft = {
        textResponse,
        linkUrl,
        studentNotes,
        savedAt: new Date().toISOString()
    };

    localStorage.setItem(`hw_draft_${currentHomeworkData.id}`, JSON.stringify(draft));

    const messageDiv = document.getElementById('submissionMessage');
    messageDiv.innerHTML = `
        <div style="background: #dbeafe; color: #1e40af; padding: 12px; border-radius: 8px; margin-bottom: 15px;">
            ✅ Draft saved successfully!
        </div>
    `;

    setTimeout(() => {
        messageDiv.innerHTML = '';
    }, 3000);
}

function loadDraft(assignmentId) {
    const draftJson = localStorage.getItem(`hw_draft_${assignmentId}`);
    return draftJson ? JSON.parse(draftJson) : null;
}

function clearDraft(assignmentId) {
    localStorage.removeItem(`hw_draft_${assignmentId}`);
}

function startAutoSave() {
    stopAutoSave(); // Clear any existing interval
    autoSaveInterval = setInterval(() => {
        if (currentHomeworkData) {
            saveDraft();
        }
    }, 30000); // Auto-save every 30 seconds
}

function stopAutoSave() {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
        autoSaveInterval = null;
    }
}

function showLoadingOverlay(message) {
    const overlay = document.createElement('div');
    overlay.id = 'hwLoadingOverlay';
    overlay.className = 'hw-loading-overlay';
    overlay.innerHTML = `
        <div class="hw-spinner"></div>
        <div class="hw-loading-text">${message}</div>
    `;
    document.body.appendChild(overlay);
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('hwLoadingOverlay');
    if (overlay) {
        overlay.remove();
    }
}

function showError(message) {
    const messageDiv = document.getElementById('submissionMessage');
    if (messageDiv) {
        messageDiv.innerHTML = `
            <div class="hw-error-message">
                <strong>❌ Error:</strong> ${message}
            </div>
        `;

        setTimeout(() => {
            messageDiv.innerHTML = '';
        }, 5000);
    }
}

// Close homework modal on outside click
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('homeworkModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'homeworkModal') {
            if (confirm('Are you sure you want to close? Any unsaved changes will be lost.')) {
                closeHomeworkModal();
            }
        }
    });
});

// Helper function to create homework button
window.createHomeworkButton = function(lessonKey, enhancement, subject, dateKey, period) {
    const instructions = (enhancement.notes || 'Complete the assigned work').replace(/`/g, '\\`').replace(/"/g, '&quot;');
    return `
        <button
            class="hw-btn hw-btn-primary"
            style="margin-top: 10px; width: 100%;"
            onclick="openHomeworkModal({
                id: '${lessonKey}_homework',
                title: 'Homework Assignment',
                subject: '${subject}',
                dueDate: '${dateKey}',
                period: ${period},
                points: 100,
                instructions: \`${instructions}\`
            })"
        >
            📝 Start Assignment
        </button>
    `;
};
