class Group {
  constructor (groupData = {}) {
    this.group_id = groupData.group_id || ''
    this.project = groupData.project || ''
    this.professorEmail = groupData.professorEmail || ''
    this.members = groupData.members || []
    this.interest = groupData.interest || []
    this.notes = groupData.notes || ''
  }

  get group_id () {
    return this._group_id
  }

  set group_id (value) {
    this._group_id = value
  }

  get project () {
    return this._project
  }

  set project (value) {
    this._project = value
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
      group_id: this.group_id,
      project: this.project,
      professorEmail: this.professorEmail,
      members: this.members,
      interest: this.interest,
      notes: this.notes
    }
  }
}

export default Group
