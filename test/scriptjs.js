function postQuestion() {
  const input = document.getElementById("questionInput");
  const question = input.value.trim();
  if (question === "") return;

  const post = createPostElement(question);
  document.getElementById("thread").appendChild(post);
  input.value = "";
}

function createPostElement(text, isReply = false) {
  const post = document.createElement("div");
  post.className = isReply ? "reply" : "post";

  const content = document.createElement("div");
  content.className = "question-text";
  content.innerText = text;

  const actions = document.createElement("div");
  actions.className = "actions";

  const likeBtn = document.createElement("button");
  likeBtn.className = "like-btn";
  likeBtn.dataset.liked = "false";
  likeBtn.dataset.count = "0";
  likeBtn.innerHTML = "❤️ 0";
  likeBtn.onclick = () => {
    const liked = likeBtn.dataset.liked === "true";
    let count = parseInt(likeBtn.dataset.count);
    if (liked) {
      count--;
      likeBtn.dataset.liked = "false";
      likeBtn.classList.remove("liked");
    } else {
      count++;
      likeBtn.dataset.liked = "true";
      likeBtn.classList.add("liked");
    }
    likeBtn.dataset.count = count;
    likeBtn.innerHTML = `❤️ ${count}`;
  };

  const replyBtn = document.createElement("button");
  replyBtn.innerText = "💬 Reply";
  replyBtn.onclick = () => {
    replyBox.style.display = replyBox.style.display === "block" ? "none" : "block";
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "🗑️ Delete";
  deleteBtn.onclick = () => post.remove();

  actions.appendChild(likeBtn);
  actions.appendChild(replyBtn);
  actions.appendChild(deleteBtn);

  const replyBox = document.createElement("div");
  replyBox.className = "reply-box";
  replyBox.innerHTML = `
    <textarea rows="2" placeholder="Write a reply..."></textarea>
    <button>Send</button>
  `;
  const sendBtn = replyBox.querySelector("button");
  sendBtn.onclick = () => {
    const replyText = replyBox.querySelector("textarea").value.trim();
    if (replyText === "") return;
    const reply = createPostElement(replyText, true);
    replies.appendChild(reply);
    replyBox.querySelector("textarea").value = "";
    replyBox.style.display = "none";
  };

  const replies = document.createElement("div");
  replies.className = "replies";

  post.appendChild(content);
  post.appendChild(actions);
  post.appendChild(replyBox);
  post.appendChild(replies);

  return post;
}
