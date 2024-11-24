import axios from 'axios';

// Axios 인스턴스 생성
const API = axios.create({
  baseURL: 'http://localhost:8000', // 백엔드 URL
});

// 요청마다 Authorization 헤더 추가
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // 로컬 스토리지에서 JWT 토큰 가져오기
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Authorization 헤더에 토큰 추가
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 다이어리 목록 가져오기
export const fetchDiaryList = async () => {
  try {
    const response = await API.get('/movieDiary/');
    return response.data;
  } catch (error) {
    console.error('다이어리 목록 가져오기 실패:', error);
    throw error;
  }
};

// 감상문 등록
export const addDiary = async (data) => {
  try {
    const response = await API.post('/movieDiary/', data);
    return response.data;
  } catch (error) {
    console.error('감상문 등록 실패:', error);
    throw error;
  }
};
