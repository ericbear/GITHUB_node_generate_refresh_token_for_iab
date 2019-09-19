const http = require('http')
const childProcess = require('child_process')
const Request = require('request-promise-lite')

const getArgValue = (name, defaultValue) => process.argv[(process.argv.indexOf(name) + 1) || -1] || defaultValue

const HOSTNAME = getArgValue('--host', '127.0.0.1')
const PORT = parseInt(getArgValue('--port', '3000'))
const CLIENT_ID = getArgValue('--client-id')
const CLIENT_SECRET = getArgValue('--client-secret')
const REDIRECT_URI = `http://${HOSTNAME}:${PORT}`

const GOOGLE_API_CONSOLE_URL = `https://code.google.com/apis/console`

const GOOGLE_GET_CODE_URL = `https://accounts.google.com/o/oauth2/auth?scope=https://www.googleapis.com/auth/androidpublisher&response_type=code&access_type=offline&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&client_id=${CLIENT_ID}`

const GOOGLE_GET_REFRESH_TOKEN_URL = `https://accounts.google.com/o/oauth2/token`

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.log(`missing argument(s)`)
  console.log(`--client-id : client id from Google API OAuth 2.0`)
  console.log(`--client-secret : client secret from Google API OAuth 2.0`)
  
  console.log(`make sure that redirect uri (${REDIRECT_URI}) was inputed as Authorized redirect URIs`)
  
  childProcess.execSync(`open "${GOOGLE_API_CONSOLE_URL}"`)
  
  process.exit()
}

http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('')
  
  const CODE_REGEX = /^.*\?.*code=([a-zA-Z0-9\.\-\_\/]*).*$/
  
  if (CODE_REGEX.test(req.url)) {
    const CODE = req.url.replace(CODE_REGEX, '$1')
    
    Request.post(
      GOOGLE_GET_REFRESH_TOKEN_URL,
      {
        form: {
          grant_type: 'authorization_code',
          code: CODE,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          redirect_uri: REDIRECT_URI
        }
      }
    )
    .then((res) => console.log(`your refresh token is ${JSON.stringify(JSON.parse(res.toString()), 2, 2)}`))
    .catch((err) => console.error(err))
    .then(() => process.exit())
  }
}).listen(PORT, HOSTNAME, () => {})

childProcess.execSync(`open "${GOOGLE_GET_CODE_URL}"`)