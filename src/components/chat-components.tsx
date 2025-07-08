import React from "react";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message, formatTimestamp } from "@/lib/chat-utils";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === "user";

  return (
    <div
      className={cn(
        "flex gap-4 max-w-[85%]",
        isUser ? "ml-auto justify-end" : "mr-auto"
      )}
    >
      {!isUser && (
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Bot className="w-5 h-5 text-primary" />
        </div>
      )}

      <div
        className={cn(
          "rounded-2xl px-4 py-3 break-words",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        <div className="prose prose-neutral max-w-none text-base leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, className, children, ...props }) {
                const isBlock = (className || "").includes("language-");
                return isBlock ? (
                  <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto my-4">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                ) : (
                  <code
                    className={
                      (className || "") +
                      " bg-gray-100 text-gray-900 rounded px-1 py-0.5"
                    }
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        <p className="text-xs opacity-70 mt-2">
          {formatTimestamp(message.timestamp)}
        </p>
      </div>

      {isUser && (
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
          <User className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};

export const LoadingIndicator: React.FC = () => (
  <div className="flex gap-4 max-w-[85%] mr-auto">
    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
      <Bot className="w-5 h-5 text-primary" />
    </div>
    <div className="bg-muted rounded-2xl px-4 py-3">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-current rounded-full animate-pulse [animation-delay:0.2s]"></div>
        <div className="w-2 h-2 bg-current rounded-full animate-pulse [animation-delay:0.4s]"></div>
      </div>
    </div>
  </div>
);

export const ChatHeader: React.FC = () => (
  <div className="p-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div>
      <h1 className="text-2xl font-bold">AI Chat</h1>
      <p className="text-muted-foreground">Ask me anything!</p>
    </div>
  </div>
);
