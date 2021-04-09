const { VuetifyLoaderPlugin } = require('vuetify-loader')
import 'setimmediate'

module.exports = {
  plugins: [
    new VuetifyLoaderPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.s(c|a)ss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            // Requires sass-loader@^7.0.0
            options: {
              implementation: require('sass'),
              indentedSyntax: true, // optional
              // Requires sass-loader@^8.0.0
              sassOptions: {
                indentedSyntax: true // optional
              },
              data: "@import '@/styles/variables.scss'",
              prependData: "@import '@/styles/variables.scss'",
              additionalData: "@import '@/styles/variables.scss'"
            }
          }
        ]
      },
    ]
  }
}
