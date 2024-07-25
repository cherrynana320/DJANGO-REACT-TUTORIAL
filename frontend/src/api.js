import axios from 'axios';
import { ACCESS_TOKEN } from './constants';

// 배포할 때 프론트엔드를 백엔드와 연결
const apiUrl = '/choreo-apis/djangoreacttutorial/backend/v1.0';

// Axios 인스턴스 생성
const api = axios.create({
  // 환경 변수(import.meta.env.VITE_API_URL)에서 API의 기본 URL을 가져옴
  //  Vite : 프론트엔드 빌드 도구
  // baseURL: import.meta.env.VITE_API_URL
  baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
});

// 요청 인터셉터 추가
api.interceptors.request.use(
  // config : 이 객체는 Axios를 통해 보내는 HTTP 요청의 설정을 포함한다.( url, http요청메서드, headers, url쿼리 매개변수, data 요청본문)
  function (config) {
    // 요청이 전달되기 전에 작업 수행
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      // config 객체를 수정하여 요청 헤더에 인증 토큰을 추가
      config.headers.Authorization = `Bearer ${token}`;
    }
    // 수정된 config 객체를 반환하여 요청이 서버로 전송되도록 함.
    return config;
  },
  function (error) {
    // 요청 설정 중 오류가 발생했을 때 실행
    return Promise.reject(error);
  }
);

export default api;
