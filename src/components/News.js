import React, { useEffect, useState } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner'
import PropTypes from "prop-types"
import InfiniteScroll from 'react-infinite-scroll-component';

const News = (props) => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResult] = useState(0)


  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


  const updateNews = async () => {
    props.setProgress(0)
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`

    setLoading(true)
    props.setProgress(30)
    let data = await fetch(url)
    let parseData = await data.json()
    props.setProgress(50)
    setArticles(parseData.articles )
    setTotalResult(parseData.totalResults )
    setLoading(false)

    props.setProgress(100)
  }

  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)} - News`;
    updateNews();
    //eslint-disable-next-line
  }, [])


  const fetchMoreData = async () => {

    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page + 1}&pageSize=${props.pageSize}`
    setPage(page + 1)
    let data = await fetch(url)
    let parseData = await data.json()
    setArticles(articles.concat(parseData.articles ))
    setTotalResult(parseData.totalResults )

  }

  return (
    <>
      <h1 className='text-center' style={{ margin: "35px" }}>News - Top Headline</h1>
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row">
            {articles?.map((element) => {
              return <div className="col-md-4" key={element.url}>
                <NewsItem title={element.title ? element.title.slice(0, 40) : ""}
                  description={element.description ? element.description.slice(0, 75) : ""}
                  imageUrl={element.urlToImage} className="card-img-top"
                  NewsUrl={element.url} author={element.author} date={element.publishedAt} />
              </div>
            })}
          </div>
        </div>
      </InfiniteScroll>
    </>
  )
}

export default News

News.defaultProps = {
  country: "in",
  pageSize: 15,
  category: "general"
}
News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string
}