import { useState, useCallback, useRef } from "react";
import axios from "axios";
import {
  API_CONFIG,
  ERROR_MESSAGES,
  generateMessageId,
  type Message,
  type ChatRequest,
} from "@/lib/chat-utils";
import { ENVIRONMENT } from "@/config/environment";

export type { Message } from "@/lib/chat-utils";

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesRef = useRef<Message[]>([]);

  const updateMessages = useCallback((newMessages: Message[]) => {
    messagesRef.current = newMessages;
    setMessages(newMessages);
  }, []);

  const createMessage = useCallback(
    (content: string, sender: "user" | "bot"): Message => ({
      id: generateMessageId(),
      content,
      sender,
      timestamp: new Date(),
      role: sender === "user" ? "user" : "assistant",
    }),
    []
  );

  const sendMessage = useCallback(
    async (content: string, selectedModel: string) => {
      const userMessage = createMessage(content, "user");

      const newMessages = [...messagesRef.current, userMessage];
      updateMessages(newMessages);
      setIsLoading(true);

      try {
        const apiMessages = newMessages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        const requestData: ChatRequest = {
          model: selectedModel,
          messages: apiMessages,
          stream: false,
        };

        const response = await axios.post(
          `${ENVIRONMENT.API.SERVICE.AI.BASE_URL}${API_CONFIG.ENDPOINTS.CHAT}`,
          requestData
        );

        let botMessage: Message;
        if (response.status === 200) {
          botMessage = createMessage(response.data.response, "bot");
        } else {
          botMessage = createMessage(ERROR_MESSAGES.PROCESSING_ERROR, "bot");
        }

        const finalMessages = [...messagesRef.current, botMessage];
        updateMessages(finalMessages);
      } catch (error) {
        console.error("Error sending message:", error);
        const errorMessage = createMessage(
          ERROR_MESSAGES.CONNECTION_ERROR,
          "bot"
        );
        const finalMessages = [...messagesRef.current, errorMessage];
        updateMessages(finalMessages);
      } finally {
        setIsLoading(false);
      }
    },
    [createMessage, updateMessages]
  );

  const clearMessages = useCallback(() => {
    updateMessages([]);
  }, [updateMessages]);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
};
