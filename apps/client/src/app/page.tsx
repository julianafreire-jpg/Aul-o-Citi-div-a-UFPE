"use client";

import { useState, type FormEvent } from "react";
import type {
  ApiResponse,
  Capsule,
  CapsuleDecoration,
  CapsulePaperColor,
  CapsuleStamp,
  CreateCapsuleInput,
} from "@repo/types";
import { api } from "@/lib/api";

const paperOptions: {
  value: CapsulePaperColor;
  label: string;
  color: string;
}[] = [
  { value: "rose", label: "Rosa antigo", color: "#edbfd1" },
  { value: "ivory", label: "Baunilha", color: "#f2e8c8" },
  { value: "sky", label: "Azul carta", color: "#c5dce5" },
  { value: "sage", label: "Verde sálvia", color: "#cdd9bd" },
];

const decorationOptions: {
  value: CapsuleDecoration;
  label: string;
  mark: string;
}[] = [
  { value: "botanical", label: "Folhas", mark: "❧" },
  { value: "celestial", label: "Estrelinhas", mark: "✦" },
  { value: "pressed", label: "Florzinhas", mark: "✿" },
];

const stampOptions: { value: CapsuleStamp; label: string; mark: string }[] = [
  { value: "flower", label: "Flor", mark: "✿" },
  { value: "star", label: "Estrela", mark: "✦" },
  { value: "heart", label: "Coração", mark: "♥" },
];

