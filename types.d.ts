/**
 * Defines the GitHub API data structures used throughout the application.
 *
 * Why: The application interacts directly with the GitHub REST API to list and delete releases.
 * Without explicit types, the data structures returned by the API are opaque, leading to potential
 * runtime errors if the expected fields (like `draft` or `html_url`) are missing or incorrectly assumed.
 * These types provide a clear contract for what the application expects from GitHub, enabling better
 * tooling and acting as documentation for developers maintaining the integration.
 *
 * Flow: The `listReleases` function fetches an array of `GitHubRelease` objects.
 * The `handleSubmit` function filters this array based on the `draft` boolean property.
 * The filtered array is then passed to `handleDraftDelete`, which utilizes `html_url` for logging
 * and `url` for the actual DELETE HTTP request.
 */

/**
 * Represents a release object returned by the GitHub REST API (`GET /repos/{owner}/{repo}/releases`).
 *
 * Why: We need to distinguish between published releases and drafts to ensure we only delete
 * the intended draft targets, preventing accidental deletion of public releases.
 *
 * Edge cases:
 * - The API might return releases with `draft: false`. These MUST NOT be deleted.
 * - The `url` property is the API endpoint used for deletion, while `html_url` is for the user-facing web interface.
 *
 * Permission requirements:
 * - Fetching these requires at least read access to the repository (public or private).
 * - Deleting these requires the `repo` scope on the Personal Access Token, as it performs a destructive action.
 */
export interface GitHubRelease {
  /**
   * The API URL for this specific release.
   * This is the endpoint that the application will issue a `DELETE` request against.
   * Example: `https://api.github.com/repos/user/repo/releases/12345`
   */
  url: string;

  /**
   * The user-facing HTML URL for the release.
   * Used purely for logging purposes in the UI so the user can verify which release was targeted.
   * Example: `https://github.com/user/repo/releases/tag/v1.0.0`
   */
  html_url: string;

  /**
   * The name of the release.
   * Used for descriptive logging in the application UI during the deletion process.
   */
  name: string;

  /**
   * Indicates whether the release is a draft.
   * This is the most critical field, as it acts as a safeguard. The application filters on this
   * to ensure only drafts are targeted.
   */
  draft: boolean;

  /**
   * Other fields returned by GitHub (e.g., id, tag_name, target_commitish, body, etc.)
   * are deliberately omitted here because the application currently does not consume them.
   * Adding them would introduce unnecessary cognitive load.
   */
  [key: string]: any;
}
