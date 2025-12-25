"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

export default function ChatInterface() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", content: data.response }]);
    } catch (error) {
      alert("Error sending message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-2xl mx-auto border rounded-xl bg-card shadow-sm">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-muted text-foreground"}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && <Loader2 className="animate-spin mx-auto text-blue-600" />}
      </div>
      <div className="p-4 border-t flex gap-2">
        <input
          className="flex-1 bg-background border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Ask about your course..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}