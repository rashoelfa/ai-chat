// API Configuration
export const API_CONFIG = {
  ENDPOINTS: {
    MODELS: "/models",
    CHAT: "/chat",
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  PROCESSING_ERROR:
    "Sorry, I encountered an error while processing your message. Please try again.",
  CONNECTION_ERROR:
    "Sorry, I'm having trouble connecting to the server. Please try again later.",
  INVALID_MODEL: "Please select a valid model to continue.",
  EMPTY_MESSAGE: "Please enter a message to send.",
} as const;

// UI Constants
export const UI_CONFIG = {
  MAX_MESSAGE_WIDTH: "85%",
  SCROLL_BEHAVIOR: "smooth",
  ANIMATION_DELAYS: {
    DOT_1: "0s",
    DOT_2: "0.2s",
    DOT_3: "0.4s",
  },
} as const;

// Message Types
export type MessageSender = "user" | "bot";
export type MessageRole = "user" | "assistant";

export interface Message {
  id: string;
  content: string;
  sender: MessageSender;
  timestamp: Date;
  role: MessageRole;
}

// API Types
export interface ChatRequest {
  model: string;
  messages: Array<{ role: MessageRole; content: string }>;
  stream: boolean;
}

export interface ChatResponse {
  response: string;
}

export interface ModelResponse {
  models: Array<{ name: string }>;
}

// Utility Functions
export const generateMessageId = (): string => `${Date.now()}-${Math.random()}`;

export const formatTimestamp = (date: Date): string => {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const isValidMessage = (content: string): boolean => {
  return content.trim().length > 0;
};
