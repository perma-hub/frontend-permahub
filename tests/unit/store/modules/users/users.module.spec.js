import { assert } from "chai"
import sinon from "sinon"
import axios from "axios"
import Cookies from "js-cookie"

import store from "@/store"

describe("Users module", () => {
    describe("loadUser", () => {

        describe("jwt doesnt exist in cookies", () => {
            var axiosMock
            var cookieMock

            beforeAll(async () => {
                delete window.location
                window.location = { href: "mock value" }

                axiosMock = sinon.mock(axios)
                cookieMock = sinon.mock(Cookies)

                axiosMock.expects("request").never()
                cookieMock.expects("get").returns(undefined)

                await store.dispatch("users/loadUser", null, { root: true })

            })

            afterAll(() => {
                jest.restoreAllMocks()
                sinon.restore()
            })

            test("should not call get user api", () => {
                axiosMock.verify()
            })

            test("should redirect to public web when jwt doesnt exist in cookies", () => {
                assert.equal(window.location.href, "http://pub.permahub.local")
            })
        })

        describe("jwt exist in cookies but get api fail", () => {
            var axiosMock
            var cookieMock

            beforeAll(async () => {
                delete window.location
                window.location = { href: "http://app.permahub.local" }

                axiosMock = sinon.mock(axios)
                cookieMock = sinon.mock(Cookies)

                cookieMock.expects("get").atLeast(1).returns("random_jwt")
                cookieMock.expects("remove").withArgs('jwt', { domain: '.permahub.local' }).once()

                axiosMock.expects("request").rejects({
                    response: {
                        data: {
                            error: {
                                type: "NotFoundException",
                                message: "User has not foundaa"
                            }
                        },
                        status: 404,
                        headers: {}
                    }
                }).once().withArgs({
                    method: "get",
                    url: "http://api.permahub.local/api/users",
                    headers: {
                        Authorization: "Bearer random_jwt"
                    },
                    crossDomain: true
                })

                await store.dispatch("users/loadUser", null, { root: true })
            })

            afterAll(() => {
                sinon.restore()
                jest.restoreAllMocks()
            })

            test("should call get user api", () => {
                axiosMock.verify()
            })

            test("should remove jwt cookies", () => {
                cookieMock.verify();
            })

            test("should redirect to public web", () => {
                assert.equal(window.location.href, "http://pub.permahub.local")
            })
        })
        describe("jwt exist in cookies but get api success", () => {
            var axiosMock
            var cookieMock

            beforeAll(async () => {
                delete window.location
                window.location = { href: "http://app.permahub.local" }

                axiosMock = sinon.mock(axios)
                cookieMock = sinon.mock(Cookies)

                cookieMock.expects("get").atLeast(1).returns("random_jwt")
                cookieMock.expects("remove").never()

                axiosMock.expects("request").resolves({
                    data: {
                        success: {
                            email: "email@mail.com",
                            createdDate: "2021-03-04T19:55:54.000+00:00",
                            lastModifiedDate: "2021-03-04T19:55:54.000+00:00"
                        }
                    },
                    status: 200,
                    headers: {}
                }).once().withArgs({
                    method: "get",
                    url: "http://api.permahub.local/api/users",
                    headers: {
                        Authorization: "Bearer random_jwt"
                    },
                    crossDomain: true
                })

                await store.dispatch("users/loadUser", null, { root: true })
            })

            afterAll(() => {
                sinon.restore()
                jest.restoreAllMocks()
            })

            test("should call get user api", () => {
                axiosMock.verify()
            })

            test("should not delete cookie", () => {
                cookieMock.verify()
            })

            test("should not redirect to public web", () => {
                assert.equal(window.location.href, "http://app.permahub.local")
            })

            test("should set email value", () => {
                assert.equal(store.getters["users/getEmail"], "email@mail.com")
            })

        })
    })
})