import hello from 'hellojs';


hello.init({
  reddit: {
    name: 'Reddit',
    oauth: {
      // See: https://developer.foursquare.com/overview/auth
      version: '2',
      auth: 'https://www.reddit.com/api/v1/authorize',
      grant: 'https://www.reddit.com/api/v1/access_token',
    },
    refresh: true,
    // The base URL changes to oauth.reddit.com when bearer tokens are used.
    base: 'https://www.reddit.com/api/v1/',
  },
});
