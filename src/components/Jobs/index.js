import {Component} from 'react'
import Loader from 'react-loader-spinner'

import {BsSearch} from 'react-icons/bs'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'
import JobCard from '../JobCard'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const locations = [
  {locationId: 'HYDERABAD', location: 'Hyderabad'},
  {locationId: 'DELHI', location: 'Delhi'},
  {locationId: 'BANGALORE', location: 'Bangalore'},
  {locationId: 'CHENNAI', location: 'Chennai'},
  {locationId: 'MUMBAI', location: 'Mumbai'},
]

class Jobs extends Component {
  state = {
    profileDetails: {},
    jobDetails: [],
    employmentType: [],
    packageExpecting: 0,
    searchInput: '',
    apiJobStatus: apiStatusConstants.initial,
    apiProfileStatus: apiStatusConstants.initial,
    isJobFailed: true,
    isProfileFailed: true,
    searchFail: false,
    location: [],
  }

  componentDidMount() {
    this.setState({
      apiProfileStatus: apiStatusConstants.inProgress,
      apiJobStatus: apiStatusConstants.inProgress,
    })
    this.getJobsData()
    this.getProfileData()
  }

  getJobsData = async () => {
    const {employmentType, packageExpecting, searchInput, location} = this.state
    const joinedString = employmentType.join(',')

    const token = Cookies.get('jwt_token')
    const JobApiUrl = `https://apis.ccbp.in/jobs?employment_type=${joinedString}&minimum_package=${packageExpecting}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(JobApiUrl, options)

    if (response.ok) {
      const data = await response.json()
      if (data.jobs.length === 0) {
        this.setState({searchFail: true})
      } else {
        console.log(data)
        const jobDetails = data.jobs.map(eachJob => ({
          companyLogoUrl: eachJob.company_logo_url,
          employmentType: eachJob.employment_type,
          id: eachJob.id,
          title: eachJob.title,
          location: eachJob.location,
          rating: eachJob.rating,
          jobDescription: eachJob.job_description,
          packagePerAnnum: eachJob.package_per_annum,
        }))
        this.setState({
          jobDetails,
          apiJobStatus: apiStatusConstants.success,
          isJobFailed: false,
          searchFail: false,
        })
      }
      if (response.status === 401) {
        this.setState({
          apiJobStatus: apiStatusConstants.failure,
          isJobFailed: false,
        })
      }
    }
  }

  getProfileData = async () => {
    const token = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(url, options)
    console.log(response)
    if (response.ok) {
      const data = await response.json()

      const profileDetails = {
        profileImageUrl: data.profile_details.profile_image_url,
        name: data.profile_details.name,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileDetails,
        apiProfileStatus: apiStatusConstants.success,
        isProfileFailed: false,
      })
    }
    if (response.status === 401) {
      this.setState({
        apiProfileStatus: apiStatusConstants.failure,
        isProfileFailed: false,
      })
    }
  }

  employmentTypeFunction = event => {
    const {employmentType} = this.state
    const checkboxId = event.target.id

    if (event.target.checked === true) {
      this.setState(
        {employmentType: [...employmentType, checkboxId]},
        this.getJobsData,
      )
    }
    if (event.target.checked === false) {
      const filterList = employmentType.filter(
        eachItem => eachItem !== checkboxId,
      )
      this.setState({employmentType: filterList}, this.getJobsData)
    }
  }

  locationFunction = event => {
    const {location} = this.state
    const checkboxId = event.target.id

    if (event.target.checked === true) {
      this.setState({location: [...location, checkboxId]}, this.getJobsData)
    }
    if (event.target.checked === false) {
      const filterList = location.filter(eachItem => eachItem !== checkboxId)
      this.setState({location: filterList}, this.getJobsData)
    }
  }

  onPackageChange = event => {
    this.setState(
      {packageExpecting: parseInt(event.target.id)},
      this.getJobsData,
    )
  }

  onKeyChange = event => {
    if (event.key === 'Enter') {
      this.setState({searchInput: event.target.value}, this.getJobsData)
    }
  }

  onTextChange = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearchIcon = () => {
    const {searchInput} = this.state
    this.setState({searchInput}, this.getJobsData)
  }

  renderProfileSuccessView = () => {
    const {profileDetails} = this.state
    const {profileImageUrl, name, shortBio} = profileDetails
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" />
        <h1>{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  renderProfileFailureView = () => (
    <>
      <button type="button" onClick={this.getProfileData}>
        Retry
      </button>
    </>
  )

  renderJobSuccessView = () => {
    const {jobDetails, location} = this.state
    let filteredList = []
    if (location.length !== 0) {
      filteredList = jobDetails.filter(eachItem =>
        location.includes(eachItem.location),
      )
    } else {
      filteredList = jobDetails
    }

    return (
      <ul className="job-card-main-container">
        {filteredList.map(eachItem => (
          <JobCard details={eachItem} key={eachItem.id} />
        ))}
      </ul>
    )
  }

  renderSearchFailureView = () => (
    <div className="main-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        className="failure-view-class"
        alt="no jobs"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters</p>
    </div>
  )

  renderJobFailureView = () => (
    <>
      <div className="main-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          className="failure-view-class"
          alt="failure view"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for</p>
        <button type="button" onClick={this.getJobsData}>
          Retry
        </button>
      </div>
    </>
  )

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProfileViews = () => {
    const {apiProfileStatus, isProfileFailed} = this.state

    switch (apiProfileStatus) {
      case apiStatusConstants.success:
        return this.renderProfileSuccessView()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderJobViews = () => {
    const {apiJobStatus, isJobFailed} = this.state
    if (isJobFailed) {
      return this.renderJobFailureView()
    }
    switch (apiJobStatus) {
      case apiStatusConstants.success:
        return this.renderJobSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {
      profileDetails,
      jobDetails,
      employmentType,
      packageExpecting,
      searchInput,
      apiprofileStatus,
      apiJobStatus,
      searchFail,
    } = this.state
    const {profileImageUrl, name, shortBio} = profileDetails
    const {employmentTypesList, salaryRangesList} = this.props

    const token = Cookies.get('jwt_token')

    if (token === undefined) {
      return <Redirect path="/login" />
    }
    return (
      <div className="job-container">
        <div className="header-container">
          <Header />
        </div>

        <div className="job-main-container">
          <div className="profile-main-container">
            {this.renderProfileViews()}
            <hr />

            <h1 className="heading-class">Type of Employment</h1>
            <ul>
              {employmentTypesList.map(eachType => (
                <li key={eachType.employmentTypeId}>
                  <input
                    type="checkbox"
                    id={eachType.employmentTypeId}
                    onChange={this.employmentTypeFunction}
                  />
                  <label
                    htmlFor={eachType.employmentTypeId}
                    className="employmentLabel"
                  >
                    {eachType.label}
                  </label>
                </li>
              ))}
            </ul>

            <hr />

            <h1 className="heading-class">Salary Range</h1>
            <ul>
              {salaryRangesList.map(eachType => (
                <li key={eachType.salaryRangeId}>
                  <input
                    type="radio"
                    id={eachType.salaryRangeId}
                    name="salary"
                    onChange={this.onPackageChange}
                  />
                  <label
                    htmlFor={eachType.salaryRangeId}
                    className="employmentLabel"
                  >
                    {eachType.label}
                  </label>
                </li>
              ))}
            </ul>

            <hr />

            <h1 className="heading-class">Location</h1>
            <ul>
              {locations.map(eachType => (
                <li key={eachType.locationId}>
                  <input
                    type="checkbox"
                    id={eachType.location}
                    onChange={this.locationFunction}
                  />
                  <label
                    htmlFor={eachType.locationId}
                    className="employmentLabel"
                  >
                    {eachType.location}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="search-main-container">
            <div className="search-container">
              <input
                type="search"
                className="search-input"
                placeholder="Search"
                onChange={this.onTextChange}
                onKeyDown={this.onKeyChange}
              />

              <button
                type="button"
                data-testid="searchButton"
                onClick={this.onClickSearchIcon}
                className="search-button"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {searchFail
              ? this.renderSearchFailureView()
              : this.renderJobViews()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
