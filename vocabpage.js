//<![CDATA[
function loadRelatedPosts() {
  const postContent = document.querySelector('.post-body') || document.querySelector('.post-content') || document.querySelector('.entry-content');
  if (!postContent) return;

  let html = postContent.innerHTML;
  const regex = /\[related label="([^"]+)"\]/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const label = match[1];
    const containerId = 'related_' + label.replace(/\s+/g, '_') + '_' + Math.floor(Math.random() * 10000);
    html = html.replace(match[0], `<div id="${containerId}">Loading related posts...</div>`);
    fetchRelatedPosts(label, containerId);
  }

  postContent.innerHTML = html;
}

function fetchRelatedPosts(label, containerId) {
  window['relatedCallback_' + containerId] = function(json) {
    const container = document.getElementById(containerId);
    if (!json.feed || !json.feed.entry || json.feed.entry.length === 0) {
      container.innerHTML = '<p>No related posts found.</p>';
      return;
    }

    let listHTML = '<div class="related-posts-box"><h4>Related Posts:</h4><ul>';
    json.feed.entry.forEach(function(entry) {
      const title = entry.title.$t;
      const url = entry.link.find(l => l.rel === 'alternate').href;
      listHTML += `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${title}</a></li>`;
    });
    listHTML += '</ul></div>';
    container.innerHTML = listHTML;
  };

  const script = document.createElement('script');
  script.src = '/feeds/posts/default/-/' + encodeURIComponent(label) +
    '?alt=json-in-script&callback=relatedCallback_' + containerId + '&max-results=3';
  document.body.appendChild(script);
}

window.addEventListener('DOMContentLoaded', loadRelatedPosts);
//]]>
