import Video from "./Video";
import Messages from "./Messages";
import Header from "../Header/Header";

import { useState } from "react";
import MembersContainer from "./MembersContainer";

function Room(props) {
  const {
    users,
    tracks,
    userName,
    roomId,
    rtmClient,
    testChannel,
    uid,
    client,
  } = props;

  //show and hide members container (left container)
  const [memberContainer, setMemberContainer] = useState(true);
  function handleMemberContainer() {
    setMemberContainer(!memberContainer);
  }

  //show and hide chat panel (right container)
  const [chatPanel, setChatPanel] = useState(true);
  function handleChatPanel() {
    setChatPanel(!chatPanel);
  }

  return (
    <div className="RoomMain">
      <Header></Header>
      <main className="container">
        <div id="room__container">
          <Video tracks={tracks} users={users} />

          <Messages
            tracks={tracks}
            users={users}
            userName={userName}
            chatPanel={chatPanel}
            roomId={roomId}
            rtmClient={rtmClient}
            testChannel={testChannel}
            uid={client.uid}
          />
        </div>
      </main>
    </div>
  );
}

export default Room;
