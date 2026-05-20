async function testHubSpot() {
  console.log("Connecting to HubSpot Companies API...");
  const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN || '<HUBSPOT_ACCESS_TOKEN>';
  try {
    const url = 'https://api.hubapi.com/crm/v3/objects/companies?properties=name,annualrevenue,account_segment,health_score,renewal_date,next_qbr_date,industry,domain';
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const text = await response.text();
      console.error(`HubSpot API returned status ${response.status}:`, text);
      return;
    }
    
    const data = await response.json();
    console.log(`Success! Found ${data.results?.length || 0} companies.`);
    console.log("Sample company data:", JSON.stringify(data.results?.slice(0, 2), null, 2));
  } catch (e) {
    console.error("HubSpot fetching exception:", e.message);
  }
}

testHubSpot();