export default function HomePage() {
  const [draft, setDraft] = useState<CreateCapsuleInput>({
    recipientEmail: "",
    subject: "",
    message: "",
    paperColor: "rose",
    decoration: "botanical",
    stamps: [],
  });
  const [isEnvelopeClosed, setIsEnvelopeClosed] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [createdCapsule, setCreatedCapsule] = useState<Capsule | null>(null);
  const [feedback, setFeedback] = useState("");

  function toggleStamp(stamp: CapsuleStamp) {
    setDraft((current) => ({
      ...current,
      stamps: current.stamps.includes(stamp)
        ? current.stamps.filter((item) => item !== stamp)
        : [...current.stamps, stamp],
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback("");

    if (!isEnvelopeClosed) {
      setFeedback("Feche a carta no envelope antes de selar a cápsula.");
      return;
    }

    setIsSending(true);
    try {
      const response = await api.post<ApiResponse<Capsule>>("/capsules", draft);
      setCreatedCapsule(response.data.data);
    } catch {
      setFeedback(
        "Não foi possível guardar sua carta agora. Tente novamente em instantes.",
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className="time-page">
      <header className="topbar" id="inicio">
        <a className="wordmark" href="#inicio" aria-label="Cápsula, início">
          <span className="wordmark-icon" aria-hidden="true">✿</span>
          <span>cápsula</span>
        </a>
        <span className="topbar-note">um pequeno presente para o futuro</span>
        <a className="topbar-link" href="#escrever">ESCREVER UMA CARTA <span aria-hidden="true">↗</span></a>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> UMA CARTA, DOIS TEMPOS</p>
          <h1 id="hero-title">Uma carta sua, <em>daqui a 2 anos.</em></h1>
          <p className="hero-description">
            Guarde um pedacinho de quem você é hoje. Escolha o papel, escreva
            sem pressa e deixe o futuro cuidar do resto.
          </p>
          <a className="seal-button" href="#escrever">
            <span>Escrever minha carta</span>
            <span className="button-arrow" aria-hidden="true">↗</span>
          </a>
          <p className="button-caption">Esta mensagem será desbloqueada em 2 anos.</p>
          <div className="hero-footnote">
            <span className="footnote-rule" />
            <span>FEITA À MÃO, GUARDADA NO TEMPO</span>
          </div>
        </div>

        <div className="capsule-stage" aria-hidden="true">
          <div className="scrapbook-spread">
            <div className="scrapbook-page journal-left">
              <div className="journal-dots" />
              <span className="washi-tape tape-left" />
              <span className="sticker-leaf">❧</span>
              <span className="sticker-disc"><i>♫</i></span>
              <div className="guest-check">
                <span>GUEST CHECK</span>
                <i />
                <i />
                <i />
                <b>até logo, eu do futuro</b>
              </div>
              <span className="mini-camera">▣</span>
              <span className="sticker-heart">♥</span>
            </div>
            <div className="scrapbook-page journal-right">
              <span className="washi-tape tape-right" />
              <div className="mini-calendar"><small>OUTUBRO</small><b>03</b><span>2026</span></div>
              <p className="scrapbook-label">UMA COISA<br />SÓ NOSSA</p>
              <div className="scrapbook-letter">
                <small>PARA ABRIR EM 2028</small>
                <strong>Oi, você.</strong>
                <span />
                <span />
                <span />
                <i>com carinho, eu</i>
              </div>
              <div className="retro-player">
                <div className="player-screen"><span>VOCÊ, NO FUTURO</span><b>▶</b></div>
                <div className="player-controls"><i /><i /><i /></div>
              </div>
              <span className="admit-sticker">ABRA<br />EM 2 ANOS</span>
              <span className="tiny-star">✦</span>
            </div>
            <div className="notebook-rings"><i /><i /><i /></div>
          </div>
          <span className="floating-note note-calendar">03 · 10 · 2026</span>
          <span className="floating-note note-time">O FUTURO<br />PODE ESPERAR</span>
          <span className="floating-spark spark-one">✳</span>
          <span className="floating-spark spark-two">✦</span>
          <span className="stage-caption"><span>01</span> UM SEGREDO BEM GUARDADO</span>
        </div>

        <div className="scroll-cue" aria-hidden="true"><span /> O TEMPO PASSA, A CARTA FICA</div>
      </section>

      <section className="composer-section" id="escrever" aria-labelledby="composer-title">
        <div className="section-heading">
          <p className="eyebrow"><span className="eyebrow-dot" /> SUA CÁPSULA COMEÇA AQUI</p>
          <h2 id="composer-title">Um recado para <em>o seu depois.</em></h2>
          <p>Preencha com calma. A carta só chega quando o tempo certo chegar.</p>
        </div>

        {createdCapsule ? (
          <div className="success-note" role="status">
            <span className="success-flower" aria-hidden="true">✿</span>
            <div>
              <p className="eyebrow">CÁPSULA SELADA</p>
              <h3>Sua carta já está a caminho do futuro.</h3>
              <p>Ela será enviada para <strong>{createdCapsule.recipientEmail}</strong> em <strong>{new Date(createdCapsule.unlockAt).toLocaleDateString("pt-BR", { dateStyle: "long", timeZone: "America/Sao_Paulo" })}</strong>.</p>
            </div>
          </div>
        ) : (
          <div className="editor-layout">
            <form className="letter-form" onSubmit={handleSubmit}>
              <label className="field-label" htmlFor="recipient-email">SEU E-MAIL DO FUTURO</label>
              <input
                id="recipient-email"
                autoComplete="email"
                className="text-field"
                type="email"
                maxLength={254}
                placeholder="voce@algumlugar.com"
                required
                value={draft.recipientEmail}
                onChange={(event) => setDraft((current) => ({ ...current, recipientEmail: event.target.value }))}
              />
              <p className="field-hint">É para este endereço que a carta vai chegar daqui a dois anos.</p>

              <label className="field-label" htmlFor="letter-subject">UM TÍTULO PARA ESTE MOMENTO</label>
              <input
                id="letter-subject"
                className="text-field"
                type="text"
                maxLength={120}
                placeholder="O que você quer lembrar?"
                required
                value={draft.subject}
                onChange={(event) => setDraft((current) => ({ ...current, subject: event.target.value }))}
              />

              <label className="field-label" htmlFor="letter-message">SUA CARTA</label>
              <textarea
                id="letter-message"
                className="text-field message-field"
                maxLength={10000}
                placeholder="Oi, eu do futuro..."
                required
                value={draft.message}
                onChange={(event) => setDraft((current) => ({ ...current, message: event.target.value }))}
              />
              <span className="character-count">{draft.message.length} / 10.000</span>

              <fieldset className="customize-group">
                <legend className="field-label">ESCOLHA A COR DO PAPEL</legend>
                <div className="paper-options">
                  {paperOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`paper-swatch${draft.paperColor === option.value ? " is-selected" : ""}`}
                      type="button"
                      aria-label={option.label}
                      aria-pressed={draft.paperColor === option.value}
                      style={{ "--swatch-color": option.color } as React.CSSProperties}
                      onClick={() => setDraft((current) => ({ ...current, paperColor: option.value }))}
                    />
                  ))}
                </div>
              </fieldset>

              <fieldset className="customize-group">
                <legend className="field-label">ESCOLHA UMA DECORAÇÃO</legend>
                <div className="option-row">
                  {decorationOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`decor-option${draft.decoration === option.value ? " is-selected" : ""}`}
                      type="button"
                      aria-pressed={draft.decoration === option.value}
                      onClick={() => setDraft((current) => ({ ...current, decoration: option.value }))}
                    >
                      <span aria-hidden="true">{option.mark}</span>{option.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="customize-group">
                <legend className="field-label">ACRESCENTE SELOS <span>(ATÉ 3)</span></legend>
                <div className="stamp-options">
                  {stampOptions.map((stamp) => (
                    <button
                      key={stamp.value}
                      className={`stamp-option${draft.stamps.includes(stamp.value) ? " is-selected" : ""}`}
                      type="button"
                      aria-label={`${stamp.label}${draft.stamps.includes(stamp.value) ? ", selecionado" : ""}`}
                      aria-pressed={draft.stamps.includes(stamp.value)}
                      onClick={() => toggleStamp(stamp.value)}
                    >
                      <span aria-hidden="true">{stamp.mark}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="envelope-toggle">
                <input
                  type="checkbox"
                  checked={isEnvelopeClosed}
                  onChange={(event) => setIsEnvelopeClosed(event.target.checked)}
                />
                <span className="toggle-box" aria-hidden="true">{isEnvelopeClosed ? "✓" : ""}</span>
                <span>Fechar a carta no envelope antes de enviar</span>
              </label>

              {feedback && <p className="form-feedback" role="alert">{feedback}</p>}
              <button className="submit-letter" type="submit" disabled={isSending}>
                <span>{isSending ? "Selando sua carta..." : "Selar e enviar em 2 anos"}</span>
                <span aria-hidden="true">↗</span>
              </button>
              <p className="privacy-note">Sua carta fica guardada até o dia de abrir.</p>
            </form>

            <aside className={`preview-column${isEnvelopeClosed ? " is-closed" : ""}`} aria-label="Prévia da carta">
              <div className={`letter-preview paper-${draft.paperColor} decoration-${draft.decoration}`} aria-hidden="true">
                <div className="preview-meta"><span>PARA: {draft.recipientEmail || "SEU EU DO FUTURO"}</span><span>ABRE EM 2 ANOS</span></div>
                <div className="preview-decoration" aria-hidden="true">
                  {draft.decoration === "botanical" ? "❧" : draft.decoration === "celestial" ? "✦ ✧ ✦" : "✿  ❀  ✿"}
                </div>
                <p className="preview-subject">{draft.subject || "Um título para sua carta"}</p>
                <p className="preview-message">{draft.message || "Suas palavras vão aparecer por aqui, como se já estivessem esperando pelo futuro."}</p>
                <p className="preview-signature">com carinho,<br />seu eu de hoje</p>
                <div className="preview-stamps" aria-label={`${draft.stamps.length} selos adicionados`}>
                  {draft.stamps.map((stamp) => (
                    <span key={stamp} aria-hidden="true">{stampOptions.find((option) => option.value === stamp)?.mark}</span>
                  ))}
                </div>
              </div>
              <div className="envelope-preview" aria-hidden="true">
                <span className="envelope-flap" />
                <span className="envelope-seal">c</span>
              </div>
              <p className="preview-caption"><span>✳</span> UMA CARTA QUE VIAJA NO TEMPO</p>
            </aside>
          </div>
        )}
      </section>
      <footer className="page-footer">UM PEQUENO PEDAÇO DE HOJE, PARA ENCONTRAR VOCÊ AMANHÃ <span>✿</span></footer>
    </main>
  );
}