const groupService = {
  get: async () => {
    return fetch("/api/groups", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Failed to get groups: ${errorMessage}`);
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
  add: async (newGroupInfo) => {
    return fetch("api/group", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newGroupInfo),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorMessage) => {
            throw new Error(`Failed to add group: ${errorMessage}`);
          });
        }
        return { success: true, message: "Group added successfully" };
      })
      .catch((error) => {
        console.error(error);
      });
  },
};

export default groupService;
