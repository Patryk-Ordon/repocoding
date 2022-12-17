import React, {useEffect} from 'react'
import { UserInfoType } from '../../API';
import { Link } from "react-router-dom";
import './UserList.scss';
import Avatar from '../../resources/avatar.jpg';

type Props = {
  userData: UserInfoType | undefined;
}

const UserList: React.FC<Props> = ({userData}) => {
  console.log(userData?.friendList);
  return (
    <div className='UserList container'>
      <h3>Lista znajomych</h3>
      <div className='Friends'>
      {
        userData && userData.friendList.length ? 
        userData.friendList.map(el => (
          <Link to={`${el.inviterID}`}>
            <div className="FriendInfo">
              <div className="Friend__avatar">
                {/* <img src={el.avatar ?? Avatar} alt="avatar" /> */}
                <img src={Avatar} alt="avatar" />
              </div>
              <div className="Friend">
                <div className="Friend__name">{el.inviterName}</div>
                <div className="Friend__id">
                  ID: {el.inviterID}
                </div>
              </div>
            </div>
          </Link>
        )) 
        :
        "Brak znajomych"
      }
      </div>
    </div>
  )
}

export default UserList