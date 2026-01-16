export function createViewer() {
  if (typeof Potree === "undefined") {
    alert("Potree not loaded");
    return null;
  }

  const viewer = new Potree.Viewer(
    document.getElementById("potree_render_area")
  );

  viewer.setEDLEnabled(true);
  viewer.setFOV(60);
  viewer.setPointBudget(1_000_000);
  viewer.loadGUI(() => viewer.setLanguage("en"));

  return viewer;
}
