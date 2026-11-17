import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { Textarea } from "@components/ui/Textarea";
import { TerminalBox } from "@components/widgets/TerminalBox";
import { consoleStore } from "@scripts/consoleStore";
import type { ChangeEvent, SubmitEvent } from "react";
import { useEffect, useRef, useState } from "react";

type FormStatus = "idle" | "opened" | "sending" | "sent" | "error";
type CopyStatus = "idle" | "copied" | "failed";

const MAX_MESSAGE_LENGTH = 1500;

interface UplinkSectionProps {
  /**
   * Formspree endpoint. When set, the form POSTs here and the visitor-facing email stays
   * hidden. Passed from index.astro at build time so this client bundle never imports
   * profile.ts — that is what keeps the email out of the shipped JavaScript.
   */
  formEndpoint?: string;
  /** Fallback address for the mailto path. Only passed when formEndpoint is unset. */
  email?: string;
}

export function UplinkSection({ formEndpoint, email }: UplinkSectionProps) {
  /** True once formEndpoint is set: the form POSTs to Formspree and the email is hidden. */
  const useFormService = Boolean(formEndpoint);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const popupRef = useRef<HTMLDivElement>(null);

  // The popup takes focus when it appears (screen readers announce it immediately via
  // role="alertdialog"). Success confirms itself after 8 seconds; failure stays until the
  // visitor acknowledges it, so a failed send is never silently missed.
  useEffect(() => {
    if (status !== "sent" && status !== "error") return;
    popupRef.current?.focus();
    if (status !== "sent") return;
    const timer = window.setTimeout(() => setStatus("idle"), 8000);
    return () => window.clearTimeout(timer);
  }, [status]);

  const update =
    (field: "name" | "email" | "message") =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      // Reset success notes once the visitor types again, but keep an error visible so the
      // failure notice does not vanish mid-retry.
      if (status === "sent" || status === "opened") setStatus("idle");
    };

  /**
   * Formspree path: POST the message as JSON. Formspree replies 200 on delivery, non-2xx on
   * rejection (spam filter, rate limit) — and network failures throw. Only a confirmed 2xx
   * clears the form and claims delivery; on any failure the visitor's text stays in the
   * fields so nothing is lost.
   */
  const sendViaService = async (endpoint: string) => {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      });
      if (res.ok) {
        setFormData({ name: "", email: "", message: "" });
        consoleStore.append("> TRANSMISSION COMPLETE", "ok");
        setStatus("sent");
      } else {
        consoleStore.append("> TRANSMISSION FAILED", "warn");
        setStatus("error");
      }
    } catch {
      consoleStore.append("> TRANSMISSION FAILED", "warn");
      setStatus("error");
    }
  };

  /**
   * Without a form service this is a static site with no server to send mail: we open the
   * visitor's own email app with the message pre-filled. We never claim the message was
   * "sent" and we never clear the form, so nothing is lost if no email app opens.
   */
  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formEndpoint) {
      if (status === "sending") return;
      setStatus("sending");
      void sendViaService(formEndpoint);
      return;
    }
    const name = formData.name.trim();
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${formData.email.trim()}\n\n${formData.message.trim()}`
    );
    window.location.href = `mailto:${email ?? ""}?subject=${subject}&body=${body}`;
    consoleStore.append("> OPENING MAIL CLIENT...", "info");
    setStatus("opened");
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email ?? "");
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  };

  const dismissTransmission = () => setStatus("idle");

  return (
    <section id="uplink" className="section" aria-labelledby="uplink-heading">
      <h2 id="uplink-heading" className="section-header">
        {"// 03_UPLINK :: ESTABLISH_DIRECT_TRANSMISSION"}
      </h2>

      <TerminalBox title="TRANSMISSION_PROTOCOL // CONTACT_FORM">
        <form onSubmit={handleSubmit}>
          <Input
            id="contact-name"
            label="INPUT_IDENTIFIER [NAME]:"
            name="name"
            type="text"
            autoComplete="name"
            value={formData.name}
            onChange={update("name")}
            required
          />
          <Input
            id="contact-email"
            label="RETURN_UPLINK [EMAIL]:"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={formData.email}
            onChange={update("email")}
            required
          />
          <Textarea
            id="contact-message"
            label="TRANSMISSION_PAYLOAD [MESSAGE]:"
            name="message"
            value={formData.message}
            onChange={update("message")}
            maxLength={MAX_MESSAGE_LENGTH}
            hint={
              useFormService
                ? `Sends directly to Dwight's inbox (max ${MAX_MESSAGE_LENGTH} characters).`
                : `Opens your email app with this message filled in (max ${MAX_MESSAGE_LENGTH} characters).`
            }
            required
          />
          <div className="form-actions">
            <Button type="submit" variant="primary" disabled={status === "sending"}>
              {useFormService ? (
                status === "sending" ? (
                  <>[ {">"} TRANSMITTING... ]</>
                ) : (
                  <>[ {">"} TRANSMIT ]</>
                )
              ) : (
                <>[ {">"} OPEN_MAIL_CLIENT ]</>
              )}
            </Button>
          </div>

          <div className="form-status" role="status">
            {status === "sending" && <p>Transmitting...</p>}
            {status === "opened" && (
              <p>
                Your email app should open with the message filled in. Nothing is sent until you
                press send there. If nothing opened, use the address below.
              </p>
            )}
          </div>
        </form>

        {!useFormService && (
          <div className="direct-contact">
            <span className="direct-contact__label caps">OR_DIRECT:</span>
            <a href={`mailto:${email ?? ""}`}>{email}</a>
            <Button type="button" onClick={copyEmail}>
              [ {">"} COPY_ADDRESS ]
            </Button>
            <span className="direct-contact__result" role="status">
              {copyStatus === "copied" && "Address copied."}
              {copyStatus === "failed" && "Could not copy. Please select the address manually."}
            </span>
          </div>
        )}
      </TerminalBox>

      {(status === "sent" || status === "error") && (
        <div
          ref={popupRef}
          className="transmission-popup"
          role="alertdialog"
          aria-labelledby="transmission-title"
          aria-describedby="transmission-desc"
          tabIndex={-1}
          onKeyDown={(e) => {
            if (e.key === "Escape") dismissTransmission();
          }}
        >
          <div className="transmission-popup__bar" aria-hidden="true">
            <span className="transmission-popup__dot" />
            <span className="transmission-popup__dot" />
            <span className="transmission-popup__dot" />
            <span className="transmission-popup__bar-title">{"SYSTEM // TRANSMISSION_STATUS"}</span>
          </div>
          <div className="transmission-popup__body">
            <p
              id="transmission-title"
              className={`transmission-popup__title${status === "error" ? " transmission-popup__title--fail" : ""}`}
            >
              {status === "sent" ? "[ OK ] TRANSMISSION_COMPLETE" : "[ FAIL ] TRANSMISSION_FAILED"}
            </p>
            <p id="transmission-desc" className="transmission-popup__desc">
              {status === "sent"
                ? "Message delivered. Dwight will reply to the return address you provided."
                : "Transmission failed. Your message is still in the form, so nothing was lost — please try again in a moment."}
            </p>
            <Button type="button" variant="primary" onClick={dismissTransmission}>
              [ {">"} ACKNOWLEDGE ]
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
