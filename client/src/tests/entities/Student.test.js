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
    studentInstance.username  = 'jane.doe';

    // Get Username and assert the value
    expect(studentInstance.Username).toBe('jane.doe');
  });

  it('should correctly get LastName', () => {
    expect(student.LastName).toBe('Doe');
  });

  it('should correctly get FirstName', () => {
    expect(student.FirstName).toBe('John');
  });

  it('should correctly get Email', () => {
    expect(student.Email).toBe('john.doe@example.com');
  });

  it('should correctly get Sections', () => {
    expect(student.Sections).toEqual(['Math', 'Science']);
  });

  it('should correctly get CalculatedFinalGradeNumerator', () => {
    expect(student.CalculatedFinalGradeNumerator).toBe(90);
  });

  it('should correctly get CalculatedFinalGradeDenominator', () => {
    expect(student.CalculatedFinalGradeDenominator).toBe(100);
  });

  it('should correctly get AdjustedFinalGradeNumerator', () => {
    expect(student.AdjustedFinalGradeNumerator).toBe(88);
  });

  it('should correctly get AdjustedFinalGradeDenominator', () => {
    expect(student.AdjustedFinalGradeDenominator).toBe(100);
  });

  it('should correctly set and get OrgDefinedId', () => {
    student.OrgDefinedId = '54321';
    expect(student.OrgDefinedId).toBe('54321');
  });


  it('should correctly set and get LastName', () => {
    student.LastName  = 'Smith';
    expect(student.LastName).toBe('Smith');
  });

  it('should correctly set and get FirstName', () => {
    student.FirstName = 'Alice';
    expect(student.FirstName).toBe('Alice');
  });

  it('should correctly set and get Email', () => {
    student.Email = 'alice.smith@example.com';
    expect(student.Email).toBe('alice.smith@example.com');
  });

  it('should correctly set and get Sections', () => {
    student.Sections = ['History', 'English'];
    expect(student.Sections).toEqual(['History', 'English']);
  });

  it('should correctly set and get CalculatedFinalGradeNumerator', () => {
    student.CalculatedFinalGradeNumerator = 110;
    expect(student.CalculatedFinalGradeNumerator).toBe(95);
  });

  it('should correctly set and get CalculatedFinalGradeDenominator', () => {
    student.CalculatedFinalGradeDenominator = 110;
    expect(student.CalculatedFinalGradeDenominator).toBe(110);
  });

  it('should correctly set and get AdjustedFinalGradeNumerator', () => {
    student.AdjustedFinalGradeNumerator =  92 ;
    expect(student.AdjustedFinalGradeNumerator).toBe(92);
  });

  it('should correctly set and get AdjustedFinalGradeDenominator', () => {
    student.AdjustedFinalGradeDenominator = 95;
    expect(student.AdjustedFinalGradeDenominator).toBe(95);
  });
});
