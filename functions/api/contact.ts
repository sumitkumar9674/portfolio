interface Env {
  CF_ACCOUNT_ID: string;
  CF_EMAIL_TOKEN: string;
  CONTACT_TO_EMAIL: string;
  CONTACT_FROM_EMAIL: string;
  RESEND_API_KEY: string;
}

type ContactFunctionContext = {
  request: Request;
  env: Env;
  waitUntil(promise: Promise<unknown>): void;
};

type ContactRequest = {
  name: string;
  email: string;
  company: string;
  type: string;
  budget: string;
  timing: string;
  goals: string;
};

type CloudflareEmailResult = {
  success?: boolean;
  errors?: Array<{ code?: number }>;
};

type EmailPayload = {
  to: string[];
  from: string;
  reply_to: string;
  subject: string;
  text: string;
  html: string;
};

type EmailSendResult =
  | { success: true }
  | {
      success: false;
      status?: number;
      errorCodes?: Array<number | undefined>;
    };

type ResendErrorResult = {
  name?: string;
};

type ResendSendResult =
  | { success: true }
  | {
      success: false;
      status?: number;
      errorName?: string;
    };

const FIELD_LIMITS = {
  name: 100,
  email: 254,
  company: 150,
  type: 100,
  budget: 100,
  timing: 100,
  goals: 5000,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function jsonResponse(body: object, status: number) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

function readField(value: unknown, maximumLength: number, required = false) {
  if (value === undefined || value === null) return required ? null : "";
  if (typeof value !== "string") return null;

  const trimmedValue = value.trim();
  if ((required && !trimmedValue) || trimmedValue.length > maximumLength)
    return null;

  return trimmedValue;
}

function parseContactRequest(value: unknown): ContactRequest | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const body = value as Record<string, unknown>;
  const name = readField(body.name, FIELD_LIMITS.name, true);
  const email = readField(body.email, FIELD_LIMITS.email, true);
  const company = readField(body.company, FIELD_LIMITS.company);
  const type = readField(body.type, FIELD_LIMITS.type);
  const budget = readField(body.budget, FIELD_LIMITS.budget);
  const timing = readField(body.timing, FIELD_LIMITS.timing);
  const goals = readField(body.goals, FIELD_LIMITS.goals, true);

  if (
    name === null ||
    email === null ||
    company === null ||
    type === null ||
    budget === null ||
    timing === null ||
    goals === null ||
    !EMAIL_PATTERN.test(email)
  ) {
    return null;
  }

  return { name, email, company, type, budget, timing, goals };
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

function displayValue(value: string) {
  return value || "Not provided";
}

function buildNotificationContent(contact: ContactRequest) {
  const fields = [
    ["Name", contact.name],
    ["Email", contact.email],
    ["Company", displayValue(contact.company)],
    ["Project type", displayValue(contact.type)],
    ["Budget", displayValue(contact.budget)],
    ["Timing", displayValue(contact.timing)],
    ["Message / Goals", contact.goals],
  ];

  const text = fields
    .map(([label, value]) => `${label}:\n${value}`)
    .join("\n\n");
  const html = `
    <h1>New portfolio enquiry</h1>
    ${fields
      .map(
        ([label, value]) => `
      <section style="margin-bottom: 16px;">
        <strong>${escapeHtml(label)}</strong>
        <div style="white-space: pre-wrap;">${escapeHtml(value)}</div>
      </section>
    `,
      )
      .join("")}
  `;

  return { text, html };
}

function buildAcknowledgementContent(contact: ContactRequest) {
  const name = contact.name.replace(/\s+/g, " ");
  const text = `Hi ${name},

Thanks for reaching out through sfysumit.app.

Your message made it through successfully. I've received your enquiry and I'll get back to you as soon as I can.

If you'd like to add anything else, you can reply directly to this email.

— Sumit
sfysumit.app`;
  const html = `
    <p>Hi ${escapeHtml(name)},</p>
    <p>Thanks for reaching out through sfysumit.app.</p>
    <p>Your message made it through successfully. I've received your enquiry and I'll get back to you as soon as I can.</p>
    <p>If you'd like to add anything else, you can reply directly to this email.</p>
    <p>— Sumit<br />sfysumit.app</p>
  `;

  return { text, html };
}

function hasEmailConfiguration(env: Env) {
  return Boolean(
    env.CF_ACCOUNT_ID &&
    env.CF_EMAIL_TOKEN &&
    env.CONTACT_TO_EMAIL &&
    env.CONTACT_FROM_EMAIL,
  );
}

async function sendEmail(env: Env, payload: EmailPayload): Promise<EmailSendResult> {
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/email/sending/send`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.CF_EMAIL_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    let result: CloudflareEmailResult | null = null;
    try {
      result = (await response.json()) as CloudflareEmailResult;
    } catch {
      // A missing or malformed result is treated as a rejected send below.
    }

    if (!response.ok || result?.success !== true) {
      return {
        success: false,
        status: response.status,
        errorCodes: result?.errors?.map((error) => error.code),
      };
    }

    return { success: true };
  } catch {
    return { success: false };
  }
}

async function sendResendEmail(
  env: Env,
  payload: EmailPayload,
): Promise<ResendSendResult> {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let result: ResendErrorResult | null = null;
      try {
        result = (await response.json()) as ResendErrorResult;
      } catch {
        // The HTTP status is sufficient when Resend does not return JSON.
      }

      return {
        success: false,
        status: response.status,
        errorName: result?.name,
      };
    }

    return { success: true };
  } catch {
    return { success: false };
  }
}

function logEmailFailure(message: string, result: EmailSendResult) {
  if (result.success) return;

  console.error(message, {
    status: result.status,
    errorCodes: result.errorCodes,
  });
}

async function sendVisitorAcknowledgement(env: Env, contact: ContactRequest) {
  if (!env.RESEND_API_KEY) {
    console.error(
      "Visitor acknowledgement email skipped: RESEND_API_KEY is missing.",
    );
    return;
  }

  const { text, html } = buildAcknowledgementContent(contact);
  const result = await sendResendEmail(env, {
    to: [contact.email],
    from: `Sumit Kumar <${env.CONTACT_FROM_EMAIL}>`,
    reply_to: env.CONTACT_FROM_EMAIL,
    subject: "Message received — sfysumit.app",
    text,
    html,
  });

  if (!result.success) {
    console.error("Visitor acknowledgement email failed.", {
      status: result.status,
      errorName: result.errorName,
    });
  }
}

export async function onRequestPost(
  context: ContactFunctionContext,
): Promise<Response> {
  try {
    let requestBody: unknown;

    try {
      requestBody = await context.request.json();
    } catch {
      return jsonResponse(
        { success: false, message: "Invalid contact request." },
        400,
      );
    }

    const contact = parseContactRequest(requestBody);
    if (!contact) {
      return jsonResponse(
        { success: false, message: "Invalid contact request." },
        400,
      );
    }

    if (!hasEmailConfiguration(context.env)) {
      throw new Error("Contact email environment is incomplete.");
    }

    const { text, html } = buildNotificationContent(contact);
    const notificationResult = await sendEmail(context.env, {
      to: [context.env.CONTACT_TO_EMAIL],
      from: context.env.CONTACT_FROM_EMAIL,
      reply_to: contact.email,
      subject: `Portfolio enquiry from ${contact.name.replace(/\s+/g, " ")}`,
      text,
      html,
    });

    if (!notificationResult.success) {
      logEmailFailure("Main contact notification email failed.", notificationResult);
      return jsonResponse(
        { success: false, message: "Message could not be sent." },
        502,
      );
    }

    try {
      context.waitUntil(
        sendVisitorAcknowledgement(context.env, contact).catch(() => {
          console.error("Visitor acknowledgement email failed unexpectedly.");
        }),
      );
    } catch {
      console.error("Visitor acknowledgement email could not be scheduled.");
    }

    return jsonResponse({ success: true, message: "Message sent." }, 200);
  } catch {
    console.error("Contact request failed unexpectedly.");
    return jsonResponse(
      { success: false, message: "Something went wrong." },
      500,
    );
  }
}
