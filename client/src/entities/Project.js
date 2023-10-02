class Project {
  constructor(projectObj) {
    this.name = projectObj.name || "";
    this.description = projectObj.description || "";
    this.client = projectObj.client || "";
    this.clientEmail = projectObj.clientEmail || "";
    this.status = projectObj.status || "proposed";
    this.professorEmail =  projectObj.professorEmail || "";
    this.currentGroup = projectObj.currentGroup || "";
  }

  // Getter and setter for 'name'
  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
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

  toRequestBody() {
    return {
      name: this._name,
      description: this._description,
      client: this._client,
      clientEmail: this._clientEmail,
      status: this._status,
      professorEmail: this.professorEmail,
      currentGroup: this._currentGroup,
    };
  }
}

export default Project;
