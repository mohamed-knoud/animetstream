import React ,{forwardRef,useState,useEffect,useRef} from 'react'
import { Link, useParams } from 'react-router-dom';
import Plyr from 'plyr';
import axios from 'axios'
import './Watch.css';
import Nav from './Nav'
import Cookies from 'js-cookie';

const pageSize = 10; // Number of items per page

const Watch = forwardRef((props, ref) => {

  let { animeId } = useParams();
        Cookies.set('lastWatchedAnime', animeId);

  const [animeid,setAnimeId] = useState(0)
  const defaultOptions = {};
  const [isLoading,setSpinner] = useState(true)
  const videoRef = useRef(null);
  const spinnerRef = useRef(null)
  const [title,setTitle] = useState('')
  const [episodeNumber,setEpisodeNumber] = useState()
  const [episodes,setEpisodes] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const [totalPages, settotalPages] = useState(0);
  const [totalEpisodes, settotalEpisodes] = useState();
  const [startIndex,setStartIndex] = useState(0)
  const [endIndex,setEndIndex] = useState(0)
  const [currentItems,setcurrentItems] = useState([])
  const [episodeId,setEpisodeId] = useState('')
  const [image,setImage] = useState("")
  const [rank,setRank] = useState("")
  const [duration,setDuration] = useState("")
  const [score,setScore] = useState("")
  const [studios,setStudios] = useState("")
  const [status,setStatus] = useState("")
  const [Season,setSeason] = useState("")
  const [releaseDate,setReleaseDate] = useState("")
  const [rating,setRating] = useState("")
  const [broadcast,setBroadcast] = useState("")
  useEffect(()=>{
    if(isLoading){
      videoRef.current.style.display = "none"
      spinnerRef.current.style.display = "block"

    }else{
      videoRef.current.style.display = "block"
      spinnerRef.current.style.display = "none"

    }
  },[isLoading])
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
    const fetchData = async () => {
      await axios.get(`https://consume-mu.vercel.app/meta/anilist/info/${animeId}`).then(data=>{
        setTitle(data.data.title.english)
        setAnimeId(data.data.episodes[0].id)
        setEpisodeNumber(data.data.episodes[0].number)
        setEpisodes(data.data.episodes)
        settotalEpisodes(data.data.episodes.length)
        setCurrentPage(1); // Reset current page when data changes
        
        setSeason(data.data.season)
        setStatus(data.data.status)
        setDuration(data.data.duration)
        setRating(data.data.rating)
        setReleaseDate(data.data.releaseDate)
        setImage(data.data.image)

       
        axios.get(`https://consume-mu.vercel.app/meta/anilist/watch/${data.data.episodes[0].id}`).then(data=>{
        console.log(data)
          
          if (window.Hls.isSupported()) {
            if(window.hls) {
              window.hls.destroy();
            }
            const hls = new window.Hls();
            hls.loadSource(data.data.sources[0].url);
            
            
           
            hls.on(window.Hls.Events.MANIFEST_PARSED, function(event, data) {
              const availableQualities = hls.levels.map((l)=>l.height)
              defaultOptions.controls = [
                'play-large', // The large play button in the center   
                'play', // Play/pause playback   
                'fast-forward', // Fast forward by the seek time (default 10 seconds)    
                'progress', // The progress bar and scrubber for playback and buffering    
                'current-time', // The current time of playback    
                'duration', // The full duration of the media    
                'mute', // Toggle mute    
                'volume', // Volume control    
                'settings', // Settings menu    
                'pip', // Picture-in-picture (currently Safari only)    
                'fullscreen', // Toggle fullscreen
              ]
              // Assuming you want to start playing the first quality level
              defaultOptions.quality = {
                default :availableQualities[0],
                option:availableQualities,
                forced : true,
                onChange: (e) => updateQuality(e)
              }
  
              new Plyr(videoRef.current,defaultOptions); 
              setSpinner(false)
           
            });
          
            hls.attachMedia(videoRef.current);
            window.hls= hls;
          }
          function updateQuality(newQuality){
            window.hls.levels.forEach((level,levelIndex)=>{
              if(level.height===newQuality ){
                window.hls.currentLevel = levelIndex
              }
            })
        }
  
        }).catch(error=>{
          // alert(error)
        })
       
      }).catch(error=>{
        // alert(error)
        axios.get(`https://consume-mu.vercel.app/anime/gogoanime/info/${animeId}`).then(data=>{
        console.log(data)
        setAnimeId(data.data.id)
        setTitle(data.data.title)
        setAnimeId(data.data.episodes[0].id)
        setEpisodeNumber(data.data.episodes[0].number)
        setEpisodes(data.data.episodes)
        settotalEpisodes(data.data.totalEpisodes)
        setCurrentPage(1); // Reset current page when data changes
        setImage(data.data.image)
        setSeason(data.data.season)
        setStatus(data.data.status)
        setDuration(data.data.duration)
        setRating(data.data.rating)
        setReleaseDate(data.data.releaseDate)
        axios.get(`https://consume-mu.vercel.app/anime/gogoanime/watch/${data.data.episodes[0].id}`).then(data=>{
          

          if (window.Hls.isSupported()) {
            if(window.hls) {
              window.hls.destroy();
            }
            const hls = new window.Hls();
            hls.loadSource(data.data.sources[3].url);

            
            
            hls.on(window.Hls.Events.MANIFEST_PARSED, function(event, data) {
              const availableQualities = hls.levels.map((l)=>l.height)
              defaultOptions.controls = [
                'play-large', // The large play button in the center   
                'play', // Play/pause playback   
                'fast-forward', // Fast forward by the seek time (default 10 seconds)    
                'progress', // The progress bar and scrubber for playback and buffering    
                'current-time', // The current time of playback    
                'duration', // The full duration of the media    
                'mute', // Toggle mute    
                'volume', // Volume control    
                'settings', // Settings menu    
                'pip', // Picture-in-picture (currently Safari only)    
                'fullscreen', // Toggle fullscreen
              ]
              // Assuming you want to start playing the first quality level
              defaultOptions.quality = {
                default :availableQualities[0],
                option:availableQualities,
                forced : true,
                onChange: (e) => updateQuality(e)
              }
  
              new Plyr(videoRef.current,defaultOptions); 
              setSpinner(false)
           
            });
          
            hls.attachMedia(videoRef.current);
            window.hls= hls;
  
          }
          function updateQuality(newQuality){
            window.hls.levels.forEach((level,levelIndex)=>{
              if(level.height===newQuality ){
                window.hls.currentLevel = levelIndex
              }
            })
        }
  
        }).catch(error=>{
          // alert(error)
        })
        }).catch(error=>{
          // alert(error)
        })
      })
      
    };

    // Call the function to fetch data
    fetchData();

    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animeId,totalEpisodes]);


  useEffect(() => {
    setSpinner(true)

    axios.get(`https://consume-mu.vercel.app/anime/gogoanime/watch/${episodeId}`).then(data=>{
          

          if (window.Hls.isSupported()) {
            if(window.hls) {
              window.hls.destroy();
            }
            const hls = new window.Hls();
            hls.loadSource(data.data.sources[3].url);

            
            
            hls.on(window.Hls.Events.MANIFEST_PARSED, function(event, data) {
              const availableQualities = hls.levels.map((l)=>l.height)
              defaultOptions.controls = [
                'play-large', // The large play button in the center   
                'play', // Play/pause playback   
                'fast-forward', // Fast forward by the seek time (default 10 seconds)    
                'progress', // The progress bar and scrubber for playback and buffering    
                'current-time', // The current time of playback    
                'duration', // The full duration of the media    
                'mute', // Toggle mute    
                'volume', // Volume control    
                'settings', // Settings menu    
                'pip', // Picture-in-picture (currently Safari only)    
                'fullscreen', // Toggle fullscreen
              ]
              // Assuming you want to start playing the first quality level
              defaultOptions.quality = {
                default :availableQualities[0],
                option:availableQualities,
                forced : true,
                onChange: (e) => updateQuality(e)
              }
  
              new Plyr(videoRef.current,defaultOptions); 
              setSpinner(false)
           
            });
          
            hls.attachMedia(videoRef.current);
            window.hls= hls;
  
          }
          function updateQuality(newQuality){
            window.hls.levels.forEach((level,levelIndex)=>{
              if(level.height===newQuality ){
                window.hls.currentLevel = levelIndex
              }
            })
        }
  
        }).catch(error=>{
          // alert(error)
        })
  }, [episodeId]);

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

          <video ref={videoRef} style={{display:'none'}} controls></video>
         
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
        <img style={{cursor:'pointer',borderRadius:'10px',marginRight:'15px',width:'150px',aspectRatio:'16/9',objectFit:'cover'}} src={episode.image ? episode.image : image} alt={episode.title ? episode.title:""} /><span style={{alignSelf:'start',color:'white'}}>{episode.title ? (episode.title.length>19 ? episode.title.slice(0, 16)+'...':episode.title) : "Episode "+episode.number}</span>
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
