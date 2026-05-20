const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN || '<HUBSPOT_ACCESS_TOKEN>';

async function testContactsAndDeals() {
  const contactsUrl = 'https://api.hubapi.com/crm/v3/objects/contacts?limit=5';
  const dealsUrl = 'https://api.hubapi.com/crm/v3/objects/deals?limit=5&properties=dealname,amount,dealstage,closedate';
  
  try {
    const contactsRes = await fetch(contactsUrl, {
      headers: { 'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}` }
    });
    const contactsData = await contactsRes.json();
    console.log("Found contacts:", contactsData.results?.length || 0);
    contactsData.results?.forEach((contact, idx) => {
      console.log(`Contact #${idx + 1}: ID: ${contact.id}, Name: ${contact.properties.firstname} ${contact.properties.lastname}, Email: ${contact.properties.email}`);
    });
    
    const dealsRes = await fetch(dealsUrl, {
      headers: { 'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}` }
    });
    const dealsData = await dealsRes.json();
    console.log("\nFound deals:", dealsData.results?.length || 0);
    dealsData.results?.forEach((deal, idx) => {
      console.log(`Deal #${idx + 1}: ID: ${deal.id}, Name: ${deal.properties.dealname}, Amount: ${deal.properties.amount}, Stage: ${deal.properties.dealstage}, Close Date: ${deal.properties.closedate}`);
    });
  } catch (e) {
    console.error("Exception:", e.message);
  }
}

testContactsAndDeals();
