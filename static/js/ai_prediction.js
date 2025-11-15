//  For auto scroll

document.addEventListener("DOMContentLoaded", function () {
  const report = document.getElementById("report");

  if (report) {
    let scrolled = false;

    try {
      report.scrollIntoView({ behavior: "smooth" });
      scrolled = true;
    } catch (e) {
      scrolled = false;
    }

    // setTimeout(() => {
    //   const nearReport = window.scrollY > report.offsetTop - window.innerHeight;
    //   if (!nearReport) {
    //     const toastEl = document.getElementById("report-toast");
    //     const toast = new bootstrap.Toast(toastEl);
    //     toast.show();
    //   }
    // }, 1000);
    const toastEl = document.getElementById("report-toast");
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  }
});

const patientNameElement = document.getElementById("pename");
let patientName = patientNameElement
  ? patientNameElement.textContent.trim()
  : "Patient";

document.getElementById("myForm").addEventListener("submit", function () {
  const btn = document.getElementById("predictBtn");
  const loading = document.getElementById("loading");

  btn.disabled = true;
  loading.style.display = "block";
});

//   / / / / / / / / / / / / / / / / // / / / / / / / / / / / / / / / / / / /  //  / /  /

document.addEventListener("DOMContentLoaded", function () {
  const pdfBtn = document.getElementById("downloadPDF");

  if (pdfBtn) {
    pdfBtn.addEventListener("click", function () {
      const reportElement = document.getElementById("report");

      if (!reportElement) {
        alert("Report not found!");
        return;
      }

      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5], // top, left, bottom, right
        filename: `${patientName}_AI_Medical_Report.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true }, // useCORS ensures external CSS/images load
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] }, // prevents cutting sections
      };

      // Use DOM element, not innerHTML
      html2pdf().set(opt).from(reportElement).save();
    });
  }
});

document.getElementById("downloadPDF").addEventListener("click", function () {
  // Wait 3 seconds before showing toast
  setTimeout(function () {
    var toastEl = document.getElementById("downloadToast");
    var toast = new bootstrap.Toast(toastEl);
    toast.show();
  }, 3000);
});
