/**
 * Date utilities
 *
 * WHY:
 * Centralized formatting logic for reuse across app
 */

/**
 * Human readable date
 *
 * Examples:
 * - 2 min ago
 * - 10:45 AM
 * - Yesterday
 * - May 1
 */
export function formatDate(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();

    const diffMs = now - date;
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    // Just now
    if (diffMinutes < 1) return 'just now';

    // Minutes ago
    if (diffMinutes < 60) return `${diffMinutes} min ago`;

    // Today → show time
    if (diffHours < 24) {
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    // Yesterday
    if (diffDays === 1) return 'Yesterday';

    // Same year
    if (date.getFullYear() === now.getFullYear()) {
        return date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
        });
    }

    // Different year
    return date.toLocaleDateString();
}