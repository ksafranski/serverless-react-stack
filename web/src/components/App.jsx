import React, { useState, useEffect } from 'react'
import './App.scss'

const StatusIcon = ({ status, completed }) => {
  return !completed ? (
    <span className='status-icon incomplete'>?</span>
  ) : status ? (
    <span className='status-icon positive'>&#x2714;</span>
  ) : (
    <span className='status-icon negative'>X</span>
  )
}

const App = () => {
  const [resFromAuth, setResFromAuth] = useState(false)
  const [resFromData, setResFromData] = useState(false)
  const [resFromSocket, setResFromSocket] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  useEffect(async () => {
    try {
      const authPing = await (
        await fetch('http://localhost/api/auth/ping')
      ).json()
      setResFromAuth(authPing)
    } catch (e) {
      setResFromAuth(false)
    }
    try {
      const dataPing = await (
        await fetch('http://localhost/api/data/ping')
      ).json()
      setResFromData(dataPing)
    } catch (e) {
      setResFromData(false)
    }
    setIsCompleted(true)

    const socket = new WebSocket('ws://localhost/api/socket')
    socket.addEventListener('open', () => {
      setResFromSocket(true)
    })
  }, [])

  return (
    <div className='app-container'>
      <h2>Hello.</h2>
      <div>
        <StatusIcon status={resFromAuth} completed={isCompleted} /> Response
        from auth function
      </div>
      <div>
        <StatusIcon status={resFromData} completed={isCompleted} /> Response
        from data function
      </div>
      <div>
        <StatusIcon status={resFromSocket} completed={isCompleted} /> Connected
        to socket function
      </div>
    </div>
  )
}

export default App
