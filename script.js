document.addEventListener("DOMContentLoaded", () => {
  const stars = document.querySelectorAll(".stars-input button"); // select your star buttons
  const commentBox = document.getElementById("ratingComment");
  const submitBtn = document.getElementById("ratingSubmit");
  const reviewsContainer = document.getElementById("ratingsList");

  let selectedRating = 0;

  // ⭐ Handle star click
  stars.forEach((star, index) => {
    star.addEventListener("click", () => {
      selectedRating = index + 1;

      // highlight stars up to clicked one
      stars.forEach((s, i) => {
        if (i < selectedRating) {
          s.classList.add("active");
        } else {
          s.classList.remove("active");
        }
      });
    });
  });

  // 📩 Handle submit
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const comment = commentBox.value.trim();

    if (selectedRating === 0) {
      alert("Please select a star rating!");
      return;
    }
    if (!comment) {
      alert("Please enter a comment!");
      return;
    }

    // create review element
    const review = document.createElement("div");
    review.classList.add("review");

    review.innerHTML = `
      <p><strong>Rating:</strong> ${"⭐".repeat(selectedRating)}</p>
      <p><strong>Comment:</strong> ${comment}</p>
      <hr>
    `;

    // add to reviews section
    reviewsContainer.prepend(review);

    // reset form
    commentBox.value = "";
    selectedRating = 0;
    stars.forEach((s) => s.classList.remove("active"));
  });
});


