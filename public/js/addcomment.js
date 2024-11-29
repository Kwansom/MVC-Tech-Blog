async function commentFormHandler(event) {
  event.preventDefault();

  const comment_body = document
    .querySelector('input[name="comment-body"]')
    .value.trim();

  const post_id = window.location.pathname.split("/").pop();
  // const post_id = window.location.toString().split("/")[
  //   window.location.toString().split("/").length - 1
  // ];

  if (comment_body) {
    const response = await fetch(`/api/comment/${post_id}`, {
      method: "POST",
      body: JSON.stringify({
        comment_body,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      document.location.reload();
    } else {
      alert(response.statusText);
      document.querySelector("#comment-form").style.display = "block";
    }
  }
}

document
  .querySelector(".comment-form")
  .addEventListener("submit", commentFormHandler);
