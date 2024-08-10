const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

const imageInput = document.getElementById("image-input");
const tierItems = document.getElementById("tier-items");
const tierItemsLabel = document.getElementById("tier-items-label");
const rows = document.querySelectorAll(".row");

let sourceContainer = null;
let draggedItem = null;

imageInput.addEventListener("change", handleFileInputChange);
tierItemsLabel.addEventListener("drop", handleLabelDrop);
tierItemsLabel.addEventListener("dragover", handleTierItemsDragOver);
tierItemsLabel.addEventListener("dragleave", handleLabelDragLeave);
tierItems.addEventListener("dragover", handleTierItemsDragOver);
tierItems.addEventListener("drop", handleTierItemsDrop);
tierItems.addEventListener("dragleave", handleTierItemsDragLeave);

for (const row of rows) {
  row.addEventListener("dragover", handleTierItemsDragOver);
  row.addEventListener("drop", handleTierItemsDrop);
  row.addEventListener("dragleave", handleTierItemsDragLeave);
}

function handleLabelDrop(event) {
  event.preventDefault();

  const { dataTransfer } = event;
  const { files } = dataTransfer;

  const allFilesAreImage = Array.from(files).every((file) =>
    IMAGE_TYPES.includes(file.type)
  );

  if (files.length === 0 || !allFilesAreImage) {
    alert("Only images are allowed to be dropped here.");
    return;
  }

  addItemsFromFileList(files, tierItems);
}

function handleLabelDragOver(event) {
  event.preventDefault();

  tierItemsLabel.classList.add("over");
}

function handleLabelDragLeave(event) {
  event.preventDefault();

  tierItemsLabel.classList.remove("over");
}

function handleFileInputChange(event) {
  event.preventDefault();

  const { files } = event.target;

  const allFilesAreImage = Array.from(files).every((file) =>
    IMAGE_TYPES.includes(file.type)
  );

  if (files.length === 0 || !allFilesAreImage) {
    alert("Only images are allowed to be dropped here.");
    return;
  }

  addItemsFromFileList(files, tierItems);
}

function handleTierItemsDragOver(event) {
  event.preventDefault();

  const { currentTarget } = event;
  currentTarget.classList.add("drag-over");

  const preview = document.querySelector(".drag-preview");

  if (draggedItem && !preview) {
    const previewClone = draggedItem.cloneNode(true);
    previewClone.classList.add("drag-preview");
    currentTarget.appendChild(previewClone);
  }
}

function handleTierItemsDragLeave(event) {
  event.preventDefault();

  const { currentTarget } = event;
  currentTarget.classList.remove("drag-over");

  currentTarget.querySelector(".drag-preview")?.remove();
}

function handleTierItemsDrop(event) {
  event.preventDefault();

  const { dataTransfer, currentTarget } = event;

  if (sourceContainer && draggedItem) {
    sourceContainer.removeChild(draggedItem);
  }

  if (draggedItem) {
    const src = dataTransfer.getData("text/plain");
    const imgElement = addItem(src);
    currentTarget.appendChild(imgElement);
  }

  currentTarget.classList.remove("drag-over");
  currentTarget.querySelector(".drag-preview")?.remove();
}

function addItem(itemSrc) {
  const imgElement = document.createElement("img");
  imgElement.src = itemSrc;
  imgElement.classList.add("tier-item");
  imgElement.draggable = true;

  imgElement.addEventListener("dragstart", (event) => {
    sourceContainer = event.target.parentNode;
    draggedItem = event.target;
    event.dataTransfer.setData("text/plain", event.target.src);
  });

  tierItems.appendChild(imgElement);

  return imgElement;
}

function addItemsFromFileList(fileList) {
  for (const file of Array.from(fileList)) {
    const reader = new FileReader();

    reader.addEventListener("load", (eventReader) => {
      addItem(eventReader.target.result);
    });

    reader.readAsDataURL(file);
  }
}
