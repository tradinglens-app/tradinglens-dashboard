'use client';

import { useEffect, useRef, useState } from 'react';

const SSE_URL =
  typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.host}/api/ws/presence`
    : 'http://localhost:3000/api/ws/presence';

export interface OnlineUser {
  user_id: number;
  name: string;
  profile_pic?: string;
}

export interface PresencePayloadOnlineUsers {
  users: OnlineUser[];
  count: number;
}

export interface PresencePayloadUserEvent extends OnlineUser {
  count: number;
}

export type PresenceData =
  | { type: 'online_users'; payload: PresencePayloadOnlineUsers }
  | { type: 'user_joined'; payload: PresencePayloadUserEvent }
  | { type: 'user_left'; payload: PresencePayloadUserEvent }
  | { type: string; payload: { count?: number; [key: string]: any } };

export interface UsePresenceWebSocketReturn {
  data: PresenceData | null;
  isConnected: boolean;
  error: string | null;
}

export function usePresenceWebSocket(): UsePresenceWebSocketReturn {
  const [data, setData] = useState<PresenceData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sseRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  useEffect(() => {
    let isMounted = true;

    function connect() {
      if (!isMounted) return;

      try {
        // EventSource connects via standard HTTP GET, supporting SSE
        const eventSource = new EventSource(SSE_URL);
        sseRef.current = eventSource;

        eventSource.onopen = () => {
          if (!isMounted) return;
          setIsConnected(true);
          setError(null);
        };

        eventSource.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const parsed = JSON.parse(event.data) as PresenceData;

            setData((prev) => {
              if (parsed.type === 'online_users') {
                return {
                  ...parsed,
                  payload: {
                    ...parsed.payload,
                    users: [...parsed.payload.users]
                  }
                } as PresenceData;
              }

              if (!prev || prev.type !== 'online_users') {
                return prev;
              }

              const prevUsers = prev.payload.users || [];

              if (parsed.type === 'user_joined') {
                const newUser = {
                  user_id: parsed.payload.user_id,
                  name: parsed.payload.name,
                  profile_pic: parsed.payload.profile_pic
                };
                const filtered = prevUsers.filter(
                  (u: OnlineUser) => u.user_id !== parsed.payload.user_id
                );
                const newUsers = [newUser, ...filtered];

                return {
                  ...prev,
                  type: 'online_users',
                  payload: {
                    users: newUsers,
                    count: parsed.payload.count
                  }
                } as PresenceData;
              }

              if (parsed.type === 'user_left') {
                const newUsers = prevUsers.filter(
                  (u: OnlineUser) => u.user_id !== parsed.payload.user_id
                );

                return {
                  ...prev,
                  type: 'online_users',
                  payload: {
                    users: newUsers,
                    count: parsed.payload.count
                  }
                } as PresenceData;
              }

              return prev;
            });
          } catch (e) {
            console.error('Failed to parse SSE data', e);
          }
        };

        eventSource.onerror = () => {
          if (!isMounted) return;

          if (eventSource.readyState === EventSource.CLOSED) {
            setError('Connection closed');
            setIsConnected(false);

            // Fallback custom reconnect if the browser doesn't retry
            reconnectTimeoutRef.current = setTimeout(() => {
              if (isMounted) connect();
            }, 5000);
          } else if (eventSource.readyState === EventSource.CONNECTING) {
            setIsConnected(false);
            setError('Reconnecting...');
          } else {
            setError('Connection error');
            setIsConnected(false);
          }
        };
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to connect');
        setIsConnected(false);
      }
    }

    connect();

    return () => {
      isMounted = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (sseRef.current) {
        sseRef.current.close();
        sseRef.current = null;
      }
    };
  }, []);

  return { data, isConnected, error };
}
