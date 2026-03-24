// netlify/functions/airtable-submit.js
// ─────────────────────────────────────────────────────────────────────────────
// Proxy sécurisé vers Airtable — 7Elite Road Show 2026
// Noms de champs alignés sur la table "Inscription" de la Base Road Show
// ─────────────────────────────────────────────────────────────────────────────

const AIRTABLE_BASE  = 'appaACRTxEWlYU5op';
const AIRTABLE_TABLE = 'tbloE8ObnJqeoJuCQ';

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  const token = process.env.AIRTABLE_TOKEN;
  if (!token) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'AIRTABLE_TOKEN manquant dans les variables Netlify.'
      }),
    };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Corps de requête invalide.' }),
    };
  }

  // Noms des champs = noms exacts des colonnes dans votre table Airtable "Inscription"
  const fields = {
    'Prénom':           data.prenom     || '',
    'Nom':              data.nom        || '',
    'Email':            data.email      || '',
    'Téléphone':        data.telephone  || '',
    'Fonction':         data.fonction   || '',
    'Type participant': data.type       || '',
    'Entreprise':       data.entreprise || '',
    'Source':           data.source     || '',
    'Date inscription': new Date().toISOString(),
    'Événement':        'Road Show 27 Mars 2026',
  };

  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE}/${AIRTABLE_TABLE}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields }),
      }
    );

    const json = await res.json();

    if (!res.ok) {
      return {
        statusCode: res.status,
        headers,
        body: JSON.stringify({ error: json.error?.message || 'Erreur Airtable.' }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, id: json.id }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erreur réseau : ' + err.message }),
    };
  }
};