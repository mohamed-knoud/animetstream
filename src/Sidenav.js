import React from 'react'
import './Sidenav.css'
import {forwardRef,useEffect,useRef,useState} from 'react';

import { Link } from 'react-router-dom';

const Sidenav = forwardRef((props, ref) => {
  const innerRef = useRef(null);
    useEffect(() => {
    const handleClick = () => {
      // Call the callback function passed from the parent
      props.kl();
    };

    // Add event listener to the innerRef
    if (innerRef.current) {
      innerRef.current.addEventListener('click', handleClick);
    }

    // Cleanup function
    return () => {
      if (innerRef.current) {
        innerRef.current.removeEventListener('click', handleClick);
      }
    };
  }, [props.kl]);
  return (
    <div id="mySidenav" style={{ width: props.width }} className="sidenav">
        <a href="#" onClick={props.onClick} className="closebtn">&times;</a>
        <Link to='/'>Home</Link>
        <a target='_blank' href="https://ko-fi.com/codercoder61">Support</a>
        <a style={{cursor:'pointer'}} ref={innerRef}>Contact</a>
      </div>
  )
})

export default Sidenav
