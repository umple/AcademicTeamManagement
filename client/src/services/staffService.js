const staffService = {
  get: async () => {
    return fetch('/api/staffs', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text()
          throw new Error(`Failed to get staff: ${errorMessage}`)
        }
        return response.json()
      })
      .then((data) => {
        return data
      })
      .catch((error) => {
        return { success: false, message: error.message }
      })
  },
  add: async (section) => {
    return fetch('/api/staff', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(section)
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorMessage) => {
            throw new Error(`Failed to add staff: ${errorMessage}`)
          })
        }
        return response
      })
      .catch((error) => {
        return { success: false, message: error.message }
      })
  },
  delete: async (id) => {
    return fetch(`api/staff/delete/${id}`, {
      method: 'DELETE'
    })
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.error(error)
      })
  },
  update: async (id, values) => {
    return fetch(`/api/staff/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorMessage) => {
            throw new Error(`Failed to update staff: ${errorMessage}`)
          })
        }
        return { success: true, message: 'Staff updated successfully' }
      })
      .catch((error) => {
        console.error(error)
      })
  }

}

export default staffService
