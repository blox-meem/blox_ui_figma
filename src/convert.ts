import { bloxUITitle, codeGenerationLanguage, dartTitle, luaCodeTitle } from "./constants";


export enum BloxF2RLanguages {
    lua,
    bloxUI,
    dart,
}

export function convertToCode(page: PageNode): void {
    const selection = page.selection;
}

export function convertToObject(page: PageNode): void {
    const selection = page.selection;
}

export function convertToCodeText(
    page: PageNode, 
    language: BloxF2RLanguages,
): CodegenResult {
    const selection = page.selection;
    const codeGenerationResult = generateCode(selection, language);
    switch (language) {
        case BloxF2RLanguages.lua:
            return {
                title: luaCodeTitle,
                language: codeGenerationLanguage, 
                code: codeGenerationResult, 
            };
        case BloxF2RLanguages.bloxUI:
            return {
                title:bloxUITitle,
                language: codeGenerationLanguage, 
                code: codeGenerationResult, 
            };
        case BloxF2RLanguages.dart:     
            return {
                title:dartTitle,
                language: codeGenerationLanguage, 
                code: codeGenerationResult, 
            };
    }
}

function generateCode(selection: readonly SceneNode[], language: BloxF2RLanguages): string {
    return '';
}
