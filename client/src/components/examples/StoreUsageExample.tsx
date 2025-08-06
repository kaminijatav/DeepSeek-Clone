import { useState } from "react";
import { userAuthStore } from "../../../store/authStore";
import { useChatStore } from "../../../store/chatStore";
import { useUIStore } from "../../../store/uiStore";
import { ThemeToggle } from "../ui/ThemeToggle";

export const StoreUsageExample = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Auth store usage
  const { user, isAuthenticated, login, logout, isLoading: authLoading } = userAuthStore();

  // Chat store usage
  const { chats, createChat, sendMessage, isLoading: chatLoading } = useChatStore();

  // UI store usage
  const { addNotification, setGlobalLoading, theme } = useUIStore();

  const handleLogin = async () => {
    try {
      await login(email, password);
      addNotification({
        type: "success",
        message: "Successfully logged in!",
      });
    } catch (error) {
      addNotification({
        type: "error",
        message: "Login failed. Please try again.",
      });
    }
  };

  const handleCreateChat = async () => {
    try {
      setGlobalLoading(true);
      const newChat = await createChat("New Chat");
      addNotification({
        type: "success",
        message: `Created new chat: ${newChat.title}`,
      });
    } catch (error) {
      addNotification({
        type: "error",
        message: "Failed to create chat.",
      });
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chats.length) {
      addNotification({
        type: "warning",
        message: "Please create a chat first.",
      });
      return;
    }

    try {
      await sendMessage(chats[0]._id, message);
      setMessage("");
      addNotification({
        type: "success",
        message: "Message sent successfully!",
      });
    } catch (error) {
      addNotification({
        type: "error",
        message: "Failed to send message.",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Zustand Store Usage Example</h1>
        <ThemeToggle />
      </div>

      {/* Auth Section */}
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Authentication Store</h2>
        {isAuthenticated ? (
          <div className="space-y-2">
            <p>Welcome, {user?.name}!</p>
            <button
              onClick={logout}
              disabled={authLoading}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            >
              {authLoading ? "Logging out..." : "Logout"}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleLogin}
              disabled={authLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {authLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        )}
      </div>

      {/* Chat Section */}
      {isAuthenticated && (
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Chat Store</h2>
          <div className="space-y-4">
            <button
              onClick={handleCreateChat}
              disabled={chatLoading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              {chatLoading ? "Creating..." : "Create New Chat"}
            </button>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || chatLoading}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
              >
                Send Message
              </button>
            </div>

            <div>
              <h3 className="font-medium mb-2">Chats ({chats.length})</h3>
              <div className="space-y-1">
                {chats.map((chat) => (
                  <div key={chat._id} className="p-2 bg-gray-100 rounded">
                    {chat.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UI Store Demo */}
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">UI Store Demo</h2>
        <div className="space-x-2">
          <button
            onClick={() =>
              addNotification({
                type: "success",
                message: "This is a success notification!",
              })
            }
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Success Notification
          </button>
          <button
            onClick={() =>
              addNotification({
                type: "error",
                message: "This is an error notification!",
              })
            }
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Error Notification
          </button>
          <button
            onClick={() =>
              addNotification({
                type: "warning",
                message: "This is a warning notification!",
              })
            }
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Warning Notification
          </button>
          <button
            onClick={() =>
              addNotification({
                type: "info",
                message: "This is an info notification!",
              })
            }
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Info Notification
          </button>
        </div>
      </div>

      {/* Current Theme Display */}
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Current State</h2>
        <div className="space-y-2 text-sm">
          <p>Theme: {theme}</p>
          <p>Authenticated: {isAuthenticated ? "Yes" : "No"}</p>
          <p>User: {user?.name || "Not logged in"}</p>
          <p>Chats: {chats.length}</p>
        </div>
      </div>
    </div>
  );
};