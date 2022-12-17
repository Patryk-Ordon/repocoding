import React, { useEffect, useState } from 'react'

import { Link, useNavigate } from 'react-router-dom';
import API, { UserInfoType } from '../../API';
import '../../components/common/sass/auth.scss';
import logo from '../../resources/logo.png';

type Props = {
  isLoggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUserData: React.Dispatch<React.SetStateAction<UserInfoType | undefined>>;
}

const Login: React.FC<Props> = ({isLoggedIn, setLoggedIn, setUserData}) => {
  const [password, setPassword] = useState("");
  const [mail, setMail] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if ( !mail || !password ) {
      setInfo("Uzupełnij dane");
      setLoading(false);
      return;
    }

    setInfo("");

    const data = await API.signInFetch(mail, password);

    console.log(data);

    if (data.ok) {
      setLoading(false)
      setInfo("Zalogowano!");
      setLoggedIn(true);
      setUserData(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } else {
      setInfo(data.error);
      setLoggedIn(false);
      setLoading(false)
    }

  };

  useEffect(() => {
    if (isLoggedIn)
      navigate('/')
  }, [])

  return (
    <div className='container'>
      <div className='login'>
        <img src={logo} alt="logo" className='logo' />
        <form method="POST" onSubmit={handleSubmit}>
        <span className='welcome'>Witaj! Z tej strony <i>Mesafe</i> - jestem bezpiecznym kominukatorem stosującym szyfrowanie E2E. Zaloguj się, abyśmy mogli rozmawiać dalej</span>
          <p>
            <input
              onChange={(e) => setMail(e.target.value)}
              value={mail}
              type="email"
              name="mail"
              placeholder="E-mail"
              required
              autoComplete='off'
            />
          </p>  
      
          <p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              name="subject"
              placeholder="Hasło"
              required
              autoComplete='new-password'
            />
          </p>
          <p className='reg'>Nie masz konta?<Link to="/sign-up"><i>&nbsp;Zarejestruj się!</i></Link></p>
          <p>
            <input type="submit" className='submit' value="Zaloguj!" />
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login