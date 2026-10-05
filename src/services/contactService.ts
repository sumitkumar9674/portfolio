export type ContactMessagePayload = {
  name: string;
  email: string;
  company: string;
  type: string;
  budget: string;
  timing: string;
  goals: string;
};

export function sendContactMessage(payload: ContactMessagePayload) {
  return fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
