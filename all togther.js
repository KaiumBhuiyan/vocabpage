<style>
/* Related Posts Box Styling */
.related-posts-box {
  background: #fff;
  border-left: 4px solid #2196f3;
  padding: 16px 20px;
  margin: 24px 0;
  border-radius: 6px;
  font-family: Arial, sans-serif;
  font-size: 15px;
  line-height: 1.6;
  color: #333;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  transition: box-shadow 0.3s ease-in-out; /* Keep for subtle hover effect */
}

/* Heading inside the box */
.related-posts-box h4 {
  margin: 0 0 12px;
  font-size: 17px;
  color: #222;
  border-bottom: 1px solid #eee;
  padding-bottom: 6px;
}

/* List container */
.related-posts-box ul {
  list-style: disc; /* Set bullet type for the list */
  margin: 0;
  padding-left: 20px; /* Indent the list for bullets */
}

/* Individual list items */
.related-posts-box ul li {
  margin-bottom: 12px;
  /* Removed padding-left and position: relative as custom arrow is gone */
}

/* Links within the list */
.related-posts-box ul li a {
  color: #2196f3;
  text-decoration: none;
  transition: color 0.3s ease;
}

/* Link hover/focus states */
.related-posts-box ul li a:hover,
.related-posts-box ul li a:focus {
  color: #1976d2;
  text-decoration: underline;
  outline: none;
}

.related-posts-box ul li a:focus {
  outline: 2px dashed #1976d2;
  outline-offset: 2px;
}

/* Responsive adjustments for smaller screens */
@media (max-width: 600px) {
  .related-posts-box {
    padding: 12px 16px;
    font-size: 14px;
  }

  .related-posts-box h4 {
    font-size: 16px;
  }

  .related-posts-box ul li {
    margin-bottom: 10px;
  }
}
</style>

<script>
//<![CDATA[
function loadRelatedPosts() {
  // Try to find the post content area using common class names
  const postContent = document.querySelector('.post-body') || document.querySelector('.post-content') || document.querySelector('.entry-content');
  if (!postContent) return; // Exit if no content area is found

  let html = postContent.innerHTML;
  // Regex to find shortcodes like [related label="Your Label"]
  const regex = /\[related label="([^"]+)"\]/gi;
  let match;

  // Loop through all matches found in the post content
  while ((match = regex.exec(html)) !== null) {
    const label = match[1]; // Extract the label from the shortcode
    // Generate a unique ID for the container to avoid conflicts
    const containerId = 'related_' + label.replace(/\s+/g, '_') + '_' + Math.floor(Math.random() * 10000);
    // Replace the shortcode with a placeholder div
    html = html.replace(match[0], `<div id="${containerId}">Loading related posts...</div>`);
    // Fetch posts for this label
    fetchRelatedPosts(label, containerId);
  }

  // Update the post content with the placeholders
  postContent.innerHTML = html;
}

function fetchRelatedPosts(label, containerId) {
  // Define a global callback function (required for JSON-in-script)
  window['relatedCallback_' + containerId] = function(json) {
    const container = document.getElementById(containerId);
    // Check if any posts were returned
    if (!json.feed || !json.feed.entry || json.feed.entry.length === 0) {
      container.innerHTML = '<p>No related posts found.</p>';
      return;
    }

    // Build the HTML for the related posts box
    let listHTML = '<div class="related-posts-box"><h4>Related Posts:</h4><ul>';
    json.feed.entry.forEach(function(entry) {
      const title = entry.title.$t;
      // Find the alternate link for the post URL
      const url = entry.link.find(l => l.rel === 'alternate').href;
      listHTML += `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${title}</a></li>`;
    });
    listHTML += '</ul></div>';
    container.innerHTML = listHTML; // Insert the generated HTML
  };

  // Create and append a script tag to make the JSONP request
  const script = document.createElement('script');
  script.src = '/feeds/posts/default/-/' + encodeURIComponent(label) +
    '?alt=json-in-script&callback=relatedCallback_' + containerId + '&max-results=3';
  document.body.appendChild(script);
}

// Load related posts when the DOM is fully loaded
window.addEventListener('DOMContentLoaded', loadRelatedPosts);
//]]>
</script>