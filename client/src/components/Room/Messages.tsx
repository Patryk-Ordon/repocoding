import React from "react";
import { useState, useEffect } from "react";

import { RtmMessage } from "agora-rtm-react";
import Send from "../../resources/icons/send.svg";
import Avatar from "../../resources/avatar.jpg";

import API from "../../API";

function Messages(props: any) {
  const {
    users,
    tracks,
    userName,
    chatPanel,
    roomId,
    rtmClient,
    testChannel,
    uid,
  } = props;

  const [texts, setTexts] = useState<messageStore[]>([]);
  const [textInput, setTextInput] = useState<string>("");

  // const [currName, setCurrName] = useState<string>("");

  // const getUserName = async (uid: any) => {
  //   const userNameTemp = await API.findUserById(uid);
  //   setCurrName(userNameTemp);
  // };

  //messages keep doubling
  useEffect(() => {
    testChannel.on("ChannelMessage", (msg: any, uid: any) => {
      setTexts((previous) => {
        //preventing doubled received messages
        if (previous.length > 0) {
          if (
            previous[previous.length - 1].uid === uid &&
            previous[previous.length - 1].msg === msg
          ) {
            return [...previous];
          } else {
            return [...previous, { msg, uid }];
          }
        } else {
          return [...previous, { msg, uid }];
        }
      });
    });
  }, []);

  const sendMsg = async (e: React.FormEvent<HTMLFormElement>, text: string) => {
    e.preventDefault();

    let message = rtmClient.createMessage({ text, messageType: "TEXT" });
    await testChannel.sendMessage(message);

    setTexts((previous) => {
      return [...previous, { msg: { text }, uid }];
    });

    setTextInput("");
  };

  const getMsg = (msg: any) => {
    if (msg.messageType === "TEXT" || msg.messageType === undefined) {
      return msg.text;
    } else {
      return "Nieobsługiwany typ wiadomości";
    }
  };

  return (
    <div className="Messages">
      {/* MESSAGES CONTAINER */}
      <h2>Wiadomości</h2>
      <section
        id="messages__container"
        className={chatPanel ? "messages__container__hidden" : undefined}
      >
        <div id="messages">
          {texts.map((text: messageStore, i) => (
            <div
              key={i}
              className={
                text.uid === uid
                  ? "author message__wrapper"
                  : "message__wrapper"
              }
            >
              <div className="message__body">
                {/* <p className="message__text">{text.uid}</p> */}
                <p className="message__text">{getMsg(text.msg)}</p>
                {/* TODO GET AVATAR FROM USER */}
                <img className="message__avatar" src={Avatar} alt="avatar" />
              </div>
            </div>
          ))}
        </div>

        <form
          id="message__form"
          onSubmit={(e) => {
            sendMsg(e, textInput);
          }}
        >
          <input
            id="message__input"
            type="text"
            name="message"
            placeholder="Napisz wiadomość..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />

          <button id="message__submit" type="submit">
            <img src={Send} alt="send" />
          </button>
        </form>
      </section>
    </div>
  );
}

export type messageStore = {
  msg: RtmMessage;
  uid: string;
};

export default Messages;
