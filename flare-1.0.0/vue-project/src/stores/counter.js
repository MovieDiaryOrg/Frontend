// stores/counter.js
import { defineStore } from 'pinia'
import { login, logout } from '@/services/account'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    isLoggedIn: !!localStorage.getItem('access_token'),
    user: null, // 사용자 정보 저장
    error: null,
    isLoading: false,
  }),
  actions: {
    async login(username, password) {
      try {
        this.isLoading = true
        this.error = null
        const result = await login(username, password)
        localStorage.setItem('access_token', result.access)
        this.isLoggedIn = true
        this.user = result.user // 서버에서 받은 사용자 정보 저장
        return { success: true, message: '로그인 성공' }
      } catch (error) {
        this.error = error.response?.data?.message || '로그인 실패'
        return { success: false, message: this.error }
      } finally {
        this.isLoading = false
      }
    },
    async logout() {
      try {
        this.isLoading = true
        await logout()
        localStorage.removeItem('access_token')
        this.isLoggedIn = false
        this.user = null // 로그아웃 시 사용자 정보 초기화
        return { success: true, message: '로그아웃 성공' }
      } catch (error) {
        this.error = error.response?.data?.message || '로그아웃 실패'
        return { success: false, message: this.error }
      } finally {
        this.isLoading = false
      }
    },
  },
})
