import React, { useState, useEffect } from 'react'

const App = () => {
  const [resFromAuth, setResFromAuth] = useState(false)
  const [resFromData, setResFromData] = useState(false)
  useEffect(async () => {
    const res = await (await fetch('http://localhost/api/auth/test')).json()
    console.log(res)
  })
  return <h1>Test!</h1>
}

export default App
