beforeEach(() => {
  delete window["__VUE_DEVTOOLS_TOAST__"]

  const existingRoot = document.getElementById('root')
  if (existingRoot) {
    existingRoot.innerHTML = ''
    return
  }
  const root = document.createElement('div')
  root.id = 'root'
  document.body.appendChild(root)
})

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

export async function setup() {  
  delete window['__VUE_DEVTOOLS_TOAST__']

  const importFile = (file: string) => import(`../../${file}`)

  const specsNames = async () =>  {
    const specs = await getSpecsToRun()
    return specs.map(specName => importFile(specName))
  }

  const [ files, specs ] = await Promise.all([
    fetch('/init').then(f => f.json()),
    specsNames()
  ])

  await Promise.all(files.map((file: string) => importFile(file)))
  await Promise.all(specs)

  const run = () => {
    mocha.checkLeaks()
    mocha.run()
  }

  return { run }
}

setup().then(s => s.run())