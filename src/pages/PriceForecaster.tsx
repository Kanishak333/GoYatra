import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { analyzeRoute, type AnalysisResult } from '../services/forecasterService';
import { Sparkles, MapPin, Calendar, TrendingUp, TrendingDown, Activity, ArrowRight } from 'lucide-react';
import Tilt from 'react-parallax-tilt';

const PriceForecaster = () => {
  const [from, setFrom] = useState('Delhi');
  const [to, setTo] = useState('Mumbai');
  const [month, setMonth] = useState('October');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const data = await analyzeRoute(from, to, month, "Flight");
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-content animate-fade-in" style={{ alignItems: 'flex-start', paddingTop: '4rem', paddingBottom: '4rem' }}>
      <div className="forecaster-container">
        {/* Header section */}
        <div className="forecaster-header">
          <div className="hero-subtitle-box inline-flex">
            <Sparkles size={18} className="icon-orange" />
            <span>AI Price Forecaster</span>
          </div>
          <h2 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '1rem', marginTop: '1rem' }}>
            Predict the Future of Travel Prices.
          </h2>
        </div>

        <div className="forecaster-content">
          {/* Controls Widget */}
          <div className="forecaster-controls glass-panel">
            <div className="form-group">
              <label>From</label>
              <div className="input-with-icon">
                <MapPin size={18} className="icon-red" />
                <input type="text" value={from} onChange={(e) => setFrom(e.target.value)} />
              </div>
            </div>
            
            <div className="form-group">
              <label>To</label>
              <div className="input-with-icon">
                <MapPin size={18} className="icon-red" />
                <input type="text" value={to} onChange={(e) => setTo(e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label>Month</label>
              <div className="input-with-icon">
                <Calendar size={18} className="icon-red" />
                <select className="destination-select" value={month} onChange={(e) => setMonth(e.target.value)}>
                  {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <button className="primary-btn w-full mt-4" style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }} onClick={handleAnalyze} disabled={loading}>
              {loading ? "Analyzing..." : "Generate AI Forecast"} {!loading && <ArrowRight size={18} />}
            </button>
          </div>

          {/* Results Area */}
          <div className="forecaster-results">
            {loading && (
              <div className="loading-state glass-panel">
                <div className="spinner"></div>
                <p>Saathi AI is analyzing market trends and capacities...</p>
              </div>
            )}

            {!loading && !result && (
              <div className="empty-state glass-panel">
                <Activity size={48} className="icon-muted" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p style={{ color: '#94a3b8' }}>Enter your route and click generate to see a highly accurate 30-day AI price prediction.</p>
              </div>
            )}

            {!loading && result && (
              <div className="results-grid animate-fade-in">
                {/* AI Insights Card */}
                <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} perspective={1000} scale={1.02} className="ai-insights-card glass-panel">
                  <div className="ai-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Sparkles size={24} className="icon-orange" />
                      <h3 style={{ margin: 0, color: 'white' }}>Saathi AI Insights</h3>
                    </div>
                    <span className="confidence-badge">{result.confidenceScore}% Confidence</span>
                  </div>
                  <div className="ai-body">
                    <p className="market-insights">"{result.aiInsights}"</p>
                    <div className="booking-advice">
                      <strong>Recommendation:</strong> {result.bestTimeToBook}
                    </div>
                  </div>
                </Tilt>

                {/* Stats Row */}
                <div className="stats-row">
                  <div className="stat-box glass-panel">
                    <span className="stat-label">Cheapest Price</span>
                    <span className="stat-value text-green">₹{result.cheapestPrice}</span>
                    <span className="stat-date">on {result.cheapestDay}</span>
                  </div>
                  <div className="stat-box glass-panel">
                    <span className="stat-label">Average Price</span>
                    <span className="stat-value text-orange">₹{result.currentAverage}</span>
                    <span className="stat-date flex-center gap-1">
                      {result.priceTrend === 'rising' ? <TrendingUp size={16}/> : <TrendingDown size={16}/>} 
                      {result.priceTrend} trend
                    </span>
                  </div>
                  <div className="stat-box glass-panel">
                    <span className="stat-label">Max Surge</span>
                    <span className="stat-value text-red">₹{result.maxPrice}</span>
                    <span className="stat-date">Peak demand</span>
                  </div>
                </div>

                {/* Chart Area */}
                <div className="chart-container glass-panel">
                  <h3 style={{ color: 'white', marginBottom: '1.5rem' }}>30-Day Price Trend</h3>
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <AreaChart data={result.priceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ff5a00" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#ff5a00" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="dayNum" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" domain={['dataMin - 1000', 'dataMax + 1000']} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                          formatter={(value: any) => [`₹${value}`, 'Price']}
                          labelFormatter={(label) => `Day ${label} (${result.month})`}
                        />
                        <Area type="monotone" dataKey="price" stroke="#ff5a00" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default PriceForecaster;
