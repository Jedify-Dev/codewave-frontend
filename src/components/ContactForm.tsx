import { ArrowUpRight, LoaderCircle } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";

type FormData = {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  mensaje: string;
};

const initialData: FormData = {
  nombre: "",
  empresa: "",
  email: "",
  telefono: "",
  mensaje: "",
};

const fields = [
  { name: "nombre", label: "Nombre", type: "text", required: true },
  { name: "empresa", label: "Empresa", type: "text", required: true },
  { name: "email", label: "Correo electrónico", type: "email", required: true },
  { name: "telefono", label: "Teléfono", type: "tel", required: true },
] as const;

export function ContactForm() {
  const [data, setData] = useState(initialData);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const update = (name: keyof FormData, value: string) => {
    setData((current) => ({ ...current, [name]: value }));
    setStatus("idle");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus("idle");

    try {
      const response = await fetch(
        import.meta.env.PUBLIC_CONTACT_ENDPOINT ?? "/api/send-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) throw new Error("No se pudo enviar el formulario");
      setData(initialData);
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
      {fields.map((field) => (
        <label key={field.name} className="grid gap-2 text-sm font-bold text-ink/70">
          {field.label}
          <input
            type={field.type}
            name={field.name}
            value={data[field.name]}
            required={field.required}
            autoComplete={field.name === "email" ? "email" : field.name === "telefono" ? "tel" : "off"}
            onChange={(event) => update(field.name, event.target.value)}
            className="h-13 rounded-xl border border-ink/15 bg-white px-4 font-medium text-ink transition placeholder:text-ink/30 focus:border-wave"
          />
        </label>
      ))}

      <label className="grid gap-2 text-sm font-bold text-ink/70 sm:col-span-2">
        Contanos sobre tu proyecto
        <textarea
          name="mensaje"
          value={data.mensaje}
          required
          rows={5}
          onChange={(event) => update("mensaje", event.target.value)}
          className="resize-none rounded-xl border border-ink/15 bg-white px-4 py-3 font-medium text-ink transition placeholder:text-ink/30 focus:border-wave"
        />
      </label>

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className="text-sm font-semibold">
          {status === "success" && (
            <span className="text-green-700">Mensaje enviado. Te responderemos pronto.</span>
          )}
          {status === "error" && (
            <span className="text-red-700">No pudimos enviarlo. Escribinos a codewave@unahur.edu.ar.</span>
          )}
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-w-44 items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-ocean disabled:cursor-wait disabled:opacity-60"
        >
          {submitting ? <LoaderCircle className="animate-spin" size={19} /> : <ArrowUpRight size={19} />}
          {submitting ? "Enviando" : "Enviar mensaje"}
        </button>
      </div>
    </form>
  );
}
