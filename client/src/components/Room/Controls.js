import { useState } from "react";
import { useClient } from "./settings";
import styled from "styled-components";
import Microphone from "../../resources/icons/microphone.svg";
import Camera from "../../resources/icons/camera.svg";
import Leave from "../../resources/icons/sign-out.svg";
import Screen from "../../resources/icons/screen.svg";

import ScreenShare from "./ScreenShare";

export default function Controls(props) {
  const client = useClient();
  const { tracks: videoTrack, setStart, setInCall, users } = props;
  const [trackState, setTrackState] = useState({ video: false, audio: false });

  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [ifScreenShared, setIfScreenShared] = useState(false);

  const mute = async (type) => {
    if (type === "audio") {
      await videoTrack[0].setMuted(!trackState.audio);
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
    } else if (type === "video") {
      await videoTrack[1].setMuted(!trackState.video);
      setTrackState((ps) => {
        return { ...ps, video: !ps.video };
      });
    }
  };

  const leaveChannel = async () => {
    await client.leave();
    client.removeAllListeners();
    videoTrack[0].close();
    videoTrack[1].close();
    setStart(false);
    setInCall(false);
    window.location.href = "/dashboard";
  };

  const StreamActions = styled.div`
    position: fixed;
    bottom: 1rem;
    border-radius: 8px;
    padding-bottom: 1rem;
    left: 50%;
    gap: 1rem;
    transform: translateX(-50%);
    display: flex;
    height: fit-content;
  `;

  const ActionBtn = styled.button`
    cursor: pointer;
    color: #fff;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    margin-top: 0;
    transition: all 0.2s ease-in-out;
    filter: invert(1);
    &:hover {
      filter: invert(1) sepia(1) saturate(3) hue-rotate(100deg);
    }
  `;

  const LeaveBtn = styled.button`
    cursor: pointer;
    color: #fff;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    margin-top: 0;
    transition: all 0.2s ease-in-out;
    &:hover {
      filter: invert(1);
    }
  `;

  return (
    <div className="Controls">
      <StreamActions>
        <div>
          <ActionBtn
            style={{
              opacity: trackState.audio ? 0.5 : 1,
            }}
            onClick={() => mute("audio")}
          >
            <img className="microphone-btn" src={Microphone} alt="Microphone" />
          </ActionBtn>
        </div>
        <div>
          <ActionBtn
            style={{
              opacity: trackState.video ? 0.5 : 1,
            }}
            onClick={() => mute("video")}
          >
            <img className="camera-btn" src={Camera} alt="Camera" />
          </ActionBtn>
        </div>
        <div>
          {/* share screen */}
          <ActionBtn
            onClick={() => {
              setIsScreenSharing(!isScreenSharing);
              setIfScreenShared(true);
            }}
            style={{
              opacity: isScreenSharing ? 0.5 : 1,
            }}
          >
            <img className="screen-btn" src={Screen} alt="Screen" />
            <ScreenShare
              isScreenSharing={isScreenSharing}
              tracks={videoTrack}
              users={users}
              ifScreenShared={ifScreenShared}
              setIfScreenShared={setIfScreenShared}
            />
          </ActionBtn>
        </div>
        <div>
          <LeaveBtn onClick={() => leaveChannel()}>
            <img className="leave-btn" src={Leave} alt="Leave" />
          </LeaveBtn>
        </div>
      </StreamActions>
    </div>
  );
}
