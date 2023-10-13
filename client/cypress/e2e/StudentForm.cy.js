describe("addingStudent", () => {
  it("tests addingStudent", () => {
    cy.viewport(1920, 939);
    cy.visit("http://localhost:3000/Students");
    cy.get("button.MuiButton-containedSuccess").click();
    cy.get("#\\:r2f\\:").click();
    cy.get("#\\:r2f\\:").type("311111111");
    cy.get("div.MuiDialogContent-root div:nth-of-type(2)").click();
    cy.get("#\\:r2h\\:").type("Ro");
    cy.get("#\\:r2h\\:").type("Robert");
    cy.get("#\\:r2j\\:").type("B");
    cy.get("#\\:r2j\\:").type("Basile");
    cy.get("#\\:r2l\\:").type("robert");
    cy.get("#\\:r2n\\:").type("robert@hotmail.com");
    cy.get("#\\:r2r\\:").type("85");
    cy.get("div.MuiDialog-root button.MuiButton-contained").click();
    cy.visit("chrome://extensions/");
  });
});
