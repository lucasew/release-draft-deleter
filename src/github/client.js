export class GitHubClient {
    constructor(token, user, repo) {
        if (!token) throw new Error("Token not specified");
        if (!user) throw new Error("User not specified");
        if (!repo) throw new Error("Repository not specified");

        this.token = token;
        this.user = user;
        this.repo = repo;
        this.baseUrl = `https://api.github.com/repos/${this.user}/${this.repo}`;
    }

    async listReleases() {
        const url = `${this.baseUrl}/releases`;
        const response = await fetch(url, {
            headers: {
                "accept": "application/vnd.github.v3+json",
                "authorization": `token ${this.token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to list releases: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    }

    async deleteDraft(release) {
        if (!release.draft) {
            throw new Error(`"${release.html_url}" is not a draft release`);
        }

        const response = await fetch(release.url, {
            method: "DELETE",
            headers: {
                "authorization": `token ${this.token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to delete draft: ${response.status} ${response.statusText}`);
        }

        return `${response.status} ${response.statusText}`;
    }
}
