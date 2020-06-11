
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
  let comment = commentBox.value;
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
    let p = document.createElement("p");
    p.classList.add("comment");
    p.innerText = comment.comment;
    commentList.appendChild(p);
  });
  loadingTimeout = setTimeout(loadComments, COMMENT_REFRESH_DELAY);
};
loadComments();
