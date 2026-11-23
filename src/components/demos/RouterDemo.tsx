"use client";

import { useId, useMemo, useState } from "react";
import { CONFIDENCE_GATE, ROUTE_LABEL, SENTIMENT_OVERRIDE, decide, type ModelReading } from "@/lib/collections";
import s from "./RouterDemo.module.css";

type Account = { id: string; situation: string; reading: ModelReading };

// Example accounts and example model readings; the decision path is the workflow's real logic.
const ACCOUNTS: Account[] = [
  { id: "ACC-1042", situation: "12 days late · usually pays · replied “I'll pay on Friday”", reading: { risk_tier: "low", sentiment_score: 0.4, confidence: 0.86, rationale: "Isolated lateness, positive reply." } },
  { id: "ACC-2210", situation: "41 days late · part-payments · “business is slow, can we spread it?”", reading: { risk_tier: "medium", sentiment_score: -0.1, confidence: 0.78, rationale: "Struggling but engaging." } },
  { id: "ACC-3307", situation: "38 days late · replied “stop messaging me”", reading: { risk_tier: "medium", sentiment_score: -0.7, confidence: 0.82, rationale: "Hostile, but has paid before." } },
  { id: "ACC-4518", situation: "95 days late · two defaults · no replies", reading: { risk_tier: "high", sentiment_score: -0.5, confidence: 0.9, rationale: "Repeat default, no engagement." } },
  { id: "ACC-5023", situation: "20 days late · mixed signals in the messages", reading: { risk_tier: "medium", sentiment_score: 0.1, confidence: 0.48, rationale: "Hard to read." } },
  { id: "ACC-6190", situation: "The model answered with a tier that doesn't exist", reading: { risk_tier: "critical", sentiment_score: -0.2, confidence: 0.95, rationale: "Very urgent." } },
];

export default function RouterDemo() {
  const name = useId();
  const [id, setId] = useState(ACCOUNTS[0]!.id);
  const account = ACCOUNTS.find((a) => a.id === id)!;
  const [reading, setReading] = useState<ModelReading>(account.reading);
  const decision = useMemo(() => decide(reading), [reading]);
  const route = ROUTE_LABEL[decision.route];
  const human = decision.route === "human_review";

  const pick = (a: Account) => {
    setId(a.id);
    setReading(a.reading);
  };

  return (
    <div className={`glass ${s.demo}`}>
      <fieldset className={s.accounts}>
        <legend className={s.k}>Pick an overdue account</legend>
        <div className={s.chips}>
          {ACCOUNTS.map((a) => (
            <label key={a.id} className={s.chip} data-checked={a.id === id}>
              <input type="radio" name={name} value={a.id} checked={a.id === id} onChange={() => pick(a)} />
              <strong>{a.id}</strong>
              <span>{a.situation}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={s.stages}>
        <section className={s.model} aria-label="The AI reads the account">
          <h3 className={s.stageTitle}>
            <span>1</span> The AI reads the account
          </h3>
          <div className={s.row}>
            <label htmlFor={`${name}-tier`}>Risk tier</label>
            <select
              id={`${name}-tier`}
              value={["low", "medium", "high"].includes(reading.risk_tier) ? reading.risk_tier : "other"}
              onChange={(e) => setReading({ ...reading, risk_tier: e.target.value === "other" ? "critical" : e.target.value })}
            >
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
              <option value="other">“critical” (not a real tier)</option>
            </select>
          </div>
          <Slider
            id={`${name}-sent`}
            label="Sentiment"
            min={-1}
            max={1}
            value={reading.sentiment_score}
            marker={SENTIMENT_OVERRIDE}
            markerNote={`override below ${SENTIMENT_OVERRIDE}`}
            onChange={(v) => setReading({ ...reading, sentiment_score: v })}
          />
          <Slider
            id={`${name}-conf`}
            label="Confidence"
            min={0}
            max={1}
            value={reading.confidence}
            marker={CONFIDENCE_GATE}
            markerNote={`gate at ${CONFIDENCE_GATE}`}
            onChange={(v) => setReading({ ...reading, confidence: v })}
          />
          <p className={s.rationale}>“{reading.rationale}”</p>
        </section>

        <div className={s.arrow} aria-hidden>
          →
        </div>

        <section className={s.code} aria-label="The code decides" aria-live="polite">
          <h3 className={s.stageTitle}>
            <span>2</span> The code decides
          </h3>
          <ol role="list" className={s.steps}>
            <li data-state={decision.notes.length ? "warn" : "ok"}>
              <strong>Check the answer</strong>
              <span>{decision.notes.length ? decision.notes.join(". ") : "Tier is valid; no override needed."}</span>
            </li>
            <li data-state={decision.gatePassed ? "ok" : "warn"}>
              <strong>Confidence gate</strong>
              <span>
                {decision.reading.confidence.toFixed(2)} {decision.gatePassed ? "≥" : "<"} {CONFIDENCE_GATE}:{" "}
                {decision.gatePassed ? "route it" : "a person decides"}
              </span>
            </li>
            <li data-state={human ? "warn" : "ok"}>
              <strong>Route</strong>
              <span>
                {decision.gatePassed ? `Tier “${decision.reading.risk_tier}”` : "No route"} → {route.title}
              </span>
            </li>
          </ol>
        </section>
      </div>

      <p className={s.outcome}>
        <span className="status" data-state={human ? "warn" : "ok"}>
          {route.title}
        </span>
        <span>
          <strong>{route.channel}.</strong> {route.detail}
        </span>
      </p>

      <p className={s.prov}>
        Accounts and the AI&rsquo;s readings are examples. The decision path is the workflow&rsquo;s real logic (its
        “Parse AI Output”, “Confidence Check” and “Route by Risk Tier” nodes), ported to TypeScript and covered by tests.
      </p>
    </div>
  );
}

function Slider({
  id,
  label,
  min,
  max,
  value,
  marker,
  markerNote,
  onChange,
}: {
  id: string;
  label: string;
  min: number;
  max: number;
  value: number;
  marker: number;
  markerNote: string;
  onChange: (v: number) => void;
}) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  return (
    <div className={s.slider}>
      <label htmlFor={id}>{label}</label>
      <div className={s.track}>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={0.01}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ "--p": `${pct(value)}%` } as React.CSSProperties}
          aria-describedby={`${id}-m`}
        />
        <span className={s.marker} style={{ left: `${pct(marker)}%` }} aria-hidden />
      </div>
      <output htmlFor={id}>{value.toFixed(2)}</output>
      <small id={`${id}-m`} className={s.markerNote}>
        {markerNote}
      </small>
    </div>
  );
}
