import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import ChatProfileCard from "../components/ChatProfileCard";
import MessageCard from "../components/MessageCard";
import { useDispatch } from "react-redux";
import {
  getChatUsers,
  getMe,
  getNewChatUsers,
} from "../redux/reducers/api/auth";
import InputDropDown from "../components/InputDropDown";
import Loading from "../components/Loading";

const getActiveChatId = (authUserId, data) => {
  return data.chatUsers.filter((cU) => cU.userId === authUserId)[0].chatId;
};

export default function Chats() {
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  const [newChatUsers, setNewChatUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingMessages, setFetchingMessages] = useState(true);
  const [chatUsers, setChatUsers] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeProfileId, setActiveProfileId] = useState(null);
  const [activeProfileData, setActiveProfileData] = useState(null);
  const [me, setMe] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesBottomRef = useRef();

  useEffect(() => {
    let socket = io();
    setSocket(socket);

    return () => socket.close();
  }, [activeChatId]);

  useEffect(() => {
    if (activeChatId && socket) {
      socket.emit("getMessages", { activeChatId });
    }
  }, [socket, activeChatId]);

  useEffect(() => {
    if (socket) {
      socket.on("messages", (messages) => {
        setMessages((prevMessages) => [...prevMessages, ...messages]);
        setFetchingMessages(false);
      });

      socket.on("message", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }
  }, [socket]);

  useEffect(() => {
    const getData = async () => {
      const response1 = await dispatch(getNewChatUsers());
      if (response1 instanceof Array) {
        setNewChatUsers([...response1]);
      }

      const response2 = await dispatch(getChatUsers());

      if (response2 instanceof Array) {
        setChatUsers([...response2]);
      }

      const response3 = await dispatch(getMe());
      if (response3) {
        setMe({ ...response3 });
      }

      setLoading(false);
    };

    getData();
  }, [dispatch]);

  useEffect(() => {
    if (chatUsers instanceof Array && chatUsers.length > 0) {
      if (activeProfileId === null && me) {
        setActiveProfileId(0);
        setActiveChatId(getActiveChatId(me.id, chatUsers[0]));
        setActiveProfileData(chatUsers[0]);
      }
    }
  }, [chatUsers, me]);

  useEffect(() => {
    if (activeProfileId !== null && me) {
      setFetchingMessages(true);
      setMessages([]);
      setActiveChatId(getActiveChatId(me.id, chatUsers[activeProfileId]));
      setActiveProfileData(chatUsers[activeProfileId]);
    }
  }, [activeProfileId, me]);

  useEffect(() => {
    if (messagesBottomRef && messagesBottomRef.current) {
      messagesBottomRef.current.scrollIntoView({ block: "end" });
    }
  }, [messages]);

  const handleChatInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmitMessage = (e) => {
    e.preventDefault();
    socket.emit("newMessage", {
      chatId: activeChatId,
      message,
      senderId: me.id,
      read: false,
    });
    setMessage("");
  };

  const handleChange = () => {};

  console.log(`messages`, messages);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container">
      {/* <h2>No messages yet</h2> */}
      <div>
        {chatUsers && chatUsers.length > 0 && (
          <>
            <div className="chats-top d-flex justify-content-between mt-3">
              <h3>Chats</h3>
              <div>
                <div>
                  <div>
                    <label>Search user to chat with</label>
                    <InputDropDown
                      data={newChatUsers}
                      setData={setNewChatUsers}
                      setChatUsers={setChatUsers}
                      chatUsers={chatUsers}
                      placeholder={"Type username..."}
                    />
                  </div>
                </div>
              </div>
            </div>
            <hr />
          </>
        )}

        <div className="row m-0">
          {chatUsers && chatUsers.length === 0 ? (
            <div className="row">
              <div className="col-md-8 col-lg-5 mx-auto mt-5">
                <h6 className="text-center mt-5 mb-3">No conversations yet!</h6>
                <label>Search user to chat with</label>
                <InputDropDown
                  data={newChatUsers}
                  setData={setNewChatUsers}
                  setChatUsers={setChatUsers}
                  chatUsers={chatUsers}
                  placeholder={"Type username..."}
                />
              </div>
            </div>
          ) : (
            <>
              {" "}
              <div className="col-lg-4">
                <div className="chat-profile-top-left height40px">
                  <div>
                    <InputDropDown
                      data={chatUsers}
                      disable
                      placeholder={"Search user by username..."}
                    />
                  </div>
                </div>
                <div className="chats-profile-wrapper">
                  {chatUsers &&
                    chatUsers.map((info, idx) => (
                      <ChatProfileCard
                        data={info}
                        key={info.id}
                        setActiveProfileId={setActiveProfileId}
                        idx={idx}
                        // setMessages={setMessages}
                      />
                    ))}
                </div>
              </div>
              <div className="col-lg-8 p-0 chat-messages">
                <div className="chat-profile-top-right height40px">
                  <p className="m-0">
                    Chatting with{" "}
                    {activeProfileData && activeProfileData.username}
                  </p>
                </div>
                <div className="p-2 messages-wrapper">
                  {fetchingMessages ? <Loading /> : null}
                  {messages && messages.length > 0 ? (
                    messages &&
                    messages.map((chat) => (
                      <MessageCard
                        key={chat.id}
                        data={chat}
                        me={me}
                        messages={chat}
                      />
                    ))
                  ) : (
                    <p className="text-center mt-5">No messages!</p>
                  )}
                  <div ref={messagesBottomRef} />
                </div>
                <div>
                  <form
                    className="mb-3 row m-0 align-items-center"
                    onSubmit={handleSubmitMessage}
                  >
                    <div className="col-11 p-0">
                      <textarea
                        className="form-control"
                        id="exampleFormControlTextarea1"
                        rows="2"
                        onChange={handleChatInputChange}
                        value={message}
                        required
                        placeholder="Type message here..."
                      ></textarea>
                    </div>
                    <div className="col-1 p-0">
                      <button className="btn bg-orange" type="submit">
                        Send
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
