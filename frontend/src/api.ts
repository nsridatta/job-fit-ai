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

export async function generateCoverLetter(formData: FormData) {
  const res = await fetch("/api/analyze/cover-letter", {
    method: "POST",
    body: formData
  });
  if (!res.ok) throw new Error("Failed to generate cover letter");
  return await res.json();
}

export async function generateRoadmap(missingSkills: string) {
  const res = await fetch(`/api/analyze/roadmap?missingSkills=${encodeURIComponent(missingSkills)}`, {
    method: "POST"
  });
  if (!res.ok) throw new Error("Failed to generate roadmap");
  return await res.json();
}
