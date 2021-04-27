const PUBLIC_SERVER_URL = "http://pub.permahub.local"
const BACKEND_SERVER_URL = "http://api.permahub.local"
const PERMAHUB_DOMAIN = ".permahub.local"
const GET_USER_URL = BACKEND_SERVER_URL + "/api/users"
const REAUTHENTICATE_USER_URL = BACKEND_SERVER_URL + "/public/api/users/re-authenticate"
const COOKIE_JWT_FIELD = "jwt"


module.exports = {
    PUBLIC_SERVER_URL: PUBLIC_SERVER_URL,
    GET_USER_URL: GET_USER_URL,
    PERMAHUB_DOMAIN: PERMAHUB_DOMAIN,
    REAUTHENTICATE_USER_URL: REAUTHENTICATE_USER_URL,
    COOKIE_JWT_FIELD: COOKIE_JWT_FIELD
}