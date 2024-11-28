document
  .querySelector("#delete-post-btn")
  .addEventListener("click", async (event) => {
    const postId = event.target.getAttribute("name");

    // Confirm deletion
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) {
      return; // If user cancels, do nothing
    }

    try {
      const response = await fetch(`/dashboard/delete/${postId}`, {
        method: "DELETE", // Use DELETE method to remove the post
      });

      if (response.ok) {
        // Redirect to the dashboard after deleting the post
        document.location.replace("/dashboard");
      } else {
        alert("Failed to delete post. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Error deleting post. Please try again.");
    }
  });
