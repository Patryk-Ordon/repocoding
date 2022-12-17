import React, {useEffect, useState} from 'react'
import API, { UserInfoType } from '../../API';
import { useChatFetch } from '../../hooks/useChatFetch';
import { useParams } from "react-router-dom";
import Encryption from '../Encryption/Encryption';

import {io} from "socket.io-client"
import Header from '../Header/Header';
import "./Chat.scss";
import Send from "../../resources/icons/send.svg";

type Props = {
  userData: UserInfoType | undefined;
}

const Chat: React.FC<Props> = ({userData}) => {

  const {messages, loading} = useChatFetch();
  const [socket, setSocket] = useState<any>(null);
  const [arrivalMessage, setArrivalMessage] = useState<any>(null);

  const [text, setText] = useState('');

  const chatId = useParams().id?.toString();

  useEffect(() => {
    // socket.current = io("ws://localhost:8900");
    // socket.current.on("getMessage", (data: any) => {
    //   setArrivalMessage({
    //     sender: data.senderId,
    //     text: data.text,
    //     createdAt: Date.now(),
    //   });
    // });
  }, []);

  useEffect(() => {
    // setSocket(io("ws://localhost:8900"))
  }, [])

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    console.log(text);

    if (!text)
      return;

    let d = new Date();
    const message = Encryption.encrypt(text, userData?.id ?? '', chatId ?? '');

    const mesObj = {author: true, content: message, createdAt: d}

    const res = await API.sendMessage(userData?.id, chatId, mesObj)
    setText('');
  }

  return (
    <>
      <Header />
      <div className='PrivChat container'>
          <div className='chatter'>{messages?.inviterName}</div>
          <div className='messages'>
            <div>
              {messages && messages.messages?.length > 0 && messages.messages.map((el) => {
                return (
                <div className={el.author ? 'sent message__body' : 'got message__body'}>
                  <span key={el.createdAt} className='message__text'>{Encryption.decrypt(el.content, userData?.id ?? '', messages.inviterID ?? '')}</span>
                  <img className='message__avatar' src={`${process.env.REACT_APP_API_URL}/public/files/${el.author ? userData?.id ?? '' : messages.inviterID ?? ''}.jpg`} alt="avatar" />
                </div>
                )
                
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit}> 
            <input type="text" name='message' placeholder='Napisz wiadomość...' value={text} onChange={(e) => setText(e.currentTarget.value)}/>
            <button id="message__submit" type="submit">
              <img src={Send} alt="send" />
            </button>
          </form>
      </div>
    </>
  )
}

export default Chat
