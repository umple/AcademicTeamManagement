const student = [
  {
    OrgDefinedId: "300111111",
    Username: "username1",
    LastName: "Lastname1",
    FirstName: "Firstname1",
    Email: "email1@example.com",
  },
  {
    OrgDefinedId: "300111112",
    Username: "username2",
    LastName: "Lastname2",
    FirstName: "Firstname2",
    Email: "email2@example.com",
    professorEmail: "",
  },
];
 

describe("Submit Group Form", () => {
  let body_id; // Declare a variable to store body_id
  let project_id; // Declare a variable to store project_id
  before(() => {
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
        orgdefinedid: "300111311",
        firstname: "username1",
        lastname: "Lastname1",
        email: "email1@example.com",
        username: "TESTThh",
        sections: "",
        finalGrade: "",
        group: "",
        professorEmail: "test@uottawa.ca",
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
        _id: "your-project-id", // Replace with a unique project ID
        project: "TEST",
        description: "TEST",
        clientName: "ROBERT",
        clientEmail: "TEST@hotmail.com",
        status: "Pending",
        professorEmail: "test@uottawa.ca",
        currentGroup: "1",
        notes: "Notes",
      },
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      project_id = response.body      
      expect(response.status).to.equal(200);
    });
    // Define the group data
    const groupData = {
      group_id: "your-group-id", // Replace with your desired group ID
      project: "your-project-name", // Replace with your desired project name
      professorEmail: "test@uottawa.ca",
      members: ["300111111", "300111112"],
      notes: "", // You can add notes if needed
    };

    cy.get('button[name="create-new-group"]').click();
    const selectedLabel = '300111111 - Firstname Lastname';

    // Example: Fill out the form fields and submit the form
    cy.get('input[name="group_id"]').type(groupData.group_id);
    cy.get('input[name="members"]').select(["300111111"]);
    cy.get('select[name="project"]').select("your-project-name");
    cy.get('input[name="notes"]').type("Notes");
    cy.get('button[type="submit"]').click();

    // Your assertions here
  });

  afterEach(() => {
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
  });
});
