"use client";

import type { ToolCalculatorInput, ToolCalculatorType } from "@/lib/tools";

type ToolCalculatorFormProps = {
  calculatorType: ToolCalculatorType;
  input: ToolCalculatorInput;
  onChange: (input: ToolCalculatorInput) => void;
  onSubmit: () => void;
};

const inputClass =
  "w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy shadow-sm focus:border-navy/30 focus:outline-none focus:ring-2 focus:ring-navy/10";

const labelClass = "mb-1.5 block text-sm font-semibold text-navy";

export function ToolCalculatorForm({
  calculatorType,
  input,
  onChange,
  onSubmit,
}: ToolCalculatorFormProps) {
  function setField(key: string, value: string | boolean) {
    onChange({ ...input, [key]: value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {calculatorType === "inheritance-registration-deadline" ||
      calculatorType === "inheritance-renunciation-deadline" ? (
        <div>
          <label htmlFor="deathDate" className={labelClass}>
            사망일(상속개시일)
          </label>
          <input
            id="deathDate"
            type="date"
            className={inputClass}
            value={String(input.deathDate ?? "")}
            onChange={(e) => setField("deathDate", e.target.value)}
            required
          />
        </div>
      ) : null}

      {calculatorType === "director-change-penalty" ? (
        <div>
          <label htmlFor="changeDate" className={labelClass}>
            임원 변경일(취임·사임·임기만료일)
          </label>
          <input
            id="changeDate"
            type="date"
            className={inputClass}
            value={String(input.changeDate ?? "")}
            onChange={(e) => setField("changeDate", e.target.value)}
            required
          />
        </div>
      ) : null}

      {calculatorType === "head-office-move-deadline" ? (
        <div>
          <label htmlFor="moveDate" className={labelClass}>
            본점 이전일(사업장 이전일)
          </label>
          <input
            id="moveDate"
            type="date"
            className={inputClass}
            value={String(input.moveDate ?? "")}
            onChange={(e) => setField("moveDate", e.target.value)}
            required
          />
        </div>
      ) : null}

      {calculatorType === "jeonse-deposit-timeline" ? (
        <div>
          <label htmlFor="leaseEndDate" className={labelClass}>
            전세 계약 만료일
          </label>
          <input
            id="leaseEndDate"
            type="date"
            className={inputClass}
            value={String(input.leaseEndDate ?? "")}
            onChange={(e) => setField("leaseEndDate", e.target.value)}
            required
          />
        </div>
      ) : null}

      {calculatorType === "payment-order-fee" ? (
        <div>
          <label htmlFor="claimAmount" className={labelClass}>
            청구 금액(원)
          </label>
          <input
            id="claimAmount"
            type="text"
            inputMode="numeric"
            placeholder="예: 5000000"
            className={inputClass}
            value={String(input.claimAmount ?? "")}
            onChange={(e) => setField("claimAmount", e.target.value)}
            required
          />
        </div>
      ) : null}

      {calculatorType === "real-estate-documents" ? (
        <>
          <div>
            <label htmlFor="transactionType" className={labelClass}>
              등기 유형
            </label>
            <select
              id="transactionType"
              className={inputClass}
              value={String(input.transactionType ?? "sale")}
              onChange={(e) => setField("transactionType", e.target.value)}
            >
              <option value="sale">매매</option>
              <option value="gift">증여</option>
              <option value="inheritance">상속</option>
              <option value="other">기타</option>
            </select>
          </div>
          <div>
            <label htmlFor="hasMortgage" className={labelClass}>
              근저당(담보) 유무
            </label>
            <select
              id="hasMortgage"
              className={inputClass}
              value={String(input.hasMortgage ?? "no")}
              onChange={(e) => setField("hasMortgage", e.target.value)}
            >
              <option value="no">없음</option>
              <option value="yes">있음</option>
            </select>
          </div>
        </>
      ) : null}

      {calculatorType === "rehab-income-debt" ? (
        <>
          <div>
            <label htmlFor="monthlyIncome" className={labelClass}>
              월 소득(원)
            </label>
            <input
              id="monthlyIncome"
              type="text"
              inputMode="numeric"
              placeholder="예: 2500000"
              className={inputClass}
              value={String(input.monthlyIncome ?? "")}
              onChange={(e) => setField("monthlyIncome", e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="totalDebt" className={labelClass}>
              총 채무액(원)
            </label>
            <input
              id="totalDebt"
              type="text"
              inputMode="numeric"
              placeholder="예: 50000000"
              className={inputClass}
              value={String(input.totalDebt ?? "")}
              onChange={(e) => setField("totalDebt", e.target.value)}
              required
            />
          </div>
        </>
      ) : null}

      <button
        type="submit"
        className="interactive-surface w-full rounded-xl bg-navy px-5 py-3.5 text-sm font-semibold text-white hover:bg-navy-dark sm:text-base"
      >
        계산하기
      </button>
    </form>
  );
}
