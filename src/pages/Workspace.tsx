import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { workspaceAPI } from '../services/api';
import { socketService } from '../services/socket';

export default function Workspace() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (id) {
      loadWorkspaceData();
      socketService.connect();
      socketService.joinWorkspace(parseInt(id));
      socketService.onNewMessage(handleNewMessage);
    }

    return () => {
      if (id) {
        socketService.leaveWorkspace(parseInt(id));
      }
    };
  }, [id]);

  const loadWorkspaceData = async () => {
    try {
      const [messagesRes, tasksRes] = await Promise.all([
        workspaceAPI.getMessages(parseInt(id!)),
        workspaceAPI.getTasks(parseInt(id!))
      ]);
      setMessages(messagesRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error('Failed to load workspace data', error);
    }
  };

  const handleNewMessage = (message: any) => {
    setMessages(prev => [...prev, message]);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      socketService.sendMessage({
        workspaceId: parseInt(id!),
        message: newMessage
      });
      setNewMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="border-b border-border glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold gradient-text">Workspace</h1>
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Back to Dashboard
            </a>
          </div>
        </div>
      </nav>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <div className="lg:col-span-2 glass-effect rounded-xl p-6 flex flex-col">
          <h3 className="text-xl font-semibold mb-4">Chat</h3>
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((msg: any, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm">
                  {msg.first_name?.[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{msg.first_name} {msg.last_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={sendMessage}
              className="px-6 py-3 gradient-purple text-white rounded-lg hover:opacity-90"
            >
              Send
            </button>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Tasks</h3>
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <p className="text-muted-foreground text-sm">No tasks yet</p>
            ) : (
              tasks.map((task: any) => (
                <div key={task.id} className="border border-border rounded-lg p-3">
                  <div className="font-medium text-sm">{task.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{task.status}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
