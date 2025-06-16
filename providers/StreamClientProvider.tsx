'use client'
import Loader from "@/components/Loader";
import {
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";
import { ReactNode, useEffect, useState } from "react";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const [user, setUser] = useState<{ id: string; name: string; image?: string } | null>(null);

  useEffect(() => {
    // Generate or get user data
    const generateUser = () => {
      // Check if user exists in localStorage
      let storedUser = localStorage.getItem('videoUser');
      let userName = localStorage.getItem('userName');
      
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        // Update name if it was changed
        if (userName && userName !== userData.name) {
          userData.name = userName;
          localStorage.setItem('videoUser', JSON.stringify(userData));
        }
        return userData;
      } else {
        // Generate new user
        const newUser = {
          id: crypto.randomUUID(),
          name: userName || 'Anonymous User',
          image: `https://api.dicebear.com/7.x/initials/svg?seed=${userName || 'Anonymous'}`
        };
        localStorage.setItem('videoUser', JSON.stringify(newUser));
        return newUser;
      }
    };

    const userData = generateUser();
    setUser(userData);

    if (!apiKey) throw new Error('Stream API Key missing');
    
    const client = new StreamVideoClient({
      apiKey,
      user: userData,
      tokenProvider: async () => {
        // For development/demo purposes - using a simple token
        // In production, you should implement proper token generation on your backend
        const response = await fetch('/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: userData.id }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to get token');
        }
        
        const data = await response.json();
        return data.token;
      },
    });
    
    setVideoClient(client);
  }, []);

  if (!videoClient || !user) return <Loader />;

  return (
    <StreamVideo client={videoClient}>
      {children}
    </StreamVideo>
  );
};

export default StreamVideoProvider;