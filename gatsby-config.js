/* eslint-env node */

require('dotenv').config()
const path = require('path')

const makeFeedHtml = require('gatsby-theme-iterative-docs/plugins/utils/makeFeedHtml')

const apiMiddleware = require('./src/server/middleware/api')
const redirectsMiddleware = require('./src/server/middleware/redirects')

const title = 'Data Version Control · DVC'
const description =
  'Open-source version control system for Data Science and Machine Learning ' +
  'projects. Git-like experience to organize your data, models, and ' +
  'experiments.'

const keywords = [
  'data version control',
  'machine learning',
  'models management'
]

const plugins = [
  'gatsby-plugin-twitter',
  {
    resolve: 'gatsby-theme-iterative-docs',
    options: {
      remark: false,
      cssBase: require.resolve(
        './src/gatsby-theme-iterative-docs/components/Page/base.css'
      )
    }
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'images',
      path: path.join(__dirname, 'static', 'uploads')
    }
  },
  'community-page',
  {
    resolve: 'gatsby-plugin-catch-links',
    options: {
      excludePattern: /\/doc\/cml/
    }
  },
  {
    resolve: `gatsby-plugin-algolia`,
    options: {
      appId: process.env.GATSBY_ALGOLIA_APP_ID || 'B87HVF62EF',
      apiKey: process.env.ALGOLIA_ADMIN_KEY,
      skipIndexing:
        process.env.CI && process.env.ALGOLIA_ADMIN_KEY ? false : true,
      queries: require('./src/utils/algolia-queries.js'),
      enablePartialUpdates:
        process.env.ALGOLIA_FULL_UPDATE === true ? false : true,
      matchFields: ['slug', 'modified']
    }
  },
  {
    resolve: 'gatsby-plugin-manifest',
    options: {
      /* eslint-disable @typescript-eslint/naming-convention */
      background_color: '#eff4f8',
      display: 'minimal-ui',
      icon: 'static/favicon-512x512.png',
      name: 'dvc.org',
      short_name: 'dvc.org',
      start_url: '/',
      theme_color: '#eff4f8',
      icons: [
        {
          src: '/apple-touch-icon-48x48.png',
          sizes: '48x48',
          type: 'image/png'
        },
        {
          src: '/apple-touch-icon-72x72.png',
          sizes: '72x72',
          type: 'image/png'
        },
        {
          src: '/apple-touch-icon-96x96.png',
          sizes: '96x96',
          type: 'image/png'
        },
        {
          src: '/apple-touch-icon-144x144.png',
          sizes: '144x144',
          type: 'image/png'
        },
        {
          src: '/apple-touch-icon.png',
          sizes: '180x180',
          type: 'image/png'
        },
        {
          src: '/apple-touch-icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/apple-touch-icon-256x256.png',
          sizes: '256x256',
          type: 'image/png'
        },
        {
          src: '/apple-touch-icon-384x384.png',
          sizes: '384x384',
          type: 'image/png'
        },
        {
          src: '/apple-touch-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
      /* eslint-enable @typescript-eslint/naming-convention */
    }
  },
  {
    resolve: `gatsby-plugin-feed`,
    options: {
      feeds: [
        {
          description,
          output: '/blog/rss.xml',
          query: `
            {
              allBlogPost(
                sort: { fields: [date], order: DESC }
              ) {
                nodes {
                  htmlAst
                  slug
                  title
                  date
                  description
                }
              }
            }
          `,
          serialize: ({ query: { site, allBlogPost } }) => {
            return allBlogPost.nodes.map(node => {
              const html = makeFeedHtml(node.htmlAst, site.siteMetadata.siteUrl)
              return Object.assign(
                {},
                {
                  /* eslint-disable-next-line @typescript-eslint/naming-convention */
                  custom_elements: [{ 'content:encoded': html }],
                  title: node.title,
                  date: node.date,
                  description: node.description,
                  guid: site.siteMetadata.siteUrl + node.slug,
                  url: site.siteMetadata.siteUrl + node.slug
                }
              )
            })
          },
          title
        }
      ],
      query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
    `
    }
  }
]

if (process.env.ANALYZE) {
  plugins.push({
    resolve: 'gatsby-plugin-webpack-bundle-analyser-v2'
  })
}

module.exports = {
  plugins,
  siteMetadata: {
    description,
    author: 'Iterative',
    keywords,
    siteUrl: process.env.HEROKU_APP_NAME
      ? `https://${process.env.HEROKU_APP_NAME}.herokuapp.com/`
      : 'https://dvc.org',
    title
  },
  developMiddleware: app => {
    app.use(redirectsMiddleware)
    app.use('/api', apiMiddleware)
  }
}
