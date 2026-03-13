/**
 * Centralized error reporting function.
 * Must be used in all catch blocks and unhandled rejections to prevent silent failures.
 *
 * @param {Error|any} error - The error to report.
 * @param {string} [context] - Optional contextual information.
 */
export function reportError(error, context = '') {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : 'No stack trace available';

    // In a real app this would send to Sentry or similar.
    // For this app, logging with explicit context ensures no silent failures.
    console.error(`[Error] ${context ? context + ': ' : ''}${message}`);
    console.error(stack);
}
