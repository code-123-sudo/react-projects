import React, { useState, useEffect } from 'react'
import Loading from './Loading'

//url to fetch api data
const url = 'https://jsonplaceholder.typicode.com/posts'

function App() {
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])
  const [isError, setIsError] = useState(false)
  const [pageStart,setPageStart] = useState(0)
  const [pageEnd,setPageEnd] = useState(5)
  const [searchTerm,setSearchTerm] = useState("")

  // async function to fetch data from api using fetch
  const fetchPosts = async () => {
    setLoading(true)
    try {
      const response = await fetch(url)
      const posts = await response.json()
      setLoading(false)
      setPosts(posts)
    } catch (error) {
      setIsError(true)
      setLoading(false)
    }
  }

  // fetch the posts on innitial load of component 
  useEffect(() => {
    fetchPosts()
  }, [])

  const next = () => {
    setPageStart(pageStart + 5)
    setPageEnd(pageEnd + 5 )
  }

  const previous = () => {
    if (pageStart >= 5 ) {
      setPageStart(pageStart - 5)
      setPageEnd(pageEnd - 5 )
    }    
  }

  const handleChange = (event) => {
    setSearchTerm(event.target.value)
    let filteredPosts = posts.slice(pageStart,pageEnd).filter((post) => {
      if ( post.title.includes(searchTerm) ) {
        return true;
      }else {
        return false;
      }
    })
    console.log(filteredPosts)
  }

  // show the loader while api is fetching the data 
  if (loading) {
    return (
      <main>
        <Loading />
      </main>
    )
  }

  // if error show the error message
   if (isError) {
    return (
      <main>
        Something went wrong
      </main>
    )
  }

  return (
    <main>
      <div className="container">
        <div className="postsDiv">
        <input type="text" onChange={(event) => {handleChange(event)}} />
        {
          posts.slice(pageStart,pageEnd).map((post,index) => {
            return (
              <div>
                <p>{pageStart + index+1}</p>
                <div>
                  Title:    {post.title}
                </div>
                <div>
                  Post:     {post.body}
                </div>
              </div>
            )
          })
        }
        </div>
        <div>
          <button onClick={() => previous()}>Previous</button>
          <button onClick={() => next()}>Next</button>
        </div>
      </div>
    </main>
  )
}

export default App
