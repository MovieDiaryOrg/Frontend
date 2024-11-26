import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const createComment = async (journal_pk, content) => {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('로그인이 필요합니다.');

  const response = await axios.post(
    `${API_BASE_URL}/movieDiary/${journal_pk}/comment/`, // journal_pk를 URL에 포함
    { 'content': content }, // 요청 본문에 content 추가
    {
        headers: {
            Authorization: `Bearer ${token}`, // 인증 헤더 설정
            'Content-Type': 'application/json', // JSON 데이터 타입
          },
    }
  );

  return response.data; // 추가된 댓글 데이터를 반환
};

export const retirevComments = async (journal_pk) => {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('로그인이 필요합니다.');
  
    const response = await axios.get(
      `${API_BASE_URL}/movieDiary/${journal_pk}/comment/`, // journal_pk를 URL에 포함
         {
          headers: {
              Authorization: `Bearer ${token}`, // 인증 헤더 설정
            },
      }
    );
  
    return response.data.comments; // 추가된 댓글 데이터를 반환
  };