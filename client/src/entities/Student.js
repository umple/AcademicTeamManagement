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
    this.setState({ OrgDefinedId });
  }

  setUsername(Username) {
    this.setState({ Username });
  }

  setLastName(LastName) {
    this.setState({ LastName });
  }

  setFirstName(FirstName) {
    this.setState({ FirstName });
  }

  setEmail(Email) {
    this.setState({ Email });
  }

  setSections(Sections) {
    this.setState({ Sections });
  }

  setCalculatedFinalGradeNumerator(CalculatedFinalGradeNumerator) {
    this.setState({ CalculatedFinalGradeNumerator });
  }

  setCalculatedFinalGradeDenominator(CalculatedFinalGradeDenominator) {
    this.setState({ CalculatedFinalGradeDenominator });
  }

  setAdjustedFinalGradeNumerator(AdjustedFinalGradeNumerator) {
    this.setState({ AdjustedFinalGradeNumerator });
  }

  setAdjustedFinalGradeDenominator(AdjustedFinalGradeDenominator) {
    this.setState({ AdjustedFinalGradeDenominator });
  }

  

}

export default Student;
