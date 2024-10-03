class Student {
  constructor (props) {
    this._id = props._id
    this._student_number = props.student_number || ''
    this._username = props.username || ''
    this._lastname = props.lastname || ''
    this._firstname = props.firstname || ''
    this._email = props.email || ''
    this._sections = props.sections || ''
    this._group = props.group || ''
    this._professorEmail = props.professorEmail || ''
    this._calculatedfinalgradenumerator = props.calculatedfinalgradenumerator
    this._calculatedfinalgradedenominator = props.calculatedfinalgradedenominator
    this._adjustedfinalgradenumerator = props.adjustedfinalgradenumerator
    this._adjustedfinalgradedenominator = props.adjustedfinalgradedenominator
  }

  // Getter methods
  get student_number () {
    return this._student_number
  }

  get username () {
    return this._username
  }

  get lastname () {
    return this._lastname
  }

  get firstname () {
    return this._firstname
  }

  get email () {
    return this._email
  }

  get sections () {
    return this._sections
  }

  get calculatedfinalgradenumerator () {
    return this._calculatedfinalgradenumerator
  }

  get calculatedfinalgradedenominator () {
    return this._calculatedfinalgradedenominator
  }

  get adjustedfinalgradenumerator () {
    return this._adjustedfinalgradenumerator
  }

  get adjustedfinalgradedenominator () {
    return this._adjustedfinalgradedenominator
  }

  // Setter methods
  set student_number (student_number) {
    this._student_number = student_number
  }

  set username (username) {
    this._username = username
  }

  set lastname (lastname) {
    this._lastname = lastname
  }

  set firstname (firstname) {
    this._firstname = firstname
  }

  set email (email) {
    this._email = email
  }

  set sections (sections) {
    this._sections = sections
  }

  set calculatedfinalgradenumerator (calculatedfinalgradenumerator) {
    this._calculatedfinalgradenumerator = calculatedfinalgradenumerator
  }

  set calculatedfinalgradedenominator (calculatedfinalgradedenominator) {
    this._calculatedfinalgradedenominator = calculatedfinalgradedenominator
  }

  set adjustedfinalgradenumerator (adjustedfinalgradenumerator) {
    this._adjustedfinalgradenumerator = adjustedfinalgradenumerator
  }

  set adjustedfinalgradedenominator (adjustedfinalgradedenominator) {
    this._adjustedfinalgradedenominator = adjustedfinalgradedenominator
  }

  get group () {
    return this._group
  }

  set group (value) {
    this._group = value
  }

  // Getter and setter for 'professorEmail'
  get professorEmail () {
    return this._professorEmail
  }

  set professorEmail (value) {
    this._professorEmail = value
  }

  toRequestBody () {
    return {
      _id: this._id,
      student_number: this._student_number,
      firstname: this._firstname,
      lastname: this._lastname,
      email: this._email,
      username: this._username,
      sections: this._sections,
      calculatedfinalgradenumerator: this._calculatedfinalgradenumerator,
      calculatedfinalgradedenominator: this._calculatedfinalgradedenominator,
      adjustedfinalgradenumerator: this._adjustedfinalgradenumerator,
      adjustedfinalgradedenominator: this._adjustedfinalgradedenominator
    }
  }

  toRequestJSON () {
    return {
      _id: this._id,
      student_number: this._student_number,
      firstname: this._firstname,
      lastname: this._lastname,
      email: this._email,
      username: this._username,
      sections: this._sections,
      finalGrade: this._finalGrade,
      group: this._group,
      professorEmail: this._professorEmail
    }
  }
}

export default Student
