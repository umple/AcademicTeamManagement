const projectService = {
  get: async () => {
    return fetch("/api/projects", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Failed to get project: ${errorMessage}`);
        }
        return response.json();
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        return { success: false, message: error.message };
      });
  },

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
  requestToJoinProject: async (body) => {
    return fetch("api/request/join/project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();  
      })
      .catch((error) => {
        throw error;
      });
  },
};

export default projectService;
