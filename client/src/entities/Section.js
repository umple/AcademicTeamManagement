class Section {
  constructor (props) {
    this._name = props.name || ''
    this._term = props.term || ''
    this._year = props.year || ''
    this._notes = props.notes || ''
  }

  // Getter methods
  get name () {
    return this._name
  }

  get term () {
    return this._term
  }

  get year () {
    return this._year
  }

  get notes () {
    return this._notes
  }

  // Setter methods
  set name (name) {
    this._name = name
  }

  set term (term) {
    this._term = term
  }

  set year (year) {
    this._year = year
  }

  set notes (notes) {
    this._notes = notes
  }

  toRequestBody () {
    return {
      name: this._name,
      term: this._term,
      year: this._year,
      notes: this._notes
    }
  }

  toRequestJSON () {
    return {
      name: this._name,
      term: this._term,
      year: this._year,
      notes: this._notes
    }
  }
}

export default Section
