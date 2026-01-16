import * as THREE from "/libs/three.js/build/three.module.js";
import {
  getAnnotations,
  addAnnotation,
  deleteAnnotation,
  clearAnnotations,
} from "./api.js";

let annotations = [];
function generateUUID() {
  // RFC4122 version 4 compliant
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function loadAnnotations(viewer) {
  const res = await getAnnotations();

  annotations = res.map((a) => ({
    id: a._id,
    text: a.text,
    position: a.position.position,
  }));

  renderAnnotations(viewer);
}

export function renderAnnotations(viewer) {
  const root = viewer.scene.annotations;
  while (root.children.length) root.remove(root.children[0]);

  annotations.forEach((a) => {
    const ann = new Potree.Annotation({
      position: new THREE.Vector3(a.position.x, a.position.y, a.position.z),
      title: "Annotation",
      description: a.text,
    });

    ann.id = a.id;
    root.add(ann);
  });

  updateList(viewer);
}

export async function updateList(viewer) {
  const list = document.getElementById("ann_items");
  list.innerHTML = "";

  const data = await getAnnotations();

  data.forEach((a) => {
    const li = document.createElement("li");
    li.className = "ann_entry";
    li.innerHTML = `<b>${a.text}</b>`;

    li.onclick = () => {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.1));
      mesh.position.set(a.position.x, a.position.y, a.position.z);
      viewer.zoomTo(mesh, 3);
    };

    li.ondblclick = async () => {
      console.log(a);
      if (!confirm("Delete annotation?")) return;
      await deleteAnnotation(a.potreeid);
      await loadAnnotations(viewer);
    };

    list.appendChild(li);
  });
}

export async function clearAll(viewer) {
  await clearAnnotations();
  annotations = [];
  renderAnnotations(viewer);
}

export async function addOnClick(viewer, pos, text) {
  const trimmedText = text.length > 256 ? text.substring(0, 256) : text;
  const payload = {
    potreeid: generateUUID(),
    position: pos,
    text,
  };

  await addAnnotation(payload);
  await loadAnnotations(viewer);
}
