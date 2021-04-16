import { mount, createLocalVue } from "@vue/test-utils"
import Vuex from "vuex"
import vuetify from "@/plugins/vuetify"
import { assert } from "chai"
import AppBar from "@/components/appBar"
import usersModule from "@/store/modules/users"

var store
const localVue = createLocalVue()

describe("AppBar component", () => {
    beforeAll(() => {
        localVue.use(Vuex)
        store = new Vuex.Store({
            modules: {
                users: usersModule
            }
        })
    })

    describe("navigation drawer", () => {
        test("not display drawer on default", async () => {
            const wrapper = mount(AppBar, {
                vuetify,
                store,
                localVue,
            })
            assert.include(wrapper.find("#app-bar-drawer").classes(), 'v-navigation-drawer--close')
        })

        test("display drawer after button clicked", async () => {
            const wrapper = mount(AppBar, {
                vuetify,
                store,
                localVue,
            })

            await wrapper.find("#nav-drawer-button").trigger("click")
            assert.include(wrapper.find("#app-bar-drawer").classes(), 'v-navigation-drawer--open')
        })
    })

    describe("User menu", () => {
        test("not display user menu on default", async () => {
            const wrapper = mount(AppBar, {
                vuetify,
                store,
                localVue,
            })
            assert.isFalse(wrapper.find(".v-menu__content").exists())
        })

        test("display user menu after user button clicked", async () => {
            const wrapper = mount(AppBar, {
                vuetify,
                store,
                localVue,
            })

            await wrapper.find(".menu-button").trigger("click")
            assert.isTrue(wrapper.find(".v-menu__content").exists())
        })

        test("menu contain profile in the menu item", async () => {
            const wrapper = mount(AppBar, {
                vuetify,
                store,
                localVue,
            })

            await wrapper.find(".menu-button").trigger("click")
            const menuItems = wrapper.findAll(".v-menu__content #menu__content a")

            assert.equal(menuItems.length, 1)
            assert.equal(menuItems.at(0).find(".v-list-item__content").text(), "Profile")
            assert.equal(menuItems.at(0).props("href"), "/users/profile")
        })

        test("menu display email from state", async () => {
            const wrapper = mount(AppBar, {
                vuetify,
                store,
                localVue,
            })
            store.commit("users/setEmail", "sample@mail.co")
            await wrapper.find(".menu-button").trigger("click")

            const userProfile = wrapper.find(".v-menu__content #menu__user-profile")

            assert.equal(userProfile.find(".v-list-item__title").text(), "sample@mail.co")
            assert.equal(userProfile.find(".v-list-item__subtitle").text(), "(name)")
        })
    })
})