const redirectUrl = process.env.VUE_APP_NODE_ENV === 'development'
   ? `http://${window.location.hostname}:8080`
   : '';

export default redirectUrl;
