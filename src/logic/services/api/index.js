import axios from "axios"
import Cookies from "js-cookie"
import logger from "@/logger"

export default {

    getAccessToken() {
        const jwt = Cookies.getJSON("jwt")
        if (jwt !== undefined && "accessToken" in jwt) return jwt.accessToken
        return null
    },
    buildConfig(config) {
        var defaultConfig = {
            crossDomain: true
        }
        const jwt = this.getAccessToken()
        if (jwt !== null)
            defaultConfig["headers"] = {
                "Authorization": "Bearer " + jwt
            }
        return {
            ...defaultConfig,
            ...config
        }
    },
    async post(url, data, config) {
        return await this.request({
            method: "post",
            url: url,
            data: data,
            ...config
        })
    },
    async get(url, config) {
        return await this.request({
            method: "get",
            url: url,
            ...config
        })
    },
    async request(config) {
        try {

            const response = await axios.request({
                ...config,
                ...this.buildConfig(config)
            })
            logger.debug(response)
            return response
        } catch (error) {
            var errorResponse
            if (error.response) {
                errorResponse = {
                    data: error.response.data,
                    status: error.response.status,
                    headers: error.response.headers
                }
                if (Math.floor(errorResponse.status / 100) == 4) {
                    logger.warn(errorResponse)
                    return errorResponse
                }
            } else if (error.request) {
                errorResponse = error.request
            } else {
                errorResponse = error.message
            }
            logger.error(errorResponse)
            return errorResponse
        }
    },
}