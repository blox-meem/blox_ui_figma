import { BloxF2RLanguages, convertToCode, convertToCodeText } from './convert';
import { downloadFile } from './download';
import { validate } from './validation';
import { CodeConvertionError, DownloadError, NavigationError, ObjectConvertionError, UnhandledKeyError, ValidationError } from './errors';

/*

const app = express();

app.get("/", (req, res) => {
  res.json({
    user: "meemsoossaas",
  });
});

app.listen(process.env.PORT || 3000);

*/

figma.showUI(__html__, {
  width: 700,
  height: 500,
  visible: true,
});

figma.ui.onmessage =  async (msg: {type: string, value?: string}) => {
  const currentPage = figma.currentPage;
  if (msg.type === 'check-password') {
    try {
      validate(msg.value!);
    } catch (error) {
      if (error instanceof ValidationError) {}
    } finally {
      
    }
  }
  if (msg.type === 'convert-to-code') {
    try {
      convertToCode(currentPage);
    } catch (error) {
      if (error instanceof CodeConvertionError) {}
    } finally {
      figma.closePlugin();
    }
  }
  if (msg.type === 'convert-to-object') {
    try {

    } catch (error) {
      if (error instanceof ObjectConvertionError) {}
    } finally {
      figma.closePlugin();
    }
  }
  if (msg.type === 'download') {
    try {
      await downloadFile(currentPage);
    } catch (error) {
      if (error instanceof DownloadError) {}
    } finally {
      
    }
  }
  if (msg.type === 'back-to-main') {
    try {

    } catch (error) {
      if (error instanceof NavigationError) {}
    } finally {

    }
  }
  if (msg.type === 'unhandled-key') {
    try {

    } catch (error) {
      if (error instanceof UnhandledKeyError) {}
    } finally {

    }
  }
};

figma.codegen.on("generate", (_: CodegenEvent) => {
  const page = figma.currentPage;
  return [
    convertToCodeText(page, BloxF2RLanguages.lua),
    convertToCodeText(page, BloxF2RLanguages.bloxUI),
    convertToCodeText(page, BloxF2RLanguages.dart),
  ];
});
