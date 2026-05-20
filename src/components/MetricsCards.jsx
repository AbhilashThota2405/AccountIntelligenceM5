import React from 'react';

export default function MetricsCards({
  activeTab,
  setActiveTab,
  allAccountsCount,
  totalARR,
  renewalAccounts,
  renewalARR,
  upsellAccounts,
  upsellARR,
  churnAccounts,
  churnARR,
  formatVal
}) {
  return (
    <section className="metrics-grid">
      <div 
        className={`metric-card ${activeTab === "accounts" ? "active" : ""}`}
        onClick={() => setActiveTab("accounts")}
      >
        <div className="metric-label">Accounts Total</div>
        <div className="metric-val-row">
          <span className="metric-value">{formatVal(totalARR)}</span>
          <span className="metric-count">{allAccountsCount}</span>
        </div>
      </div>

      <div 
        className={`metric-card ${activeTab === "renewal" ? "active" : ""}`}
        onClick={() => setActiveTab("renewal")}
      >
        <div className="metric-label">Needs Engagement</div>
        <div className="metric-val-row">
          <span className="metric-value">{formatVal(renewalARR)}</span>
          <span className="metric-count">{renewalAccounts.length}</span>
        </div>
      </div>

      <div 
        className={`metric-card ${activeTab === "upsell" ? "active" : ""}`}
        onClick={() => setActiveTab("upsell")}
      >
        <div className="metric-label">Strategic Upsell</div>
        <div className="metric-val-row">
          <span className="metric-value">{formatVal(upsellARR)}</span>
          <span className="metric-count">{upsellAccounts.length}</span>
        </div>
      </div>

      <div 
        className={`metric-card ${activeTab === "churn" ? "active" : ""}`}
        onClick={() => setActiveTab("churn")}
      >
        <div className="metric-label">Renewing Soon</div>
        <div className="metric-val-row">
          <span className="metric-value">{formatVal(churnARR)}</span>
          <span className="metric-count">{churnAccounts.length}</span>
        </div>
      </div>
    </section>
  );
}
