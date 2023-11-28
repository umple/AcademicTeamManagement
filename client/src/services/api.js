// api.js

export const fetchData = async (url) => {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('Request failed')
    }

    return await response.json()
  } catch (error) {
    console.error(error)
    throw error
  }
}
