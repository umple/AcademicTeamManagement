class Project {
  constructor(projectObj = {}) {
    this._name = projectObj.name || "";
    this._description = projectObj.description || "";
    this._client = projectObj.client || "";
    this._clientEmail = projectObj.clientEmail || "";
    this._status = projectObj.status || "proposed";
    this._professorEmail = projectObj.professorEmail || "";
    this._currentGroup = projectObj.group || "";
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
}

export default Project;
