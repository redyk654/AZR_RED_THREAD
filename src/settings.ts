const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7178/api";

const settings = {
  PROJECT_URL: `${API_BASE_URL}/Project`,
  // plus tard tu pourras ajouter TASK_URL, USER_URL, etc.
};

export default settings;
