// Admin save request that reports real upload progress (fetch can't, XMLHttpRequest can).
// sendWithProgress(url, { method, body | json, onProgress }) → Promise of the JSON response.
// onProgress(percent) receives 0–100 as the request body is uploaded.
export const sendWithProgress = (url, { method = "POST", body, json, onProgress } = {}) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader("Authorization", `Bearer ${localStorage.getItem("adminToken")}`);
    if (json) xhr.setRequestHeader("Content-Type", "application/json");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      let data = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        // non-JSON response
      }
      if (xhr.status >= 200 && xhr.status < 300 && data.success !== false) resolve(data);
      else reject(new Error(data.message || `Request failed (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error("Network error. Please try again."));

    xhr.send(json ? JSON.stringify(json) : body);
  });