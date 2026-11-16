import type {
  ApiError,
  CreateSession,
  CreatedSession,
  DraftRequest,
  Me,
  OwnerList,
  OwnerSession,
  PrioritiesRequest,
  RespondentView,
  SetupDraft,
  Step,
  TurnRequest,
} from "../shared/api";

export class RequestError extends Error {
  constructor(
    message: string,
    readonly code: ApiError["error"]["code"] | "network" | "unknown",
  ) {
    super(message);
  }
}

async function request<T>(path: string, body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      method: body === undefined ? "GET" : "POST",
      headers: body === undefined ? undefined : { "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new RequestError("We couldn't reach Mise. Check your connection and try again.", "network");
  }
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as ApiError | null;
    throw new RequestError(data?.error?.message ?? "Something went wrong, try again.", data?.error?.code ?? "unknown");
  }
  return (await res.json()) as T;
}

export function errorMessage(err: unknown): string {
  return err instanceof RequestError ? err.message : "Something went wrong, try again.";
}

const s = (token: string, action = "") => `/api/s/${encodeURIComponent(token)}${action && `/${action}`}`;

export const api = {
  me: () => request<Me>("/api/me"),
  logout: () => request<Me>("/api/auth/logout", {}),
  draft: (body: DraftRequest) => request<SetupDraft>("/api/setup/draft", body),
  createSession: (body: CreateSession) => request<CreatedSession>("/api/sessions", body),

  view: (token: string) => request<RespondentView>(s(token)),
  start: (token: string) => request<RespondentView>(s(token, "start"), {}),
  basics: (token: string, basics: Record<string, string | string[]>) =>
    request<RespondentView>(s(token, "basics"), { basics }),
  turn: (token: string, body: TurnRequest) => request<RespondentView>(s(token, "turn"), body),
  steps: (token: string, steps: Step[]) => request<RespondentView>(s(token, "steps"), { steps }),
  priorities: (token: string, priorities: PrioritiesRequest["priorities"]) =>
    request<RespondentView>(s(token, "priorities"), { priorities }),
  confirm: (token: string) => request<RespondentView>(s(token, "confirm"), {}),
  deleteAnswers: (token: string) => request<RespondentView>(s(token, "delete"), {}),

  links: () => request<OwnerList>("/api/links"),
  link: (id: string) => request<OwnerSession>(`/api/links/${encodeURIComponent(id)}`),
  deleteLink: (id: string) => request<{ ok: true }>(`/api/links/${encodeURIComponent(id)}/delete`, {}),
};
