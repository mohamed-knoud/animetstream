import React,{useState,useEffect} from 'react'
import './Block.css'
import { Link } from 'react-router-dom';
import axios from 'axios';
function Block(props) {
  const [data, setData] = useState([]);
  const fetchData = async (url) => {
    await axios.get(url).then(dataa=>{
        setData(dataa.data.results);

    }).catch(error=>{
        console.log(error)
    });
      
    
  };

  const handleClick3 = ()=>{
        fetchData('https://sup-proxy.zephex0-f6c.workers.dev/api-json?url=https://consume-mu.vercel.app/meta/anilist/trending?page=1?api_key=171fe27dbfecc58e2a18fbced644cda9')
  }
  const handleClick4 = ()=>{
        fetchData('https://sup-proxy.zephex0-f6c.workers.dev/api-json?url=https://consume-mu.vercel.app/meta/anilist/popular?page=1&perPage=20?api_key=171fe27dbfecc58e2a18fbced644cda9')
  }
  useEffect(() => {


    fetchData('https://sup-proxy.zephex0-f6c.workers.dev/api-json?url=https://consume-mu.vercel.app/meta/anilist/trending?page=1?api_key=171fe27dbfecc58e2a18fbced644cda9')
    
    
  }, []);
  return (
    <>
    

        <div id="div">
            <button onClick={handleClick3}>Trending</button>
            <button onClick={handleClick4}>Popular</button>
        </div>
        <div id="fetched">
                    {
            data.map((anime, index) => (
                <Link key={index} style={{textDecoration:'none'}} to={`/Watch/${anime.id}`}><div style={{display:'flex',flexDirection:'column',textAlign:'center'}} >
                <img src={anime.image} alt={anime.title} />
<span>{(anime.title.english && anime.title.english.length>30)?anime.title.english.slice(0,30)+"...":anime.title.english}</span>
  

                </div></Link>
            ))
            }
        </div>
    </>
  )
}

export default Block
