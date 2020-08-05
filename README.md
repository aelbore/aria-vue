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
* `npm install`
* `npm run build`
* `cd example`
* `npm test`

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
    -H --headless    run test(s) in headless  (default false)
    --script         scripts or helper scripts to load before setup
    --path           virtual path for your html reporter
    --html           path of your index.html file
    -v, --version    Displays current version
    -h, --help       Displays this message

  Examples
    $ aria-vue -w -H --script ./test/plugin.js
    $ aria-vue --watch --path my-virtual-path --script ./test/plugin.js
    $ aria-vue --path test-ui --html ./test/index.html --script ./test/plugins.js
```

Plugin usage
------------
* Create `vite.config.test.js` file
```javascript
import { createVueTestPlugin } from 'aria-vue'

export default  {
  plugins: [  
    createVueTestPlugin({
      script: './test/plugins.js',
      watch: true
    })
  ]
}
```
* `vite --config vite.config.test.js`