const API_BASE = "http://13.201.192.135:5000";

export const getCases = async () => {
  const response = await fetch(`${API_BASE}/api/cases`);
  const data = await response.json();
  return data;
};