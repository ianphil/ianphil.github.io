const AUTH_ENDPOINT = "https://github-oauth.ian-philpot.workers.dev/auth/github";
const COMMENT_API = "https://github-oauth.ian-philpot.workers.dev/api/comment";
const TOKEN_KEY = "github_token";

export const auth = {
  isLoggedIn: () => !!localStorage.getItem(TOKEN_KEY),

  getToken: () => localStorage.getItem(TOKEN_KEY),

  login: (returnTo = window.location.pathname) => {
    localStorage.setItem("auth_return_to", returnTo);
    window.location.href = AUTH_ENDPOINT;
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    window.location.reload();
  },

  fetch: (url, options = {}) => {
    const token = localStorage.getItem(TOKEN_KEY);
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  },

  postComment: async (repo, issue, comment) => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(COMMENT_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ repo, issue, comment }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  },
};
