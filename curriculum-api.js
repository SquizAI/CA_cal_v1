/**
 * Curriculum API - Frontend Loader
 * Loads curriculum dynamically from secure serverless function
 * NO KEYS EXPOSED - All requests go through Netlify Functions
 */

// Global curriculum cache
let curriculumCache = null;
window.curriculumMap = {}; // For backwards compatibility - make it globally accessible

/**
 * Load curriculum from serverless function
 * @param {Object} filters - Optional filters (subject_key, grade_level, day_key)
 * @returns {Promise<Object>} Curriculum data
 */
async function loadCurriculum(filters = {}) {
    try {
        // Build query string
        const params = new URLSearchParams(filters);
        const url = `/.netlify/functions/get-curriculum${params.toString() ? '?' + params.toString() : ''}`;

        console.log('📚 Loading curriculum from:', url);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to load curriculum');
        }

        console.log(`✅ Loaded ${data.count} lessons`);

        // Update global curriculumMap for backwards compatibility
        window.curriculumMap = data.curriculum;
        curriculumCache = data.curriculum;

        return data.curriculum;

    } catch (error) {
        console.error('❌ Error loading curriculum:', error);

        // If running locally without Netlify Dev, show helpful message
        if (error.message.includes('404') || error.message.includes('Failed to fetch')) {
            console.warn('⚠️  Make sure Netlify Dev is running: netlify dev');
        }

        return {};
    }
}

/**
 * Load curriculum for a specific subject
 * @param {string} subjectKey - e.g., '7th_civics', '9th_math'
 * @returns {Promise<Object>} Subject curriculum
 */
async function loadSubject(subjectKey) {
    const curriculum = await loadCurriculum({ subject_key: subjectKey });
    return curriculum[subjectKey] || {};
}

/**
 * Load curriculum for a specific grade level
 * @param {number} gradeLevel - 7, 9, or 11
 * @returns {Promise<Object>} Grade curriculum
 */
async function loadGrade(gradeLevel) {
    return await loadCurriculum({ grade_level: gradeLevel });
}

/**
 * Load a specific lesson
 * @param {string} subjectKey
 * @param {string} dayKey
 * @returns {Promise<Object>} Lesson data
 */
async function loadLesson(subjectKey, dayKey) {
    const curriculum = await loadCurriculum({ subject_key: subjectKey, day_key: dayKey });
    return curriculum[subjectKey]?.[dayKey] || null;
}

/**
 * Get curriculum from cache (if already loaded)
 * @returns {Object} Cached curriculum or empty object
 */
function getCachedCurriculum() {
    return curriculumCache || {};
}

/**
 * Create curriculum data wrapper with helper methods
 * This provides the interface expected by the calendar rendering code
 */
window.curriculumData = {
    /**
     * Get a specific lesson by subject key and day key
     * @param {string} subjectKey - e.g., '11th_ela', '7th_civics'
     * @param {string} dayKey - e.g., '1.B', '10.A'
     * @returns {Object|null} Lesson data or null if not found
     */
    getLesson(subjectKey, dayKey) {
        if (!curriculumCache || !curriculumCache[subjectKey]) {
            return null;
        }

        const subject = curriculumCache[subjectKey];

        // Handle both old format (direct lessons) and new format (lessons nested)
        if (subject.lessons) {
            return subject.lessons[dayKey] || null;
        } else {
            return subject[dayKey] || null;
        }
    },

    /**
     * Get all lessons for a subject
     * @param {string} subjectKey
     * @returns {Object} All lessons for the subject
     */
    getSubject(subjectKey) {
        if (!curriculumCache || !curriculumCache[subjectKey]) {
            return null;
        }
        return curriculumCache[subjectKey];
    },

    /**
     * Get all curriculum data
     * @returns {Object} Full curriculum
     */
    getAll() {
        return curriculumCache || {};
    }
};

/**
 * Initialize curriculum for the page
 * Call this on page load to populate curriculumMap
 * @param {Object} filters - Optional filters
 * @returns {Promise<void>}
 */
async function initializeCurriculum(filters = {}) {
    console.log('🔄 Initializing curriculum...');
    await loadCurriculum(filters);
    console.log('✅ Curriculum initialized');

    // Dispatch event so other scripts know curriculum is ready
    window.dispatchEvent(new CustomEvent('curriculumLoaded', {
        detail: { curriculum: window.curriculumMap }
    }));
}

// Auto-initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeCurriculum();
    });
} else {
    // DOM already loaded
    initializeCurriculum();
}
