export const professorEmail = () => {
  const userType = JSON.parse(localStorage.getItem('userType'))
  if (userType === 'TA') {
    return JSON.parse(localStorage.getItem('userLinkedProfessor'))
  } else {
    return JSON.parse(localStorage.getItem('userEmail'))
  }
}
