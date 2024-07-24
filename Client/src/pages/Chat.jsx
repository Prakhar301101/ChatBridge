import React, { useEffect, useContext, useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Logo from '../components/Logo';
import { UserContext } from '../UserContext';
import Avatar from '../components/Avatar';

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [selectedContact, setSelectedContact] = useState('');
  const [onlinePeople, setOnlinePeople] = useState({});
  const [people, setPeople] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [redirect, setRedirect] = useState(false);  // State for redirection
  const divUnderMessages = useRef();
  const { username, id, setUserName, setId } = useContext(UserContext);

  // Establish socket connection when the component mounts
  useEffect(() => {
    connectToSocket();
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const connectToSocket = () => {
    const socket = new WebSocket('wss://chatbridge-server.onrender.com');
    setWs(socket);
    socket.addEventListener('message', handleMessage);
    socket.addEventListener('close', () => {
      setTimeout(() => {
        console.log('Disconnected, trying to reconnect..');
        connectToSocket();
      }, 1000);
    });
  };

  // Fetch all users to display contacts
  useEffect(() => {
    fetch('https://chatbridge-server.onrender.com/api/users', {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        const allPeople = {};
        data.forEach((el) => {
          allPeople[el._id] = el.name;
        });
        setPeople(allPeople);
      });
  }, []);

  // Fetch messages when a contact is selected
  useEffect(() => {
    if (selectedContact) {
      fetch(`https://chatbridge-server.onrender.com/api/messages/${selectedContact}`, {
        method: 'GET',
        credentials: 'include',
      })
        .then((response) => response.json())
        .then((data) => setMessages(data));
    }
  }, [selectedContact]);

  // Update online users state or messages when receiving a WebSocket message
  const handleMessage = (e) => {
    const messageData = JSON.parse(e.data);
    if (messageData.type === 'connectedClients') {
      const clients = messageData.clients;
      showPeopleOnline(clients);
    } else if ('text' in messageData) {
      setMessages((prv) => [...prv, { ...messageData }]);
    }
  };

  // Logout function
  const logout = () => {
    fetch('https://chatbridge-server.onrender.com/api/users/logout', {
      method: 'POST',
      credentials: 'include',
    })
      .then(() => {
        if(ws) ws.close();
        setWs(null);
        setId(null);
        setUserName(null);
        setRedirect(true);  
      });
  };

  const showPeopleOnline = (data) => {
    const online = {};
    data.forEach(({ userId, userName }) => {
      online[userId] = userName;
    });
    setOnlinePeople(online);
  };

  const selectContact = (userId) => {
    setSelectedContact(userId);
  };

  // Send a message through the WebSocket
  const sendMessage = (ev) => {
    ev.preventDefault();
    ws.send(
      JSON.stringify({
        recipient: selectedContact,
        text: newMessage,
      })
    );
    setNewMessage('');
    setMessages((prv) => [
      ...prv,
      {
        text: newMessage,
        sender: id,
        recipient: selectedContact,
      },
    ]);
  };

  // Scroll the chat to the bottom whenever messages change
  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  // Filter out the current user from the list of online people
  const onlinePeopleExceptMe = { ...people };
  delete onlinePeopleExceptMe[id];

  // Redirect to home page if logged out
  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center ">
      <Header />
      <div className="Chat-area h-auto w-screen md:w-3/4 lg:w flex flex-grow p-2 md:py-5 lg:py-8 md:px-7 lg:px-12 justify-center font-semibold">
        <div className="w-1/4 md:w-1/3 bg-blue-700 rounded-sm flex flex-col">
          <Logo />
          <div className="relative h-full">
            <div className="absolute overflow-y-scroll inset-0">
              {Object.keys(onlinePeopleExceptMe).map((userId) => (
                <div
                  onClick={() => selectContact(userId)}
                  key={userId}
                  className={`flex cursor-pointer items-center gap-[2px] md:gap-2 border-b px-[2px] md:px-2 py-2 text-sm md:text-xl text-blue-200 border-blue-500 shadow-md ${
                    selectedContact === userId ? 'bg-blue-600 shadow-lg' : ''
                  }`}
                >
                  <Avatar online={userId in onlinePeople} username={people[userId]} userId={userId} />
                  <span>{people[userId]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-2 bg-blue-500 text-white flex gap-1 item-center justify-center text-center">
            <span className="p-[2px] sm:p-1 text-xs sm:text-base">{username}</span>
            <button onClick={logout} className="sm:p-1 text-xs sm:text-base bg-blue-600 rounded-md">LogOut</button>
          </div>
        </div>
        <div className="w-3/4 md:w-2/3 flex flex-col bg-blue-300 rounded-sm p-2">
          <div className="flex-grow">
            {!selectedContact && (
              <div className="flex h-full flex-grow items-center justify-center">
                <div className="text-blue-400 text-xl">
                  &larr; Select contact
                </div>
              </div>
            )}
            {!!selectedContact && (
              <div className="relative h-full">
                <div className="absolute overflow-y-scroll inset-0">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.sender === id ? 'justify-end mr-1' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`text-white text-left text-xs md:text-base sm:py-1 py-2 px-1 sm:px-2 rounded-md md:text-md my-1 md:my-2 ${
                          message.sender === id ? 'bg-blue-500' : 'bg-sky-600'
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                  <div ref={divUnderMessages}></div>
                </div>
              </div>
            )}
          </div>
          {!!selectedContact && (
            <form onSubmit={sendMessage} className="flex gap-1 md:gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(ev) => setNewMessage(ev.target.value)}
                placeholder="Type a message"
                className="w-full p-1 md:p-2 rounded-sm"
              ></input>
              <button type="submit" className="text-blue-500">
                <ion-icon name="send" size="large"></ion-icon>
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Chat;
