class Project {
  constructor(projectObj) {
    console.log("projectObj", projectObj)
    this.name = projectObj.name || "";
    this.description = projectObj.description || "";
    this.client = projectObj.client || "";
    this.clientEmail = projectObj.clientEmail || "";
    this.status = projectObj.status || "proposed";
    this.professorEmail = projectObj.professorEmail || "";
    this.currentGroup = projectObj.currentGroup || "";
  }

  // Getter and setter for 'name'
  get name() {
    return this._name;
  }

  set name(name) {
    this._name = name;
  }

  // Getter and setter for 'description'
  get description() {
    return this._description;
  }

  set description(description) {
    this._description = description;
  }

  // Getter and setter for 'client'
  get client() {
    return this._client;
  }

  set client(client) {
    this._client = client;
  }

  // Getter and setter for 'clientEmail'
  get clientEmail() {
    return this._clientEmail;
  }

  set clientEmail(clientEmail) {
    this._clientEmail = clientEmail;
  }

  // Getter and setter for 'status'
  get status() {
    return this._status;
  }

  set status(status) {
    this._status = status;
  }

  // Getter and setter for 'professorEmail'
  get professorEmail() {
    return this._professorEmail;
  }

  set professorEmail(professorEmail) {
    this._professorEmail = professorEmail;
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
      professorEmail: this._professorEmail,
      currentGroup: this._currentGroup,
    };
  }
}

export default Project;
