// for auto scroll

document.addEventListener("DOMContentLoaded", function () {
  const report = document.getElementById("rep_con");

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

// console.log(patientName);

document.addEventListener("DOMContentLoaded", function () {
  const pdfBtn = document.getElementById("pdfBtn");

  if (pdfBtn) {
    pdfBtn.addEventListener("click", function () {
      let element = document.getElementById("rep_con");
      let opt = {
        margin: 0.5,
        filename: `${patientName}_Medical_Report.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };

      html2pdf().set(opt).from(element).save();
    });
  }
});

document.getElementById("pdfBtn").addEventListener("click", function () {
  
  setTimeout(function () {
    var toastEl = document.getElementById("downloadToast");
    var toast = new bootstrap.Toast(toastEl);
    toast.show();
  }, 3000);
});
