import React, { createContext, useContext } from 'react';
import useWebSocket from 'react-use-websocket';
import { useAuth } from '../auth/AuthProvider';

const WebSocketContext = createContext({});

export function useWebSocketContext() {
  return useContext(WebSocketContext);
}

export function WebSocketProvider({ children, url }: { children: React.ReactNode, url : string }) {

  const { uuid } = useAuth();
  const socketUrl = url + uuid;


  const {
    sendMessage,
    lastMessage,
    readyState,
    getWebSocket,
    lastJsonMessage,
  } = useWebSocket(socketUrl, {
    retryOnError: true,
    onOpen: () => console.log("Websocket connected")
  });

  const value = {
    sendMessage,
    lastMessage,
    readyState,
    getWebSocket,
    lastJsonMessage,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export const useWs = () => {
    return useContext(WebSocketContext);
};
