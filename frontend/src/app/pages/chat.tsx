import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { ScrollArea } from "../components/ui/scroll-area";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { sendChatMessage, ChatMessage } from "../lib/api";
import { toast } from "sonner";

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Jambo! I'm your AI Cultural Historian. I can tell you stories, explain traditions, and share knowledge preserved in our cultural archive. Ask me about Swahili folktales, Kenyan traditions, or any cultural heritage from our collection. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await sendChatMessage(userMessage, messages);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      toast.error("Failed to get response", {
        description: "The AI historian is temporarily unavailable. Please try again.",
      });
      console.error("Chat error:", error);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const suggestedQuestions = [
    "Tell me a Swahili folktale",
    "What are traditional Kikuyu ceremonies?",
    "Explain the history of Mount Kenya",
    "What languages are preserved in your archive?",
  ];

  const handleSuggestion = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-4"
      >
        <h1 className="text-4xl font-bold mb-3">AI Cultural Historian</h1>
        <p className="text-muted-foreground">
          Ask questions about preserved stories, traditions, and cultural knowledge
        </p>
      </motion.div>

      {/* Chat Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="flex flex-col" style={{ height: "580px" }}>
          <CardHeader style={{ borderBottom: "1px solid #E0DDD6" }}>
            <CardTitle className="text-base font-semibold">Chat with the Historian</CardTitle>
            <CardDescription className="text-xs">
              Powered by AI, informed by real cultural preservation data
            </CardDescription>
          </CardHeader>

          {/* Messages */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full p-5">
              <div className="space-y-5" ref={scrollRef}>
                <AnimatePresence mode="popLayout">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <Avatar
                        className="flex-shrink-0 w-8 h-8"
                        style={{
                          backgroundColor: message.role === "assistant" ? "#E8E5DF" : "#2D5016",
                          border: "none",
                        }}
                      >
                        <AvatarFallback style={{ backgroundColor: "transparent" }}>
                          {message.role === "assistant" ? (
                            <Bot className="h-4 w-4" style={{ color: "#2D5016" }} />
                          ) : (
                            <User className="h-4 w-4 text-white" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`flex-1 ${message.role === "user" ? "text-right" : "text-left"}`}>
                        <div
                          className="inline-block max-w-[85%] px-4 py-3 rounded-xl"
                          style={{
                            backgroundColor: message.role === "user" ? "#2D5016" : "#EFEFEA",
                            color: message.role === "user" ? "white" : "#1A1A1A",
                          }}
                        >
                          <p className="whitespace-pre-wrap leading-relaxed text-sm">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <Avatar className="flex-shrink-0 w-8 h-8" style={{ backgroundColor: "#E8E5DF", border: "none" }}>
                      <AvatarFallback style={{ backgroundColor: "transparent" }}>
                        <Bot className="h-4 w-4" style={{ color: "#2D5016" }} />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="inline-block px-4 py-3 rounded-xl" style={{ backgroundColor: "#EFEFEA" }}>
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          <span className="text-muted-foreground text-sm">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Input */}
          <CardContent className="p-4" style={{ borderTop: "1px solid #E0DDD6" }}>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about cultural stories, traditions, languages..."
                disabled={loading}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                size="icon"
                style={{ backgroundColor: "#2D5016" }}
              >
                <Send className="h-4 w-4 text-white" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Suggested Questions
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {suggestedQuestions.map((question, index) => (
              <motion.div
                key={question}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.08 }}
              >
                <button
                  className="w-full text-left px-4 py-3 rounded-xl text-sm text-muted-foreground transition-colors hover:text-foreground"
                  style={{ backgroundColor: "#EFEFEA" }}
                  onClick={() => handleSuggestion(question)}
                >
                  {question}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl p-5"
        style={{ backgroundColor: "#EFEFEA" }}
      >
        <h4 className="font-semibold text-sm mb-2">How it works</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          This AI historian is trained on real cultural preservation data from our archive.
          It can answer questions about stories, traditions, languages, and customs that
          have been uploaded and preserved by community members.
        </p>
      </motion.div>
    </div>
  );
}
