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
    expect(student.getOrgDefinedId()).toBe('12345');
  });

  it('should correctly set and get Username', () => {
    const studentInstance = new Student({
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

    // Set Username using the method
    studentInstance.setUsername('jane.doe');

    // Get Username and assert the value
    expect(studentInstance.getUsername()).toBe('jane.doe');
  });

  it('should correctly get LastName', () => {
    expect(student.getLastName()).toBe('Doe');
  });

  it('should correctly get FirstName', () => {
    expect(student.getFirstName()).toBe('John');
  });

  it('should correctly get Email', () => {
    expect(student.getEmail()).toBe('john.doe@example.com');
  });

  it('should correctly get Sections', () => {
    expect(student.getSections()).toEqual(['Math', 'Science']);
  });

  it('should correctly get CalculatedFinalGradeNumerator', () => {
    expect(student.getCalculatedFinalGradeNumerator()).toBe(90);
  });

  it('should correctly get CalculatedFinalGradeDenominator', () => {
    expect(student.getCalculatedFinalGradeDenominator()).toBe(100);
  });

  it('should correctly get AdjustedFinalGradeNumerator', () => {
    expect(student.getAdjustedFinalGradeNumerator()).toBe(88);
  });

  it('should correctly get AdjustedFinalGradeDenominator', () => {
    expect(student.getAdjustedFinalGradeDenominator()).toBe(100);
  });

  it('should correctly set and get OrgDefinedId', () => {
    student.setOrgDefinedId('54321');
    expect(student.getOrgDefinedId()).toBe('54321');
  });


  it('should correctly set and get LastName', () => {
    student.setLastName('Smith');
    expect(student.getLastName()).toBe('Smith');
  });

  it('should correctly set and get FirstName', () => {
    student.setFirstName('Alice');
    expect(student.getFirstName()).toBe('Alice');
  });

  it('should correctly set and get Email', () => {
    student.setEmail('alice.smith@example.com');
    expect(student.getEmail()).toBe('alice.smith@example.com');
  });

  it('should correctly set and get Sections', () => {
    student.setSections(['History', 'English']);
    expect(student.getSections()).toEqual(['History', 'English']);
  });

  it('should correctly set and get CalculatedFinalGradeNumerator', () => {
    student.CalculatedFinalGradeNumerator = 110;
    expect(student.getCalculatedFinalGradeNumerator()).toBe(95);
  });

  it('should correctly set and get CalculatedFinalGradeDenominator', () => {
    student.CalculatedFinalGradeDenominator = 110;
    expect(student.getCalculatedFinalGradeDenominator()).toBe(110);
  });

  it('should correctly set and get AdjustedFinalGradeNumerator', () => {
    student.AdjustedFinalGradeNumerator =  92 ;
    expect(student.getAdjustedFinalGradeNumerator()).toBe(92);
  });

  it('should correctly set and get AdjustedFinalGradeDenominator', () => {
    student.AdjustedFinalGradeDenominator = 95;
    expect(student.getAdjustedFinalGradeDenominator()).toBe(95);
  });
});
