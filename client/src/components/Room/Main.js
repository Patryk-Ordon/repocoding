import { useState } from "react";
import VideoCall from "./VideoCall";
import "./Lobby.css";

function Main({ userData }) {
  const [inCall, setInCall] = useState(false);
  const [userName, setUserName] = useState();

  const [roomId, setRoomId] = useState("");

  function handleRoomId(e) {
    e.preventDefault();
    setRoomId(e.target.value);
  }

  function handleNameInput(e) {
    e.preventDefault();
    setUserName(e.target.value);
  }

  return (
    <div className="Main">
      {inCall ? (
        <VideoCall
          setInCall={setInCall}
          userName={userData.name}
          roomId={roomId}
          userData={userData}
        />
      ) : (
        <div className="Lobby">
          <main id="room__lobby__container">
            <div id="form__container">
              <div id="form__container__header">
                <p>👋 Create or Join Room</p>
              </div>

              <form id="lobby__form">
                <div className="form__field__wrapper">
                  <label>Your Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Enter your display name..."
                    onChange={handleNameInput}
                  />
                </div>

                <div className="form__field__wrapper">
                  <label>Room Name</label>
                  <input
                    type="text"
                    name="room"
                    required
                    placeholder="Enter room name..."
                    onChange={handleRoomId}
                  />
                </div>

                <button
                  className="form__field__wrapper"
                  onClick={() => setInCall(true)}
                >
                  Join Call
                </button>
              </form>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

export default Main;
