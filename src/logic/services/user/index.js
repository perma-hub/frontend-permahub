import moment from "moment"
import Cookies from "js-cookie"

import { REAUTHENTICATE_USER_URL, PERMAHUB_DOMAIN, COOKIE_JWT_FIELD } from "@/constants"
import apiService from "@/logic/services/api"

export default {
    async refreshToken() {
        const jwt = Cookies.getJSON("jwt")

        if (jwt !== undefined && "expiredAt" in jwt && moment.utc(jwt.expiredAt).isSameOrBefore(moment.utc())) {
            const refreshToken = jwt.refreshToken
            Cookies.remove(COOKIE_JWT_FIELD, { domain: PERMAHUB_DOMAIN })
            const response = await apiService.post(REAUTHENTICATE_USER_URL, {
                refreshToken: refreshToken
            })
            if ("data" in response && "success" in response.data) {
                Cookies.set(COOKIE_JWT_FIELD, response.data.success, { domain: PERMAHUB_DOMAIN })
            }
        }
    }
}