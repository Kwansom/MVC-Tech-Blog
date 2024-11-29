async function newFormHandler(event) {
  event.preventDefault();

  const title = document.querySelector('textarea[name="post-title"]').value;
  const content = document.querySelector('textarea[name="post-body"]').value;

  const response = await fetch(`/dashboard/post`, {
    method: "POST",
    body: JSON.stringify({
      title,
      content,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  // console.log(response);
  if (response.ok) {
    document.location.replace("/dashboard");
  } else {
    alert(response.statusText);
  }
}

document
  .querySelector("#new-post-form")
  .addEventListener("submit", newFormHandler);
