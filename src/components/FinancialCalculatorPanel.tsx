import React, { useState } from 'react';
import { DollarSign, TrendingUp, Users, Calculator } from 'lucide-react';
import { sound } from '../utils/soundEffects';

type SubTool = 'compound' | 'loan' | 'tip';

export const FinancialCalculatorPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SubTool>('compound');

  // Compound Interest State
  const [initialDeposit, setInitialDeposit] = useState<number>(5000);
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(500);
  const [interestRate, setInterestRate] = useState<number>(10); // % per year
  const [rateType, setRateType] = useState<'yearly' | 'monthly'>('yearly');
  const [periodYears, setPeriodYears] = useState<number>(5);

  // Loan State
  const [loanAmount, setLoanAmount] = useState<number>(50000);
  const [loanRateAnnual, setLoanRateAnnual] = useState<number>(12); // % per year
  const [loanMonths, setLoanMonths] = useState<number>(36);

  // Split Bill State
  const [billAmount, setBillAmount] = useState<number>(240);
  const [tipPercent, setTipPercent] = useState<number>(10);
  const [numPeople, setNumPeople] = useState<number>(3);

  // Calculations for Compound Interest
  const rMonthly = rateType === 'yearly' 
    ? Math.pow(1 + interestRate / 100, 1 / 12) - 1 
    : interestRate / 100;
  
  const totalMonths = periodYears * 12;
  let runningTotal = initialDeposit;
  let totalInvested = initialDeposit;
  const yearlyBreakdown: { year: number; invested: number; total: number; interest: number }[] = [];

  for (let m = 1; m <= totalMonths; m++) {
    runningTotal = runningTotal * (1 + rMonthly) + monthlyDeposit;
    totalInvested += monthlyDeposit;

    if (m % 12 === 0 || m === totalMonths) {
      const yr = Math.ceil(m / 12);
      yearlyBreakdown.push({
        year: yr,
        invested: Math.round(totalInvested),
        total: Math.round(runningTotal),
        interest: Math.round(runningTotal - totalInvested),
      });
    }
  }

  const finalAmount = runningTotal;
  const totalInterestEarned = finalAmount - totalInvested;
  const interestPercent = (totalInterestEarned / finalAmount) * 100;

  // Calculations for Loan (PRICE table)
  const iMonthlyLoan = loanRateAnnual / 100 / 12;
  const monthlyPayment = iMonthlyLoan > 0
    ? (loanAmount * (iMonthlyLoan * Math.pow(1 + iMonthlyLoan, loanMonths))) /
      (Math.pow(1 + iMonthlyLoan, loanMonths) - 1)
    : loanAmount / loanMonths;
  const totalLoanPaid = monthlyPayment * loanMonths;
  const totalLoanInterest = totalLoanPaid - loanAmount;

  // Calculations for Split Bill
  const tipTotal = (billAmount * tipPercent) / 100;
  const grandTotal = billAmount + tipTotal;
  const perPerson = numPeople > 0 ? grandTotal / numPeople : grandTotal;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  return (
    <div className="w-full bg-neutral-900/90 border border-neutral-800 rounded-2xl p-5 sm:p-6 flex flex-col gap-6">
      {/* Sub-navigation tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
        <button
          onClick={() => { sound.playClick(); setActiveTab('compound'); }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'compound'
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Juros Compostos</span>
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveTab('loan'); }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'loan'
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Empréstimo & Financiamento</span>
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveTab('tip'); }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'tip'
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Divisão de Conta</span>
        </button>
      </div>

      {/* 1. Compound Interest Tool */}
      {activeTab === 'compound' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs Column */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">
                Aporte Inicial (R$)
              </label>
              <input
                type="number"
                min="0"
                value={initialDeposit}
                onChange={(e) => setInitialDeposit(Math.max(0, Number(e.target.value)))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-100 font-mono text-base focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-neutral-400 block mb-1">
                Aporte Mensal (R$)
              </label>
              <input
                type="number"
                min="0"
                value={monthlyDeposit}
                onChange={(e) => setMonthlyDeposit(Math.max(0, Number(e.target.value)))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-100 font-mono text-base focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">
                  Taxa de Juros (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-100 font-mono text-base focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400 block mb-1">
                  Periodicidade
                </label>
                <select
                  value={rateType}
                  onChange={(e) => setRateType(e.target.value as 'yearly' | 'monthly')}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-neutral-200 text-sm focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="yearly">Ao ano (% a.a.)</option>
                  <option value="monthly">Ao mês (% a.m.)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-neutral-400 block mb-1">
                Período: {periodYears} {periodYears === 1 ? 'ano' : 'anos'} ({periodYears * 12} meses)
              </label>
              <input
                type="range"
                min="1"
                max="40"
                value={periodYears}
                onChange={(e) => setPeriodYears(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-neutral-500 font-mono mt-1">
                <span>1 ano</span>
                <span>10 anos</span>
                <span>20 anos</span>
                <span>40 anos</span>
              </div>
            </div>
          </div>

          {/* Results Summary Column */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="p-5 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex flex-col gap-3">
              <span className="text-xs text-neutral-400 font-medium">
                Montante Final Acumulado
              </span>
              <div className="font-mono text-3xl sm:text-4xl font-bold text-amber-400 tracking-tight tabular-nums">
                {formatCurrency(finalAmount)}
              </div>

              {/* Progress visual bar */}
              <div className="w-full h-3 rounded-full bg-neutral-800 overflow-hidden flex mt-2">
                <div
                  style={{ width: `${Math.max(5, 100 - interestPercent)}%` }}
                  className="bg-neutral-600 transition-all"
                  title="Capital Investido"
                />
                <div
                  style={{ width: `${Math.min(95, interestPercent)}%` }}
                  className="bg-amber-500 transition-all"
                  title="Juros Ganhos"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-2 pt-2 border-t border-neutral-800/80">
                <div>
                  <span className="text-xs text-neutral-500 block">Total Investido</span>
                  <span className="font-mono text-lg font-semibold text-neutral-200 tabular-nums">
                    {formatCurrency(totalInvested)}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-neutral-500 block">Total em Juros</span>
                  <span className="font-mono text-lg font-semibold text-amber-400 tabular-nums">
                    +{formatCurrency(totalInterestEarned)}
                  </span>
                </div>
              </div>
            </div>

            {/* Annual Breakdown */}
            <div className="border border-neutral-800 rounded-xl overflow-hidden">
              <div className="bg-neutral-850 px-4 py-2 text-xs font-semibold text-neutral-300">
                Evolução Anual
              </div>
              <div className="max-h-48 overflow-y-auto no-scrollbar divide-y divide-neutral-850 text-xs font-mono">
                {yearlyBreakdown.map((row) => (
                  <div key={row.year} className="px-4 py-2 flex items-center justify-between text-neutral-400">
                    <span className="text-neutral-300 font-medium">Ano {row.year}</span>
                    <span className="text-neutral-500">Investido: {formatCurrency(row.invested)}</span>
                    <span className="text-amber-400 font-semibold">{formatCurrency(row.total)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Loan Simulator */}
      {activeTab === 'loan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">
                Valor do Empréstimo / Financiamento (R$)
              </label>
              <input
                type="number"
                min="0"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value)))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-100 font-mono text-base focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-neutral-400 block mb-1">
                Taxa de Juros Anual (% a.a.)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={loanRateAnnual}
                onChange={(e) => setLoanRateAnnual(Math.max(0, Number(e.target.value)))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-100 font-mono text-base focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-neutral-400 block mb-1">
                Prazo em Meses: {loanMonths} meses ({(loanMonths / 12).toFixed(1)} anos)
              </label>
              <input
                type="range"
                min="6"
                max="360"
                step="6"
                value={loanMonths}
                onChange={(e) => setLoanMonths(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-neutral-500 font-mono mt-1">
                <span>12m</span>
                <span>36m</span>
                <span>60m</span>
                <span>120m</span>
                <span>360m</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="p-5 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex flex-col gap-3">
              <span className="text-xs text-neutral-400 font-medium">
                Parcela Mensal Estimada (Tabela Price)
              </span>
              <div className="font-mono text-3xl sm:text-4xl font-bold text-amber-400 tracking-tight tabular-nums">
                {formatCurrency(monthlyPayment)}
                <span className="text-xs font-normal text-neutral-400 ml-2">/ mês</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-neutral-800/80">
                <div>
                  <span className="text-xs text-neutral-500 block">Total a Pagar</span>
                  <span className="font-mono text-lg font-semibold text-neutral-200 tabular-nums">
                    {formatCurrency(totalLoanPaid)}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-neutral-500 block">Custo Total de Juros</span>
                  <span className="font-mono text-lg font-semibold text-rose-400 tabular-nums">
                    +{formatCurrency(totalLoanInterest)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Split Bill Tool */}
      {activeTab === 'tip' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">
                Valor da Conta (R$)
              </label>
              <input
                type="number"
                min="0"
                value={billAmount}
                onChange={(e) => setBillAmount(Math.max(0, Number(e.target.value)))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-100 font-mono text-base focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-neutral-400 block mb-2">
                Gorjeta / Taxa de Serviço
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[0, 10, 12, 15, 20].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => { sound.playClick(); setTipPercent(pct); }}
                    className={`py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                      tipPercent === pct
                        ? 'bg-amber-500 text-neutral-950'
                        : 'bg-neutral-850 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-neutral-400 block mb-1">
                Dividir entre quantas pessoas? ({numPeople})
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={numPeople}
                onChange={(e) => setNumPeople(Math.max(1, Number(e.target.value)))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="p-5 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex flex-col gap-4">
              <span className="text-xs text-neutral-400 font-medium">
                Valor por Pessoa ({numPeople} {numPeople === 1 ? 'pessoa' : 'pessoas'})
              </span>
              <div className="font-mono text-3xl sm:text-4xl font-bold text-amber-400 tracking-tight tabular-nums">
                {formatCurrency(perPerson)}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-neutral-800/80 text-xs font-mono">
                <div>
                  <span className="text-neutral-500 block">Gorjeta Total ({tipPercent}%)</span>
                  <span className="text-neutral-200 font-semibold text-sm">
                    {formatCurrency(tipTotal)}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Conta Total c/ Gorjeta</span>
                  <span className="text-neutral-200 font-semibold text-sm">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
