const path = require('path') // used for resolving aliases
const { VuetifyLoaderPlugin } = require('vuetify-loader')

module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
  ],
  // add this function to tweak the webpack config
  webpackFinal: async (config, { configType }) => {

    config.node = {
      fs: 'empty'
    }
    // so I can import { storyFactory } from '~storybook/util/helpers'
    config.resolve.alias['~storybook'] = path.resolve(__dirname)
    // the @ alias points to the `src/` directory, a common alias
    // used in the Vue community
    config.resolve.alias['@'] = path.resolve(__dirname, '..', 'src')
    config.plugins.push(new VuetifyLoaderPlugin())
    // THIS is the tricky stuff!
    config.module.rules.push({
      test: /\.s(c|a)ss$/,
      use: [
        'vue-style-loader',
        'css-loader',
        {
          loader: 'sass-loader',
          options: {
            implementation: require('sass'),
            sassOptions: {
              indentedSyntax: true // optional
            },
            additionalData: "@import '@/styles/variables.scss'"
          },
        },
      ],
      include: path.resolve(__dirname, '../'),
    })
    // return the updated Storybook configuration
    return config
  },
}
