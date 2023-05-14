import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', showErrorMessage: false, errMsg: ''}

  onSuccessLogin = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onLoginFailure = errMsg => {
    this.setState({showErrorMessage: true, errMsg})
  }

  onSubmit = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userData = {username, password}
    console.log(username, password)
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userData),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(response)
    console.log(data)
    if (response.ok) {
      this.onSuccessLogin(data.jwt_token)
    } else {
      this.onLoginFailure(data.error_msg)
    }
  }

  onNameChange = event => {
    this.setState({username: event.target.value})
  }

  onPasswordChange = event => {
    this.setState({password: event.target.value})
  }

  renderUserName = () => {
    const {username} = this.state
    return (
      <>
        <label htmlFor="usernameId" className="label-class">
          {' '}
          USERNAME
        </label>
        <br />
        <input
          type="text"
          value={username}
          id="usernameId"
          placeholder="Username"
          className="input-class"
          onChange={this.onNameChange}
        />
      </>
    )
  }

  renderPassword = () => {
    const {password} = this.state
    return (
      <>
        <label htmlFor="passwordId" className="label-class">
          {' '}
          PASSWORD
        </label>
        <br />
        <input
          type="password"
          value={password}
          id="passwordId"
          placeholder="Password"
          className="input-class"
          onChange={this.onPasswordChange}
        />
      </>
    )
  }

  render() {
    const {showErrorMessage, errMsg} = this.state
    const {history} = this.props
    if (Cookies.get('jwt_token') === undefined) {
      return (
        <div className="login-container">
          <div className="login-details-container">
            <div className="login-img-class">
              <img
                src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
                alt="website logo"
              />
            </div>
            <form className="form-class" onSubmit={this.onSubmit}>
              <div className="label-input-container">
                {this.renderUserName()}
              </div>
              <div>{this.renderPassword()}</div>
              <button type="submit" className="login-button">
                Login
              </button>
            </form>
            {showErrorMessage && <p className="login-error-msg">*{errMsg}</p>}
          </div>
        </div>
      )
    }
    return <Redirect path="/" />
  }
}

export default Login
