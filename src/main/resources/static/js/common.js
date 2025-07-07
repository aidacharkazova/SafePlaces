// common.js
const API_BASE_URL = '/api';

/**
 * Displays a message on the page.
 * @param {string} message - The message to display.
 * @param {string} type - 'success' or 'error'.
 * @param {HTMLElement} element - The HTML element to display the message in.
 */
function displayMessage(message, type, element) {
    if (element) {
        element.textContent = message;
        element.className = `message ${type}-message`;
        element.style.display = 'block';
    }
}

/**
 * Hides a message.
 * @param {HTMLElement} element - The HTML element containing the message.
 */
function hideMessage(element) {
    if (element) {
        element.textContent = '';
        element.className = 'message';
        element.style.display = 'none';
    }
}

/**
 * Handles API response errors.
 * @param {Response} response - The fetch API response object.
 * @returns {Promise<Error>} - A promise that rejects with an Error object.
 */
async function handleResponseError(response) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        const errorData = await response.json();
        const errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`;
        const error = new Error(errorMessage);
        error.status = response.status;
        error.errorDetails = errorData;
        throw error;
    } else {
        const text = await response.text();
        const error = new Error(`Error: ${response.status} ${response.statusText} - ${text}`);
        error.status = response.status;
        throw error;
    }
}

/**
 * Fetches data from a given URL.
 * @param {string} url - The URL to fetch.
 * @returns {Promise<any>} - A promise that resolves with the JSON data.
 */
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            await handleResponseError(response);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error; // Re-throw to be caught by the calling function
    }
}

/**
 * Posts data to a given URL.
 * @param {string} url - The URL to post to.
 * @param {object} data - The data to send in the request body.
 * @returns {Promise<any>} - A promise that resolves with the JSON data from the response.
 */
async function postData(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            await handleResponseError(response);
        }
        return await response.json();
    } catch (error) {
        console.error('Post error:', error);
        throw error; // Re-throw to be caught by the calling function
    }
}

/**
 * Formats a LocalDateTime string into a readable date and time.
 * @param {string} dateTimeString - The LocalDateTime string (e.g., "2025-07-04T17:30:00").
 * @returns {string} - Formatted date and time string.
 */
function formatDateTime(dateTimeString) {
    try {
        const date = new Date(dateTimeString);
        if (isNaN(date.getTime())) {
            return dateTimeString; // Return original if invalid date
        }
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        return date.toLocaleString('en-US', options);
    } catch (e) {
        console.error("Error formatting date:", e);
        return dateTimeString; // Fallback
    }
}

// Enum for safety features (mirroring backend)
const SafetyFeatures = [
    "WELL_LIT", "SECURITY_PRESENT", "CAMERAS", "EMERGENCY_BUTTON",
    "CROWDED", "ISOLATED", "GOOD_LIGHTING", "VISIBLE_STAFF",
    "PUBLIC_SPACE", "PRIVATE_SPACE"
];