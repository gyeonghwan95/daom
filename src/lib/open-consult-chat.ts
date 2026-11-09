export type ConsultChatStatus = "idle" | "copied" | "failed";

export function copyConsultText(text: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    return Promise.resolve(false);
  }
  return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
}

export function consultChatButtonLabel(status: ConsultChatStatus, idle: string): string {
  if (status === "copied") return "붙여넣기만 하세요";
  if (status === "failed") return "창에서 한 줄만 적어 주세요";
  return idle;
}

export function consultChatHint(status: ConsultChatStatus): string {
  if (status === "copied") return "첫 문장을 복사했습니다. 열린 창에 붙여 넣어 주세요.";
  if (status === "failed") return "창에서 한 줄만 적어 주세요.";
  return "누르면 열린 창에 붙여 넣을 문장을 복사합니다.";
}
