import {
  Avatar,
  ChatContainer,
  Conversation,
  ConversationHeader,
  ConversationList,
  ExpansionPanel,
  InfoButton,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  MessageSeparator,
  Search,
  Sidebar,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../context/auth/AuthProvider";
import useWebSocket from "react-use-websocket";

const ChatRoom = () => {
  const [messageInputValue, setMessageInputValue] = useState("");
  const [sideBarUsers, setSideBarUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState<any>({
    name: "No user selected",
  });
  const [userConversation, setUserConversation] = useState<any>([]);
  const [typing, setTyping] = useState<any>();

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
  const [seen, setSeen] = useState<any>();

  useEffect(() => {
    if (lastJsonMessage !== null) {
      console.log(lastJsonMessage);
      //@ts-ignore
      if (lastJsonMessage.type === "MESSAGE") {
        //@ts-ignore
        const payload = lastJsonMessage.payload;
        //@ts-ignore
        setUserConversation((prevConversation) => [
          ...prevConversation,
          {
            uuid: payload.uuid,
            message: { message: payload.message, direction: "incoming" },
          },
        ]);
        //@ts-ignore
      } else if (lastJsonMessage.type === "TYPING") {
        //@ts-ignore
        const uuid = lastJsonMessage.payload.uuid;
        setTyping({ uuid: uuid, typing: true });
        setTimeout(() => {
          setTyping({ uuid: uuid, typing: false });
        }, 5000);
        //@ts-ignore
      }
    }
  }, [lastJsonMessage]);

  //@ts-ignore
  const handleSendMessage = (text) => {
    console.log(text);
    sendMessage(text); // Send message using WebSocket
    //@ts-ignore
    setUserConversation((prevMessages) => [
      ...prevMessages,
      {
        uuid: uuid + "-" + currentUser.uuid,
        message: { message: text, direction: "outgoing" },
      },
    ]);
    setSeen(false);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get("http://localhost:8084/connections");
      if (res.status === 200) {
        console.log(res.data)
        const users = res.data.filter((user: any) => user.role === "USER");
        setSideBarUsers(users);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (lastJsonMessage !== null && lastJsonMessage !== undefined) {
      // Handle the incoming message
      //@ts-ignore
      if (lastJsonMessage.type === "NEW_USER") {
        if (
          sideBarUsers.filter(
            //@ts-ignore
            (user: any) => user.uuid === lastJsonMessage.payload.uuid
          ).length === 0
        ) {
          //@ts-ignore
          setSideBarUsers((prevUsers) => [
            ...prevUsers,
            {
              //@ts-ignore
              name: lastJsonMessage.payload.name,
              //@ts-ignore
              uuid: lastJsonMessage.payload.uuid,
            },
          ]);
        }
        //@ts-ignore
      } else if (lastJsonMessage.type === "SEEN") {
        if (
          userConversation.filter(
            //@ts-ignore
            (conversation) => conversation.message.direction === "outgoing"
          ).length !== 0
        ) {
          setSeen(true);
        }
      }
    }
  }, [lastJsonMessage]);

  return (
    <div
      style={{
        top: "10vh",
        left: "0",
        position: "fixed",
        width: "100vw",
        height: "90%",
      }}
    >
      <MainContainer responsive>
        <Sidebar position="left" scrollable={false}>
          <Search placeholder="Search..." />
          <ConversationList>
            {sideBarUsers.map((user: any) => {
              return (
                <Conversation
                  name={user.name}
                  key={user.uuid}
                  onClick={async () => {
                    setCurrentUser(user);
                    await axios.post(
                      `http://localhost:8084/connections/${user.uuid}/assign-admin`,
                      { adminUuid: uuid }
                    );
                  }}
                >
                  <Avatar
                    name={user.name}
                    src={`https://robohash.org/${user.uuid}`}
                  />
                </Conversation>
              );
            })}
          </ConversationList>
        </Sidebar>

        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Back />
            <Avatar
              name={currentUser.name}
              src={`https://robohash.org/${currentUser.uuid}`}
            />
            <ConversationHeader.Content userName={currentUser.name} />
            <ConversationHeader.Actions>
              <InfoButton />
            </ConversationHeader.Actions>
          </ConversationHeader>
          <MessageList
            typingIndicator={
              typing !== undefined &&
              typing.uuid === currentUser.uuid &&
              typing.typing === true && (
                <TypingIndicator content={`${currentUser.name} is typing`} />
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
            {userConversation.map((conversation: any, index: any) => {
              if (
                conversation.uuid === currentUser.uuid ||
                conversation.uuid === uuid + "-" + currentUser.uuid
              ) {
                return (
                  <Message
                    key={conversation.uuid + "-" + conversation.message.message}
                    model={conversation.message}
                  >
                    {seen &&
                      index === userConversation.length - 1 &&
                      //@ts-ignore
                      conversation.message.direction === "outgoing" && (
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
                );
              }
            })}
          </MessageList>
          <MessageInput
            placeholder="Type message here"
            value={messageInputValue}
            onChange={(val) => setMessageInputValue(val)}
            onSend={() => {
              setMessageInputValue("");
              handleSendMessage(messageInputValue);
            }}
            disabled={currentUser.name === "No user selected"}
            onKeyDown={() => {
              console.log("User is typing...");
              sendMessage(
                JSON.stringify({
                  type: "TYPING",
                })
              );
            }}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default ChatRoom;
