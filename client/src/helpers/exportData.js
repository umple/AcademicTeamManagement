import { getDate } from './dateHelper'
// import StudentTable from '../components/professorComponents/tables/StudentTable'
import groupService from '../services/groupService'
import projectService from '../services/projectService'
import sectionService from '../services/sectionService'
import staffService from '../services/staffService'
import studentService from '../services/studentService'

export const csvOptions = (name) => ({
  filename: `${name}` + '-' + getDate(),
  fieldSeparator: ',',
  quoteStrings: '"',
  decimalSeparator: '.',
  showLabels: true,
  useBom: true,
  useKeysAsHeaders: true
})

// global export - due to limiations of CSV format,
// global export to CSV as one file is not possible.
export const handleGlobalExportData = (csvExporter) => {
  var exportData = {}
  groupService.get()
    .then((data) => {
      exportData.groups = data.groups
    })

  projectService.get()
    .then((data) => {
      exportData.projects = data.projects
    })

  sectionService.get()
    .then((data) => {
      exportData.sections = data.sections
    })

  staffService.get()
    .then((data) => {
      exportData.staff = data.staff
    })

  studentService.get()
    .then((data) => {
      exportData.students = data.students
      console.log(JSON.stringify(exportData))
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportData)
      )}`

      const link = document.createElement('a')
      link.href = jsonString
      link.download = 'data.json'

      link.click()
    })
}

// export function for specific tables
export const handleExportData = (tableData, columns, csvExporter) => {
  // clean up and organize data to be exported
  if (tableData.length === 0) {
    return
  }
  const keyToRemove = '_id'
  const updatedJsonList = tableData.map((jsonObj) => {
    let updatedJsonObject = jsonObj
    // remove the _id as that should not be in the json
    if (keyToRemove in jsonObj) {
      const { [keyToRemove]: deletedKey, ...rest } = jsonObj // use destructuring to remove the key
      updatedJsonObject = rest // return the updated JSON object without the deleted key
    }

    // sort the keys as they appear in the columns
    const orderedKeys = columns.map((key) => key.accessorKey)
    updatedJsonObject = Object.keys(updatedJsonObject)
      .sort((a, b) => orderedKeys.indexOf(a) - orderedKeys.indexOf(b)) // sort keys in the order of the updated keys
      .reduce((acc, key) => ({ ...acc, [key]: updatedJsonObject[key] }), {}) // create a new object with sorted keys

    // replace the accessor key by the header
    for (let i = 0; i < columns.length; i++) {
      const { accessorKey, header } = columns[i]
      if (accessorKey in updatedJsonObject) {
        const { [accessorKey]: renamedKey, ...rest } = updatedJsonObject // use destructuring to rename the key
        updatedJsonObject = { ...rest, [header]: renamedKey } // update the JSON object with the renamed key
      }
    }

    return updatedJsonObject // return the original JSON object if the key is not found
  })

  csvExporter.generateCsv(updatedJsonList)
}
