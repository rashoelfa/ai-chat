"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/text-area";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ModelSelect } from "./model-select";
import { MessageBubble, LoadingIndicator, ChatHeader } from "./chat-components";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import useSWR from "swr";
import { useChat, type Message } from "@/hooks/api/use-chat";
import { API_CONFIG, isValidMessage } from "@/lib/chat-utils";
import { useModels } from "@/hooks/api/use-models";

interface ChatInterfaceProps {
  className?: string;
}

const useAutoScroll = (messages: Message[]) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return scrollAreaRef;
};

export function ChatInterface({ className }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [alertDialogShow, setAlertDialogShow] = useState(false);
  const [pendingModel, setPendingModel] = useState<string>("");
  const [previousModel, setPreviousModel] = useState<string>("");

  const { messages, isLoading, sendMessage, clearMessages } = useChat();
  const { data, error, isLoading: isLoadingModels } = useModels();
  const scrollAreaRef = useAutoScroll(messages);

  const models = useMemo(
    () => data?.models?.map((m: { name: string }) => m.name) || [],
    [data]
  );

  useEffect(() => {
    if (models.length > 0 && !selectedModel) {
      setSelectedModel(models[0]);
      setPreviousModel(models[0]);
    }
  }, [models, selectedModel]);

  const handleModelChange = useCallback(
    (newModel: string) => {
      if (messages.length > 0 && newModel !== selectedModel) {
        setPendingModel(newModel);
        setAlertDialogShow(true);
      } else {
        setPreviousModel(selectedModel);
        setSelectedModel(newModel);
      }
    },
    [messages.length, selectedModel]
  );

  const handleConfirmModelChange = useCallback(() => {
    clearMessages();
    setPreviousModel(selectedModel);
    setSelectedModel(pendingModel);
    setAlertDialogShow(false);
    setPendingModel("");
  }, [clearMessages, selectedModel, pendingModel]);

  const handleCancelModelChange = useCallback(() => {
    setAlertDialogShow(false);
    setPendingModel("");
  }, []);

  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!isValidMessage(inputValue) || isLoading) return;

      await sendMessage(inputValue, selectedModel);
      setInputValue("");
    },
    [inputValue, isLoading, sendMessage, selectedModel]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage(e);
      }
    },
    [handleSendMessage]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInputValue(e.target.value);
    },
    []
  );

  const isFormDisabled = !isValidMessage(inputValue) || isLoading;

  return (
    <div className={cn("flex flex-col h-screen", className)}>
      <ChatHeader />

      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-6 min-h-0">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isLoading && <LoadingIndicator />}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-6 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky bottom-0 z-10">
        <div className="max-w-4xl mx-auto">
          <p className="text-muted-foreground text-xs ml-1">Selected Model</p>
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <ModelSelect
              models={models}
              value={selectedModel}
              onChange={handleModelChange}
              isLoading={isLoadingModels}
            />
            <TextArea
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 text-base py-3 px-4 min-h-[36px]"
            />
            <Button
              type="submit"
              size="sm"
              disabled={isFormDisabled}
              className="shrink-0 px-6"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* Alert Dialog for Model Change */}
      <AlertDialog open={alertDialogShow} onOpenChange={setAlertDialogShow}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create New Chat</AlertDialogTitle>
            <AlertDialogDescription>
              Select a new model will create a new chat. All previous messages
              will be cleared. Do you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelModelChange}>
              No
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmModelChange}>
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
