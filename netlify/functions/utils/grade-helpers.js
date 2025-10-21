/**
 * Grade Calculation Utilities
 *
 * Shared helper functions for grade calculations, validation, and formatting
 * Used across grading-related serverless functions
 */

/**
 * Calculate letter grade from percentage
 * @param {number} percentage - Grade percentage (0-100)
 * @returns {string} Letter grade (A, B, C, D, F)
 */
function getLetterGrade(percentage) {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
}

/**
 * Calculate GPA from letter grade
 * @param {string} letterGrade - Letter grade (A, B, C, D, F)
 * @returns {number} GPA on 4.0 scale
 */
function getGPAFromLetter(letterGrade) {
    const gpaMap = {
        'A': 4.0,
        'B': 3.0,
        'C': 2.0,
        'D': 1.0,
        'F': 0.0
    };
    return gpaMap[letterGrade] || 0.0;
}

/**
 * Calculate percentage from points
 * @param {number} pointsEarned - Points earned
 * @param {number} pointsPossible - Total points possible
 * @returns {number} Percentage (0-100), rounded to 2 decimals
 */
function calculatePercentage(pointsEarned, pointsPossible) {
    if (!pointsPossible || pointsPossible <= 0) {
        return 0;
    }
    return Math.round((pointsEarned / pointsPossible) * 100 * 100) / 100;
}

/**
 * Calculate points from rubric scores
 * @param {Object} rubricScores - Rubric scores object
 * @param {number} totalPoints - Assignment total points
 * @returns {Object} { pointsEarned, rubricTotal, rubricMax }
 */
function calculatePointsFromRubric(rubricScores, totalPoints) {
    let rubricTotal = 0;
    let rubricMax = 0;

    for (const criterion of Object.values(rubricScores)) {
        rubricTotal += parseFloat(criterion.score);
        rubricMax += parseFloat(criterion.max);
    }

    // Scale to assignment total points
    const pointsEarned = rubricMax > 0
        ? (rubricTotal / rubricMax) * totalPoints
        : 0;

    return {
        pointsEarned: Math.round(pointsEarned * 100) / 100,
        rubricTotal: Math.round(rubricTotal * 100) / 100,
        rubricMax: Math.round(rubricMax * 100) / 100
    };
}

/**
 * Calculate weighted grade from category scores
 * @param {Array} categoryGrades - Array of {percentage, weight} objects
 * @returns {number} Weighted percentage
 */
function calculateWeightedGrade(categoryGrades) {
    let weightedSum = 0;
    let totalWeight = 0;

    for (const category of categoryGrades) {
        if (category.percentage !== null && category.percentage !== undefined) {
            weightedSum += category.percentage * category.weight;
            totalWeight += category.weight;
        }
    }

    if (totalWeight === 0) return null;

    return Math.round((weightedSum / totalWeight) * 100) / 100;
}

/**
 * Validate rubric scores structure
 * @param {Object} rubricScores - Rubric scores to validate
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateRubricScores(rubricScores) {
    const errors = [];

    if (!rubricScores || typeof rubricScores !== 'object' || Array.isArray(rubricScores)) {
        return {
            valid: false,
            errors: ['rubric_scores must be an object']
        };
    }

    const criteria = Object.entries(rubricScores);

    if (criteria.length === 0) {
        errors.push('rubric_scores cannot be empty');
    }

    for (const [key, value] of criteria) {
        if (!value || typeof value !== 'object') {
            errors.push(`Rubric criterion "${key}" must be an object`);
            continue;
        }

        if (value.score === undefined || value.score === null) {
            errors.push(`Rubric criterion "${key}" must have a 'score' property`);
        }

        if (value.max === undefined || value.max === null) {
            errors.push(`Rubric criterion "${key}" must have a 'max' property`);
        }

        const score = parseFloat(value.score);
        const max = parseFloat(value.max);

        if (isNaN(score)) {
            errors.push(`Rubric criterion "${key}": score must be a number`);
        }

        if (isNaN(max)) {
            errors.push(`Rubric criterion "${key}": max must be a number`);
        }

        if (!isNaN(score) && score < 0) {
            errors.push(`Rubric criterion "${key}": score cannot be negative`);
        }

        if (!isNaN(max) && max <= 0) {
            errors.push(`Rubric criterion "${key}": max must be greater than 0`);
        }

        if (!isNaN(score) && !isNaN(max) && score > max) {
            errors.push(`Rubric criterion "${key}": score (${score}) cannot exceed max (${max})`);
        }
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Validate points earned
 * @param {number} pointsEarned - Points to validate
 * @param {number} pointsPossible - Maximum points
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validatePoints(pointsEarned, pointsPossible) {
    const errors = [];

    const points = parseFloat(pointsEarned);
    const max = parseFloat(pointsPossible);

    if (isNaN(points)) {
        errors.push('points_earned must be a valid number');
    }

    if (isNaN(max)) {
        errors.push('points_possible must be a valid number');
    }

    if (!isNaN(points) && points < 0) {
        errors.push('points_earned cannot be negative');
    }

    if (!isNaN(max) && max <= 0) {
        errors.push('points_possible must be greater than 0');
    }

    if (!isNaN(points) && !isNaN(max) && points > max) {
        errors.push(`points_earned (${points}) cannot exceed points_possible (${max})`);
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Format grade for display
 * @param {Object} grade - Grade object
 * @returns {string} Formatted grade string
 */
