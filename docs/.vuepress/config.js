module.exports = {
  dest: 'methor',
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Methor',
      description: 'Nodejs web application framework inspired by Facebook API'
    }
  },
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    [
      'meta',
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }
    ],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],
  serviceWorker: true,
  themeConfig: {
    repo: 'ancm-s/methor',
    editLinks: true,
    docsDir: 'docs',
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',
        nav: [
          {
            text: 'Guide',
            link: '/guide/'
          },
          {
            text: 'Config Reference',
            link: '/config/'
          },
          {
            text: 'Changelog',
            link: 'https://github.com/ancm-s/methor/blob/master/CHANGELOG.md'
          }
        ],
        sidebar: {
          '/guide/': genSidebarConfig('Guide')
        }
      }
    }
  }
}

function genSidebarConfig(title) {
  return [
    {
      title,
      collapsable: false,
      children: ['', 'method-define-ways', 'method-plugin-validate', 'plugin']
    }
  ]
}
