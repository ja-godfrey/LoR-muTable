import ky from 'ky';
import { AuthenticationProperties as auth0 } from 'vue-auth0-plugin';
import baseUrl from '@/api/baseUrl';

function useApi() {
   const headers = { 'x-user-id': auth0.user?.sub };

   return {
      get: async route => ky.get(`${baseUrl}/api${route}`, { headers }).json(),
      post: async (route, json) => ky.post(`${baseUrl}/api${route}`, { headers, json }).json(),
      put: async (route, json) => ky.put(`${baseUrl}/api${route}`, { headers, json }).json(),
      delete: async route => ky.delete(`${baseUrl}/api${route}`, { headers }).json(),
   };
}

export default useApi;
