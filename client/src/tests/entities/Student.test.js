import Student from '../../entities/Student'; // adjust the path based on your project structure

describe('Student class', () => {
  let student;

  beforeEach(() => {
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
    expect(student.OrgDefinedId).toBe('12345');
  });

  it('should correctly set and get Username', () => {
    const studentInstance = new Student({
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
    });

    // Set Username using the method
    studentInstance.username  = 'jane.doe';

    // Get Username and assert the value
    expect(studentInstance.username).toBe('jane.doe');
  });

  it('should correctly get LastName', () => {
    expect(student.lastName).toBe('Doe');
  });

  it('should correctly get FirstName', () => {
    expect(student.firstName).toBe('John');
  });

  it('should correctly get Email', () => {
    expect(student.email).toBe('john.doe@example.com');
  });

  it('should correctly get Sections', () => {
    expect(student.sections).toEqual(['Math', 'Science']);
  });

  it('should correctly get CalculatedFinalGradeNumerator', () => {
    expect(student.calculatedFinalGradeNumerator).toBe(90);
  });

  it('should correctly get CalculatedFinalGradeDenominator', () => {
    expect(student.calculatedFinalGradeDenominator).toBe(100);
  });

  it('should correctly get AdjustedFinalGradeNumerator', () => {
    expect(student.adjustedFinalGradeNumerator).toBe(88);
  });

  it('should correctly get AdjustedFinalGradeDenominator', () => {
    expect(student.adjustedFinalGradeDenominator).toBe(100);
  });

  it('should correctly set and get OrgDefinedId', () => {
    student.orgDefinedId = '54321';
    expect(student.orgDefinedId).toBe('54321');
  });


  it('should correctly set and get LastName', () => {
    student.lastName  = 'Smith';
    expect(student.lastName).toBe('Smith');
  });

  it('should correctly set and get FirstName', () => {
    student.firstName = 'Alice';
    expect(student.firstName).toBe('Alice');
  });

  it('should correctly set and get Email', () => {
    student.email = 'alice.smith@example.com';
    expect(student.email).toBe('alice.smith@example.com');
  });

  it('should correctly set and get Sections', () => {
    student.sections = ['History', 'English'];
    expect(student.sections).toEqual(['History', 'English']);
  });

  it('should correctly set and get CalculatedFinalGradeNumerator', () => {
    student.calculatedFinalGradeNumerator = 110;
    expect(student.calculatedFinalGradeNumerator).toBe(95);
  });

  it('should correctly set and get CalculatedFinalGradeDenominator', () => {
    student.calculatedFinalGradeDenominator = 110;
    expect(student.calculatedFinalGradeDenominator).toBe(110);
  });

  it('should correctly set and get AdjustedFinalGradeNumerator', () => {
    student.adjustedFinalGradeNumerator =  92 ;
    expect(student.adjustedFinalGradeNumerator).toBe(92);
  });

  it('should correctly set and get AdjustedFinalGradeDenominator', () => {
    student.adjustedFinalGradeDenominator = 95;
    expect(student.adjustedFinalGradeDenominator).toBe(95);
  });
});
