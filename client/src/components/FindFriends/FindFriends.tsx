import React, { useEffect, useState } from "react";
import API, { UserInfoType } from "../../API";
import Header from "../Header/Header";
import "./FindFriends.scss";
import Mail from "../../resources/icons/mail.svg";
import Avatar from "../../resources/avatar.jpg";
import FileUploader from "../FileUploader/FileUploader";

type Props = {
  userData: UserInfoType | undefined;
  getData: () => Promise<void>;
  setRoomId: any;
};

const FindFriends: React.FC<Props> = ({ userData, getData, setRoomId }) => {
  const [loading, setLoading] = useState(false);
  const [friendID, setFriendID] = useState("");
  const [info, setInfo] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!friendID) setInfo("Pole nie moze pozostać puste");

    setInfo("");

    if (!userData || !userData.name || !userData.mail) return;

    const data = await API.findUsers(friendID, userData?.name, userData?.mail);

    if (data.ok) {
      setInfo(data.msg);
      getData();
    } else {
      setInfo(data.error);
    }

    console.log(data);
  };

  return (
    <div>
      <Header user={userData?.name} setRoomId={setRoomId} />
      <div className="Dashboard container">
        <div className="UserInfo">
          <div className="User__avatar">
            {/* <img src={userData?.avatar ?? Avatar} alt="avatar" /> */}
            <img id="user_avatar_img" src={`${process.env.REACT_APP_API_URL}/public/files/${userData?.id}.jpg`} alt="avatar" />
          </div>
          <div className="User">
            <div className="User__name">{userData?.name}</div>
            <div className="User__mail">
              <img src={Mail} alt="Mail" />
              {userData?.mail}
            </div>
            <div className="User__id">ID: {userData?.id}</div>
          </div>
        </div>
        <FileUploader uid={userData?.id}/>
        <div className="FindFriends">
          <h2>Znajdź znajomych</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Wpisz ID znajomego:
              <br />
              <input
                type="mail"
                name="text"
                onChange={(e) => setFriendID(e.target.value)}
              />
              <br />
              <input className="submit" type="submit" value="Szukaj" />
              <br />
            </label>
            {info}
          </form>
        </div>
      </div>
    </div>
  );
};

export default FindFriends;
