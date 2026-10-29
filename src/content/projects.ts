import { projectsFromModules } from '../lib/projects'
import type { Prd } from '../lib/types'

// Every JSON file in ./projects is a PRD; the filename is its id (used in ?project=<id>)
const modules = import.meta.glob<Prd>('./projects/*.json', { eager: true, import: 'default' })

const projects = projectsFromModules(modules)

export default projects
