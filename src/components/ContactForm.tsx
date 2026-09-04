"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type RefObject,
} from "react";
import { site } from "@/content/site";
import { Cta } from "./Cta";

type FieldName = "name" | "company" | "email" | "message";
type Values = Record<FieldName, string>;
type Errors = Partial<Record<FieldName, string>>;
type Touched = Partial<Record<FieldName, boolean>>;
type Status = "idle" | "sending" | "error" | "success";
type FieldNode = HTMLInputElement | HTMLTextAreaElement | null;

/** Solo questi tre sono obbligatori: l'azienda si può omettere. */
const REQUIRED_FIELDS: FieldName[] = ["name", "email", "message"];
const FIELD_ORDER: FieldName[] = ["name", "company", "email", "message"];

const EMPTY_VALUES: Values = { name: "", company: "", email: "", message: "" };

/** Controllo volutamente permissivo: la validazione vera la fa il server di posta. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const form = site.contact.form;

function validateField(field: FieldName, value: string): string | undefined {
  const trimmed = value.trim();
  if (REQUIRED_FIELDS.includes(field) && trimmed === "") return form.required;
  if (field === "email" && trimmed !== "" && !EMAIL_RE.test(trimmed)) {
    return form.invalidEmail;
  }
  return undefined;
}

/**
 * Form di contatto (§6.5, §7.4, §7.5, §9.5).
 *
 * Due comportamenti, decisi dal contenuto e non dal codice:
 * - `site.contact.formspreeEndpoint` valorizzato → POST JSON all'endpoint;
 * - endpoint vuoto (caso attuale) → nessuna chiamata di rete: si apre il
 *   client di posta con oggetto e corpo già scritti e si mostra comunque lo
 *   stato di successo, perché da lì in poi il messaggio è in mano all'utente.
 *
 * Validazione solo al submit e poi onBlur sui campi già toccati: mai durante
 * la digitazione.
 */
