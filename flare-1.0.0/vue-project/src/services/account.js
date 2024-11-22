import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000/accounts'

export const login = async (username, password) => {
  const response = await axios.post(`${API_BASE_URL}/dj-rest-auth/login/`, {
    username,
    password,
  })
  return {
    access: response.data.access,
    user: response.data.user, // 사용자 정보 (이름, 이메일 등)
  }
}

export const logout = async () => {
  const response = await axios.post(`${API_BASE_URL}/dj-rest-auth/logout/`)
  return response.data
}

export const signup = async (formData) => {
  const response = await axios.post(`${API_BASE_URL}/dj-rest-auth/registration/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}


