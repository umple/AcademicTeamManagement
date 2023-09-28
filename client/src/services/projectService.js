const projectService = {
  add: async (project) => {
    return fetch("/api/project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorMessage) => {
            throw new Error(`Failed to add project: ${errorMessage}`);
          });
        }
        return { success: true, message: "Project added successfully" };
      })
      .catch((error) => {
        return { success: false, message: error.message };
      });
  },
};

export default projectService;