export function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY_VALUES);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [status, setStatus] = useState<Status>("idle");
  const [showSummary, setShowSummary] = useState(false);

  // Honeypot: se è pieno, ha scritto un bot.
  const honeypot = useRef("");
  const fields = useRef<Partial<Record<FieldName, FieldNode>>>({});

  const sending = status === "sending";

  function handleChange(field: FieldName, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleBlur(field: FieldName, value: string) {
    // Mai validazione live: finché il campo non è stato "toccato" da un submit
    // fallito, uscire dal campo non produce nessun errore.
    if (!touched[field]) return;
    setErrors((current) => ({
      ...current,
      [field]: validateField(field, value),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;

    const nextErrors: Errors = {};
    for (const field of FIELD_ORDER) {
      const message = validateField(field, values[field]);
      if (message) nextErrors[field] = message;
    }

    setTouched({ name: true, company: true, email: true, message: true });
    setErrors(nextErrors);

    const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
    if (firstInvalid) {
      setShowSummary(true);
      fields.current[firstInvalid]?.focus();
      return;
    }

    setShowSummary(false);

    // Bot: si finge l'invio riuscito e non parte nulla.
    if (honeypot.current.trim() !== "") {
      setStatus("success");
      return;
    }

    setStatus("sending");

    const endpoint = site.contact.formspreeEndpoint;

    if (endpoint === "") {
      // Nessun backend: si apre il client di posta con tutto già compilato.
      const body = [
        `${form.name.label}: ${values.name}`,
        `${form.company.label}: ${values.company}`,
        `${form.email.label}: ${values.email}`,
        "",
        values.message,
      ].join("\n");

      window.location.href =
        `mailto:${site.contactDetails.email}` +
        `?subject=${encodeURIComponent(site.contact.mailtoSubject)}` +
        `&body=${encodeURIComponent(body)}`;

      setStatus("success");
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error(String(response.status));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  // Il form viene sostituito in-place: la pagina si accorcia, e va bene.
  if (status === "success") {
    return (
      <div role="status" aria-live="polite">
        <div aria-hidden="true" className="h-px w-full bg-hairline" />
        <h3 className="t-h3 mt-5">{site.contact.successTitle}</h3>
        <p className="t-body mt-3 text-gray-1">{form.success}</p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      {/* Riepilogo degli errori sopra il form, annunciato ma non invadente. */}
      <p aria-live="polite" className="t-small text-error">
        {showSummary ? form.errorSummary : ""}
      </p>

      <div className="space-y-6 lg:space-y-7">
        <Field
          name="name"
          label={form.name.label}
          autoComplete="name"
          value={values.name}
          error={errors.name}
          sending={sending}
          onChange={handleChange}
          onBlur={handleBlur}
          register={fields}
        />
        <Field
          name="company"
          label={form.company.label}
          autoComplete="organization"
          value={values.company}
          error={errors.company}
          sending={sending}
          onChange={handleChange}
          onBlur={handleBlur}
          register={fields}
        />
        <Field
          name="email"
          label={form.email.label}
          type="email"
          autoComplete="email"
          value={values.email}
          error={errors.email}
          sending={sending}
          onChange={handleChange}
          onBlur={handleBlur}
          register={fields}
        />
        <Field
          name="message"
          label={form.message.label}
          placeholder={form.message.placeholder}
          multiline
          value={values.message}
          error={errors.message}
          sending={sending}
          onChange={handleChange}
          onBlur={handleBlur}
          register={fields}
        />
      </div>

      {/* Honeypot: fuori dallo schermo, fuori dal tab order, invisibile agli
          screen reader. Chi lo compila non è una persona. */}
      <div aria-hidden="true" className="honeypot">
        <input
          type="text"
          name="azienda-riferimento"
          tabIndex={-1}
          autoComplete="off"
          onChange={(event) => {
            honeypot.current = event.target.value;
          }}
        />
      </div>

      {status === "error" ? (
        <p role="alert" className="t-small mt-8 text-error">
          {form.error}{" "}
          <a href={`mailto:${site.contactDetails.email}`}>
            {site.contactDetails.email}
          </a>
        </p>
      ) : null}

      <div className="mt-8">
        <Cta type="submit" disabled={sending}>
          {sending ? form.sending : form.submit}
        </Cta>
      </div>

      <p className="t-small mt-5 text-gray-1">{site.contact.privacyNote}</p>
    </form>
  );
}

type FieldProps = {
  name: FieldName;
  label: string;
  value: string;
  error?: string;
  /** In invio i campi diventano readonly, non disabled: il contrasto resta. */
  sending: boolean;
  type?: "text" | "email";
  placeholder?: string;
  autoComplete?: string;
  multiline?: boolean;
  onChange: (field: FieldName, value: string) => void;
  onBlur: (field: FieldName, value: string) => void;
  register: RefObject<Partial<Record<FieldName, FieldNode>>>;
};

/**
 * Campo underline-only: label sempre visibile sopra il campo, mai un
 * placeholder al posto della label, mai un floating label (§6.5).
 */
function Field({
  name,
  label,
  value,
  error,
  sending,
  type = "text",
  placeholder,
  autoComplete,
  multiline = false,
  onChange,
  onBlur,
  register,
}: FieldProps) {
  const id = `campo-${name}`;
  const errorId = `${id}-errore`;
  const required = REQUIRED_FIELDS.includes(name);

  const shared = {
    id,
    name,
    value,
    placeholder,
    autoComplete,
    required,
    readOnly: sending,
    className: "field-input",
    "aria-invalid": error !== undefined,
    "aria-describedby": error !== undefined ? errorId : undefined,
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(name, event.target.value),
    onBlur: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onBlur(name, event.target.value),
  };

  return (
    <div>
      <label className="t-eyebrow block text-gray-1" htmlFor={id}>
        {label}
        {required ? (
          <span className="t-small normal-case text-gray-2">
            {" "}
            {form.requiredHint}
          </span>
        ) : null}
      </label>

      <div className="mt-2">
        {multiline ? (
          <textarea
            {...shared}
            rows={4}
            ref={(node) => {
              register.current[name] = node;
            }}
          />
        ) : (
          <input
            {...shared}
            type={type}
            inputMode={type === "email" ? "email" : undefined}
            ref={(node) => {
              register.current[name] = node;
            }}
          />
        )}
      </div>

      {error ? (
        <p role="alert" id={errorId} className="t-small mt-2 text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
