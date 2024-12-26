import main, { 
  BloxF2RLanguages, 
  ConvertRunType, 
  convertToCode, 
} from './convert';

import { 
  exportFile 
} from './download';

import { 
  validate 
} from './validation';

import { 
  CodeConvertionError, 
  DownloadError, 
  NavigationError, 
  ObjectConvertionError, 
  UnhandledKeyError, 
  ValidationError 
} from './errors';
import { ExternalRobloxProperties } from './input';

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
      await main(
        ConvertRunType.convertToCode, 
        new Map<string, ExternalRobloxProperties>()
      );
    } catch (error) {
      if (error instanceof CodeConvertionError) {}
    } finally {
      figma.closePlugin();
    }
  }
  if (msg.type === 'convert-to-object') {
    try {
      await main(
        ConvertRunType.convertToObject,
        new Map<string, ExternalRobloxProperties>(),
      );
    } catch (error) {
      if (error instanceof ObjectConvertionError) {}
    } finally {
      figma.closePlugin();
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

figma.codegen.on("generate",  async (_: CodegenEvent) => await main(ConvertRunType.generateCode, new Map<string, ExternalRobloxProperties>()) as CodegenResult[]);
