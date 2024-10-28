import Student from '../../entities/Student' // adjust the path based on your project structure

describe('Student class', () => {
  let student

  beforeEach(() => {
    student = new Student({
      orgdefinedid: '12345',
      username: 'john.doe',
      lastname: 'Doe',
      firstname: 'John',
      email: 'john.doe@example.com',
      sections: ['Math', 'Science'],
      calculatedfinalgradenumerator: 90,
      calculatedfinalgradedenominator: 100,
      adjustedfinalgradenumerator: 88,
      adjustedfinalgradedenominator: 100,
      group: 'Group A',
      professorEmail: 'prof@example.com'
    })
  })
  it('should correctly initialize orgdefinedid', () => {
    expect(student.orgdefinedid).toBe('12345')
  })

  it('should correctly set and get Username', () => {
    student.username = 'jane.doe'  // setting a new username to trigger the setter
    expect(student.username).toBe('jane.doe')
  })

  it('should correctly get LastName', () => {
    expect(student.lastname).toBe('Doe')
  })

  it('should correctly get FirstName', () => {
    expect(student.firstname).toBe('John')
  })

  it('should correctly get Email', () => {
    expect(student.email).toBe('john.doe@example.com')
  })

  it('should correctly get Sections', () => {
    expect(student.sections).toEqual(['Math', 'Science'])
  })

  it('should correctly get CalculatedFinalGradeNumerator', () => {
    expect(student.calculatedfinalgradenumerator).toBe(90)
  })

  it('should correctly get CalculatedFinalGradeDenominator', () => {
    expect(student.calculatedfinalgradenominator).toBe(100)
  })

  it('should correctly get AdjustedFinalGradeNumerator', () => {
    expect(student.adjustedfinalgradenumerator).toBe(88)
  })

  it('should correctly get AdjustedFinalGradeDenominator', () => {
    expect(student.adjustedfinalgradedenominator).toBe(100)
  })

  // Additional getter tests for group and professorEmail
  it('should correctly get Group', () => {
    expect(student.group).toBe('Group A')
  })

  it('should correctly get ProfessorEmail', () => {
    expect(student.professorEmail).toBe('prof@example.com')
  })

  // Setter tests
  it('should correctly set and get OrgDefinedId', () => {
    student.orgdefinedid = '54321'
    expect(student.orgdefinedid).toBe('54321')
  })

  it('should correctly set and get LastName', () => {
    student.lastname = 'Smith'
    expect(student.lastname).toBe('Smith')
  })

  it('should correctly set and get FirstName', () => {
    student.firstname = 'Alice'
    expect(student.firstname).toBe('Alice')
  })

  it('should correctly set and get Email', () => {
    student.email = 'alice.smith@example.com'
    expect(student.email).toBe('alice.smith@example.com')
  })

  it('should correctly set and get Sections', () => {
    student.sections = ['History', 'English']
    expect(student.sections).toEqual(['History', 'English'])
  })

  it('should correctly set and get CalculatedFinalGradeNumerator', () => {
    student.calculatedfinalgradenumerator = 110
    expect(student.calculatedfinalgradenumerator).toBe(110)
  })

  // Test for calculatedfinalgradenumerator setter coverage on line 88
  it('should correctly set and get CalculatedFinalGradeDenominator', () => {
    student.calculatedfinalgradedenominator = 110
    expect(student.calculatedfinalgradedenominator).toBe(110)
  })

  it('should correctly set and get AdjustedFinalGradeNumerator', () => {
    student.adjustedfinalgradenumerator = 92
    expect(student.adjustedfinalgradenumerator).toBe(92)
  })

  // Test for adjustedfinalgradenumerator setter coverage on line 96
  it('should correctly set and get AdjustedFinalGradeDenominator', () => {
    student.adjustedfinalgradedenominator = 95
    expect(student.adjustedfinalgradedenominator).toBe(95)
  })

  // Additional setter tests for group and professorEmail
  it('should correctly set and get Group', () => {
    student.group = 'Group B'
    expect(student.group).toBe('Group B')
  })

  it('should correctly set and get ProfessorEmail', () => {
    student.professorEmail = 'newprof@example.com'
    expect(student.professorEmail).toBe('newprof@example.com')
  })

  // Tests for toRequestBody method
  it('should return the correct request body', () => {
    const expectedRequestBody = {
      orgdefinedid: '12345',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      username: 'john.doe',
      sections: ['Math', 'Science'],
      calculatedfinalgradenumerator: 90,
      calculatedfinalgradedenominator: 100,
      adjustedfinalgradenumerator: 88,
      adjustedfinalgradedenominator: 100
    }
    expect(student.toRequestBody()).toEqual(expectedRequestBody)
  })

  // Tests for toRequestJSON method
  it('should return the correct request JSON', () => {
    const expectedRequestJSON = {
      orgdefinedid: '12345',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      username: 'john.doe',
      sections: ['Math', 'Science'],
      finalGrade: undefined,
      group: 'Group A',
      professorEmail: 'prof@example.com'
    }
    expect(student.toRequestJSON()).toEqual(expectedRequestJSON)
  })
})
