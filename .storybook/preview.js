import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import { opts } from '@/plugins/vuetify' // <== important
import 'setimmediate'
import store from '@/store'
import '@/styles/general.css'

// configure Vue to use Vuetify
Vue.use(Vuetify)
Vue.use(Vuex)


export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

const vuetify = new Vuetify(opts)

// THIS is my decorator
export const decorators = [
  (story, context) => {
    // wrap the passed component within the passed context
    const wrapped = story(context)
    // extend Vue to use Vuetify around the wrapped component
    return Vue.extend({
      vuetify,
      store,
      components: { wrapped },
      props: {
        dark: {
          type: Boolean,
          default: context.args.dark,
        },
      },
      watch: {
        dark: {
          immediate: true,
          handler(val) {
            this.$vuetify.theme.dark = val
          }
        },
      },
      template: `
        <v-app>
          <v-container fluid>
            <wrapped />
          </v-container>
        </v-app>
      `
    })
  },
]