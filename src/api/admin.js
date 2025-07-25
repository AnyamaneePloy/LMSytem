const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
// const API_BASE_URL =  'http://localhost:4000';


export async function getClosedCases() {
  const res = await fetch(`${API_BASE_URL}/tasks`);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return await res.json();
}

export async function submitReopenCase(payload) {
  const res = await fetch(`${API_BASE_URL}/tasks/${payload.caseId}/reopen`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to submit reopen request');
  }

  return await res.json();
}
