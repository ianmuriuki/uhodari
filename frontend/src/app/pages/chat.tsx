import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { ScrollArea } from "../components/ui/scroll-area";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Send, Bot, User, Sparkles, Loader2, BookOpen } from "lucide-react";
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Bot className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">AI Cultural Historian</h1>
        <p className="text-muted-foreground text-lg">
          Ask questions about preserved stories, traditions, and cultural knowledge
        </p>
      </motion.div>

      {/* Chat Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Chat with the Historian
            </CardTitle>
            <CardDescription>
              Powered by AI, informed by real cultural preservation data
            </CardDescription>
          </CardHeader>

          {/* Messages */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full p-6">
              <div className="space-y-6" ref={scrollRef}>
                <AnimatePresence mode="popLayout">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className={`flex gap-3 ${
                        message.role === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <Avatar
                        className={`flex-shrink-0 ${
                          message.role === "assistant"
                            ? "bg-primary/10 border-2 border-primary/20"
                            : "bg-secondary/10 border-2 border-secondary/20"
                        }`}
                      >
                        <AvatarFallback>
                          {message.role === "assistant" ? (
                            <Bot className="h-5 w-5 text-primary" />
                          ) : (
                            <User className="h-5 w-5 text-secondary" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`flex-1 ${
                          message.role === "user" ? "text-right" : "text-left"
                        }`}
                      >
                        <div
                          className={`inline-block max-w-[85%] px-4 py-3 rounded-2xl ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          <p className="whitespace-pre-wrap leading-relaxed">
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
                    <Avatar className="flex-shrink-0 bg-primary/10 border-2 border-primary/20">
                      <AvatarFallback>
                        <Bot className="h-5 w-5 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="inline-block px-4 py-3 rounded-2xl bg-muted">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-muted-foreground">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Input */}
          <CardContent className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about cultural stories, traditions, languages..."
                disabled={loading}
                className="flex-1"
              />
              <Button type="submit" disabled={loading || !input.trim()} className="gap-2">
                <Send className="h-4 w-4" />
                Send
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5" />
                Suggested Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {suggestedQuestions.map((question, index) => (
                  <motion.div
                    key={question}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full text-left justify-start h-auto py-3 px-4"
                      onClick={() => handleSuggestion(question)}
                    >
                      <Sparkles className="h-4 w-4 mr-2 flex-shrink-0 text-primary" />
                      <span className="text-sm">{question}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">How it works</h4>
                <p className="text-sm text-muted-foreground">
                  This AI historian is trained on real cultural preservation data from our archive.
                  It can answer questions about stories, traditions, languages, and customs that
                  have been uploaded and preserved by community members.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}