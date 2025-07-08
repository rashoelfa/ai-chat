import { ENVIRONMENT } from "@/config/environment";
import { API_CONFIG } from "@/lib/chat-utils";
import axios from "axios";
import { useCallback } from "react";
import useSWR from "swr";

export const useModels = () => {
  const fetcher = useCallback(
    (url: string) => axios.get(url).then((res) => res.data),
    []
  );
  return useSWR(
    `${ENVIRONMENT.API.SERVICE.AI.BASE_URL}${API_CONFIG.ENDPOINTS.MODELS}`,
    fetcher
  );
};
