import  {
  main, 
  ConvertRunType, 
} from './convert';

import { 
  validate 
} from './validation';

import { 
  CodeConvertionError, 
  NavigationError, 
  ObjectConvertionError, 
  UnhandledKeyError, 
  ValidationError 
} from './errors';

import { 
  ExternalRobloxProperties 
} from './input';

figma.showUI(__html__, {
  width: 500,
  height: 350,
  visible: true,
});

figma.ui.onmessage =  async (msg: {pluginMessage: string, value?: string}) => {
  console.log(1);
  console.log(msg);
  if (msg.pluginMessage === 'check-password') {
    console.log(1);
    try {
      console.log(1);
      validate(msg.value!);
    } catch (error) {
      if (error instanceof ValidationError) {}
    } finally {
      console.log(1);
    }
  }
  if (msg.pluginMessage === 'convert-to-code') {
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
  if (msg.pluginMessage === 'convert-to-object') {
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
  if (msg.pluginMessage === 'back-to-main') {
    try {

    } catch (error) {
      if (error instanceof NavigationError) {}
    } finally {

    }
  }
  if (msg.pluginMessage === 'unhandled-key') {
    try {

    } catch (error) {
      if (error instanceof UnhandledKeyError) {}
    } finally {

    }
  }
};

figma.codegen.on("generate",  async (_: CodegenEvent) => await main(ConvertRunType.generateCode, new Map<string, ExternalRobloxProperties>()) as CodegenResult[]);
