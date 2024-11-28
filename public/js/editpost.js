async function editFormHandler(event) {
  event.preventDefault();

  const title = document.querySelector('textarea[name="post-title"]').value;
  const content = document.querySelector('textarea[name="post-body"]').value;
  const postId = document.querySelector('input[name="post-id"]').value;

  const response = await fetch(`/dashboard/post/${postId}`, {
    method: "PUT", // Use PUT method for updating
    body: JSON.stringify({
      title,
      content,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    document.location.replace(`/dashboard`); // Redirect to the post page after successful edit
  } else {
    alert(response.statusText);
  }
}

document
  .querySelector("#edit-post-form")
  .addEventListener("submit", editFormHandler);
