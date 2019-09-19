Generate refresh token for Android Publisher
-----

> https://developers.google.com/android-publisher/authorization

According to [official proceduce](https://developers.google.com/android-publisher/authorization), Refresh Token is required in which is used to generate access token to verify the receipt of IAB...

----

### Prerequisite

- install [node.js](https://nodejs.org) > 8.x
- create your project on [Google API console](https://code.google.com/apis/console)
  - create your OAuth 2.0 client ID under `APIs & Services > Credentials > Create creditials > OAuth client ID > Web application`
    - pass your client id and secret as arguments

### How to use

```
git clone ${PROJECT}
cd ${PROJECT}
npm install
node get_refresh_token --client-id ${CLIENT_ID} --client-secret ${CLIENT_SECRET}
```

### Caution

> once everything is fine, the program will try to open a browse page which is required to login your google account, make sure that account have **right to access your financial report** of Google Play (since it is necessary permission to verify the recept of iab)