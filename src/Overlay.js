import React,{useState,useEffect} from 'react'
import axios from 'axios'
import './Overlay.css'
import { Link } from 'react-router-dom'
function Overlay(props) {
  const [query,setQuery] = useState('')
  const [animes,setAnimes] = useState([])
  const handleChange = (event)=>{
    setQuery(event.target.value)
  }

 
  useEffect(() => {
    axios.get(`https://proxy-ryan.vercel.app/cors?url=https://anime-brown-three.vercel.app/api/v2/hianime/search?q=${query}`)
      .then(response => {
        console.log(response.data);
        //setAnimes(response.data.results || []) 
      })
      .catch(error => {
        console.error('Error fetching data:', error); // Logging the error if fetching fails
      });
  }, [query]);
  return (
    <div id="myOverlay" className="overlay">
        <span onClick={props.onClick} className="closebtn" title="Close Overlay">×</span>
        <div className="overlay-content">
          <form action="/action_page.php">
            <input id="se" value={query} onChange = {handleChange} type="text" placeholder="Search for anime..." name="search"/><br/>            
          </form>
          
        </div>
        <div id="results">
        {(query !== "" && animes.length > 0 )? (
              animes.map(anime => (
                <Link key={anime.id} onClick={()=>{props.onclick();props.spinnertrue()}} style={{textDecoration:'none'}} to={`/Watch/${anime.id}`}><div>
                  <img src={anime.image} style={{witdh:'80px',height:'120px',borderRadius:'50%',objectFit:'cover'}} alt={anime.title}/>
                  <span>{anime.title.length>20?anime.title.slice(0,19)+'...':anime.title}</span>
                </div></Link>
              ))
            ) : (
              <div></div>
            )}
            </div>
      </div>)
      
}

export default Overlay
