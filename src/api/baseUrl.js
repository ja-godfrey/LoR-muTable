const baseUrl = process.env.VUE_APP_NODE_ENV === 'development'
   ? `http://${window.location.hostname}:9090`
   : '';

export default baseUrl;
