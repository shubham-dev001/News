import React from 'react'

const NewsItem = (props) => {


  let { title, description, imageUrl, NewsUrl, author, date } = props;
  return (
    <div  className="card my-3" style={{ height: "450px" }} >
      <img src={imageUrl} alt="..." style={{ height: "200px", objectFit: "cover" }} />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{title}...</h5>
        <p className="card-text">{description}...</p>
        <p className="card-text">
          <small className="text-body-secondary"> By {!author ? "Unknown" : author} on {new Date(date).toGMTString()} </small></p>
        <a href={NewsUrl} target='blank' className="btn btn-sm btn-dark mt-auto align-self-start">Read more</a>
      </div>
    </div>
  )
}

export default NewsItem 