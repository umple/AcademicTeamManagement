import axios from "axios";
const groupsService = {
  get: async () => {
    return await fetch("/api/groups", { method: "GET" })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return data;
      }) 
      .catch((error) => {
        return error;
      });
  },
  post: async (values) => {
    try {
      const response = await fetch("api/group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        return response.status;
      } else {
        throw new Error(`Request failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
    }
  },
  put: async (groupId, values) => {
    return fetch(`api/group/update/${groupId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        return error;
      });
  },
  delete: async (id) => {
    return fetch(`api/group/delete/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        return error;
      });
  },
};

export default groupsService;
