class Project {
  constructor(projectObj) {
    this.project = projectObj.project || "";
    this.description = projectObj.description || "";
    this.client = projectObj.client || "";
    this.clientEmail = projectObj.clientEmail || "";
    this.status = projectObj.status || "proposed";
    this.professorEmail = projectObj.professorEmail || "";
    this.currentGroup = projectObj.currentGroup || "";
    this.notes = projectObj.notes || "";
  }

  // Getter and setter for 'name'
  get project() {
    return this._project;
  }

  set project(value) {
    this._project = value;
  }

  // Getter and setter for 'description'
  get description() {
    return this._description;
  }

  set description(value) {
    this._description = value;
  }

  // Getter and setter for 'client'
  get client() {
    return this._client;
  }

  set client(value) {
    this._client = value;
  }

  // Getter and setter for 'clientEmail'
  get clientEmail() {
    return this._clientEmail;
  }

  set clientEmail(value) {
    this._clientEmail = value;
  }

  // Getter and setter for 'status'
  get status() {
    return this._status;
  }

  set status(value) {
    this._status = value;
  }

  // Getter and setter for 'professorEmail'
  get professorEmail() {
    return this._professorEmail;
  }

  set professorEmail(value) {
    this._professorEmail = value;
  }

  // Getter and setter for 'currentGroup'
  get currentGroup() {
    return this._currentGroup;
  }

  set currentGroup(currentGroup) {
    this._currentGroup = currentGroup;
  }

  get notes() {
    return this._notes;
  }

  set notes(value) {
    this._notes = value;
  }

  toRequestBody() {
    return {
      project: this._project,
      description: this._description,
      client: this._client,
      clientEmail: this._clientEmail,
      status: this._status,
      professorEmail: this.professorEmail,
      currentGroup: this._currentGroup,
    };
  }

  toProfessorRequestBody() {
    return {
      project: this._project,
      description: this._description,
      client: this._client,
      clientEmail: this._clientEmail,
      status: this._status,
      professorEmail: this._professorEmail,
      currentGroup: this._currentGroup,
      notes: this._notes,
    };
  }
}

export default Project;
