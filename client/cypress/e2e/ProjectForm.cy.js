import Project from "../../src/entities/Project"; // Adjust the path based on your project structure

Cypress.Commands.add('ssoLogin', () => {
  cy.visit('http://localhost:3000'); // Replace with your SSO login URL
  cy.get('button[name="login"]').click();

  // Assuming you need to click a button to initiate the SSO login
  cy.get('button.sso-login-button').click();

  // You may need to interact with the Microsoft login page
  cy.get('input[name="loginfmt"]').type('test@robertnbasilehotmailcom.onmicrosoft.com');
  cy.get('input[name="passwd"]').type('107Z0ucunb5GDz17xVCd');
  cy.get('input[type="submit"]').click();

  // Handle any redirects and assertions as needed
  // For example, check if you are redirected to the expected page after successful login
  cy.url().should('eq', 'https://your-app.com/dashboard'); // Replace with the expected URL

  // Add more assertions and handling as needed
});

describe("Submit Form", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.ssoLogin(); // Use the SSO login command to log in
  });

  it("should fill out a project form and submit it", () => {
    // Define project data
    const projectData = {
      project: "TEST",
      description: "TEST",
      clientName: "ROBERT",
      clientEmail: "TEST@hotmail.com",
      status: "Pending",
      professorEmail: "Professor@hotmail.com",
      currentGroup: "1",
      notes: "Notes",
    };

    cy.get('button[name="create-new-project"]').click();

    cy.get("input[name=project]").type(projectData.project);
    cy.get("input[name=description]").type(projectData.description);
    cy.get("input[name=clientName]").type(projectData.clientName);
    cy.get("input[name=clientEmail]").type(projectData.clientEmail);
    cy.get("select[name=status]").select(projectData.status);
    cy.get("input[name=professorEmail]").type(projectData.professorEmail);
    cy.get("input[name=currentGroup]").type(projectData.currentGroup);
    cy.get("textarea[name=notes]").type(projectData.notes);

    // Submit the form
    cy.get("form").submit();

    // Assert that the project is created successfully
    cy.contains("tbody tr", projectData.project).should("exist");

    // Add more assertions as needed for successful form submission
  });
});
