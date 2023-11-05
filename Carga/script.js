const form = document.querySelector("form");
const fileInput = document.querySelector(".file-input");
const progressArea = document.querySelector(".progress-area");
const uploadedArea = document.querySelector(".uploaded-area");

form.addEventListener("click", () => fileInput.click());

fileInput.onchange = ({ target }) => {
  const file = target.files[0];
  if (file) {
    const fileName = (file.name.length >= 12) ? `${file.name.substring(0, 13)}... .${file.name.split('.')[1]}` : file.name;
    uploadFile(fileName);
  }
};

function uploadFile(name) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "php/upload.php");
  xhr.upload.addEventListener("progress", ({ loaded, total }) => {
    const fileLoaded = Math.floor((loaded / total) * 100);
    const fileTotal = Math.floor(total / 1000);
    const fileSize = (fileTotal < 1024) ? `${fileTotal} KB` : `${(loaded / (1024 * 1024)).toFixed(2)} MB`;

    const progressHTML = `<li class="row">
                          <i class="fas fa-file-alt"></i>
                          <div class="content">
                            <div class="details">
                              <span class="name">${name} • Uploading</span>
                              <span class="percent">${fileLoaded}%</span>
                            </div>
                            <div class="progress-bar">
                              <div class="progress" style="width: ${fileLoaded}%"></div>
                            </div>
                          </div>
                        </li>`;
    uploadedArea.classList.add("onprogress");
    progressArea.innerHTML = progressHTML;

    if (loaded === total) {
      progressArea.innerHTML = "";
      const uploadedHTML = `<li class="row">
                            <div class="content upload">
                              <i class="fas fa-file-alt"></i>
                              <div class="details">
                                <span class="name">${name} • Uploaded</span>
                                <span class="size">${fileSize}</span>
                              </div>
                            </div>
                            <i class="fas fa-check"></i>
                          </li>`;
      uploadedArea.classList.remove("onprogress");
      uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);
    }
  });

  const data = new FormData(form);
  xhr.send(data);
}
