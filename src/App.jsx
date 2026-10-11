import prd from './content/prd'
import Header from './components/Header'
import Section from './components/Section'
import Overview from './components/Overview'
import Text from './components/Text'
import Table from './components/Table'
import List from './components/List'
import Media from './components/Media'
import Commercials from './components/Commercials'
import Nav from './components/Nav'
import './App.css'

function App() {
  return (
    <main id="top" className="prd-layout">
      <Nav />

      <div className="prd-content">
        <Header title={prd.pageTitle} />

        <Section 
          id="overview"
          title="1. Overview"
        >

          <Overview overview={prd.overview}/>

        </Section>

        <Section 
          id="problem"
          title="2. The Problem"
        >

          <Text 
            title="Current State" 
            content={prd.problem.currentState} 
          />

          <Text 
            title="Strategic Alignment" 
            content={prd.problem.strategicAlignment} 
          />

          <Text title="Business Case" />

          <h4>Baseline</h4>
          <Table
            columns={[
              {key: 'metric', label: 'Metric'},
              {key: 'currentState', label: 'Current State'}
            ]}
            rows={prd.problem.businessCase.baseline}
          />

          <h4>Expected Improvement</h4>
          <Table
            columns={[
              {key: 'metric', label: 'Metric'},
              {key: 'currentState', label: 'Current'},
              {key: 'target', label: 'Target'},
              {key: 'improvement', label: 'Improvement'}
            ]}
            rows={prd.problem.businessCase.expectedImprovement}
          />
          {/* TODO: turn Commercial Benefit into component */}
          <Commercials 
            content={prd.problem.businessCase.commercialBenefit}
          />
        </Section> 

        <Section 
          id="solution"
          title="3. The Solution"
        >

          <Text 
            title="Future State" 
            content={prd.solution.futureState} 
          />

          <Text title="Workflows" />
          <Media 
            images={prd.solution.workflows} 
          />

          <Text title="Key Features" />
          <List items={prd.solution.keyFeatures}/>

          <Text title="Wireframes" />
          <Media 
            images={prd.solution.wireframes} 
          />
        </Section>

        <Section 
          id="scope"
          title="4. Scope"
        >

          <Text title="Goals" />
          <List items={prd.scope.goals}/>

          <Text title="Non Goals" />
          <List items={prd.scope.nonGoals}/>

        </Section>

        <Section 
          id="timeline"
          title="5. Timeline"
        >

        <Text title="Key Milestones" />
          <Table
            columns={[
              {key: 'target', label: 'Target Date'},
              {key: 'milestone', label: 'Milestone'},
              {key: 'description', label: 'Description'}
            ]}
            rows={prd.problem.businessCase.baseline}
          />

        </Section>

        <Section 
          id="risks"
          title="6. Risks"
        >

          <Table
            columns={[
              {key: 'risk', label: 'Risk'},
              {key: 'impact', label: 'Impact'},
              {key: 'likelihood', label: 'Likelihood'},
              {key: 'mitigation', label: 'Mitigation'},
            ]}
            rows={prd.risks}
          />

        </Section>

        <Section 
          id="dependencies"
          title="7. Dependencies"
        >

          <Table
            columns={[
              {key: 'dependency', label: 'Dependency'},
              {key: 'requirement', label: 'Requirement'},
              {key: 'owner', label: 'Owner'},
              {key: 'status', label: 'Status'},
            ]}
            rows={prd.dependencies}
          />

        </Section>

        <Section 
          id="assumptions"
          title="8. Assumptions"
        >

        <Text title="Assumptions" />
        <List items={prd.assumptions}/>
        
        </Section>
      </div>

      <a href="top" className="scroll-top">
        ^ Scroll to Top
      </a>

    </main>
  )
}

export default App