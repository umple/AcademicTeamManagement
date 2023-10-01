const studentService = {
  get: async () => {
    return fetch("/api/students", {
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
  add: async (student) => {
    return fetch("/api/student", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorMessage) => {
            throw new Error(`Failed to add student: ${errorMessage}`);
          });
        }
        return { success: true, message: "Student added successfully" };
      })
      .catch((error) => {
        return { success: false, message: error.message };
      });
  }
};

export default studentService;