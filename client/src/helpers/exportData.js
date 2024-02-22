import { getDate } from './dateHelper'

export const csvOptions = (name) => ({
  filename: `${name}` + '-' + getDate(),
  fieldSeparator: ',',
  quoteStrings: '"',
  decimalSeparator: '.',
  showLabels: true,
  useBom: true,
  useKeysAsHeaders: true
})

// global export
export const handleGlobalExportData = () => {
  console.log('test')
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
