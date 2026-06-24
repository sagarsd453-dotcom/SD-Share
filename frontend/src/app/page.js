'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Share2, Users, ArrowRight, History, Trash2, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import webrtcService from '@/services/webRTC';

import { storageService } from '@/services/storage';

export default function Home() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState('');
  const [recentRooms, setRecentRooms] = useState([]);

  useEffect(() => {
    // Clear any orphaned chunks from previous crashed sessions
    storageService.clearAllData();

    const saved = localStorage.getItem('sd_recent_rooms');
    if (saved) {
      setRecentRooms(JSON.parse(saved));
    }
  }, []);

  const handleCreateRoom = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    router.push(`/room/${code}?mode=sender`);
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (roomCode.trim()) {
      router.push(`/room/${roomCode.toUpperCase()}?mode=receiver`);
    }
  };

  const handleDeleteRoom = (code, mode) => {
    // If it's a creator, tell the server to delete the room
    if (mode === 'sender') {
      webrtcService.connectSocket(process.env.NEXT_PUBLIC_SOCKET_URL);
      webrtcService.socket.emit('delete-room', code);
    }
    
    // Remove from local storage
    const updated = recentRooms.filter(r => r.code !== code);
    setRecentRooms(updated);
    localStorage.setItem('sd_recent_rooms', JSON.stringify(updated));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -z-10 animate-pulse delay-1000" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-5xl flex flex-col items-center text-center mb-12"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
            <Share2 className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            SD-Share
          </h1>
        </div>
        <p className="text-lg text-zinc-400 max-w-2xl mt-4">
          Real-time, peer-to-peer file sharing platform. Transfer files of virtually any size directly. No servers, no storage limits, fully resumable.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl z-10 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full flex flex-col hover:border-indigo-500/50 transition-colors duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-indigo-400" />
                Send Files
              </CardTitle>
              <CardDescription>Create a secure room to share files directly with others.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end mt-8">
              <Button onClick={handleCreateRoom} className="w-full h-12 text-lg group">
                Create Room
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="h-full flex flex-col hover:border-purple-500/50 transition-colors duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Receive Files
              </CardTitle>
              <CardDescription>Join an existing room to receive files.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end mt-8">
              <form onSubmit={handleJoinRoom} className="flex gap-2">
                <Input 
                  placeholder="Enter Room Code" 
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  className="h-12 text-lg uppercase font-mono"
                  maxLength={6}
                />
                <Button type="submit" variant="outline" className="h-12 px-6">
                  Join
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {recentRooms.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="w-full max-w-4xl z-10"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <History className="w-5 h-5 text-zinc-400" />
                Recent Rooms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentRooms.map((room) => (
                  <div key={room.code} className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900/50">
                    <div>
                      <p className="font-mono font-bold text-indigo-400">{room.code}</p>
                      <p className="text-xs text-zinc-500">
                        {room.mode === 'sender' ? 'Created by you' : 'Joined by you'} • {new Date(room.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => router.push(`/room/${room.code}?mode=${room.mode}`)}
                      >
                        <LogIn className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        onClick={() => handleDeleteRoom(room.code, room.mode)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </main>
  );
}
