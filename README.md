# csi-accounts-express

An express middleware for verifying user tokens from [accounts.csivit.com](https://accounts.csivit.com).

# Installation
```
$ npm install csivitu/csi-accounts-express
```

> Note: This will use the master branch from GitHub, since the package hasn't been published on npm.

# API
```javascript
const authorize = require('csi-accounts-express');
```
## authorize(options)
Creates a middleware to authenticate JWTs generated from [accounts.csivit.com](https://accounts.csivit.com). Expectes the token to be present in the `authorization` or the `x-access-token` header.

If the token was invalid then the middleware may return a `403`/`400`/`401` status code.
* A `401` status code indicates that no authorization header was provided.
* A `400` status code indicates that the JWT was invalid.
* A `403` status code indicates that the authenticates user doesn't satisfy the scope/year constraints.

### options
options in an object which has the following options:
* secret (required)
  The secret used to sign/verify the JWT token. In the Gitlab CI/CD, this is availabe in the `JWT_SECRET` environment variable.
* scope
  An array of scopes (strings) that the user must have to authenticate with the middleware.
  Currently supported scope values are: 'csi' (for csi members), and 'user' for all users.
  If not provided, all scopes are allowed
* years
  An array of numbers (1/2/3/4) specifiying which year students are allowed to authenticate with the middleware. If not specified, all year students are permitted.
* token
  An express middleware which is supposed to return the token string. This is the string that will be verified by the library.

### req.user
If the token is authenticated sucesfully, and the user staisfies all other contraints, then `req.user` contains the user object of the authenticated user. This just contains the payload from the given jwt token:
```typescript
interface User {
    name: string;
    username: string;
    email: string;
    mobile: string;
    regNo: string;
    gender: string;
    scope: scope[];
}
```


# Example Usage:

To allow CSI members who are 1st (2020) and 2nd (2019) years:

```javascript
app.use(authorize({
    secret: process.env.JWT_SECRET,
    scope: ['csi'],
    years: ['20', '19'],
}));
```

To allow all users with a valid jwt:
```javascript
app.use(authorize({
    secret: process.env.JWT_SECRET,
}));
```

Suppose the token is not present in the header, you can pass your own express middleware to extract the token from the header and return it to the library:
```javascript
app.use(authorize({
    secret: process.env.JWT_SECRET,
    token: (req, res, next) => {
      return res.session.token // If the token is stored in a session variable, for example
    }
}));
```
