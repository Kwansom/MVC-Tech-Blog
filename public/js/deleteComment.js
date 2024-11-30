document.addEventListener("DOMContentLoaded", function () {
  const comments = document.querySelectorAll(".render-comment");

  comments.forEach((comment) => {
    // Show a "delete" indicator on hover if the comment is deletable
    if (comment.getAttribute("data-can-delete") === "true") {
      comment.addEventListener("mouseenter", function () {
        // Change the cursor to indicate that the comment is clickable
        comment.style.cursor = "pointer";
        comment.style.opacity = "0.7"; // Optional: Add a hover effect to show that it's clickable
      });

      comment.addEventListener("mouseleave", function () {
        comment.style.opacity = "1"; // Reset opacity when the mouse leaves
      });

      // When clicked, send the DELETE request to the server
      comment.addEventListener("click", async function () {
        const commentId = comment.getAttribute("data-comment-id");

        // Confirm deletion
        const confirmDelete = window.confirm(
          "Are you sure you want to delete your comment?"
        );
        if (!confirmDelete) {
          return; // If user cancels, do nothing
        }

        // Send the DELETE request to the backend
        const response = await fetch(`/api/comment/${commentId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          // On success, remove the comment from the page
          comment.remove();
        } else {
          alert("Failed to delete comment");
        }
      });
    }
  });
});
