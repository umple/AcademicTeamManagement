import React, { createContext, useContext, useState, useEffect } from 'react'
import groupService from '../services/groupService'
import studentService from '../services/studentService'

// Create the context
const DataContext = createContext()

// Custom hook to use the context
export const useData = () => useContext(DataContext)

// Provider component
export const DataProvider = ({ children }) => {
  const [groups, setGroups] = useState([])
  const [students, setStudents] = useState([])

  // Fetch groups
  const fetchGroups = async () => {
    try {
      const response = await groupService.get()
      setGroups(response.groups || [])
    } catch (error) {
      console.error('Error fetching groups:', error)
    }
  }

  // Fetch students
  const fetchStudents = async () => {
    try {
      const response = await studentService.get()
      setStudents(response.students || [])
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  // Update group for bulk students
  const updateGroupBulkStudents = async (studentIds, newGroup) => {
    try {
      await studentService.updateGroupBulkStudents(studentIds, newGroup)
      // Refresh groups and students after updating
      await fetchGroups()
      await fetchStudents()
    } catch (error) {
      console.error('Error updating group for students:', error)
    }
  }

  // Load initial data
  useEffect(() => {
    fetchGroups()
    fetchStudents()
  }, [])

  // The value provided to the context consumers
  const value = {
    groups,
    students,
    fetchGroups,
    fetchStudents,
    updateGroupBulkStudents
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
