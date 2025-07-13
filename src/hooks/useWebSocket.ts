import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTenant } from '../contexts/TenantContext';

interface WebSocketHook {
  socket: WebSocket | null;
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastMessage: any;
  sendMessage: (message: any) => void;
  connect: () => void;
  disconnect: () => void;
}

export const useWebSocket = (url?: string): WebSocketHook => {
  const { user } = useAuth();
  const { tenantId } = useTenant();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [lastMessage, setLastMessage] = useState<any>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  // Default WebSocket URL (would be configured in environment variables)
  const defaultUrl = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8080/ws';
  const wsUrl = url || defaultUrl;

  const connect = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    if (!user || !tenantId) {
      console.log('WebSocket: Cannot connect - user or tenant not available');
      return;
    }

    try {
      setConnectionStatus('connecting');
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setConnectionStatus('connected');
        setSocket(ws);
        reconnectAttempts.current = 0;

        // Send authentication message
        ws.send(JSON.stringify({
          type: 'auth',
          token: user.email, // In a real app, this would be a JWT token
          tenantId: tenantId,
          role: user.role
        }));
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setLastMessage(message);
          
          // Handle different message types
          switch (message.type) {
            case 'auth_success':
              console.log('WebSocket authentication successful');
              break;
            case 'auth_error':
              console.error('WebSocket authentication failed');
              setConnectionStatus('error');
              break;
            default:
              // Handle other message types
              break;
          }
        } catch (error) {
          console.error('WebSocket message parsing error:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setConnectionStatus('disconnected');
        setSocket(null);

        // Attempt to reconnect if it wasn't a manual disconnect
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          console.log(`WebSocket reconnect attempt ${reconnectAttempts.current}/${maxReconnectAttempts}`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 3000 * reconnectAttempts.current); // Exponential backoff
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('error');
      };

    } catch (error) {
      console.error('WebSocket connection error:', error);
      setConnectionStatus('error');
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (socket) {
      socket.close();
      setSocket(null);
    }
    
    setIsConnected(false);
    setConnectionStatus('disconnected');
    reconnectAttempts.current = maxReconnectAttempts; // Prevent auto-reconnect
  };

  const sendMessage = (message: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected - cannot send message');
    }
  };

  // Auto-connect when user and tenant are available
  useEffect(() => {
    if (user && tenantId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [user, tenantId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socket) {
        socket.close();
      }
    };
  }, []);

  return {
    socket,
    isConnected,
    connectionStatus,
    lastMessage,
    sendMessage,
    connect,
    disconnect
  };
}; 