import React from 'react'
import {Link} from 'react-router-dom'

const Footer = () => (
  <div>
    <p>-------------------------</p>
    <p>THIS IS A FOOTER</p>
    <Link to="./contact">Contact Us</Link>
    <Link to="./about">About Us</Link>
  </div>
)

export default Footer
