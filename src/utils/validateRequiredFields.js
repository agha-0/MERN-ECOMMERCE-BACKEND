// utils/validateFields.js

/**
 * Checks if the required fields are present in the object.
 * @param {Object} obj - The object to validate.
 * @param {Array<string>} requiredFields - An array of field names that are required.
 * @returns {string|null} - Returns an error message if any required field is missing, otherwise null.
 */
function validateRequiredFields(obj, requiredFields) {
    for (const field of requiredFields) {
        if (!obj[field]) {
            return `${field} is required.`;
        }
    }
    return null;
}

module.exports = validateRequiredFields;
