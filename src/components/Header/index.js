import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const {history} = props

  const onLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="nav-container">
      <ul className="nav-list-class">
        <li>
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              className="header-image-class"
              alt="website logo"
            />
          </Link>
        </li>

        <li className="links-container">
          <Link to="/" className="header-link">
            Home
          </Link>

          <Link to="/jobs" className="header-link">
            Jobs
          </Link>
        </li>
        <li>
          <button className="header-logout-button" onClick={onLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
