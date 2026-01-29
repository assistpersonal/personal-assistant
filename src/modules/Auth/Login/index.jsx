import { setCookie } from 'cookies-next'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { requestAuthService } from '../../../services/auth'
import { ToastContainer, toast } from "react-toastify";

const LoginWrapper = () => {
    const navigate = useNavigate()
    const [isRegister, setIsRegister] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const login = async (user) => {
        setIsLoading(true)
        setError('')
        try {
            const payload = {
                url: '/user/login',
                method: 'post',
                data: {
                    email: user.email,
                    password: user.password
                }
            }
            const resp = await requestAuthService(payload)
            if(resp?.data?.status === 'failed') {
                setError(resp?.data?.message)
                return
            }
            localStorage.setItem("authToken", resp.data.token);
            toast.success('Login successful!')
            setTimeout(() => {
                navigate('/app')
            }, 1000)
            console.log(resp?.data)
        } catch(e) {
            console.debug('error exception', e)
            setError('Login failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const register = async (user) => {
        setIsLoading(true)
        setError('')
        try {
            const payload = {
                url: '/user/register',
                method: 'post',
                data: {
                    name: user.username,
                    email: user.email,
                    password: user.password,
                    password_confirmation: user.password,
                    mobile_number: user.mobilenumber,
                    whatsapp_number: user.mobilenumber
                }
            }
            const resp = await requestAuthService(payload)
            if(resp?.data?.status === 'failed') {
                setError(resp?.data?.message)
                return
            }
            toast.success('Registration successful! Verification link sent to your WhatsApp number.')
            // Switch to login form after successful registration
            setIsRegister(false)
            console.log(resp?.data)
        } catch(e) {
            console.debug('error exception', e)
            setError('Registration failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const authSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target);
        const { username, email, password, mobilenumber } = Object.fromEntries(formData.entries())
        if(!isRegister){
            await login({ email, password })
        } else {
            await register({ username, email, password, mobilenumber })
        }
    }
  return (
      <div>
          <section className="booking-section">
              <div className="outer-container" style={{ backgroundImage: "url(assets/images/background/booking-bg.jpg)" }}>
                  <div className="auto-container">
                      <div className="row clearfix">
                          <div className="col-xl-6 col-lg-12 col-md-12 inner-column">
                              <div className="inner-box">
                                  <div className="text">
                                      <h2>{isRegister ? 'Register' : 'Login'} Here</h2>
                                      <p>Rationally encounter consequences that are extremely painful or again is there anyone.</p>
                                  </div>
                                  <div className="form-inner">
                                      <form onSubmit={authSubmit} className="default-form">
                                          <div className="row clearfix">
                                              {isRegister && <div className="col-lg-6 col-md-6 col-sm-12 column">
                                                  <div className="form-group">
                                                      <i className="far fa-user"></i>
                                                      <input type="text" id="username" name="username" maxLength={50} placeholder="Name" required />
                                                  </div>
                                              </div>}
                                              <div className="col-lg-6 col-md-6 col-sm-12 column">
                                                  <div className="form-group">
                                                      <i className="far fa-user"></i>
                                                      <input type="email" id="email" name="email" placeholder="Email Address" required />
                                                  </div>
                                              </div>
                                              <div className="col-lg-6 col-md-6 col-sm-12 column">
                                                  <div className="form-group">
                                                      <i className="far fa-envelope-open"></i>
                                                      <input type="password" minLength={6} id="password" name="password" placeholder="Password" required />
                                                  </div>
                                              </div>
                                              {isRegister && <div className="col-lg-6 col-md-6 col-sm-12 column">
                                                  <div className="form-group">
                                                      <i className="fa fa-whatsapp text-lg"></i>
                                                      <input className='flex' type="text" id="mobilenumber" minLength={10} maxLength={12} name="mobilenumber" placeholder="Whatsapp Number" required />
                                                  </div>
                                              </div>}
                                              {error ? <div className='col-lg-12 col-md-12 col-sm-12 column text-red-500 text-center py-2'>{error}</div>: null}
                                              <div className="col-lg-12 col-md-12 col-sm-12 column">
                                                  <div className="form-group message-btn">
                                                      <button type="submit" className="theme-btn btn-one" disabled={isLoading}>
                                                          <span>{isLoading ? 'Processing...' : 'Submit Here'}</span>
                                                      </button>
                                                  </div>
                                              </div>
                                          </div>
                                      </form>
                                  </div>
                                  <div className='flex justify-between'>
                                      <div className='text-black cursor-pointer' onClick={() => setIsRegister(prev => !prev)}>
                                          {isRegister ? 'Existing User? Login here' : 'New User? Register Here'}
                                      </div>
                                      {/* <div className='text-red-500 cursor-pointer'>
                                          <Link to="/forget-password">{!isRegister ? 'Forgot Password' : ""}</Link>
                                      </div> */}
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </section>
          {/* <section className="location-section">
              <div className="auto-container">
                  <div className="sec-title centred">
                      <h6>Our Locations</h6>
                      <h2> Centers in Your City</h2>
                  </div>
                  <div className="three-item-carousel owl-carousel owl-theme owl-nav-none dots-style-one">
                      <div className="single-item">
                          <figure className="image-box"><img src="assets/images/resource/location-2.jpg" alt="" /></figure>
                          <div className="lower-content">
                              <h3>Newyork</h3>
                              <ul className="info clearfix">
                                  <li><span>Add&nbsp;&nbsp;:</span>191 Integer Rd, 2nd Street LA 08219 USA.</li>
                                  <li><span>Mob&nbsp;&nbsp;:</span><a href="tel:08963648018">+089 636-48018</a></li>
                                  <li><span>Mail&nbsp;&nbsp;:</span><a href="mailto:supportny@example.com">supportnyexample.com</a></li>
                              </ul>
                              <div className="google-map">
                                  <a href="https://www.google.com/maps/@23.1866368,89.6499712,13z" target="_blank"><i className="light-icon fas fa-angle-right"></i><i className="fas fa-angle-right"></i><span>Google Map</span></a>
                              </div>
                          </div>
                      </div>
                      <div className="single-item">
                          <figure className="image-box"><img src="assets/images/resource/location-3.jpg" alt="" /></figure>
                          <div className="lower-content">
                              <h3>San Fransisco</h3>
                              <ul className="info clearfix">
                                  <li><span>Add&nbsp;&nbsp;:</span>191 Integer Rd, 2nd Street LA 08219 USA.</li>
                                  <li><span>Mob&nbsp;&nbsp;:</span><a href="tel:08963648018">+089 636-48018</a></li>
                                  <li><span>Mail&nbsp;&nbsp;:</span><a href="mailto:supportny@example.com">supportnyexample.com</a></li>
                              </ul>
                              <div className="google-map">
                                  <a href="https://www.google.com/maps/@23.1866368,89.6499712,13z" target="_blank"><i className="light-icon fas fa-angle-right"></i><i className="fas fa-angle-right"></i><span>Google Map</span></a>
                              </div>
                          </div>
                      </div>
                      <div className="single-item">
                          <figure className="image-box"><img src="assets/images/resource/location-4.jpg" alt="" /></figure>
                          <div className="lower-content">
                              <h3>Philadelphia</h3>
                              <ul className="info clearfix">
                                  <li><span>Add&nbsp;&nbsp;:</span>191 Integer Rd, 2nd Street LA 08219 USA.</li>
                                  <li><span>Mob&nbsp;&nbsp;:</span><a href="tel:08963648018">+089 636-48018</a></li>
                                  <li><span>Mail&nbsp;&nbsp;:</span><a href="mailto:supportny@example.com">supportnyexample.com</a></li>
                              </ul>
                              <div className="google-map">
                                  <a href="https://www.google.com/maps/@23.1866368,89.6499712,13z" target="_blank"><i className="light-icon fas fa-angle-right"></i><i className="fas fa-angle-right"></i><span>Google Map</span></a>
                              </div>
                          </div>
                      </div>
                      <div className="single-item">
                          <figure className="image-box"><img src="assets/images/resource/location-2.jpg" alt="" /></figure>
                          <div className="lower-content">
                              <h3>Newyork</h3>
                              <ul className="info clearfix">
                                  <li><span>Add&nbsp;&nbsp;:</span>191 Integer Rd, 2nd Street LA 08219 USA.</li>
                                  <li><span>Mob&nbsp;&nbsp;:</span><a href="tel:08963648018">+089 636-48018</a></li>
                                  <li><span>Mail&nbsp;&nbsp;:</span><a href="mailto:supportny@example.com">supportnyexample.com</a></li>
                              </ul>
                              <div className="google-map">
                                  <a href="https://www.google.com/maps/@23.1866368,89.6499712,13z" target="_blank"><i className="light-icon fas fa-angle-right"></i><i className="fas fa-angle-right"></i><span>Google Map</span></a>
                              </div>
                          </div>
                      </div>
                      <div className="single-item">
                          <figure className="image-box"><img src="assets/images/resource/location-3.jpg" alt="" /></figure>
                          <div className="lower-content">
                              <h3>San Fransisco</h3>
                              <ul className="info clearfix">
                                  <li><span>Add&nbsp;&nbsp;:</span>191 Integer Rd, 2nd Street LA 08219 USA.</li>
                                  <li><span>Mob&nbsp;&nbsp;:</span><a href="tel:08963648018">+089 636-48018</a></li>
                                  <li><span>Mail&nbsp;&nbsp;:</span><a href="mailto:supportny@example.com">supportnyexample.com</a></li>
                              </ul>
                              <div className="google-map">
                                  <a href="https://www.google.com/maps/@23.1866368,89.6499712,13z" target="_blank"><i className="light-icon fas fa-angle-right"></i><i className="fas fa-angle-right"></i><span>Google Map</span></a>
                              </div>
                          </div>
                      </div>
                      <div className="single-item">
                          <figure className="image-box"><img src="assets/images/resource/location-4.jpg" alt="" /></figure>
                          <div className="lower-content">
                              <h3>Philadelphia</h3>
                              <ul className="info clearfix">
                                  <li><span>Add&nbsp;&nbsp;:</span>191 Integer Rd, 2nd Street LA 08219 USA.</li>
                                  <li><span>Mob&nbsp;&nbsp;:</span><a href="tel:08963648018">+089 636-48018</a></li>
                                  <li><span>Mail&nbsp;&nbsp;:</span><a href="mailto:supportny@example.com">supportnyexample.com</a></li>
                              </ul>
                              <div className="google-map">
                                  <a href="https://www.google.com/maps/@23.1866368,89.6499712,13z" target="_blank"><i className="light-icon fas fa-angle-right"></i><i className="fas fa-angle-right"></i><span>Google Map</span></a>
                              </div>
                          </div>
                      </div>
                      <div className="single-item">
                          <figure className="image-box"><img src="assets/images/resource/location-2.jpg" alt="" /></figure>
                          <div className="lower-content">
                              <h3>Newyork</h3>
                              <ul className="info clearfix">
                                  <li><span>Add&nbsp;&nbsp;:</span>191 Integer Rd, 2nd Street LA 08219 USA.</li>
                                  <li><span>Mob&nbsp;&nbsp;:</span><a href="tel:08963648018">+089 636-48018</a></li>
                                  <li><span>Mail&nbsp;&nbsp;:</span><a href="mailto:supportny@example.com">supportnyexample.com</a></li>
                              </ul>
                              <div className="google-map">
                                  <a href="https://www.google.com/maps/@23.1866368,89.6499712,13z" target="_blank"><i className="light-icon fas fa-angle-right"></i><i className="fas fa-angle-right"></i><span>Google Map</span></a>
                              </div>
                          </div>
                      </div>
                      <div className="single-item">
                          <figure className="image-box"><img src="assets/images/resource/location-3.jpg" alt="" /></figure>
                          <div className="lower-content">
                              <h3>San Fransisco</h3>
                              <ul className="info clearfix">
                                  <li><span>Add&nbsp;&nbsp;:</span>191 Integer Rd, 2nd Street LA 08219 USA.</li>
                                  <li><span>Mob&nbsp;&nbsp;:</span><a href="tel:08963648018">+089 636-48018</a></li>
                                  <li><span>Mail&nbsp;&nbsp;:</span><a href="mailto:supportny@example.com">supportnyexample.com</a></li>
                              </ul>
                              <div className="google-map">
                                  <a href="https://www.google.com/maps/@23.1866368,89.6499712,13z" target="_blank"><i className="light-icon fas fa-angle-right"></i><i className="fas fa-angle-right"></i><span>Google Map</span></a>
                              </div>
                          </div>
                      </div>
                      <div className="single-item">
                          <figure className="image-box"><img src="assets/images/resource/location-4.jpg" alt="" /></figure>
                          <div className="lower-content">
                              <h3>Philadelphia</h3>
                              <ul className="info clearfix">
                                  <li><span>Add&nbsp;&nbsp;:</span>191 Integer Rd, 2nd Street LA 08219 USA.</li>
                                  <li><span>Mob&nbsp;&nbsp;:</span><a href="tel:08963648018">+089 636-48018</a></li>
                                  <li><span>Mail&nbsp;&nbsp;:</span><a href="mailto:supportny@example.com">supportnyexample.com</a></li>
                              </ul>
                              <div className="google-map">
                                  <a href="https://www.google.com/maps/@23.1866368,89.6499712,13z" target="_blank"><i className="light-icon fas fa-angle-right"></i><i className="fas fa-angle-right"></i><span>Google Map</span></a>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </section>
          <section className="cta-section centred">
              <div className="outer-container" style={{ backgroundImage: "url(assets/images/background/cta-bg.jpg)" }}>
                  <div className="auto-container">
                      <div className="inner-box">
                          <div className="icon-box"><i className="flaticon-teamwork"></i></div>
                          <h6>Doing Good, Together.</h6>
                          <h2>Get Inspired to The Collaboration</h2>
                          <div className="btn-box">
                              <a href="tel:3125096995" className="phone theme-btn"><i className="flaticon-phone"></i>312-509-6995</a>
                              <a href="index-2.html" className="theme-btn btn-one"><span>Appointment</span></a>
                          </div>
                      </div>
                  </div>
              </div>
          </section> */}
      </div>
  )
}

export default LoginWrapper