import React from 'react'
import "./Header.css"
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <div className='header'>
      <Link className='link' to="/detection">Recognition</Link>
      <Link className='link' to="/Upload">Upload</Link>
      {/* <Link className='link' to="/test">Test</Link> */}
    </div>
  )
}
