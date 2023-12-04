const groupService = {
  get: async () => {
    return fetch('/api/groups', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text()
          throw new Error(`Failed to get groups: ${errorMessage}`)
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
  getCurrGroup: async () => {
    return fetch('api/retrieve/curr/user/group', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text()
          throw new Error(`Failed to get the group of the current user: ${errorMessage}`)
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
  add: async (newGroupInfo) => {
    return fetch('api/group', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newGroupInfo)
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorMessage) => {
            throw new Error(`Failed to add group: ${errorMessage}`)
          })
        }
        return { success: true, message: 'Group added successfully' }
      })
      .catch((error) => {
        console.error(error)
      })
  },
  delete: async (row) => {
    return fetch(`api/group/delete/${row}`, {
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
    return fetch('/api/group/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorMessage) => {
            throw new Error(`Failed to update group: ${errorMessage}`)
          })
        }
        return { success: true, message: 'Group updated successfully' }
      })
      .catch((error) => {
        console.error(error)
      })
  },
  clearMembers: async (id) => {
    return fetch(`/api/group/clear/members/${id}`, {
      method: 'PUT'
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorMessage) => {
            throw new Error(`Failed to update group: ${errorMessage}`)
          })
        }
        return { success: true, message: 'Group updated successfully' }
      })
      .catch((error) => {
        console.error(error)
      })
  },
  studentLockGroup: async (group) => {
    return fetch('/api/group/update/student/lock', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(group)
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorMessage) => {
            throw new Error(`Failed to lock group: ${errorMessage}`)
          })
        }
        return { success: true, message: 'Group locked successfully' }
      })
      .catch((error) => {
        console.error(error)
      })
  },
  studentUnlockGroup: async (group) => {
    return fetch('/api/group/update/student/unlock', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(group)
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorMessage) => {
            throw new Error(`Failed to unlock group: ${errorMessage}`)
          })
        }
        return { success: true, message: 'Group unlocked successfully' }
      })
      .catch((error) => {
        console.error(error)
      })
  }
}

export default groupService
