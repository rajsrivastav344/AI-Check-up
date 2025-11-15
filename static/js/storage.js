document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("uploadForm");
  const fileInput = document.getElementById("reportInput");
  const errorBox = document.getElementById("uploadError");

  form.addEventListener("submit", function (event) {
    errorBox.innerHTML = ""; // clear previous errors
    const file = fileInput.files[0];

    if (!file) {
      event.preventDefault();
      errorBox.innerHTML = `
        <div class="alert alert-warning alert-dismissible fade show rounded-4" role="alert">
          ⚠️ Please select a file before uploading.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      event.preventDefault();
      errorBox.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show rounded-4" role="alert">
          ❌ File type not allowed. Allowed: PDF, PNG, JPG, JPEG, DOC, DOCX.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
      return;
    }

    const maxSize = 2 * 1024 * 1024; // 2 MB
    if (file.size > maxSize) {
      event.preventDefault();
      errorBox.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show rounded-4" role="alert">
          ❌ File too large! Maximum allowed size is 2 MB.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
      return;
    }
  });
});

// / / / / /                  auto scroll                     / / / / / /
document.addEventListener("DOMContentLoaded", function () {
  const storage = document.getElementById("storage_container");

  if (storage) {
    let scrolled = false;

    try {
      storage.scrollIntoView({ behavior: "smooth" });
      scrolled = true;
    } catch (e) {
      scrolled = false;
    }
  }
});

document.getElementById("downloadPDF").addEventListener("click", function () {
  
  setTimeout(function () {
    var toastEl = document.getElementById("downloadToast");
    var toast = new bootstrap.Toast(toastEl);
    toast.show();
  }, 3000);
});
