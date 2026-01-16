import { createViewer } from "./viewer.js";
import {
  loadAnnotations,
  updateList,
  clearAll,
  addOnClick,
} from "./annotations.js";

window.onload = async () => {
  const viewer = createViewer();
  if (!viewer) return;

  await loadAnnotations(viewer);

  // UI
  document.getElementById("listBtn").onclick = () => {
    const panel = document.getElementById("list_panel");
    panel.style.display =
      panel.style.display === "flex" ? "none" : "flex";
    updateList(viewer);
  };

  document.getElementById("clearBtn").onclick = () => {
    if (confirm("Clear all annotations?")) {
      clearAll(viewer);
    }
  };

  // Point cloud
  Potree.loadPointCloud(
    "/pointclouds/lion_takanawa/cloud.js",
    "lion",
    e => {
      viewer.scene.addPointCloud(e.pointcloud);
      viewer.fitToScreen();

      viewer.renderer.domElement.addEventListener("click", async (evt) => {
        const hit = viewer.inputHandler.getMousePointCloudIntersection(evt);
        if (!hit) return;

        const text = prompt("Annotation text:");
        if (!text) return;
        console.log(hit.point);

        await addOnClick(viewer, hit.point, text);
      });
    }
  );
};
