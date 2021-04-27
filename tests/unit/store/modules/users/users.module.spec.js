import { assert } from "chai"
import sinon from "sinon"
import axios from "axios"
import Cookies from "js-cookie"
import MockDate from 'mockdate'
import moment from "moment"

import store from "@/store"

describe("Users module", () => {
    describe("loadUser", () => {

        describe("jwt doesnt exist in cookies", () => {
            var axiosStubRequest
            var cookieStubGet

            beforeAll(async () => {

                delete window.location
                window.location = { href: "mock value" }

                axiosStubRequest = sinon.stub(axios, "request")
                cookieStubGet = sinon.stub(Cookies, "getJSON")

                cookieStubGet.returns(undefined)

                await store.dispatch("users/loadUser", null, { root: true })

            })

            afterAll(() => {
                jest.restoreAllMocks()
                sinon.restore()
            })

            test("should not call get user api", () => {
                assert.isTrue(axiosStubRequest.notCalled)
            })

            test("should redirect to public web when jwt doesnt exist in cookies", () => {
                assert.equal(window.location.href, "http://pub.permahub.local")
            })
        })

        describe("jwt exist in cookies but get api fail", () => {
            var axiosStub
            var cookieStubGet
            var cookieStubRemove

            beforeAll(async () => {
                delete window.location
                window.location = { href: "http://app.permahub.local" }
                MockDate.set(moment.utc("2021-03-02T08:08:10Z"))

                axiosStub = sinon.stub(axios, "request")
                cookieStubGet = sinon.stub(Cookies, "getJSON")
                cookieStubRemove = sinon.stub(Cookies, "remove")

                cookieStubGet.returns({ accessToken: "random_access_jwt", refreshToken: "random_refresh_jwt", expiredAt: "2021-03-02T09:08:10Z" })

                axiosStub.rejects({
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
                })

                await store.dispatch("users/loadUser", null, { root: true })
            })

            afterAll(() => {
                sinon.restore()
                jest.restoreAllMocks()
                MockDate.reset()
            })

            test("should call get user api", () => {
                assert.equal(axiosStub.callCount, 1)
                assert.deepEqual(axiosStub.firstCall.args, [{
                    method: "get",
                    url: "http://api.permahub.local/api/users",
                    headers: {
                        Authorization: "Bearer random_access_jwt"
                    },
                    crossDomain: true
                }])
            })

            test("should remove jwt cookies", () => {
                assert.equal(cookieStubRemove.callCount, 1)
                assert.deepEqual(cookieStubRemove.firstCall.args, ['jwt', { domain: '.permahub.local' }])
            })

            test("should redirect to public web", () => {
                assert.equal(window.location.href, "http://pub.permahub.local")
            })
        })
        describe("jwt exist in cookies and get api success", () => {
            var axiosStub
            var cookieStubRemove
            var cookieStubGet

            beforeAll(async () => {
                delete window.location
                window.location = { href: "http://app.permahub.local" }

                axiosStub = sinon.stub(axios, "request")
                cookieStubGet = sinon.stub(Cookies, "getJSON")
                cookieStubRemove = sinon.stub(Cookies, "remove")

                MockDate.set(moment.utc("2021-03-02T08:08:10Z"))

                cookieStubGet.returns({ accessToken: "random_access_jwt", refreshToken: "random_refresh_jwt", expiredAt: "2021-03-02T09:08:10Z" })


                axiosStub.resolves({
                    data: {
                        success: {
                            email: "email@mail.com",
                            createdDate: "2021-03-04T19:55:54.000+00:00",
                            lastModifiedDate: "2021-03-04T19:55:54.000+00:00"
                        }
                    },
                    status: 200,
                    headers: {}
                })

                await store.dispatch("users/loadUser", null, { root: true })
            })

            afterAll(() => {
                sinon.restore()
                jest.restoreAllMocks()
                MockDate.reset()
            })

            test("should call get user api", () => {
                assert.equal(axiosStub.callCount, 1)
                assert.deepEqual(axiosStub.firstCall.args, [{
                    method: "get",
                    url: "http://api.permahub.local/api/users",
                    headers: {
                        Authorization: "Bearer random_access_jwt"
                    },
                    crossDomain: true
                }])
            })

            test("should not delete cookie", () => {
                assert.isTrue(cookieStubRemove.notCalled)
            })

            test("should not redirect to public web", () => {
                assert.equal(window.location.href, "http://app.permahub.local")
            })

            test("should set email value", () => {
                assert.equal(store.getters["users/getEmail"], "email@mail.com")
            })

        })

        describe("jwt exist and expired in cookies but re-authenticate fail", () => {
            var axiosStub
            var cookieStubRemove
            var cookieStubGet

            beforeAll(async () => {
                delete window.location
                window.location = { href: "http://app.permahub.local" }

                axiosStub = sinon.stub(axios, "request")
                cookieStubGet = sinon.stub(Cookies, "getJSON")
                cookieStubRemove = sinon.stub(Cookies, "remove")

                MockDate.set(moment.utc("2021-03-02T10:08:10Z"))

                cookieStubGet.onCall(0).returns({ accessToken: "random_access_jwt", refreshToken: "random_refresh_jwt", expiredAt: "2021-03-02T09:08:10Z" })
                cookieStubGet.returns(undefined)

                axiosStub.rejects({
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
                })

                await store.dispatch("users/loadUser", null, { root: true })
            })

            afterAll(() => {
                sinon.restore()
                jest.restoreAllMocks()
                MockDate.reset()
            })

            test("should call re-authenticate api", () => {
                assert.equal(axiosStub.callCount, 1)
                assert.deepEqual(axiosStub.firstCall.args, [
                    {
                        method: "post",
                        url: "http://api.permahub.local/public/api/users/re-authenticate",
                        data: {
                            refreshToken: "random_refresh_jwt"
                        },
                        crossDomain: true
                    }
                ])
            })

            test("should remove jwt cookies", () => {
                assert.equal(cookieStubRemove.callCount, 1)
                assert.deepEqual(cookieStubRemove.firstCall.args, ['jwt', { domain: '.permahub.local' }])
            })

            test("should redirect to public web", () => {
                assert.equal(window.location.href, "http://pub.permahub.local")
            })
        })

        describe("jwt exist and expired in cookies, re-authenticate succeed but get api fail", () => {
            var axiosStub
            var cookieStubRemove
            var cookieStubGet
            var cookieStubSet

            beforeAll(async () => {
                delete window.location
                window.location = { href: "http://app.permahub.local" }

                axiosStub = sinon.stub(axios, "request")
                cookieStubGet = sinon.stub(Cookies, "getJSON")
                cookieStubSet = sinon.stub(Cookies, "set")
                cookieStubRemove = sinon.stub(Cookies, "remove")

                MockDate.set(moment.utc("2021-03-02T10:08:10Z"))

                cookieStubGet.onCall(0).returns({
                    accessToken: "random_access_jwt",
                    refreshToken: "random_refresh_jwt",
                    expiredAt: "2021-03-02T09:08:10Z"
                }).onCall(1).returns(undefined)
                cookieStubGet.returns({
                    accessToken: "new_random_access_jwt",
                    refreshToken: "new_random_refresh_jwt",
                    expiredAt: "2021-03-02T12:08:10Z"
                })

                axiosStub.onCall(0).resolves({
                    data: {
                        success: {
                            accessToken: "new_random_access_jwt",
                            refreshToken: "new_random_refresh_jwt",
                            expiredAt: "2021-03-02T12:08:10Z"
                        }
                    },
                    status: 201,
                    headers: {}
                }).onCall(1).rejects({
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
                })

                await store.dispatch("users/loadUser", null, { root: true })
            })

            afterAll(() => {
                sinon.restore()
                jest.restoreAllMocks()
                MockDate.reset()
            })

            test("should call re-authenticate api", () => {
                assert.equal(axiosStub.callCount, 2)
                assert.deepEqual(axiosStub.firstCall.args, [
                    {
                        method: "post",
                        url: "http://api.permahub.local/public/api/users/re-authenticate",
                        data: {
                            refreshToken: "random_refresh_jwt"
                        },
                        crossDomain: true
                    }
                ])
                assert.deepEqual(axiosStub.secondCall.args, [
                    {
                        method: "get",
                        url: "http://api.permahub.local/api/users",
                        headers: {
                            Authorization: "Bearer new_random_access_jwt"
                        },
                        crossDomain: true
                    }
                ])
            })
            test("should set new jwt cookies after refresh", () => {
                assert.equal(cookieStubSet.callCount, 1)
                assert.deepEqual(cookieStubSet.firstCall.args, [
                    'jwt', {
                        accessToken: "new_random_access_jwt",
                        refreshToken: "new_random_refresh_jwt",
                        expiredAt: "2021-03-02T12:08:10Z"
                    }, {
                        domain: '.permahub.local'
                    }
                ])
            })
            test("should remove jwt cookies", () => {
                assert.equal(cookieStubRemove.callCount, 2)
                const expectedArgs = ['jwt', { domain: '.permahub.local' }]
                assert.deepEqual(cookieStubRemove.firstCall.args, expectedArgs)
                assert.deepEqual(cookieStubRemove.secondCall.args, expectedArgs)
            })

            test("should redirect to public web", () => {
                assert.equal(window.location.href, "http://pub.permahub.local")
            })
        })

        describe("jwt exist and expired in cookies, re-authenticate and get api succeed", () => {
            var axiosStub
            var cookieStubRemove
            var cookieStubGet
            var cookieStubSet

            beforeAll(async () => {
                delete window.location
                window.location = { href: "http://app.permahub.local" }

                axiosStub = sinon.stub(axios, "request")
                cookieStubGet = sinon.stub(Cookies, "getJSON")
                cookieStubSet = sinon.stub(Cookies, "set")
                cookieStubRemove = sinon.stub(Cookies, "remove")

                MockDate.set(moment.utc("2021-03-02T10:08:10Z"))

                cookieStubGet.onCall(0).returns({
                    accessToken: "random_access_jwt",
                    refreshToken: "random_refresh_jwt",
                    expiredAt: "2021-03-02T09:08:10Z"
                }).onCall(1).returns(undefined)
                cookieStubGet.returns({
                    accessToken: "new_random_access_jwt",
                    refreshToken: "new_random_refresh_jwt",
                    expiredAt: "2021-03-02T12:08:10Z"
                })

                axiosStub.onCall(0).resolves({
                    data: {
                        success: {
                            accessToken: "new_random_access_jwt",
                            refreshToken: "new_random_refresh_jwt",
                            expiredAt: "2021-03-02T12:08:10Z"
                        }
                    },
                    status: 201,
                    headers: {}
                }).onCall(1).resolves({
                    data: {
                        success: {
                            email: "email@mail.com",
                            createdDate: "2021-03-04T19:55:54.000+00:00",
                            lastModifiedDate: "2021-03-04T19:55:54.000+00:00"
                        }
                    },
                    status: 200,
                })

                await store.dispatch("users/loadUser", null, { root: true })
            })

            afterAll(() => {
                sinon.restore()
                jest.restoreAllMocks()
                MockDate.reset()
            })

            test("should call re-authenticate api", () => {
                assert.equal(axiosStub.callCount, 2)
                assert.deepEqual(axiosStub.firstCall.args, [
                    {
                        method: "post",
                        url: "http://api.permahub.local/public/api/users/re-authenticate",
                        data: {
                            refreshToken: "random_refresh_jwt"
                        },
                        crossDomain: true
                    }
                ])
                assert.deepEqual(axiosStub.secondCall.args, [
                    {
                        method: "get",
                        url: "http://api.permahub.local/api/users",
                        headers: {
                            Authorization: "Bearer new_random_access_jwt"
                        },
                        crossDomain: true
                    }
                ])
            })
            test("should set new jwt cookies after refresh", () => {
                assert.equal(cookieStubSet.callCount, 1)
                assert.deepEqual(cookieStubSet.firstCall.args, [
                    'jwt', {
                        accessToken: "new_random_access_jwt",
                        refreshToken: "new_random_refresh_jwt",
                        expiredAt: "2021-03-02T12:08:10Z"
                    }, {
                        domain: '.permahub.local'
                    }
                ])
            })
            test("should remove jwt cookies once before refresh token", () => {
                assert.equal(cookieStubRemove.callCount, 1)
                assert.deepEqual(cookieStubRemove.firstCall.args, ['jwt', { domain: '.permahub.local' }])
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