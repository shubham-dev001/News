import React, { useEffect, useState } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner'
import PropTypes from "prop-types"
import InfiniteScroll from 'react-infinite-scroll-component'

const News = (props) => {

  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  const capitalizeFirstLetter = (string) => {
    if (!string) return ""
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const updateNews = async () => {

    props.setProgress(0)

    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`

    setLoading(true)
    props.setProgress(30)

    const data = await fetch(url)
    const parsedData = await data.json()

    props.setProgress(50)

    setArticles(parsedData.articles || [])
    setTotalResults(parsedData.totalResults || 0)

    setLoading(false)

    props.setProgress(100)
  }

  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)} - News`
    updateNews()
    // eslint-disable-next-line
  }, [])

  const fetchMoreData = async () => {

    const nextPage = page + 1
    setPage(nextPage)

    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${nextPage}&pageSize=${props.pageSize}`

    const data = await fetch(url)
    const parsedData = await data.json()

    setArticles(prevArticles => prevArticles.concat(parsedData.articles))
    setTotalResults(parsedData.totalResults)
  }

  return (
    <>

      <h1 className='text-center' style={{ margin: "35px" }}>
        News - Top {capitalizeFirstLetter(props.category)} Headlines
      </h1>

      {loading && <Spinner />}

      <InfiniteScroll
        dataLength={articles?.length || 0}
        next={fetchMoreData}
        hasMore={articles?.length  < totalResults && !loading}
        loader={<Spinner />}
      >

        <div className="container">
          <div className="row">

            {articles.map((element) => {

              return (
                <div className="col-md-4" key={element.url}>

                  <NewsItem
                    title={element.title ? element.title.slice(0, 40) : ""}
                    description={element.description ? element.description.slice(0, 75) : ""}
                    imageUrl={element.urlToImage}
                    NewsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                  />

                </div>
              )
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