import { config } from '@vue/test-utils'

mocha.setup('bdd');
/// @ts-ignore
window.expect = chai.expect
/// @ts-ignore
window.assert = chai.assert

beforeEach(() => {
  const existingRoot = document.getElementById('root')
  if (existingRoot) {
    existingRoot.innerHTML = ''
    return
  }
  const root = document.createElement('div')
  root.id = 'root'
  document.body.appendChild(root)
})

function DataTestIdPlugin(wrapper) {
  function findByTestId(selector) {
    const dataSelector = `[data-testid='${selector}']`
    const element = wrapper.element.querySelector(dataSelector)
    if (element) {
      return element
    }
    return null
  }
  return {
    findByTestId
  }
}

async function getSpecsToRun(dir?: string) {
  const testDir = dir ?? 'test'
  const params = new URLSearchParams((document.location.href.split('?'))[1])

  // ?spec=App.spec.js
  // ?specs=Foo.spec.js,App.spec.js
  // ?run=App.spec.js
  const specParams =
  params.getAll('spec') ||
  params.getAll('run') ||
  params.getAll('specs')

  const allSpecs = specParams.reduce((acc, curr) => {
    return acc.concat(curr.split(',').map(p => `${testDir}/${p}`))
  }, [])

  const specs: string[] = (allSpecs.length) 
    ? await Promise.resolve(allSpecs)
    : await fetch('/test-files').then(r => r.json())

  return specs
}

async function setup() {  
  /// @ts-ignore
  config.plugins.VueWrapper.install(DataTestIdPlugin)

  /// @ts-ignore
  delete window.__VUE_DEVTOOLS_TOAST__

  const specsNames = async () =>  {
    const specs = await getSpecsToRun()
    return specs.map(specName => import(`../../${specName}`))
  }

  const specs = await specsNames()
  await Promise.all(specs)

  const run = () => {
    mocha.checkLeaks()
    mocha.run()
  }

  return { run }
}

setup().then(s => s.run())