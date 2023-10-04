import Student from '../../entities/Student'; // adjust the path based on your project structure

describe('Student class', () => {
  let student;

  beforeEach(() => {
    // Create a new instance of the Student class before each test
    student = new Student({
      OrgDefinedId: '12345',
      Username: 'john.doe',
      LastName: 'Doe',
      FirstName: 'John',
      Email: 'john.doe@example.com',
      Sections: ['Math', 'Science'],
      CalculatedFinalGradeNumerator: 90,
      CalculatedFinalGradeDenominator: 100,
      AdjustedFinalGradeNumerator: 88,
      AdjustedFinalGradeDenominator: 100,
    });
  });

  it('should correctly get OrgDefinedId', () => {
    expect(student.getOrgDefinedId()).toBe('12345');
  });

  it('should correctly set and get Username', () => {
    student.setUsername('jane.doe');
    expect(student.getUsername()).toBe('john.doe');
  });

  it('should correctly get LastName', () => {
    expect(student.getLastName()).toBe('Doe');
  });
});