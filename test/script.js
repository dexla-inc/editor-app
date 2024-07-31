document.addEventListener("DOMContentLoaded", () => {
  const draggable = document.getElementById("draggable-component");
  const marginBox = document.createElement("div");
  marginBox.classList.add("margin-box");
  document.body.appendChild(marginBox);

  draggable.addEventListener("dragover", (event) => {
    event.preventDefault();
    const rect = draggable.getBoundingClientRect();
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Calculate distances to edges
    const distances = {
      top: Math.abs(mouseY - rect.top),
      bottom: Math.abs(mouseY - rect.bottom),
      left: Math.abs(mouseX - rect.left),
      right: Math.abs(mouseX - rect.right),
    };

    // Find the closest edge
    const closestEdge = Object.keys(distances).reduce((a, b) =>
      distances[a] < distances[b] ? a : b,
    );

    // Determine the margin size
    const margin = Math.floor(distances[closestEdge] / 2) * 2;

    // Set margin box dimensions and position
    switch (closestEdge) {
      case "top":
        marginBox.style.width = `${rect.width}px`;
        marginBox.style.height = `${margin}px`;
        marginBox.style.left = `${rect.left}px`;
        marginBox.style.top = `${rect.top - margin}px`;
        break;
      case "bottom":
        marginBox.style.width = `${rect.width}px`;
        marginBox.style.height = `${margin}px`;
        marginBox.style.left = `${rect.left}px`;
        marginBox.style.top = `${rect.bottom}px`;
        break;
      case "left":
        marginBox.style.width = `${margin}px`;
        marginBox.style.height = `${rect.height}px`;
        marginBox.style.left = `${rect.left - margin}px`;
        marginBox.style.top = `${rect.top}px`;
        break;
      case "right":
        marginBox.style.width = `${margin}px`;
        marginBox.style.height = `${rect.height}px`;
        marginBox.style.left = `${rect.right}px`;
        marginBox.style.top = `${rect.top}px`;
        break;
    }

    // Snap the component
    if (margin > 0) {
      switch (closestEdge) {
        case "top":
          draggable.style.top = `${rect.top - margin}px`;
          break;
        case "bottom":
          draggable.style.top = `${rect.top + margin}px`;
          break;
        case "left":
          draggable.style.left = `${rect.left - margin}px`;
          break;
        case "right":
          draggable.style.left = `${rect.left + margin}px`;
          break;
      }
    }
  });
});
