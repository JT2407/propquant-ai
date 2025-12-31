
import React, { useState } from 'react';
import { Search, Loader2, TrendingUp, ShieldAlert, BarChart3, AlertCircle, Info, CheckCircle2, Building, Zap, ArrowRight, Settings2, Link as LinkIcon, MessageSquare, Wrench, Thermometer, Droplets, Lightbulb } from 'lucide-react';
import { PropertyData, AnalysisResult, AnalysisConfig } from './types';
import { DEFAULT_CONFIG, SCORE_LABELS } from './constants';
import { GeminiService } from './services/geminiService';
import { AnalysisService } from './services/analysisService';

const ScoreDefinition = ({ title, value, definition, colorClass = "text-slate-900" }: { title: string, value: number, definition: string, colorClass?: string }) => (
  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</div>
    <div className={`text-4xl font-black ${colorClass}`}>{value}</div>
    <div className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-tighter leading-tight max-w-[120px]">{definition}</div>
  </div>
);

export default function App() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [config, setConfig] = useState<AnalysisConfig>(DEFAULT_CONFIG);

  const analyzeProperty = async () => {
    if (!url) return;
    setIsLoading(true);
    setError(null);
    try {
      const gemini = new GeminiService();
      const analyst = new AnalysisService();
      
      const propData = await gemini.extractPropertyData(url);
      const risks = await gemini.generateRiskAssessment(propData);
      
      const financials = analyst.calculateFinancials(propData, config);
      const sanityChecks = analyst.runSanityChecks(propData, financials);
      const scores = analyst.calculateInstitutionalScores(propData, financials, risks);
      const sensitivity = analyst.generateSensitivity(propData, config);
      const projections = analyst.generateProjections(propData, financials);

      setResult({
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toISOString(),
        property: propData,
        financials,
        risks,
        sanityChecks,
        institutionalScores: scores,
        sensitivity,
        projections
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (val: number, cur = 'USD') => 
    new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: cur,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <header className="bg-white border-b py-4 px-6 mb-10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 p-1.5 rounded-lg"><Building className="text-white w-5 h-5" /></div>
            <h1 className="text-lg font-black tracking-tight uppercase">PropQuant <span className="text-indigo-600">Institutional</span></h1>
          </div>
          <div className="flex items-center gap-4">
             <button 
              onClick={() => setConfig(prev => ({ ...prev, selfManaged: !prev.selfManaged }))}
              className={`text-[10px] font-bold px-4 py-1.5 rounded-full border transition-all shadow-sm ${config.selfManaged ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-400 border-slate-200'}`}
            >
              {config.selfManaged ? 'MODEL: SELF-MANAGED' : 'MODEL: PRO-MANAGED (8%)'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        <section className="max-w-2xl mx-auto mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-6">
            <Zap className="w-3 h-3 text-indigo-600" />
            <span className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Yield-Admissibility Auditor v2.8</span>
          </div>
          <h2 className="text-4xl font-black mb-4 tracking-tight">Real-Estate Underwriting Audit</h2>
          <div className="relative group max-w-xl mx-auto">
            <input
              className="w-full pl-6 pr-36 py-5 bg-white border-2 border-slate-200 rounded-2xl focus:border-indigo-600 outline-none transition-all shadow-xl font-medium"
              placeholder="Paste listing URL (Zillow, Rightmove, etc)..."
              value={url} onChange={e => setUrl(e.target.value)}
            />
            <button 
              onClick={analyzeProperty}
              disabled={isLoading}
              className="absolute right-2 top-2 bottom-2 px-6 bg-slate-900 text-white rounded-xl font-bold hover:bg-black disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <><Search className="w-4 h-4" /> Audit</>}
            </button>
          </div>
          {error && <div className="mt-4 text-red-600 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 bg-red-50 py-3 rounded-xl border border-red-100 shadow-sm"><AlertCircle className="w-4 h-4" /> {error}</div>}
        </section>

        {result && !isLoading && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            {/* Split Score Display */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <ScoreDefinition 
                title="Asset Quality" 
                value={result.institutionalScores.assetQualityScore} 
                definition="Location, supply, demand, and structural fundamentals."
              />
              <ScoreDefinition 
                title="Deal Economics" 
                value={result.institutionalScores.dealEconomicsScore} 
                definition="Price relative to regional yields and expected flows."
              />
              <ScoreDefinition 
                title="Leverage Impact" 
                value={result.institutionalScores.leverageImpactScore} 
                definition="Debt service efficiency under current capital stack."
                colorClass="text-indigo-600"
              />
              <div className="bg-slate-900 p-6 rounded-3xl text-center flex flex-col justify-center border-4 border-indigo-600 shadow-2xl">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Conviction Score</div>
                <div className="text-5xl font-black text-white">{result.institutionalScores.finalScore}</div>
                <div className="text-[9px] font-bold text-indigo-400 mt-2 uppercase tracking-tighter leading-tight">{result.institutionalScores.verdict}</div>
              </div>
            </div>

            {/* Narrative Explanation & Mitigation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-indigo-900 text-white p-7 rounded-3xl flex items-start gap-4 shadow-xl border-b-4 border-indigo-950">
                <MessageSquare className="w-7 h-7 text-indigo-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300 mb-2">Institutional Interpretation</h4>
                  <p className="text-sm font-medium leading-relaxed">{result.institutionalScores.scoreExplanation}</p>
                </div>
              </div>

              {result.institutionalScores.mitigationSuggestions.length > 0 && (
                <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-4">
                  <ShieldAlert className="w-7 h-7 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Suggested Mitigation Actions</h4>
                    <ul className="space-y-2">
                      {result.institutionalScores.mitigationSuggestions.map((s, idx) => (
                        <li key={idx} className="text-[11px] font-bold text-slate-700 flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" /> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Sanity & Warning Banners */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.sanityChecks.map(c => (
                <div key={c.id} className={`p-4 rounded-2xl border flex items-center gap-3 shadow-sm ${c.type === 'critical' ? 'bg-red-50 border-red-200 text-red-800' : c.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-[11px] font-black uppercase tracking-tight leading-tight">{c.message}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Structural Sub-Scores */}
                {result.property.structuralSubScores && (
                   <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <Wrench className="w-4 h-4" /> Structural Integrity Breakdown
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                         <div className="space-y-2">
                           <div className="flex justify-between items-center text-[10px] font-black uppercase">
                             <div className="flex items-center gap-1.5"><Building className="w-3 h-3 text-slate-400" /> Roof & Ext.</div>
                             <span>{result.property.structuralSubScores.roofExterior}/100</span>
                           </div>
                           <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${result.property.structuralSubScores.roofExterior}%` }}></div>
                           </div>
                         </div>
                         <div className="space-y-2">
                           <div className="flex justify-between items-center text-[10px] font-black uppercase">
                             <div className="flex items-center gap-1.5"><Droplets className="w-3 h-3 text-slate-400" /> Plumbing</div>
                             <span>{result.property.structuralSubScores.plumbingWater}/100</span>
                           </div>
                           <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${result.property.structuralSubScores.plumbingWater}%` }}></div>
                           </div>
                         </div>
                         <div className="space-y-2">
                           <div className="flex justify-between items-center text-[10px] font-black uppercase">
                             <div className="flex items-center gap-1.5"><Thermometer className="w-3 h-3 text-slate-400" /> HVAC & Elec</div>
                             <span>{result.property.structuralSubScores.hvacElectrical}/100</span>
                           </div>
                           <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${result.property.structuralSubScores.hvacElectrical}%` }}></div>
                           </div>
                         </div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-[11px] font-bold text-slate-500 italic flex items-start gap-2">
                        <Info className="w-4 h-4 text-slate-300 flex-shrink-0" />
                        "Underwriting Guidance: {result.property.structuralSubScores.guidance}"
                      </div>
                   </div>
                )}

                {/* Core Operating Model */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-8 py-6 bg-slate-50 border-b flex justify-between items-center">
                    <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">Underwriting Pro-Forma (Monthly)</h3>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                       {result.property.condition?.toUpperCase()} ASSET • BUILT {result.property.yearBuilt || 'N/A'}
                    </div>
                  </div>
                  <div className="p-8 space-y-4 text-sm font-medium">
                    <div className="flex justify-between"><span>Effective Gross Income</span><span className="text-emerald-600 font-bold">+{formatCurrency(result.property.inferredMarketData.avgMonthlyRental * (1 - Math.max(result.property.inferredMarketData.vacancyRate, 4)/100), result.property.currency)}</span></div>
                    <div className="h-px bg-slate-100 my-4" />
                    <div className="flex justify-between"><span>Property Taxes</span><span className="text-red-500">-{formatCurrency(result.property.propertyTaxesAnnual/12, result.property.currency)}</span></div>
                    <div className="flex justify-between"><span>Maintenance Provision</span><span className="text-red-500">-{formatCurrency((result.financials.totalAnnualExpenses / 12) * 0.3, result.property.currency)}</span></div>
                    {!config.selfManaged && (
                      <div className="flex justify-between"><span>Management Fee (8.0%)</span><span className="text-red-500">-{formatCurrency((result.property.inferredMarketData.avgMonthlyRental * 0.08), result.property.currency)}</span></div>
                    )}
                    <div className="flex justify-between font-black text-lg pt-4 text-slate-900 border-t">
                      <span>Net Operating Income (NOI)</span>
                      <span>{formatCurrency(result.financials.annualNoi/12, result.property.currency)}</span>
                    </div>
                    <div className="flex justify-between text-indigo-600 font-bold border-b pb-4">
                      <span>Debt Service ({config.interestRate}%)</span>
                      <span>-{formatCurrency(result.financials.mortgagePaymentMonthly, result.property.currency)}</span>
                    </div>
                    <div className="bg-slate-900 text-white p-7 rounded-3xl flex justify-between items-center mt-6 shadow-xl">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Net Post-Debt Flow</span>
                        <span className={`text-2xl font-black ${result.financials.monthlyCashFlow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{formatCurrency(result.financials.monthlyCashFlow, result.property.currency)}</span>
                      </div>
                      <div className="text-right flex flex-col items-end">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">DSCR Coverage</span>
                         <span className={`text-2xl font-black flex items-center gap-2 ${result.financials.dscr >= 1.25 ? 'text-emerald-400' : result.financials.dscr >= 1.0 ? 'text-amber-400' : 'text-red-400'}`}>
                           {result.financials.dscr.toFixed(2)}x
                           {result.financials.dscr < 1.0 && <AlertCircle className="w-5 h-5" />}
                         </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rate Sensitivity Matrix */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" /> Capital Stack Sensitivity
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {result.sensitivity.map((s, idx) => (
                      <div key={idx} className={`p-5 rounded-2xl border transition-all ${idx === 1 ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 bg-slate-50 opacity-70'}`}>
                        <div className="text-[10px] font-black text-slate-400 uppercase mb-1">{s.label}</div>
                        <div className="text-lg font-black mb-3">{s.rate.toFixed(1)}% Rate</div>
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-slate-500 uppercase tracking-tighter">Cash Flow:</span>
                          <span className={s.monthlyCashFlow >= 0 ? 'text-emerald-600' : 'text-red-600'}>{formatCurrency(s.monthlyCashFlow, result.property.currency)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grounding Sources Evidence List */}
                {result.property.groundingSources && result.property.groundingSources.length > 0 && (
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Underwriting Evidence (Source Data)</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.property.groundingSources.map((source, idx) => (
                        <a 
                          key={idx} 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm"
                        >
                          <LinkIcon className="w-3 h-3 text-slate-400" />
                          {source.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar: Risks & Verdict */}
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sticky top-28">
                   <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Asset Risk Model</h4>
                   <div className="space-y-8">
                    {result.risks.map(r => (
                      <div key={r.id}>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase mb-2">
                          <span>{r.label}</span>
                          <span className={r.score > 70 ? 'text-emerald-600' : r.score > 40 ? 'text-amber-600' : 'text-red-600'}>{r.score}/100</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-1000 ${r.score > 70 ? 'bg-emerald-500' : r.score > 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${r.score}%` }}></div>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 leading-relaxed font-bold uppercase tracking-tight">{r.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100 border-b-8 border-indigo-800">
                    <h4 className="font-black text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2 text-indigo-200">
                      <CheckCircle2 className="w-4 h-4" />
                      Final Conviction Verdict
                    </h4>
                    <p className="text-xs font-black leading-snug uppercase tracking-tight">
                      "{result.institutionalScores.verdict}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!result && !isLoading && (
          <div className="mt-20 py-32 text-center border-2 border-dashed border-slate-200 rounded-[3rem] bg-white group hover:border-indigo-400 transition-all cursor-pointer shadow-sm">
            <Settings2 className="w-20 h-20 text-slate-100 mx-auto mb-6 group-hover:text-indigo-100 transition-all" />
            <h3 className="text-2xl font-black text-slate-400 group-hover:text-slate-900 transition-all tracking-tight">System Ready for Asset Audit</h3>
            <p className="text-slate-300 font-bold max-w-sm mx-auto mt-3 uppercase tracking-tighter text-sm">Input listing URL to initiate risk-audit and conviction modeling.</p>
          </div>
        )}
      </main>

      <footer className="mt-20 border-t py-12 text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Institutional Analysis Engine &bull; PropQuant AI &bull; Refined v2.8
        </p>
      </footer>
    </div>
  );
}