function formatGrade(grade) {
    return `${grade.letterGrade} (${grade.percentage}%) - ${grade.pointsEarned}/${grade.pointsPossible} pts`;
}

/**
 * Calculate class statistics for an assignment
 * @param {Array} grades - Array of grade objects with percentage
 * @returns {Object} Statistics object
 */
function calculateClassStatistics(grades) {
    if (!grades || grades.length === 0) {
        return {
            count: 0,
            average: null,
            median: null,
            highest: null,
            lowest: null,
            standardDeviation: null
        };
    }

    const percentages = grades.map(g => parseFloat(g.percentage)).filter(p => !isNaN(p));
    const count = percentages.length;

    if (count === 0) {
        return {
            count: 0,
            average: null,
            median: null,
            highest: null,
            lowest: null,
            standardDeviation: null
        };
    }

    // Average
    const sum = percentages.reduce((acc, p) => acc + p, 0);
    const average = sum / count;

    // Median
    const sorted = [...percentages].sort((a, b) => a - b);
    const median = count % 2 === 0
        ? (sorted[count / 2 - 1] + sorted[count / 2]) / 2
        : sorted[Math.floor(count / 2)];

    // High/Low
    const highest = Math.max(...percentages);
    const lowest = Math.min(...percentages);

    // Standard deviation
    const squareDiffs = percentages.map(p => Math.pow(p - average, 2));
    const avgSquareDiff = squareDiffs.reduce((acc, d) => acc + d, 0) / count;
    const standardDeviation = Math.sqrt(avgSquareDiff);

    return {
        count,
        average: Math.round(average * 100) / 100,
        median: Math.round(median * 100) / 100,
        highest: Math.round(highest * 100) / 100,
        lowest: Math.round(lowest * 100) / 100,
        standardDeviation: Math.round(standardDeviation * 100) / 100
    };
}

/**
 * Determine grade trend
 * @param {Array} recentGrades - Array of recent grades (oldest to newest)
 * @returns {Object} Trend analysis
 */
function analyzeGradeTrend(recentGrades) {
    if (!recentGrades || recentGrades.length < 2) {
        return { trend: 'insufficient_data', message: 'Not enough data to determine trend' };
    }

    const percentages = recentGrades.map(g => parseFloat(g.percentage));

    // Calculate simple moving average trend
    const firstHalf = percentages.slice(0, Math.floor(percentages.length / 2));
    const secondHalf = percentages.slice(Math.floor(percentages.length / 2));

    const firstAvg = firstHalf.reduce((sum, p) => sum + p, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, p) => sum + p, 0) / secondHalf.length;

    const difference = secondAvg - firstAvg;

    let trend, message;

    if (difference > 5) {
        trend = 'improving';
        message = `Grades improving by ${difference.toFixed(1)}% on average`;
    } else if (difference < -5) {
        trend = 'declining';
        message = `Grades declining by ${Math.abs(difference).toFixed(1)}% on average`;
    } else {
        trend = 'stable';
        message = 'Grades are relatively stable';
    }

    return {
        trend,
        message,
        firstHalfAverage: Math.round(firstAvg * 100) / 100,
        secondHalfAverage: Math.round(secondAvg * 100) / 100,
        percentageChange: Math.round(difference * 100) / 100
    };
}

/**
 * Check if grade needs attention (failing or borderline)
 * @param {number} percentage - Grade percentage
 * @returns {Object} Alert information
 */
function checkGradeAlert(percentage) {
    if (percentage < 60) {
        return {
            needsAttention: true,
            severity: 'critical',
            message: 'Failing grade - immediate intervention needed'
        };
    } else if (percentage < 70) {
        return {
            needsAttention: true,
            severity: 'warning',
            message: 'Below proficiency - support recommended'
        };
    } else if (percentage < 75) {
        return {
            needsAttention: true,
            severity: 'caution',
            message: 'Borderline - monitor progress'
        };
    }

    return {
        needsAttention: false,
        severity: 'none',
        message: 'Grade is satisfactory'
    };
}

/**
 * Round to specified decimal places
 * @param {number} value - Value to round
 * @param {number} decimals - Number of decimal places
 * @returns {number} Rounded value
 */
function roundToDecimals(value, decimals = 2) {
    const multiplier = Math.pow(10, decimals);
    return Math.round(value * multiplier) / multiplier;
}

module.exports = {
    getLetterGrade,
    getGPAFromLetter,
    calculatePercentage,
    calculatePointsFromRubric,
    calculateWeightedGrade,
    validateRubricScores,
    validatePoints,
    formatGrade,
    calculateClassStatistics,
    analyzeGradeTrend,
    checkGradeAlert,
    roundToDecimals
};
