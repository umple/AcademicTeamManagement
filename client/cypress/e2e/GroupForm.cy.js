const student = [
  {
    email: "email1@example.com",
    firstname: "Firstname1",
    lastname: "Lastname1",
    is_admin: false,
  },
  {
    email: "email2@example.com",
    firstname: "Firstname2",
    lastname: "Lastname2",
    is_admin: false,
  },
];

describe("Submit Group Form", () => {
  let body_id; // Declare a variable to store body_id
  let project_id; // Declare a variable to store project_id
  let section_id;
  beforeEach(() => {
    cy.visit("http://localhost:3000");

    cy.window().then((win) => {
      win.localStorage.setItem("userEmail", JSON.stringify("test@uottawa.ca"));
    });
    cy.intercept("GET", "/api/getusertype", {
      statusCode: 200,
      body: { userType: "professor" }, // Mocked response
      headers: { "Access-Control-Allow-Credentials": "true" }, // Ensure credentials are allowed
    }).as("getUserType");

    cy.intercept("GET", "/api/checksession", {
      statusCode: 200,
      body: { authenticated: true },
    }).as("checkSession");
    cy.intercept("POST", "/api/login", {
      statusCode: 200,
      body: { token: "mocked-token" },
    }).as("login");
  });

  beforeEach(() => {
    cy.visit("http://localhost:3000/GroupView");
  });

  it("should fill out a group form and submit it", () => {
    cy.request({
      method: "POST",
      url: "/api/student", // Replace with the correct URL for the student endpoint
      body: {
        email: "email1@example.com",
        firstname: "username1",
        lastname: "Lastname1",
        student_number: "300111311",
        is_admin: false,
      }, // Adjust the request body as needed
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      body_id = response.body;
      expect(response.status).to.equal(201);
    });

    cy.request({
      method: "POST",
      url: "/api/project", // Replace with the correct URL
      body: {
        // _id: "your-project-id", // Replace with a unique project ID
        project: "MYGROUPTEST",
        description: "TEST",
        clientName: "ROBERT",
        clientEmail: "TEST@hotmail.com",
        status: "Available",
        professorEmail: "test@uottawa.ca",
        group: "1",
        notes: "Notes",
      },
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      project_id = response.body;
      expect(response.status).to.equal(200);
    });

  //   // Add a section
  //   cy.request({
  //     method: "POST",
  //     url: "/api/section", // Replace with the correct URL for the student endpoint
  //     body: {
  //       name: "Fall 2023 Test",
  //       term: "Fall",
  //       year: "2023",
  //       note: "new section",
  //     }, // Adjust the request body as needed
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   }).then((response) => {
  //     section_id = response.body;
  //     expect(response.status).to.equal(201);
  //   });

  //   // Define the group data
  //   const groupData = {
  //     group_id: "your-group-id", // Replace with your desired group ID
  //     project: "your-project-name", // Replace with your desired project name
  //     professorEmail: "test@uottawa.ca",
  //     members: ["300111111", "300111112"],
  //     notes: "", // You can add notes if needed
  //   };

  //   cy.reload()
  //   cy.wait(20000)
  //   cy.reload()
 

  //   cy.get('button[name="create-new-group"]').click();
  //   // Example: Fill out the form fields and submit the form
  //   cy.get('input[name="group_id"]').type(groupData.group_id);
  //   cy.get(
  //     'input[id="members-autocomplete"]'
  //   ).click().contains("username1 Lastname1").click();
  //   cy.get('ul[aria-labelledby="demo-multiple-chip-label"]') // Select the <ul> element by its aria-labelledby attribute
  //     .contains("300111311 - username1 Lastname1") // Find the element with the specified text
  //     .click();
  //   cy.get("body").click();

  //   // Select the section
  //   cy.get('[name="sections"]').parent().click();
  //   cy.get('[role="option"]').contains('Fall 2023 Test').click();

  //   cy.get('div[aria-labelledby="project-label mui-component-select-project"]') // Select the <div> element by its aria-labelledby attribute
  //     .click(); // Click the element
  //   cy.get('ul[role="listbox"] li').contains("MYGROUPTEST").click();
  //   cy.get('input[name="notes"]').type("Notes");
  //   cy.get('button[type="submit"]').click();

  //   cy.contains("tbody tr", "MYGROUPTEST").should("exist");

  //   // Your assertions here
  // });

  // it("should delete the group that was added", () => {
  //   cy.get('button[name="deleteGroup"]').each(($button) => {
  //     // Click the delete button for the current row
  //     cy.wrap($button)
  //       .parents("tr")
  //       .within(() => {
  //         // Click the delete button for the current row
  //         cy.get('button[name="deleteGroup"]').as("btn").click();
  //       });

  //     cy.get(".modal-dialog").should("be.visible");
  //     cy.get('button[name="agreeToDelete"]').click();
  //     cy.get(".modal-dialog").should("not.exist");
  //   });
  //   // After deleting all rows, verify that none of them exist in the table
  //   cy.contains("tbody tr").should("not.exist");
  // });

  after(() => {
    cy.request({
      method: "DELETE",
      url: `/api/student/delete/${body_id}`,
    }).then((response) => {
      expect(response.status).to.equal(200);
    });

    cy.request({
      method: "DELETE",
      url: `/api/project/delete/${project_id}`,
    }).then((response) => {
      expect(response.status).to.equal(200);
    });

    cy.request({
      method: "DELETE",
      url: `/api/section/delete/${section_id}`,
    }).then((response) => {
      expect(response.status).to.equal(200);
    });
  });
});
