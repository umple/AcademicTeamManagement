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
          throw new Error(`Failed to get student: ${errorMessage}`);
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
  getByEmail: async (email) => {
    return fetch(`/api/student/${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Failed to get student by email: ${errorMessage}`);
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
        return response;
      })
      .catch((error) => {
        return { success: false, message: error.message };
      });
  }, 
  delete: async (id) => {
    return fetch(`api/student/delete/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error(error);
      });
  },
  deleteBulkStudents: async (rows) => {
    const  s = Object.fromEntries(
      Object.entries(rows).map(([key, value]) => [String(key), value])
    );
    return fetch("api/student/delete/bulk", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(s)
    })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error(error);
      });
  },
  update: async (id, values) => {
    return fetch(`/api/student/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
    .then((response) => {
      if (!response.ok) {
        return response.text().then((errorMessage) => {
          throw new Error(`Failed to update student: ${errorMessage}`);
        });
      }
      return { success: true, message: "Student updated successfully" };
    })
    .catch((error) => {
      console.error(error);
    });
  }

};

export default studentService;
