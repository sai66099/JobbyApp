import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsFillStarFill, BsBriefcase} from 'react-icons/bs'
import {FaExternalLinkAlt} from 'react-icons/fa'
import {GoLocation} from 'react-icons/go'

import Cookies from 'js-cookie'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItem extends Component {
  state = {
    details: {},
    lifeAtCompany: {},
    skills: [],
    similarJobs: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    this.getResponse()
  }

  getResponse = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const token = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, options)

    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const modifiedData = {
        jobDetails: data.job_details,
        similarJobs: data.similar_jobs,
      }
      const {jobDetails, similarJobs} = modifiedData
      const lifeAtCompany = {
        description: jobDetails.life_at_company.description,
        imageUrl: jobDetails.life_at_company.image_url,
      }

      const skills = jobDetails.skills.map(eachItem => ({
        imageUrl: eachItem.image_url,
        name: eachItem.name,
      }))

      const similarJobsInfo = similarJobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        rating: eachItem.rating,
        title: eachItem.title,
      }))

      const jobDetailsInfo = {
        companyLogoUrl: jobDetails.company_logo_url,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        id: jobDetails.id,
        jobDescription: jobDetails.job_description,
        title: jobDetails.title,
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,
      }

      this.setState({
        details: {
          jobDetailsInfo,
          lifeAtCompany,
          skills,
          similarJobsInfo,
        },
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderJobItemFailureView = () => (
    <div className="main-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="failure-view-class"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button>Retry</button>
    </div>
  )

  renderJobItemView = () => {
    const {details} = this.state
    const {jobDetailsInfo, similarJobsInfo, lifeAtCompany, skills} = details
    if (jobDetailsInfo && similarJobsInfo && lifeAtCompany && skills) {
      const {
        companyLogoUrl,
        companyWebsiteUrl,
        employmentType,
        id,
        jobDescription,
        title,
        location,
        packagePerAnnum,
        rating,
      } = jobDetailsInfo
      const {imageUrl, description} = lifeAtCompany
      const count = 0
      console.log(title)
      console.log(location)
      console.log(rating)
      return (
        <div className="main-container">
          <div className="sub-container">
            <div className="first-container">
              <img
                src={companyLogoUrl}
                className="job-card-company-logo"
                alt="job details company logo"
              />

              <div className="title-rating-container">
                <h1 className="title">{title}</h1>
                <div className="rating-container">
                  <BsFillStarFill className="star-icon" />

                  <p className="rating-text">{rating}</p>
                </div>
              </div>
            </div>

            <div className="location-main-container">
              <div className="location-employment-container">
                <div className="location-class">
                  <GoLocation className="location-icon" />
                  <p className="location-info">{location}</p>
                </div>
                <div className="location-class location-margin">
                  <BsBriefcase className="location-icon" />
                  <p className="location-info">{employmentType}</p>
                </div>
              </div>
              <p className="package-class">{packagePerAnnum}</p>
            </div>

            <hr />
            <div className="link-description-container">
              <h1 className="description-class">Description</h1>
              <a
                href={companyWebsiteUrl}
                className="website-link-class"
                target="_blank"
                rel="noreferrer"
              >
                visit
                <FaExternalLinkAlt className="website-link-icon" />
              </a>
            </div>

            <p className="job-description-class">{jobDescription}</p>
            <div className="skills-container">
              <h1>Skills</h1>
              <ul className="skills-class">
                {skills.map(eachItem => (
                  <li key={skills.indexOf(eachItem)} className="skills-list">
                    <img src={eachItem.imageUrl} alt={eachItem.name} />
                    <p>{eachItem.name}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="life-at-company-class">
              <div className="company-life-description-class">
                <h1>Life at Company</h1>
                <p>{description}</p>
              </div>
              <img src={imageUrl} alt="life at company" />
            </div>
          </div>

          <div className="similar-jobs-section">
            <h1>Similar Jobs</h1>
            <ul className="similar-jobs-list-container">
              {similarJobsInfo.map(eachItem => (
                <li className="similar-jobs-list" key={eachItem.id}>
                  <div className="first-container">
                    <img
                      src={eachItem.companyLogoUrl}
                      className="job-card-company-logo"
                      alt="similar job company logo"
                    />

                    <div className="title-rating-container">
                      <h1 className="title">{eachItem.title}</h1>
                      <div className="rating-container">
                        <BsFillStarFill className="star-icon" />

                        <p className="rating-text">{eachItem.rating}</p>
                      </div>
                    </div>
                  </div>
                  <h1 className="description-class">Description</h1>
                  <p className="job-description-class">
                    {eachItem.jobDescription}
                  </p>
                  <div className="location-employment-container">
                    <div className="location-class">
                      <GoLocation className="location-icon" />
                      <p className="location-info">{location}</p>
                    </div>
                    <div className="location-class location-margin">
                      <BsBriefcase className="location-icon" />
                      <p className="location-info">{employmentType}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    }
    return ''
  }

  render() {
    const {apiStatus} = this.state
    switch ('SUCCESS') {
      case apiStatusConstants.success:
        return this.renderJobItemView()
      case apiStatusConstants.failure:
        return this.renderJobItemFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default JobItem
