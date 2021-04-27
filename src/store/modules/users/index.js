import Cookies from "js-cookie"
import userService from "@/logic/services/user"
import apiService from "@/logic/services/api"
import logger from "@/logger"
import { PERMAHUB_DOMAIN } from "@/constants"

import { PUBLIC_SERVER_URL, GET_USER_URL } from "@/constants"


const state = () => ({
    email: "",
})

const getters = {
    getEmail: (state) => state.email,
}

const mutations = {
    setEmail(state, email) { state.email = email },
}

const actions = {
    async loadUser({ commit }) {
        await userService.refreshToken()
        const jwt = Cookies.getJSON("jwt")
        if (jwt !== undefined) {
            try {
                const response = await apiService.get(GET_USER_URL)
                if ("data" in response && "success" in response.data && "email" in response.data.success) {
                    commit('setEmail', response.data.success.email)
                    return
                }
                logger.warn(response)
            } catch (error) {
                logger.error(error)
            }
            Cookies.remove("jwt", { domain: PERMAHUB_DOMAIN })
        }
        window.location.href = PUBLIC_SERVER_URL
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}