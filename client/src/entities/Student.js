import React, { Component } from 'react';

class Student extends Component {
  constructor(props) {
    super(props);

    this.state = {
      OrgDefinedId: props.OrgDefinedId,
      Username: props.Username,
      LastName: props.LastName,
      FirstName: props.FirstName,
      Email: props.Email,
      Sections: props.Sections,
      CalculatedFinalGradeNumerator: props.CalculatedFinalGradeNumerator,
      CalculatedFinalGradeDenominator: props.CalculatedFinalGradeDenominator,
      AdjustedFinalGradeNumerator: props.AdjustedFinalGradeNumerator,
      AdjustedFinalGradeDenominator: props.AdjustedFinalGradeDenominator,
    };
  }

  // Getter methods
  getOrgDefinedId() {
    return this.state.OrgDefinedId;
  }

  getUsername() {
    return this.state.Username;
  }

  getLastName() {
    return this.state.LastName;
  }

  getFirstName() {
    return this.state.FirstName;
  }

  getEmail() {
    return this.state.Email;
  }

  getSections() {
    return this.state.Sections;
  }

  getCalculatedFinalGradeNumerator() {
    return this.state.CalculatedFinalGradeNumerator;
  }

  getCalculatedFinalGradeDenominator() {
    return this.state.CalculatedFinalGradeDenominator;
  }

  getAdjustedFinalGradeNumerator() {
    return this.state.AdjustedFinalGradeNumerator;
  }

  getAdjustedFinalGradeDenominator() {
    return this.state.AdjustedFinalGradeDenominator;
  }

  // Setter methods
  setOrgDefinedId(OrgDefinedId) {
    this.state.OrgDefinedId = OrgDefinedId;
  }

  setUsername(Username) {
    this.state.Username = Username;
  }

  setLastName(LastName) {
    this.state.LastName = LastName;
  }

  setFirstName(FirstName) {
    this.state.FirstName = FirstName;
  }

  setEmail(Email) {
    this.state.Email = Email;
  }

  setSections(Sections) {
    this.state.Sections = Sections;
  }

  setCalculatedFinalGradeNumerator(CalculatedFinalGradeNumerator) {
    this.state.CalculatedFinalGradeNumerator = CalculatedFinalGradeNumerator;
  }

  setCalculatedFinalGradeDenominator(CalculatedFinalGradeDenominator) {
    this.state.CalculatedFinalGradeDenominator = CalculatedFinalGradeDenominator;
  }

  setAdjustedFinalGradeNumerator(AdjustedFinalGradeNumerator) {
    this.state.AdjustedFinalGradeNumerator = AdjustedFinalGradeNumerator;
  }

  setAdjustedFinalGradeDenominator(AdjustedFinalGradeDenominator) {
    this.state.AdjustedFinalGradeDenominator = AdjustedFinalGradeDenominator;
  }
}

export default Student;
