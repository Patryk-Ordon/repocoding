import "./components/common/sass/App.scss";
import "./components/Room/Room.scss";
import { useIsLoggedIn } from "./hooks/useIsLoggedIn";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Dashboard from "./pages/Dashboard";
import Main from "./components/Room/Main";
import Chat from "./components/Chat/Chat";
import VideoCall from "./components/Room/VideoCall";
import { useState } from "react";

function App() {
  const { loggedIn, setLoggedIn, userData, setUserData, loading, getData } =
    useIsLoggedIn();

  const [inCall, setInCall] = useState(true);
  const [roomId, setRoomId] = useState("1");

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home isLoggedIn={loggedIn} />}></Route>

        <Route path="/dashboard/:id" element={<Chat userData={userData} />} />

        <Route
          path="/sign-up"
          element={<Register isLoggedIn={loggedIn} />}
        ></Route>
        <Route
          path="/sign-in"
          element={
            <Login
              isLoggedIn={loggedIn}
              setLoggedIn={setLoggedIn}
              setUserData={setUserData}
            />
          }
        ></Route>
        <Route
          path="/dashboard"
          element={
            <Dashboard
              userData={userData}
              getData={getData}
              setRoomId={setRoomId}
              setLoggedIn={setLoggedIn}
            />
          }
        />
        <Route
          path="/room/:roomId"
          element={
            <VideoCall
              setInCall={setInCall}
              userName={userData?.name}
              roomId={roomId}
              setRoomId={setRoomId}
            />
          }
        />
        <Route path="/test" element={<Main userData={userData} />}></Route>
      </Routes>
    </div>
  );
}

export default App;
