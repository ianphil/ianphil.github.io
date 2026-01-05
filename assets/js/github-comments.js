/**
 * GitHub Issues Comments Display
 *
 * Fetches and displays comments from a GitHub issue on the blog post.
 * Phase 2: Includes authenticated commenting via OAuth.
 */

import { auth } from '/auth.js';

(function() {
  'use strict';

  const GITHUB_API = 'https://api.github.com';
  const ANALYTICS_ENDPOINT = 'https://ianphil--412f8d84e91f11f0bb4242dde27851f2.web.val.run/track';
  let currentRepo = '';
  let currentIssue = '';

  /**
   * Track analytics event
   */
  function trackEvent(event, metadata = {}) {
    try {
      const data = {
        page: location.pathname,
        event: `comment_${event}`,
        ...metadata
      };
      const img = new Image();
      img.src = ANALYTICS_ENDPOINT + '?' + Object.keys(data)
        .map(k => k + '=' + encodeURIComponent(data[k]))
        .join('&');
    } catch (error) {
      console.error('Analytics tracking failed:', error);
    }
  }

  /**
   * Format date to readable format
   */
  function formatDate(isoDate) {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return diffMinutes <= 1 ? 'just now' : `${diffMinutes} minutes ago`;
      }
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    }

    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  /**
   * Render markdown to HTML using GitHub API
   */
  async function renderMarkdown(text) {
    try {
      const response = await fetch(`${GITHUB_API}/markdown`, {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text, mode: 'gfm' })
      });

      if (!response.ok) {
        throw new Error(`Markdown API error: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error('Failed to render markdown:', error);
      // Fallback: return text with basic HTML escaping
      return text.replace(/&/g, '&amp;')
                 .replace(/</g, '&lt;')
                 .replace(/>/g, '&gt;')
                 .replace(/\n/g, '<br>');
    }
  }

  /**
   * Fetch reactions for a comment
   */
  async function fetchReactions(commentId) {
    try {
      const response = await fetch(
        `${GITHUB_API}/repos/${currentRepo}/issues/comments/${commentId}/reactions`,
        {
          headers: {
            'Accept': 'application/vnd.github+json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Reactions API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch reactions:', error);
      return [];
    }
  }

  /**
   * Create reactions display
   */
  function createReactionsElement(reactions) {
    if (!reactions || reactions.length === 0) return null;

    // Count reactions by type
    const reactionCounts = {};
    const reactionEmojis = {
      '+1': '👍',
      '-1': '👎',
      'laugh': '😄',
      'hooray': '🎉',
      'confused': '😕',
      'heart': '❤️',
      'rocket': '🚀',
      'eyes': '👀'
    };

    reactions.forEach(reaction => {
      reactionCounts[reaction.content] = (reactionCounts[reaction.content] || 0) + 1;
    });

    const reactionsDiv = document.createElement('div');
    reactionsDiv.className = 'comment-reactions';

    Object.entries(reactionCounts).forEach(([type, count]) => {
      const emoji = reactionEmojis[type];
      if (!emoji) return;

      const reactionSpan = document.createElement('span');
      reactionSpan.className = 'reaction';
      reactionSpan.title = `${count} ${type}`;
      reactionSpan.textContent = `${emoji} ${count}`;
      reactionsDiv.appendChild(reactionSpan);
    });

    return reactionsDiv;
  }

  /**
   * Detect @mention in comment body
   */
  function detectMention(commentBody) {
    // Match @username at the start of the comment
    const match = commentBody.match(/^@(\w+)/);
    return match ? match[1] : null;
  }

  /**
   * Find parent comment by username mention
   */
  function findParentComment(comments, mentionedUser, currentIndex) {
    // Look backwards for the most recent comment by the mentioned user
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (comments[i].user.login === mentionedUser) {
        return comments[i];
      }
    }
    return null;
  }

  /**
   * Create "replying to" element
   */
  function createReplyIndicator(parentComment) {
    const replyDiv = document.createElement('div');
    replyDiv.className = 'comment-reply-to';
    replyDiv.innerHTML = `
      <span class="reply-indicator">↳ replying to</span>
      <a href="#comment-${parentComment.id}"
         class="reply-author"
         title="Jump to parent comment">@${parentComment.user.login}</a>
    `;
    return replyDiv;
  }

  /**
   * Create "reply" action button
   */
  function createReplyButton(username) {
    const replyBtn = document.createElement('button');
    replyBtn.className = 'comment-reply-btn';
    replyBtn.textContent = 'Reply';
    replyBtn.onclick = () => {
      const textarea = document.getElementById('comment-text');
      if (textarea) {
        textarea.value = `@${username} `;
        textarea.focus();
        textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };
    return replyBtn;
  }

  /**
   * Create comment HTML element
   */
  async function createCommentElement(comment, allComments, index) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'github-comment';
    commentDiv.id = `comment-${comment.id}`;

    // Detect if this is a reply
    const mentionedUser = detectMention(comment.body);
    const parentComment = mentionedUser ? findParentComment(allComments, mentionedUser, index) : null;

    // Add threading class if this is a reply
    if (parentComment) {
      commentDiv.classList.add('is-reply');
    }

    const avatar = document.createElement('img');
    avatar.className = 'comment-avatar';
    avatar.src = `${comment.user.avatar_url}&s=64`;
    avatar.alt = `${comment.user.login}'s avatar`;
    avatar.loading = 'lazy';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'comment-content';

    const header = document.createElement('div');
    header.className = 'comment-header';

    const author = document.createElement('a');
    author.className = 'comment-author';
    author.href = comment.user.html_url;
    author.target = '_blank';
    author.rel = 'noopener noreferrer';
    author.textContent = comment.user.login;

    const timestamp = document.createElement('time');
    timestamp.className = 'comment-date';
    timestamp.dateTime = comment.created_at;
    timestamp.textContent = formatDate(comment.created_at);

    header.appendChild(author);
    header.appendChild(document.createTextNode(' commented '));
    header.appendChild(timestamp);

    contentDiv.appendChild(header);

    // Add reply indicator if this is a reply
    if (parentComment) {
      contentDiv.appendChild(createReplyIndicator(parentComment));
    }

    const body = document.createElement('div');
    body.className = 'comment-body';
    body.innerHTML = await renderMarkdown(comment.body);

    contentDiv.appendChild(body);

    // Fetch and add reactions (Phase 3)
    const reactions = await fetchReactions(comment.id);
    const reactionsElement = createReactionsElement(reactions);
    if (reactionsElement) {
      contentDiv.appendChild(reactionsElement);
    }

    // Add reply button (Phase 3.5)
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'comment-actions';
    actionsDiv.appendChild(createReplyButton(comment.user.login));
    contentDiv.appendChild(actionsDiv);

    commentDiv.appendChild(avatar);
    commentDiv.appendChild(contentDiv);

    return commentDiv;
  }

  /**
   * Fetch comments from GitHub API
   */
  async function fetchComments(repo, issueNumber) {
    const url = `${GITHUB_API}/repos/${repo}/issues/${issueNumber}/comments`;

    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/vnd.github+json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Issue not found');
        }
        if (response.status === 403) {
          const remaining = response.headers.get('X-RateLimit-Remaining');
          if (remaining === '0') {
            throw new Error('GitHub API rate limit exceeded. Try again later.');
          }
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      throw error;
    }
  }

  /**
   * Display comments in the container
   */
  async function displayComments(container, repo, issueNumber) {
    try {
      const comments = await fetchComments(repo, issueNumber);

      // Track comment section view
      trackEvent('view', { count: comments.length });

      // Clear loading message
      container.innerHTML = '';

      if (comments.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'comments-empty';
        emptyMessage.textContent = 'No comments yet. Be the first to comment!';
        container.appendChild(emptyMessage);
        return;
      }

      // Add comment count
      const countDiv = document.createElement('div');
      countDiv.className = 'comments-count';
      countDiv.textContent = `${comments.length} ${comments.length === 1 ? 'comment' : 'comments'}`;
      container.appendChild(countDiv);

      // Render each comment
      for (let i = 0; i < comments.length; i++) {
        const commentElement = await createCommentElement(comments[i], comments, i);
        container.appendChild(commentElement);
      }

    } catch (error) {
      trackEvent('error', { error: error.message });
      container.innerHTML = '';
      const errorDiv = document.createElement('div');
      errorDiv.className = 'comments-error';
      errorDiv.innerHTML = `
        <p><strong>Failed to load comments:</strong> ${error.message}</p>
        <p>You can view comments directly on <a href="https://github.com/${repo}/issues/${issueNumber}" target="_blank" rel="noopener noreferrer">GitHub</a>.</p>
      `;
      container.appendChild(errorDiv);
    }
  }

  /**
   * Reload comments after posting
   */
  async function reloadComments() {
    const container = document.getElementById('github-comments');
    if (!container) return;

    container.innerHTML = '<p>Loading comments...</p>';
    await displayComments(container, currentRepo, currentIssue);
  }

  /**
   * Submit a new comment
   */
  async function submitComment() {
    const textarea = document.getElementById('comment-text');
    const button = document.querySelector('.comment-submit');
    const errorDiv = document.getElementById('comment-error');

    if (!textarea || !button) return;

    const comment = textarea.value.trim();
    if (!comment) {
      errorDiv.textContent = 'Comment cannot be empty';
      errorDiv.style.display = 'block';
      return;
    }

    // Track comment submission attempt
    trackEvent('submit_start', { length: comment.length });

    // Disable form while submitting
    textarea.disabled = true;
    button.disabled = true;
    button.textContent = 'Posting...';
    errorDiv.style.display = 'none';

    try {
      await auth.postComment(currentRepo, currentIssue, comment);

      // Track successful submission
      trackEvent('submit_success');

      // Clear form and reload comments
      textarea.value = '';
      await reloadComments();

      // Re-enable form
      textarea.disabled = false;
      button.disabled = false;
      button.textContent = 'Post comment';

    } catch (error) {
      console.error('Failed to post comment:', error);

      // Track failed submission
      trackEvent('submit_error', { error: error.message });

      errorDiv.textContent = `Failed to post comment: ${error.message}`;
      errorDiv.style.display = 'block';

      // Re-enable form
      textarea.disabled = false;
      button.disabled = false;
      button.textContent = 'Post comment';
    }
  }

  /**
   * Create and render the comment form
   */
  function renderCommentForm() {
    const formContainer = document.getElementById('comment-form');
    if (!formContainer) return;

    if (auth.isLoggedIn()) {
      // Show comment form for authenticated users
      formContainer.innerHTML = `
        <div class="comment-input">
          <textarea id="comment-text"
                    placeholder="Write a comment... (Markdown supported)"
                    rows="4"></textarea>
          <div id="comment-error" class="comment-form-error" style="display: none;"></div>
          <div class="comment-form-actions">
            <button class="comment-submit" onclick="window.submitComment()">Post comment</button>
            <button class="comment-logout" onclick="window.logoutAndReload()">Sign out</button>
          </div>
        </div>
      `;
    } else {
      // Show login button for unauthenticated users
      formContainer.innerHTML = `
        <div class="comment-auth">
          <button class="comment-login" onclick="window.loginWithGitHub()">
            Sign in with GitHub to comment
          </button>
        </div>
      `;
    }
  }

  /**
   * Global functions for button onclick handlers
   */
  window.submitComment = submitComment;
  window.loginWithGitHub = () => {
    trackEvent('login_click');
    auth.login(window.location.pathname);
  };
  window.logoutAndReload = () => {
    trackEvent('logout');
    auth.logout();
  };

  /**
   * Initialize comments on page load
   */
  function init() {
    const container = document.getElementById('github-comments');
    if (!container) return;

    const repo = container.dataset.repo;
    const issueNumber = container.dataset.issue;

    if (!repo || !issueNumber) {
      console.error('Missing data-repo or data-issue attributes');
      container.innerHTML = '<p class="comments-error">Comments configuration error.</p>';
      return;
    }

    // Store for later use
    currentRepo = repo;
    currentIssue = issueNumber;

    displayComments(container, repo, issueNumber);
    renderCommentForm();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
