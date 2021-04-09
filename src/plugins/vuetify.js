import Vue from 'vue'
import Vuetify from 'vuetify'

Vue.use(Vuetify)

const opts = {
  theme: {
    options: {
      customProperties: true
    },
    dark: false,
    themes: {
      dark: {
        primary: '#8BC34A',
        accent: '#2E7D32',
        secondary: '#FFC107',
        success: '#00FFDC',
        info: '#00DDFF',
        warning: '#FB8C00',
        error: '#F44336'
      },
      light: {
        primary: '#9CCC65',
        accent: '#2E7D32',
        secondary: '#FFE082',
        success: '#00BFA5',
        info: '#00B8D4',
        warning: '#FFAB00',
        error: '#FF5252'
      }
    }
  }
}

export default new Vuetify(opts)
