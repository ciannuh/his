document.addEventListener("DOMContentLoaded", () => {
  loadThread();
  document.querySelector("button[onclick='postQuestion()']").addEventListener("click", postQuestion);
  document.getElementById("sortSelect").addEventListener("change", sortPosts);
});

function postQuestion() {
  const input = document.getElementById("questionInput");
  const text = input.value.trim();
  if (text === "") return;

  const post = createPost(text);
  document.getElementById("thread").appendChild(post);
  input.value = "";
  saveThread();
}

function createPost(text, isReply = false) {
  const post = document.createElement("div");
  post.className = isReply ? "reply" : "post";

  // Add a timestamp to each post
  post.dataset.timestamp = Date.now().toString();

  const content = document.createElement("div");
  content.className = "text";
  content.innerText = text;

  const actions = document.createElement("div");
  actions.className = "actions";

  const likeBtn = document.createElement("button");
  likeBtn.className = "like-btn";
  likeBtn.textContent = "Like (0)";
  likeBtn.dataset.liked = "false";
  likeBtn.dataset.count = "0";

  likeBtn.addEventListener("click", () => {
    let liked = likeBtn.dataset.liked === "true";
    let count = parseInt(likeBtn.dataset.count);
    count = liked ? count - 1 : count + 1;
    likeBtn.dataset.liked = (!liked).toString();
    likeBtn.dataset.count = count.toString();
    likeBtn.textContent = `Like (${count})`;
    likeBtn.classList.toggle("liked");
    saveThread();
  });

  const replyBtn = document.createElement("button");
  replyBtn.textContent = "Reply";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete-btn";

  deleteBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this post?")) {
      post.remove();
      saveThread();
    }
  });

  const replyBox = document.createElement("div");
  replyBox.className = "reply-box";
  replyBox.style.display = "none";

  const replyInput = document.createElement("textarea");
  replyInput.rows = 2;
  replyInput.placeholder = "Write a reply...";

  const sendBtn = document.createElement("button");
  sendBtn.textContent = "Send";

  sendBtn.addEventListener("click", () => {
    const replyText = replyInput.value.trim();
    if (replyText === "") return;
    const reply = createPost(replyText, true);
    replies.appendChild(reply);
    replyInput.value = "";
    replyBox.style.display = "none";
    saveThread();
  });

  replyBox.appendChild(replyInput);
  replyBox.appendChild(sendBtn);

  replyBtn.addEventListener("click", () => {
    replyBox.style.display = replyBox.style.display === "block" ? "none" : "block";
  });

  const replies = document.createElement("div");
  replies.className = "replies";

  actions.appendChild(likeBtn);
  actions.appendChild(replyBtn);
  actions.appendChild(deleteBtn);

  post.appendChild(content);
  post.appendChild(actions);
  post.appendChild(replyBox);
  post.appendChild(replies);

  return post;
}

function saveThread() {
  const thread = document.getElementById("thread");
  localStorage.setItem("threadContent", thread.innerHTML);
}

function loadThread() {
  const saved = localStorage.getItem("threadContent");
  if (saved) {
    const thread = document.getElementById("thread");
    thread.innerHTML = saved;

    thread.querySelectorAll(".post, .reply").forEach((element) => {
      const likeBtn = element.querySelector(".like-btn");
      const replyBtn = element.querySelector(".actions button:nth-child(2)");
      const deleteBtn = element.querySelector(".delete-btn");
      const replyBox = element.querySelector(".reply-box");
      const replyInput = replyBox?.querySelector("textarea");
      const sendBtn = replyBox?.querySelector("button");
      const replies = element.querySelector(".replies");

      likeBtn?.addEventListener("click", () => {
        let liked = likeBtn.dataset.liked === "true";
        let count = parseInt(likeBtn.dataset.count);
        count = liked ? count - 1 : count + 1;
        likeBtn.dataset.liked = (!liked).toString();
        likeBtn.dataset.count = count.toString();
        likeBtn.textContent = `Like (${count})`;
        likeBtn.classList.toggle("liked");
        saveThread();
      });

      replyBtn?.addEventListener("click", () => {
        replyBox.style.display = replyBox.style.display === "block" ? "none" : "block";
      });

      sendBtn?.addEventListener("click", () => {
        const replyText = replyInput.value.trim();
        if (replyText === "") return;
        const reply = createPost(replyText, true);
        replies.appendChild(reply);
        replyInput.value = "";
        replyBox.style.display = "none";
        saveThread();
      });

      deleteBtn?.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this post?")) {
          element.remove();
          saveThread();
        }
      });
    });
  }
}

function sortPosts() {
  const sortType = document.getElementById("sortSelect").value;
  const thread = document.getElementById("thread");
  const posts = Array.from(thread.querySelectorAll(".post"));

  let sortedPosts;
  if (sortType === "likes") {
    sortedPosts = posts.sort((a, b) => {
      const aLikes = parseInt(a.querySelector(".like-btn")?.dataset.count || "0");
      const bLikes = parseInt(b.querySelector(".like-btn")?.dataset.count || "0");
      return bLikes - aLikes;
    });
  } else if (sortType === "oldest") {
    sortedPosts = posts.sort((a, b) => {
      return parseInt(a.dataset.timestamp) - parseInt(b.dataset.timestamp);
    });
  } else {
    // Newest (default)
    sortedPosts = posts.sort((a, b) => {
      return parseInt(b.dataset.timestamp) - parseInt(a.dataset.timestamp);
    });
  }

  thread.innerHTML = "";
  sortedPosts.forEach(post => thread.appendChild(post));
  saveThread();
}
