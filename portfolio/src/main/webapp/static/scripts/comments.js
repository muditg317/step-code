
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
};
const xwwwfurlenc = (srcjson) => {
  if(typeof srcjson !== "object")
    if(typeof console !== "undefined"){
      console.log("\"srcjson\" is not a JSON object");
      return null;
    }
  u = encodeURIComponent;
  var urljson = "";
  var keys = Object.keys(srcjson);
  for(var i=0; i < keys.length; i++){
    urljson += u(keys[i]) + "=" + u(srcjson[keys[i]]);
    if(i < (keys.length-1))urljson+="&";
  }
  return urljson;
};


const commentList = document.getElementById("comment-list");
const commentBox = document.getElementById("comment-text");
const commentCountField = document.getElementById("num-comments");
const postComment = async () => {
  const comment = commentBox.value;
  let authResponse = await fetch(`/auth-url?entryURLPath=${window.location.pathname}`);
  let authUrlData = await authResponse.json();
  if (authUrlData.type !== "logout") {
    commentBox.value = "You must have an account to post a comment";
    setTimeout(() => {
      commentBox.value = comment;
    }, 1000);
    let authButton = document.querySelector("authentication-button");
    authButton && authButton.focus();
    return;
  }
  commentBox.value = "";
  let response = await fetch("/data-comments", {
      method: "POST",
      body: new URLSearchParams({comment})
    });
  let text = await response.text();
  let data = JSON.parse(text);
  loadComments(data);
};
const deleteComments = async () => {
  let response = await fetch("/data-comments", {
      method: "DELETE",
    });
  let text = await response.text();
  await sleep(500);
  loadComments();
};
const COMMENT_REFRESH_DELAY = 5000;
let loadingTimeout;
const loadComments = async (lastPostDatastoreKey) => {
  clearTimeout(loadingTimeout); // clear timeout in case method was called externally (not from timeout)
  let response = await fetch(
      "/data-comments?" + xwwwfurlenc({
          ...lastPostDatastoreKey,
          maxComments: commentCountField.value
        })
    );
  let text = await response.text();
  let comments = JSON.parse(text);
  commentList.innerHTML = "";
  comments.forEach(comment => {
    let poster = document.createElement("td");
    poster.classList.add("poster");
    poster.innerText = `${comment.commenterName}:`;
    let commentText = document.createElement("td");
    commentText.classList.add("comment-text");
    commentText.innerText = comment.comment;
    let commentInfo = document.createElement("tr");
    commentInfo.classList.add("comment-info");
    commentInfo.appendChild(poster);
    commentInfo.appendChild(commentText);
    commentList.appendChild(commentInfo);
  });
  loadingTimeout = setTimeout(loadComments, COMMENT_REFRESH_DELAY);
};
loadComments();
