import hello from 'hellojs';


hello.init({
  reddit: {
    name: 'Reddit',
    oauth: {
      version: '2',
      auth: 'https://www.reddit.com/api/v1/authorize',
      grant: 'https://www.reddit.com/api/v1/access_token',
    },
    refresh: false,
    base: 'https://oauth.reddit.com/',
    xhr(payload) {
      const token = payload.query.access_token;
      delete payload.query.access_token;
      if (token) {
        payload.headers = {
          Authorization: `Bearer ${token}`,
        };
      }
      return true;
    },
  },
}, {
  popup: {
    height: 450,
    width: 850,
    resizable: 1,
  },
});
