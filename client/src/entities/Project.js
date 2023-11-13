class Project {
  constructor(projectObj) {
    this.project = projectObj.project || "";
    this.description = projectObj.description || "";
    this.clientName = projectObj.clientName || "";
    this.clientEmail = projectObj.clientEmail || "";
    this.status = projectObj.status || "Available";
    this.professorEmail = projectObj.professorEmail || "";
    this.group = projectObj.group || "";
    this.notes = projectObj.notes || "";
  }

  // Getter and setter for 'project'
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
  get clientName() {
    return this._clientName;
  }

  set clientName(value) {
    this._clientName = value;
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

  // Getter and setter for 'group'
  get group() {
    return this._group;
  }

  set group(group) {
    this._group = group;
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
      clientName: this._clientName,
      clientEmail: this._clientEmail,
      status: this._status,
      professorEmail: this.professorEmail,
      group: this._group,
    };
  }

  toProfessorRequestBody() {
    return {
      project: this._project,
      description: this._description,
      clientName: this._clientName,
      clientEmail: this._clientEmail,
      status: this._status,
      professorEmail: this._professorEmail,
      group: this._group,
      notes: this._notes,
    };
  }
}

export default Project;
