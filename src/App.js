import {Route, Switch, Redirect} from 'react-router-dom'

import Login from './components/Login'

import Home from './components/Home'
import ProtectedComponent from './components/ProtectedComponent'
import Jobs from './components/Jobs'
import JobItem from './components/JobItem'
import NotFound from './components/NotFound'
import './App.css'

// These are the lists used in the application. You can move them to any component needed.
const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

// Replace your code here
const App = () => (
  <div>
    <Switch>
      <Route path="/login" component={Login} />

      <Route exact path="/jobs">
        <Jobs
          salaryRangesList={salaryRangesList}
          employmentTypesList={employmentTypesList}
        />
      </Route>
      <ProtectedComponent exact path="/" component={Home} />
      <ProtectedComponent exact path="/jobs/:id" component={JobItem} />
      <Route path="/not-found" component={NotFound} />
      <Redirect to="/not-found" />
    </Switch>
  </div>
)

export default App
