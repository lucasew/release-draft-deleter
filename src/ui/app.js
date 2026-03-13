import { GitHubClient } from '../github/client.js';
import { reportError } from '../utils/error.js';

function initializeFormFromUrl() {
    try {
        const url = new URL(window.location.href);
        const token = url.searchParams.get("token");
        const user = url.searchParams.get("user");
        const repo = url.searchParams.get("repo");

        if (token) document.getElementById("token").value = token;
        if (user) document.getElementById("user").value = user;
        if (repo) document.getElementById("repo").value = repo;
    } catch (err) {
        reportError(err, 'Failed to initialize form from URL');
    }
}

function logPromise(promise, description) {
    const statusMsg = document.createElement("p");
    document.getElementById("log").appendChild(statusMsg);
    statusMsg.textContent = `WIP: ${description}`;

    promise
        .then((msg) => {
            statusMsg.textContent = `${description} - OK ${msg}`;
        })
        .catch((err) => {
            reportError(err, `Promise failed for: ${description}`);
            statusMsg.textContent = `${description} - ERR ${err.message || err}`;
        });
}

async function handleSubmit(e) {
    e.preventDefault();
    try {
        const token = document.getElementById("token").value.trim();
        const user = document.getElementById("user").value.trim();
        const repo = document.getElementById("repo").value.trim();

        if (token.length === 0) return alert("Token not specified");
        if (user.length === 0) return alert("User not specified");
        if (repo.length === 0) return alert("Repository not specified");

        const client = new GitHubClient(token, user, repo);

        const releases = await client.listReleases();
        const drafts = releases.filter((v) => v.draft);
        console.log(drafts);

        if (drafts.length === 0) {
            logPromise(Promise.reject(new Error("No draft to delete or invalid token")), "");
            return;
        }

        drafts.forEach((draft) => {
            logPromise(client.deleteDraft(draft), `Delete '${draft.name}' (${draft.html_url})`);
        });
    } catch (err) {
        reportError(err, 'Failed to handle form submission');
    }
}

function setupApp() {
    try {
        initializeFormFromUrl();
        const start = document.getElementById("start");
        start.addEventListener('click', handleSubmit);
        start.hidden = false;
        console.log("Ready");
    } catch (err) {
        reportError(err, 'Failed to setup application');
    }
}

// Global error handlers
window.addEventListener('error', (event) => {
    reportError(event.error || event.message, 'Uncaught Error');
});

window.addEventListener('unhandledrejection', (event) => {
    reportError(event.reason, 'Unhandled Promise Rejection');
});

// Initialize on DOMContentLoaded or immediately if already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupApp);
} else {
    setupApp();
}
