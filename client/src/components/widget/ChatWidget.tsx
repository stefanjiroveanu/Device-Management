import React, { useState, useEffect } from "react";
import {
  ChatContainer,
  MessageList,
  MessageInput,
  ConversationHeader,
  Avatar,
  Message,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { ReactComponent as ChatWidgetSVG } from "../../chat-svgrepo-com.svg";
import { useWs } from "../../context/websocket/WebSocketProvider";
import useWebSocket from "react-use-websocket";
import { useAuth } from "../../context/auth/AuthProvider";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { uuid, token } = useAuth();
  //@ts-ignore
  const {
    sendMessage,
    lastMessage,
    readyState,
    getWebSocket,
    lastJsonMessage,
  } = useWebSocket("ws://localhost:8085/" + uuid + "?token=" + token, {
    retryOnError: true,
    onOpen: () => console.log("Websocket connected to chat message"),
  });

  // State to track messages
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState<any>();
  const [seen, setSeen] = useState<any>();

  useEffect(() => {
    if (lastJsonMessage !== null) {
      //@ts-ignore
      console.log(lastJsonMessage);
      //@ts-ignore
      if (lastJsonMessage.type === "MESSAGE") {
        // Handle the incoming message
        //@ts-ignore
        setMessages((prevMessages) => [
          ...prevMessages,
          //@ts-ignore
          { message: lastJsonMessage.payload.message, direction: "incoming" },
        ]);
      }
      //@ts-ignore
      else if (lastJsonMessage.type === "TYPING") {
        setTyping({ typing: true });
        setTimeout(() => {
          setTyping({ typing: false });
        }, 2000);
        //@ts-ignore
      } else if (lastJsonMessage.type === "SEEN") {
        if (
          //@ts-ignore
          messages.filter((message) => message.direction === "outgoing")
            .length !== 0
        ) {
          setSeen(true);
        }
      }
    }
  }, [lastJsonMessage]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  //@ts-ignore
  const handleSendMessage = (text) => {
    sendMessage(text); // Send message using WebSocket
    // Add message to the local state
    console.log(getWebSocket()?.url);
    //@ts-ignore
    setMessages((prevMessages) => [
      ...prevMessages,
      { message: text, direction: "outgoing" },
    ]);
    setSeen(false);
  };

  return (
    <div>
      {isOpen && (
        <div className="absolute h-96 w-96 bottom-10 right-10 bg-inherit">
          <ChatContainer style={{ backgroundColor: "rgb(30 41 59)" }}>
            <ConversationHeader style={{ height: 50 }}>
              <ConversationHeader.Back onClick={toggleChat} />
              <ConversationHeader.Content
                userName="Admin Chat"
                about="Chat with us"
                style={{ textAlign: "center" }}
              />
            </ConversationHeader>
            <MessageList
              typingIndicator={
                typing !== undefined &&
                typing.typing === true && (
                  <TypingIndicator content={`Admin is typing`} />
                )
              }
              onMouseEnter={() => {
                sendMessage(
                  JSON.stringify({
                    type: "SEEN",
                  })
                );
              }}
            >
              {messages.map((msg, index) => (
                <Message
                  key={index}
                  model={{
                    //@ts-ignore
                    message: msg.message,
                    //@ts-ignore
                    direction: msg.direction,
                    position: "single",
                  }}
                >
                  {seen &&
                    index === messages.length - 1 &&
                    //@ts-ignore
                    msg.direction === "outgoing" && (
                      <Message.Footer
                        style={{
                          fontSize: "12px",
                          color: "grey",
                          textAlign: "right",
                        }}
                      >
                        Seen
                      </Message.Footer>
                    )}
                </Message>
              ))}
            </MessageList>
            <MessageInput
              placeholder="Type message here..."
              onSend={handleSendMessage}
              onKeyDown={() => {
                sendMessage(
                  JSON.stringify({
                    type: "TYPING",
                  })
                );
              }}
            />
          </ChatContainer>
        </div>
      )}
      <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
        {!isOpen && (
          <button onClick={toggleChat} style={{ fontSize: "24px" }}>
            <ChatWidgetSVG className="w-10 h-10" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatWidget;
