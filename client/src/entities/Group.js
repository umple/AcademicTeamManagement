class Group {
  constructor (groupData) {
    this._id = groupData._id
    this.assigned_project_id = groupData.assigned_project_id || ''
    this.professorEmail = groupData.professorEmail || ''
    this.members = groupData.members || []
    this.interest = groupData.interest || []
    this.sections = groupData.sections || ''
    this.notes = groupData.notes || ''
    this.studentLock = groupData.studentLock || false
    this.professorLock = groupData.professorLock || false
  }

  get assigned_project_id () {
    return this._assigned_project_id
  }

  set assigned_project_id (value) {
    this._assigned_project_id = value
  }

  get professorEmail () {
    return this._professorEmail
  }

  set professorEmail (value) {
    this._professorEmail = value
  }

  get members () {
    return this._members
  }

  set members (value) {
    this._members = value
  }

  get interest () {
    return this._interest
  }

  set interest (value) {
    this._interest = value
  }

  get notes () {
    return this._notes
  }

  set notes (value) {
    this._notes = value
  }

  toJSON () {
    return {
      _id: this._id,
      assigned_project_id: this.assigned_project_id,
      professorEmail: this.professorEmail,
      members: this.members,
      interest: this.interest,
      sections: this.sections,
      notes: this.notes,
      studentLock: this.studentLock,
      professorLock: this.professorLock
    }
  }
}

export default Group
