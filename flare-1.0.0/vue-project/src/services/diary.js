import axios from 'axios';


const API_BASE_URL = 'http://localhost:8000';

// 영화 등록 API 호출
export const addMovieDiary = async (movieData) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('토큰이 없습니다. 로그인 상태를 확인하세요.');

    console.log('Authorization 헤더:', `Bearer ${token}`);

    const response = await axios.post(`${API_BASE_URL}/movieDiary/`, movieData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('등록된 영화:', response.data);
    return response.data; // 등록된 영화 데이터 반환
  } catch (error) {
    console.error('영화 등록 중 오류 발생:', error);
    throw error;
  }
};

// 등록된 영화 상세 조회
export const fetchMovieDetail = async (id) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('토큰이 없습니다. 로그인 상태를 확인하세요.');

    const response = await axios.get(`${API_BASE_URL}/movieDiary/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('영화 상세 조회:', response.data);
    return response.data;
  } catch (error) {
    console.error('영화 상세 조회 중 오류 발생:', error);
    throw error;
  }
};

// 사용자 다이어리 영화 리스트 조회
export const fetchUserMovies = async (user_pk = null) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('토큰이 없습니다. 로그인 상태를 확인하세요.');

    // user_pk가 존재하면 해당 유저의 다이어리 URL로, 없으면 본인의 다이어리 URL로 요청
    const url = user_pk 
      ? `${API_BASE_URL}/movieDiary/${user_pk}/list/`
      : `${API_BASE_URL}/movieDiary/list/`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('사용자 영화 리스트:', response.data);
    return response.data;
  } catch (error) {
    console.error('영화 리스트 조회 중 오류 발생:', error);
    throw error;
  }
};


export const updateMovieDiary = async (id, movieData) => {
  try {
    // 인증 토큰 가져오기
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('토큰이 없습니다. 로그인 상태를 확인하세요.');

    // API 호출
    const response = await axios.patch(`${API_BASE_URL}/movieDiary/${id}/`, movieData, {
      headers: {
        Authorization: `Bearer ${token}`, // 인증 헤더 설정
        'Content-Type': 'application/json', // JSON 데이터 타입
      },
    });

    // 응답 데이터 확인용 로그
    console.log('수정된 영화 기록 응답:', response.data);

    // 응답 데이터 반환
    return response.data;
  } catch (error) {
    console.error('영화 기록 수정 중 오류 발생:', error);

    // 서버 응답에 대한 추가 정보 출력 (상태 코드 및 오류 메시지)
    if (error.response) {
      console.error('서버 응답 상태 코드:', error.response.status);
      console.error('서버 응답 데이터:', error.response.data);
    }

    // 오류 던지기
    throw error;
  }
};



export const deleteMovieDiary = async (id) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('토큰이 없습니다. 로그인 상태를 확인하세요.');

    // DELETE 요청
    const response = await axios.delete(`${API_BASE_URL}/movieDiary/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(`영화 ID ${id} 삭제 성공`);
    return response.status; // 성공 시 상태 코드 반환 (204)
  } catch (error) {
    console.error('영화 삭제 중 오류 발생:', error);
    throw error;
  }
};


// 댓글 등록
export const addCommentToDiary = async (journalPk, content) => {
  const token = localStorage.getItem('access_token'); // 토큰 가져오기
  try {
    const response = await axios.post(
      `http://localhost:8000/movieDiary/${journalPk}/comment/`,
      { content },
      {
        headers: {
          Authorization: `Bearer ${token}`, // 인증 토큰 추가
        },
      }
    );
    return response.data; // 응답 데이터 반환
  } catch (error) {
    console.error('댓글 등록 중 오류 발생:', error);
    throw error;
  }
};



// 댓글 수정
export const updateComment = async (commentId, content) => {
  const response = await axios.patch(`${API_BASE_URL}/movieDiary/${commentId}/comment/`, {
    content,
  });
  return response.data; // 성공 시 수정된 댓글 데이터 반환
};

// 댓글 삭제
export const deleteComment = async (commentId) => {
  const response = await axios.delete(`${API_BASE_URL}/movieDiary/${commentId}/comment/delete/`);
  return response.status; // 성공 시 204 반환
};

