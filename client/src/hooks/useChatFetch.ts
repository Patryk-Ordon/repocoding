import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../API";

type messageData = {
  inviterID: string;
  inviterMail: string;
  inviterName: string;
  messages: singleMessage[]
}

type singleMessage = {
  author: boolean;
  content: string;
  createdAt: string;
}

export const useChatFetch = () => {


  const [messages, setMessages] = useState<messageData>()
  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false);

  const chatId = useParams().id?.toString();


  const rawStoredData = localStorage.getItem('user')
  const userStoredData = rawStoredData ? JSON.parse(rawStoredData) : null;

  const fetchMessages = async() => {

    try {
      setLoading(true)
      if (!chatId)
        return;

      const messages = await API.fetchMessages(userStoredData.id, chatId);
      console.log(messages);
      setMessages(messages);

    } catch (err) {
      return;
    }
  }

  useEffect(() => {
    // setInterval(() => {
      fetchMessages();
      console.log(messages)
    // }, 500)
  }, [])

  return {
    messages,
    loading
  }
}