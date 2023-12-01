describe("Student Home Page - Language Switching", () => {
  beforeEach(() => {
    // Mock user as a student
    cy.window().then((win) => {
      win.localStorage.setItem("userEmail", JSON.stringify("test@uottawa.ca"));
    });

    // Mock API calls if needed
    cy.intercept("GET", "/api/getusertype", {
      statusCode: 200,
      body: { userType: "student" }, // Mocked response for student user type
      headers: { "Access-Control-Allow-Credentials": "true" },
    }).as("getUserType");

    cy.intercept("GET", "/api/checksession", {
      statusCode: 200,
      body: { authenticated: true },
    }).as("checkSession");

    cy.intercept("POST", "/api/login", {
      statusCode: 200,
      body: { token: "mocked-token" },
    }).as("login");

    cy.visit("http://localhost:3000/StudentHome");
  });

  it("should switch language when language button is clicked", () => {
    // Assert default language
    cy.contains("Academic Team Management").should("exist");
    cy.contains("Welcome").should("exist");

    // Switch to French
    cy.get('[data-testid="LanguageIcon"]').click();
    cy.contains("Gestion d'équipe académique").should("exist"); // Check for the French translation of "Academic Team Management"
    cy.contains("Bienvenue").should("exist"); // Check for the French translation of "Welcome"
    
    // Add more assertions based on your translations and the structure of your page
    // For example, you can check for the existence of specific elements, classes, etc.

    // Switch back to English
    cy.get('[data-testid="LanguageIcon"]').click();
    cy.contains("Academic Team Management").should("exist");
    cy.contains("Welcome").should("exist");
  });
});