// Every JSON file in ./projects is a PRD; the filename is its id (used in ?project=<id>)
const modules = import.meta.glob('./projects/*.json', { eager: true, import: 'default' })

const projects = Object.entries(modules)
  .map(([path, prd]) => ({
    id: path.match(/([^/]+)\.json$/)[1],
    prd
  }))
  .sort((a, b) => a.prd.pageTitle.localeCompare(b.prd.pageTitle))

export default projects
