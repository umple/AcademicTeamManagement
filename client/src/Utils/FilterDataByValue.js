export const FilterDataByProfessor= (data, email) => {
    const newFilteredData = data.filter(function (element) {
        return element.professorEmail == email
      });
    return newFilteredData
}