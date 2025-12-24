// Connects frontend -> backend APIs on port 8082 for dev

export async function analyzeResume(formData: FormData, signal?: AbortSignal) {
  const res = await fetch("/api/analyze/jobfit", {
    method: "POST",
    body: formData,
    signal
  });
  if (!res.ok) throw new Error("Failed to analyze resume");
  return await res.json();
}

export async function analyzeTemplate(formData: FormData) {
  const res = await fetch("/api/analyze/template", {
    method: "POST",
    body: formData
  });
  if (!res.ok) throw new Error("Failed to analyze template");
  return await res.json();
}
