import { useQuery, useMutation } from 'react-query';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

function refreshAccessToken(refreshToken) {
  return axios.post('/api/refresh-token', { refreshToken })
    .then((response) => response.data.accessToken);
}

function isTokenExpired(token) {
  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000;

  return decodedToken.exp < currentTime;
}

function useAccessToken() {
  const refreshToken = 'your-refresh-token';

  const accessTokenQuery = useQuery('accessToken', async () => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken && !isTokenExpired(accessToken)) {
      return accessToken;
    }

    const refreshedAccessToken = await refreshAccessToken(refreshToken);

    localStorage.setItem('accessToken', refreshedAccessToken);

    return refreshedAccessToken;
  }, {
    retry: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    onSuccess: (accessToken) => {
      // Update axios authorization header with new access token
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    },
    onError: (error) => {
      // Handle error
    }
  });

  const logoutMutation = useMutation(() => {
    // Perform logout API request
    return axios.post('/api/logout', null, {
      headers: {
        Authorization: `Bearer ${accessTokenQuery.data}`
      }
    });
  }, {
    onSettled: () => {
      // Remove access token and refresh token from client-side storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      // Redirect to login page
      window.location.href = '/login';
    }
  });

  return {
    accessTokenQuery,
    logoutMutation
  };
}
