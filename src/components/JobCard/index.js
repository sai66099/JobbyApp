import {BsFillStarFill, BsBriefcase} from 'react-icons/bs'
import {GoLocation} from 'react-icons/go'
import {Link} from 'react-router-dom'

import './index.css'

const JobCard = props => {
  const {details} = props

  const {
    companyLogoUrl,
    employmentType,
    title,
    id,
    location,
    rating,
    jobDescription,
    packagePerAnnum,
  } = details

  return (
    <li className="job-card-container">
      <Link to={`/jobs/${id}`} className="link-class">
        <div className="first-container">
          <img
            src={companyLogoUrl}
            className="job-card-company-logo"
            alt="company logo"
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
        <h1 className="description-class">Description</h1>
        <p className="job-description-class">{jobDescription}</p>
      </Link>
    </li>
  )
}

export default JobCard
