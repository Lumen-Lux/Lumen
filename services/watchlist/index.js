const functions = require('@google-cloud/functions-framework');
const { Firestore } = require('@google-cloud/firestore');
const axios = require('axios');

const firestore = new Firestore();

functions.http('watchlist', async (req, res) => {
  // 1. Extraer posts de Reddit/Product Hunt (ejemplo simplificado)
  const resp = await axios.get('https://api.reddit.com/r/Entrepreneur/new?limit=10');
  const posts = resp.data.data.children.map(c => c.data.title);
  
  // 2. Guardar en Firestore con timestamp
  const batch = firestore.batch();
  posts.forEach((title, i) => {
    const ref = firestore.collection('watchlist').doc();
    batch.set(ref, { title, timestamp: Date.now() });
  });
  await batch.commit();
  res.status(200).send('Watchlist updated');
});
