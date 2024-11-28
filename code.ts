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
