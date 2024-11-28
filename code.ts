import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.PORT,
  ssl: {
    rejectUnauthorized: false,
  }
});

client.connect();

client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});

figma.showUI(__html__, {width: 400, height: 250, visible: true});

figma.ui.onmessage =  (msg: {type: string, value?: string}) => {
  if (msg.type === 'check-password') {}
  if (msg.type === 'convert-to-code') {}
  if (msg.type === 'convert-to-object') {}
  if (msg.type === 'download') {}
  if (msg.type === 'back-to-main') {}
  if (msg.type === 'unhandled-key') {}
  figma.closePlugin();
};
