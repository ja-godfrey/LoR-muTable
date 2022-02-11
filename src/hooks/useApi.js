import ky from 'ky';
import tempAuth from '../tempAuth';

const headers = { 'x-user-id': tempAuth.userId };

function useApi() {
   return {
      get: async route => ky.get(`/api${route}`, { headers }).json(),
      post: async (route, json) => ky.post(`/api${route}`, { headers, json }).json(),
      put: async (route, json) => ky.put(`/api${route}`, { headers, json }).json(),
      delete: async route => ky.delete(`/api${route}`, { headers }).json(),
   };
}

export default useApi;
