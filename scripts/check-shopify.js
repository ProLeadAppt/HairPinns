import fs from 'fs';

const env = fs.readFileSync('d:/Dev/Hair Pinns/HairPinns/.env', 'utf8');
let domain, token, version;
env.split('\n').forEach(line => {
  if (line.startsWith('VITE_SHOPIFY_MYSHOPIFY_DOMAIN=')) domain = line.split('=')[1].trim();
  if (line.startsWith('VITE_SF_STOREFRONT_TOKEN=')) token = line.split('=')[1].trim();
  if (line.startsWith('VITE_SF_API_VERSION=')) version = line.split('=')[1].trim();
});

domain = domain.replace(/['"]/g, '');
token = token.replace(/['"]/g, '');
version = version.replace(/['"]/g, '');

fetch(`https://${domain}/api/${version}/graphql.json`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': token
  },
  body: JSON.stringify({ query: '{ products(first: 250) { pageInfo { hasNextPage } edges { node { handle } } } }' })
}).then(res => res.json()).then(data => console.log(JSON.stringify(data))).catch(console.error);
