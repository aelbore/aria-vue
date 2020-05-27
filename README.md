[![npm version](https://badge.fury.io/js/aria-vue.svg)](https://www.npmjs.com/package/aria-vue)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

# aria-vue
Simple testing tools for vuejs

Installation
------------
  ```
    npm install --save-dev aria-vue aria-mocha puppeteer
  ```

Installation
------------
```
aria-vue --help

  Usage
    $ aria-vue [options]

  Options
    -p, --port       port to use default(3000)  (default 3000)
    -d, --dir        root directory of test files default (test folder)  (default test)
    --headless       run test(s) in headless  (default false)
    --script         scripts or helper scripts to load before setup
    --path           virtual path for your html reporter
    -v, --version    Displays current version
    -h, --help       Displays this message

  Examples
    $ aria-vue --headless --script ./test/plugin.js
    $ aria-vue --path my-virtual-path --script ./test/plugin.js
```