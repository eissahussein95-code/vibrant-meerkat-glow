import { io, Socket } from 'socket.io-client';
import { supabase } from '../lib/supabase';

const REALTIME_SERVER_URL = import.meta.env.VITE_REALTIME_SERVER_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;
  private isConnecting = false;

  async connect() {
    if (this.socket?.connected || this.isConnecting) return;
    
    this.isConnecting = true;

    try {
      // Get current session token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        console.error('No access token available');
        this.isConnecting = false;
        return;
      }

      this.socket = io(REALTIME_SERVER_URL, {
        auth: {
          token: session.access_token
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
      });

      this.socket.on('connect', () => {
        console.log('Connected to real-time server');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from real-time server');
      });

      this.socket.on('error', (error: any) => {
        console.error('Socket error:', error);
      });

    } catch (error) {
      console.error('Socket connection error:', error);
    } finally {
      this.isConnecting = false;
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinWorkspace(workspaceId: number) {
    this.socket?.emit('join_workspace', workspaceId);
  }

  leaveWorkspace(workspaceId: number) {
    this.socket?.emit('leave_workspace', workspaceId);
  }

  sendMessage(data: {
    workspaceId: number;
    message: string;
    attachmentUrl?: string;
    attachmentName?: string;
  }) {
    this.socket?.emit('send_message', data);
  }

  onNewMessage(callback: (message: any) => void) {
    this.socket?.on('new_message', callback);
  }

  offNewMessage(callback: (message: any) => void) {
    this.socket?.off('new_message', callback);
  }

  onNewNotification(callback: (notification: any) => void) {
    this.socket?.on('new_notification', callback);
  }

  offNewNotification(callback: (notification: any) => void) {
    this.socket?.off('new_notification', callback);
  }

  typing(workspaceId: number, isTyping: boolean) {
    this.socket?.emit('typing', { workspaceId, isTyping });
  }

  onUserTyping(callback: (data: { userId: string; isTyping: boolean }) => void) {
    this.socket?.on('user_typing', callback);
  }

  offUserTyping(callback: (data: { userId: string; isTyping: boolean }) => void) {
    this.socket?.off('user_typing', callback);
  }

  markRead(workspaceId: number) {
    this.socket?.emit('mark_read', { workspaceId });
  }
}

export const socketService = new SocketService();
