import { Client } from 'pg';
import express from 'express';
import { convertToCode, convertToObject } from './src/convert';

const app = express();

app.get("/", (req, res) => {
  res.json({
    user: "meemsoossaas",
  });
});

app.listen(process.env.PORT || 3000);

figma.showUI(__html__, {width: 400, height: 250, visible: true});

figma.ui.onmessage =  (msg: {type: string, value?: string}) => {
  if (msg.type === 'check-password') {}
  if (msg.type === 'convert-to-code') {
    convertToCode(figma.currentPage);
  }
  if (msg.type === 'convert-to-object') {
    convertToObject(figma.currentPage);
  }
  if (msg.type === 'download') {}
  if (msg.type === 'back-to-main') {}
  if (msg.type === 'unhandled-key') {}
  figma.closePlugin();
};
