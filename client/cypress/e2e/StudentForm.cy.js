describe("addingStudent", () => {
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
    cy.visit("http://localhost:3000/Students");
  });
  it("tests addingStudent", () => {
    cy.get('button[name="create-new-student"]').click();
    const  studentData = {
      orgdefinedid: "300000000",
      firstname:   "robert",
      lastname:   "basile",
      email:   "test@hotmail.com",
      username:   "username",
      sections:   "5",
      finalGrade:   "85",
    }
    for (const key in  studentData) {
      cy.get(`input[name=${key}]`).type( studentData[key]);
    }

    cy.get('button[name="submitForm"]').click();
    cy.contains("tbody tr",  studentData.project).should("exist");
  });
});
