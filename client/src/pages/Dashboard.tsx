import React, {useEffect, useRef} from 'react'
import { UserInfoType } from '../API';
import FindFriends from '../components/FindFriends/FindFriends';
import UserList from '../components/UserList/UserList';
import FileUploader from '../components/FileUploader/FileUploader';

type Props = {
  userData: UserInfoType | undefined;
  getData: () => Promise<void>;
  setRoomId: any;
  setLoggedIn: any;
};

const Dashboard: React.FC<Props> = ({ userData, getData, setRoomId, setLoggedIn }) => {
  const gotData = useRef(false);

  useEffect(() => {
    if (!userData || gotData.current) return;

    getData();
    gotData.current = true;
  }, [userData]);

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  const handleClick = () => {
    setLoggedIn(false);
    localStorage.removeItem('user');
  }

  return (
    <>
      <FindFriends
        userData={userData}
        getData={getData}
        setRoomId={setRoomId}
      />
      <UserList userData={userData} />

      <button onClick={handleClick}>Wyloguj się</button>
    </>
  );
};

export default Dashboard;
