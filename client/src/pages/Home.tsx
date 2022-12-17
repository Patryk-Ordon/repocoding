import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

type Props = {
  isLoggedIn: boolean;
}

const Home: React.FC<Props> = ({isLoggedIn}) => {

  const nav = useNavigate();

  useEffect(() => {
    if (!isLoggedIn)
      nav('/sign-in');
  })

  return (
    <div>Strona główna</div>
  )
}

export default Home