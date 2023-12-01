export const FilterDataByProfessor = (data, email) => {
  const newFilteredData = data.filter((element) => {
    return element.professorEmail === email
  })
  return newFilteredData
}
