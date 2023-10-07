import Project from "../../src/entities/Project"; // Adjust the path based on your project structure

 

before(() => {
  cy.visit("http://localhost:3000");

  cy.window().then((win) => {
    win.localStorage.setItem("userEmail", JSON.stringify("test@uottawa.ca"));
  });
  
  cy.intercept('GET', '/api/getusertype', {
    statusCode: 200,
    body: { "userType": "professor" }, // Mocked response
    headers: { 'Access-Control-Allow-Credentials': 'true' } // Ensure credentials are allowed
  }).as('getUserType');

  cy.intercept('GET', '/api/checksession', { statusCode: 200, body: { authenticated: true } }).as('checkSession');
  cy.intercept('POST', '/api/login', { statusCode: 200, body: { token: 'mocked-token' } }).as('login');
  cy.visit("http://localhost:3000/Projects");

  // cy.ssoLogin(); // Use the SSO login command to log in
});
describe("Submit Form", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");

    cy.window().then((win) => {
      win.localStorage.setItem("userEmail", JSON.stringify("test@uottawa.ca"));
    });
    
    cy.intercept('GET', '/api/getusertype', {
      statusCode: 200,
      body: { "userType": "professor" }, // Mocked response
      headers: { 'Access-Control-Allow-Credentials': 'true' } // Ensure credentials are allowed
    }).as('getUserType');
  
    cy.intercept('GET', '/api/checksession', { statusCode: 200, body: { authenticated: true } }).as('checkSession');
    cy.intercept('POST', '/api/login', { statusCode: 200, body: { token: 'mocked-token' } }).as('login');
    cy.visit("http://localhost:3000/Projects");
  });

  it("should fill out a project form and submit it", () => {
    // Define project data
    const projectData = {
      project: "TEST",
      description: "TEST",
      clientName: "ROBERT",
      clientEmail: "TEST@hotmail.com",
      status: "Pending",
      professorEmail: "test@uottawa.ca",
      currentGroup: "1",
      notes: "Notes",
    };

    cy.get('button[name="create-new-project"]').click();

    cy.get("input[name=project]").type(projectData.project);
    cy.get("textarea[name=description]").type(projectData.description);
    cy.get("input[name=clientName]").type(projectData.clientName);
    cy.get("input[name=clientEmail]").type(projectData.clientEmail);
    cy.get("input[name=notes]").type(projectData.notes);
    cy.get('button[name="submitForm"]').click();
    cy.contains("tbody tr", projectData.project).should("exist");
  });

  it("should delete the project that was added", () => {
    cy.get('button[name="deleteProject"]').each(($button) => {
      // Click the delete button for the current row
      cy.wrap($button).parents('tr').within(() => {
        // Click the delete button for the current row
        cy.get('button[name="deleteProject"]').as("btn").click();
      });
  
      // Wait for the modal dialog to appear (adjust the selector as needed)
      cy.get('.modal-dialog').should('be.visible');
  
      // Click the "Agree to Delete" button in the modal dialog
    
      cy.get('button[name="agreeToDelete"]').click();
     
  
      // Wait for the modal dialog to disappear
      cy.get('.modal-dialog').should('not.exist');
    });
  
    // After deleting all rows, verify that none of them exist in the table
    cy.contains("tbody tr", "TEST").should("not.exist");
  });
  
});
