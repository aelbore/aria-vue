[![npm version](https://badge.fury.io/js/aria-vue.svg)](https://www.npmjs.com/package/aria-vue)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

# aria-vue
Simple testing tools for vuejs

Installation
------------
  ```
    npm install --save-dev aria-vue aria-mocha puppeteer
  ```

Example Code
------------
* npm install
* npm run build
* cd example
* npm run headless

Usage
------------
```
aria-vue --help

  Usage
    $ aria-vue [options]

  Options
    -p, --port       port to use default(3000)
    -d, --dir        root directory of test files (default test)
    -w --watch       enable watch (default false)
    -h --headless    run test(s) in headless  (default false)
    --script         scripts or helper scripts to load before setup
    --path           virtual path for your html reporter
    --html           path of your index.html file
    -v, --version    Displays current version
    -h, --help       Displays this message

  Examples
    $ aria-vue -w -h --script ./test/plugin.js
    $ aria-vue --watch --path my-virtual-path --script ./test/plugin.js
    $ aria-vue --path test-ui --html ./test/index.html --script ./test/plugins.js
```

Plugin usage
------------
* Create `vite.config.test.js` file
```javascript
const { testPlugin, watchPlugin } = require('aria-vue')

/// by default (watchPlugin)
/// all the files in src and test folder 
/// with .spec.js and .vue extension will watch for change

module.exports = {
  configureServer: [
    testPlugin({   
      script: './test/plugins.js'
    }),
    watchPlugin()
  ]
}
```
* `vite --config vite.config.test.js`