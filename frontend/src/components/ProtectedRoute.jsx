import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api';
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../constants';
import { useState, useEffect } from 'react';
import { ACCESS_TOKEN } from './../constants';

function ProtectedRoute({ children }) {
  // 인증 상태 관리
  const [isAuthoruized, setIsAuthorized] = useState(null);

  useEffect(() =>{
    auth().catch(()=> setIsAuthorized(false))
  },[])

  // 새 토큰을 가져오는 비동기 함수
  const refreshToken = async () => {
    // 토큰 갱신
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
        const res = await api.post("/api/token/refresh/", {
            refresh: refreshToken,
        });
        if(res.status === 200){
           localStorage.setItem(ACCESS_TOKEN, res.data.access)
           setIsAuthorized(true)
        }else{
            setIsAuthorized(false)
        }
    }catch(error){
        console.log(error){
            console.log(error)
            setIsAuthorized(false)
        }
    }
  };

  // 인증을 확인하는 비동기 함수
  const auth = async () => {
    // 인증 확인
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    // 토큰의 유효기간이 끝났다면
    if (tokenExpiration < now) {
        // 리프레쉬 토큰 가져오기
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };

  // 인증 상태가 아직 확인되지 않은 경우 로딩 상태를 표시
  if (isAuthoruized === null) {
    return <div>Loading...</div>;
  }

  // 인증된 경우 자식 컴포넌트를 렌더링하고, 그렇지 않은 경우 로그인 페이지로 리디렉션
  return isAuthoruized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
