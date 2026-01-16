import { API_BASE } from "./config.js";

export async function getAnnotations() {
  const res = await fetch(`${API_BASE}/api/annotations`);
  if (!res.ok) throw new Error("Failed to fetch annotations");
  return res.json();
}

export async function addAnnotation(annotation) {
  const response = await fetch(`${API_BASE}/api/annotations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(annotation),
  });
  if (!response.ok) throw new Error("Failed to add annotation");
  return await response.json();
}

export async function deleteAnnotation(id) {
  const response = await fetch(`${API_BASE}/api/annotations/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Failed to delete annotation");
  try{
    return await response.json();
  }
  catch{
    return true
  }
}

export async function clearAnnotations() {
  const response = await fetch(`${API_BASE}/api/annotations`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Failed to clear DB");
  try{
    return await response.json();
  }
  catch{
    return true
  }
}
