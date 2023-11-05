class Staff {
    constructor(props) {
        this._username = props.username || '';
        this._lastname = props.lastname || '';
        this._firstname = props.firstname || '';
        this._role = props.role || '';
        this._email = props.email || '';
    }
  
    // Getter methods
    get username() {
        return this._username;
    }

    get lastname() {
        return this._lastname;
    }

    get firstname() {
        return this._firstname;
    }

    get role() {
        return this._role;
    }

    get email() {
        return this._email;
    }
  
    // Setter methods
    set username(username) {
        this._username = username;
    }

    set lastname(lastname) {
        this._lastname = lastname;
    }

    set firstname(firstname) {
        this._firstname = firstname;
    }

    set role(role) {
        this._role = role;
    }

    set email(email) {
        this._email = email;
    }
  
    toRequestBody() {
      return {
        firstname: this._firstname,
        lastname: this._lastname,
        email: this._email,
        role: this._role,
        username: this._username,
      };
    }
  
    toRequestJSON() {
      return {
        firstname: this._firstname,
        lastname: this._lastname,
        email: this._email,
        role:this._role,
        username: this._username,
      };
    }
  }
  
  export default Staff;  