import http from './http'

const authService = {
  register: async (email, password, fullName) => {
    const response = await http.post('/api/auth/register', {
      email,
      password,
      fullName
    })
    return response.data
  },

  login: async (email, password) => {
    const response = await http.post('/api/auth/login', {
      email,
      password
    })
    return response.data
  }
}

export default authService
