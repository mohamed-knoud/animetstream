import React ,{forwardRef,useState,useEffect,useRef} from 'react'
import { Link, useParams } from 'react-router-dom';
import Plyr from 'plyr';
import axios from 'axios'
import './Watch.css';
import Nav from './Nav'
import Cookies from 'js-cookie';
import Hls from 'hls.js';

const pageSize = 10; // Number of items per page

const Watch = forwardRef((props, ref) => {
let response 
let res
  let { animeId } = useParams();
        Cookies.set('lastWatchedAnime', animeId);
  //const videoRef = useRef(null);
const player = new Plyr('#player');

  const [animeid,setAnimeId] = useState(0)
  const defaultOptions = {};
  const [isLoading,setSpinner] = useState(true)
  const videoRef = useRef(null);
  const spinnerRef = useRef(null)
  const [title,setTitle] = useState('')
  const [poster,setPoster] = useState('')
	
  const [episodeNumber,setEpisodeNumber] = useState()
  const [totalEpisodes,setTotalEpisodes] = useState([])
  const [episodes,setEpisodes] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const [totalPages, settotalPages] = useState(0);
  //const [totalEpisodes, settotalEpisodes] = useState();
  const [startIndex,setStartIndex] = useState(0)
  const [endIndex,setEndIndex] = useState(0)
  const [currentItems,setcurrentItems] = useState([])
  const [episodeId,setEpisodeId] = useState('')
  
  useEffect(()=>{
    if(isLoading){
      videoRef.current.style.display = "none"
      spinnerRef.current.style.display = "block"

    }else{
      videoRef.current.style.display = "block"
      spinnerRef.current.style.display = "none"

    }
  },[isLoading])
useEffect(async ()=>{
    res = await axios.get(`https://proxy-ryan.vercel.app/cors?url=https://anime-brown-three.vercel.app/api/v2/hianime/anime/${animeId}`);
	//console.log(res)
	setPoster(res.data.data.anime.info.poster)
	setTitle(res.data.data.anime.info.name)
	setEpisodeNumber(1)
},[])
 
  const spinnerTrue = ()=>{
    setSpinner(true)
  }
   const renderPagination = () => {
    const pages = [];
    // for (let i = 1; i <= totalPages; i++) {
    //   pages.push(
    //     <button className='btn_pag' key={i} onClick={() => handlePageChange(i)}>
    //       {i}
    //     </button>
    //   );
    // }
    return <>
    <button className='btn_pag'  onClick={() => handlePageChange(currentPage-1)}>
          <i class="fa-solid fa-arrow-left"></i>
        </button>
      <button className='btn_pag'  onClick={() => handlePageChange(currentPage+1)}>
      <i class="fa-solid fa-arrow-right"></i>
         </button>
    
    </>;
  };
useEffect(() => {
        const fetchEpisodes = async () => {
            try {
                response = await axios.get(`https://proxy-ryan.vercel.app/cors?url=https://anime-brown-three.vercel.app/api/v2/hianime/anime/${animeId}/episodes`);
                console.log(response)
		    console.log(response.data.data.episodes);
		    setEpisodes(response.data.data.episodes)
		    setTotalEpisodes(response.data.data.episodes.length);
              const options = {
              method: 'POST',
              url: 'https://http-cors-proxy.p.rapidapi.com/',
              headers: {
                'x-rapidapi-key': '2e4139dc3fmshfb131a66e36aa23p1bbef1jsncf62aca0e0bd',
                'x-rapidapi-host': 'http-cors-proxy.p.rapidapi.com',
                'Content-Type': 'application/json',
                Origin: 'https://animetstream.vercel.app/',
                'X-Requested-With': 'https://animetstream.vercel.app/'
              },
              data: {
                url: `https://anime-brown-three.vercel.app/api/v2/hianime/episode/sources?animeEpisodeId=${response.data.data.episodes[0].episodeId}&server=hd-1&category=dub`
              }
            };try {
	const response2 = await axios.request(options);
	console.log(response2.data);
		      if (Hls.isSupported()) {
			      const hls = new Hls();
			      hls.loadSource(response2.data.data.sources[0]);
			      hls.attachMedia(videoRef.current);
		    }
		
		    // If Hls is not supported, fall back to native video element
		    if (videoRef.current) {
		      videoRef.current.src = response2.data.data.sources[0];
		    }
} catch (error) {
	console.error(error);
}
                
               // console.log(response2)  
                //setEpisodes(response.data.episodes);
                //setTotalEpisodes(response.data.totalEpisodes);
                //setEpisodeNumber(response.data.episodes[0]?.number); // Optional chaining for safety
                //setCurrentPage(1); // Reset current page when data changes
            } catch (error) {
                console.error('Error fetching episodes:', error);
            }
        };

        fetchEpisodes();
    }, []); // Dependency array includes animeId
 
  useEffect(() => {
    if (totalEpisodes > 0) {
            if(currentPage<1){
        setCurrentPage(1)
      }
     
  
      if(currentPage>totalPages)
        {
          setCurrentPage(totalPages)
     
      }
     

      settotalPages(Math.ceil(totalEpisodes / pageSize));
      setStartIndex((currentPage - 1) * pageSize)
      
      setEndIndex(Math.min(startIndex + pageSize, totalEpisodes))
      setcurrentItems(episodes.slice(startIndex,endIndex))
    }
  }, [totalEpisodes,animeId,currentPage,startIndex,endIndex]);

 

    const [visible,setVisible] = useState(true)
    const handleClick =()=>{
      setVisible(false)
    }
  return (
    <>

    <Nav pp={props.hj} forwardedRef={ref} spinner={spinnerTrue}/>
   {visible && <div style={{ position:'relative',justifyContent:'space-between', backgroundColor:'rgb(51, 50, 50)',color:'white', padding:'10px 10px'}} >
      <i className="fa-solid fa-hand-holding-dollar"></i> Support
      <span ><a target='_blank' style={{backgroundColor:'black',padding:'0px 10px',color:'white',textDecoration:'none',position:'absolute',right:'20px',marginRight:'10px'}} href='https://ko-fi.com/codercoder61'>Support</a><span 
  style={{cursor:'pointer',color:'white',position:'absolute',right:'10px',bottom:'8px',fontSize:'20px'}} onClick={handleClick}>X</span></span>
  </div>}
  <div className="containerr">

          <video ref={videoRef} id="player" style={{display:'none'}} controls></video>
         
          <div ref={spinnerRef} className="spinner-container">
            <div className="spinner"></div>
          </div>

  
  <div id="episodeDetails">
    <div style={{display:'flex',flexDirection:'column',alignItems:'start'}}>
      {title?<span >{title}</span>:""}
      <span style={{color:'rgb(161,161,170'}}>Episode {episodeNumber} </span>
    </div>
  </div>
  
  
    <div id="eps" style={{marginTop:'20px',display:'flex',flexDirection:'column',flex:'1',alignItems:'center',flexWrap:'wrap',justifyContent:'center'}}>
    <div  style={{marginBottom:'20px'}}>
        {(totalPages>1 && totalEpisodes>10 )? renderPagination() : ""}
      </div>
      <div style={{display:'flex',flexWrap:'wrap',justifyContent:"center"}}>
    {
  currentItems.length > 0 ? (
    currentItems.map((episode) => (
      <div key={episode.id} onClick={()=>{setEpisodeId(episode.id);setEpisodeNumber(episode.number);}} style={{display:'flex',flexDirection:'column'}}>
      <img style={{cursor:'pointer',borderRadius:'10px',marginRight:'15px',width:'150px',aspectRatio:'16/9',objectFit:'cover'}} src={poster} alt={episode.title ? episode.title:""} /><span style={{alignSelf:'start',color:'white'}}>{episode.title ? (episode.title.length>19 ? episode.title.slice(0, 16)+'...':episode.title) : "Episode "+episode.number}</span>
	</div>
    ))
  ) : (
    ""
  )
}
</div>
    </div>
  </div>

  
    </>
  )
})

export default Watch
