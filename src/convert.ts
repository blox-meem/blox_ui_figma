import { 
    assert 
} from "console";

import { 
    luaCodeTitle 
} from "./constants";

import { 
    Color3,
    ColorSequence,
    ColorSequenceKeypoint,
    Font,
    FontStyle,
    Frame, 
    GuiBase, 
    ImageButton, 
    ImageLabel, 
    RobloxUI, 
    ScreenGui,
    ScreenGuiProperties,
    ScrollingFrame, 
    TextBox, 
    TextButton, 
    TextLabel, 
    TextTruncate, 
    TextXAlignment, 
    TextYAlignment, 
    UDim, 
    UDim2, 
    UIAspectRatioConstraint, 
    UICorner, 
    UIFlexItem, 
    UIGradient, 
    UIGridLayout, 
    UIListLayout, 
    UIPadding, 
    UIPageLayout, 
    UIScale, 
    UISizeConstraint, 
    UIStroke, 
    UITableLayout, 
    UITextSizeConstraint, 
    VideoFrame, 
    ViewportFrame, 
    ZIndexBehaviour 
} from "./lua";

import { 
    processNestedNodes, 
    SelectedComponentMap, 
    StringBuffer,
    toCamelCase
} from "./structure";

import { 
    ExternalFrameProperties, 
    ExternalImageButtonProperties, 
    ExternalImageLabelProperties, 
    ExternalRobloxProperties, 
    ExternalScrollingFrameProperties, 
    ExternalTextBoxProperties, 
    ExternalTextButtonProperties, 
    ExternalTextLabelProperties, 
    ExternalVideoFrameProperties, 
    ExternalViewportFrameProperties 
} from "./input";

import { 
    exportFile 
} from "./download";

export enum BloxF2RLanguages {
    lua,
    bloxUI,
    dart,
}

declare type Colors = ReadonlyArray<Paint>;

declare type Effects = ReadonlyArray<Effect>;

declare type StrokeAlign = "CENTER" | "INSIDE" | "OUTSIDE";

abstract class ColorData<COLORTYPE extends string | RGB | RGBA> {
    colorCode: COLORTYPE | undefined;

    constructor(colorCode: COLORTYPE | undefined) {
        this.colorCode = colorCode;
    }
}

export class HexColor extends ColorData<string> {
    constructor(params: {
        hexCode: string
    }) {
        super(params.hexCode);
    }
} 

export class RGBColor extends ColorData<RGB> implements RGB {
    r: number;
    g: number;
    b: number;

    constructor(params: {
        r: number,
        g: number,
        b: number,
    }) {
        super(undefined);
        this.r = params.r;
        this.g = params.g;
        this.b = params.b;
    }
}

export class RGBAColor extends ColorData<RGBA> implements RGBA {
    r: number;
    g: number;
    b: number;
    a: number;

    constructor(params: {
        r: number,
        g: number,
        b: number,
        a?: number,
    }) {
        super(undefined);
        this.r = params.r;
        this.g = params.g;
        this.b = params.b;
        this.a = params.a ?? 1;
    }
}

export class RGBOrRGBAColor extends ColorData<RGB | RGBA> implements RGB, RGBA {
    r: number;
    g: number;
    b: number;
    a: number;
    
    constructor(params: {
        r: number,
        g: number,
        b: number,
        a?: number,
    }) {
        super(undefined);
        this.r = params.r;
        this.g = params.g;
        this.b = params.b;
        this.a = params.a ?? 1;
    }
}

declare type ColorType = "SOLID" | GradientType | "IMAGE" | "VIDEO";

abstract class Color {
    color?: string | RGB | RGBA;
    colorType: ColorType | undefined;

    constructor(params: {
        color?: string | RGB | RGBA,
        colorType: ColorType | undefined,
    }) {
        this.color = params.color;
        this.colorType = params.colorType;
    }
}

export class MonoColor extends Color implements SolidPaint {
    type: "SOLID";
    color: RGB;
    visible?: boolean | undefined;
    opacity?: number | undefined;
    blendMode?: BlendMode | undefined;
    boundVariables?: { color?: VariableAlias | undefined; } | undefined;

    constructor(params: {
        color?: RGB,
        visible?: boolean | undefined,
        opacity?: number | undefined,
        blendMode?: BlendMode | undefined,
        boundVariables?: { color?: VariableAlias | undefined; } | undefined,
    }) {
        super({
            color: params.color ?? figma.util.rgb("#FFFFFF"),
            colorType: "SOLID",
        });
        this.type = "SOLID";
        this.color = params.color ?? figma.util.rgb("#FFFFFF");
        this.visible = params.visible;
        this.opacity = params.opacity;
        this.blendMode = params.blendMode;
        this.boundVariables = params.boundVariables;
    }
}

declare type GradientType = "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "GRADIENT_ANGULAR" | "GRADIENT_DIAMOND";

export class GradientStopColor extends Color implements ColorStop {
    position: number;
    color: RGBA;
    boundVariables?: { color?: VariableAlias | undefined; } | undefined;

    constructor(params: {
        position: number,
        color: RGBA,
        boundVariables?: { color?: VariableAlias | undefined; } | undefined,
    }) {
        super({
            color: params.color,
            colorType: undefined
        });
        this.position = params.position;
        this.color = params.color;
        this.boundVariables = params.boundVariables;
    }
}

export class GradientColor extends Color implements GradientPaint {
    type: GradientType;
    gradientTransform: Transform;
    gradientStops: readonly ColorStop[];
    visible?: boolean | undefined;
    opacity?: number | undefined;
    blendMode?: BlendMode | undefined;

    constructor(params: {
        type?: GradientType,
        gradientTransform?: Transform,
        gradientStops?: readonly ColorStop[],
        visible?: boolean | undefined,
        opacity?: number | undefined,
        blendMode?: BlendMode | undefined,
    }) {
        super({
            color: undefined,
            colorType: params.type ?? "GRADIENT_LINEAR",
        });
        this.type = params.type ?? "GRADIENT_LINEAR";
        this.gradientTransform = params.gradientTransform ?? [[255, 255, 255], [255, 255, 255]];
        this.gradientStops = params.gradientStops ?? [];
        this.visible = params.visible;
        this.opacity = params.opacity;
        this.blendMode = params.blendMode;
    }
}

declare type ScaleMode = "FILL" | "FIT" | "CROP" | "TILE";

export class ImageColor extends Color implements ImagePaint {
    type: "IMAGE";
    scaleMode: ScaleMode;
    imageHash: string | null;
    imageTransform?: Transform | undefined;
    scalingFactor?: number | undefined;
    rotation?: number | undefined;
    filters?: ImageFilters | undefined;
    visible?: boolean | undefined;
    opacity?: number | undefined;
    blendMode?: BlendMode | undefined;

    constructor(params: {
        scaleMode?: ScaleMode,
        imageHash?: string | null,
        imageTransform?: Transform | undefined,
        scalingFactor?: number | undefined,
        rotation?: number | undefined,
        filters?: ImageFilters | undefined,
        visible?: boolean | undefined,
        opacity?: number | undefined,
        blendMode?: BlendMode | undefined,
    }) {
        super({
            color: undefined,
            colorType: "IMAGE",
        });
        this.type = "IMAGE";
        this.scaleMode = params.scaleMode ?? "FILL";
        this.imageHash = params.imageHash ?? "";
        this.imageTransform = params.imageTransform;
        this.scalingFactor = params.scalingFactor;
        this.rotation = params.rotation;
        this.filters = params.filters;
        this.visible = params.visible;
        this.opacity = params.opacity;
        this.blendMode = params.blendMode;
    }
}

export class VideoColor extends Color implements VideoPaint {
    type: "VIDEO";
    scaleMode: ScaleMode;
    videoHash: string | null;
    videoTransform?: Transform | undefined;
    scalingFactor?: number | undefined;
    rotation?: number | undefined;
    filters?: ImageFilters | undefined;
    visible?: boolean | undefined;
    opacity?: number | undefined;
    blendMode?: BlendMode | undefined;

    constructor(params: {
        scaleMode?: ScaleMode,
        videoHash?: string | null,
        videoTransform?: Transform | undefined,
        scalingFactor?: number | undefined,
        rotation?: number | undefined,
        filters?: ImageFilters | undefined,
        visible?: boolean | undefined,
        opacity?: number | undefined,
        blendMode?: BlendMode | undefined,
    }) {
        super({
            color: undefined,
            colorType: "VIDEO",
        });
        this.type = "VIDEO";
        this.scaleMode = params.scaleMode ?? "FILL";
        this.videoHash = params.videoHash ?? "";
        this.videoTransform = params.videoTransform;
        this.scalingFactor = params.scalingFactor;
        this.rotation = params.rotation;
        this.filters = params.filters;
        this.visible = params.visible;
        this.opacity = params.opacity;
        this.blendMode = params.blendMode;
    }
}

//

interface RadiusObject {
    cornerRadius?: number;
    topLeftRadius?: number | undefined,
    topRightRadius?: number | undefined,
    bottomLeftRadius?: number | undefined,
    bottomRightRadius?: number | undefined,
}

interface VisibleObject {
    visible: boolean;
    opacity: number;
}

interface PositionObject {
    x: number;
    y: number;
}

interface SizeObject {
    width: number;
    height: number;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
}

interface ColorObject {
    fills: Colors;
}

interface StrokeObject {
    strokes: Colors;
    strokeWeight?: number | undefined;
    strokeTopWeight?: number | undefined;
    strokeBottomWeight?: number | undefined;
    strokeLeftWeight?: number | undefined;
    strokeRightWeight?: number | undefined;
    strokeJoin: StrokeJoin;
    strokeAlign: 'CENTER' | 'INSIDE' | 'OUTSIDE';
}

interface RotationObject {
    rotation: number;
}

interface EffectsObject {
    effects: Effects;
}

declare type ConstraintObject = Constraints;

abstract class FigmaObject<OBJECTTYPE> implements 
    RadiusObject, 
    VisibleObject, 
    PositionObject, 
    SizeObject, 
    ColorObject, 
    StrokeObject, 
    RotationObject, 
    ConstraintObject, 
    EffectsObject 
{
    name: string;

    figmaObjectType: OBJECTTYPE;
    
    cornerRadius?: number | undefined;
    topLeftRadius?: number | undefined;
    topRightRadius?: number | undefined;
    bottomLeftRadius?: number | undefined;
    bottomRightRadius?: number | undefined;
    
    visible: boolean;
    opacity: number;
    
    x: number;
    y: number;
    
    width: number;
    height: number;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    
    fills: Colors;
    
    strokes: Colors;
    strokeWeight?: number | undefined;
    strokeTopWeight?: number | undefined;
    strokeBottomWeight?: number | undefined;
    strokeLeftWeight?: number | undefined;
    strokeRightWeight?: number | undefined;
    strokeJoin: StrokeJoin;
    strokeAlign: StrokeAlign;
    
    rotation: number;
    
    horizontal: ConstraintType;
    vertical: ConstraintType;

    effects: Effects;
    
    constructor(params: {
        name: string,
        figmaObjectType: OBJECTTYPE,
        cornerRadius?: number | undefined,
        topLeftRadius?: number | undefined,
        topRightRadius?: number | undefined,
        bottomLeftRadius?: number | undefined,
        bottomRightRadius?: number | undefined,

        visible: boolean,
        opacity: number,
        
        x: number,
        y: number,
        
        width: number,
        height: number,
        minWidth?: number,
        maxWidth?: number,
        minHeight?: number,
        maxHeight?: number,
        
        fills: Colors,
        
        strokes: Colors,
        strokeWeight?: number | undefined,
        strokeTopWeight?: number | undefined,
        strokeBottomWeight?: number | undefined,
        strokeLeftWeight?: number | undefined,
        strokeRightWeight?: number | undefined,
        strokeJoin: StrokeJoin,
        strokeAlign: "CENTER" | "INSIDE" | "OUTSIDE",
        
        rotation: number,
        
        horizontal: ConstraintType,
        vertical: ConstraintType,

        effects: Effects,
    }) {
        assert(typeof params.cornerRadius === "undefined" 
            || typeof params.topLeftRadius === "number" 
            || typeof params.topRightRadius === "number"
            || typeof params.bottomLeftRadius === "number"
            || typeof params.bottomRightRadius === "number"
        );

        assert(typeof params.cornerRadius === "undefined" 
            || typeof params.topLeftRadius === "number" 
            || typeof params.topRightRadius === "number"
            || typeof params.bottomLeftRadius === "number"
            || typeof params.bottomRightRadius === "number"
        );

        this.name = params.name;

        this.figmaObjectType = params.figmaObjectType;

        this.cornerRadius = params.cornerRadius;
        this.topLeftRadius = params.topLeftRadius;
        this.topRightRadius = params.topRightRadius;
        this.bottomLeftRadius = params.bottomLeftRadius;
        this.bottomRightRadius = params.bottomRightRadius;

        this.visible = params.visible;
        this.opacity = params.opacity;

        this.x = params.x;
        this.y = params.y;

        this.width = params.width;
        this.height = params.height;
        this.minWidth = params.minWidth;
        this.maxWidth = params.maxWidth;
        this.minHeight = params.minHeight;
        this.maxHeight = params.maxHeight;
        
        this.fills = params.fills;

        this.strokes = params.strokes;
        this.strokeWeight = params.strokeWeight;
        this.strokeTopWeight = params.strokeTopWeight;
        this.strokeBottomWeight = params.strokeBottomWeight;
        this.strokeLeftWeight = params.strokeLeftWeight;
        this.strokeRightWeight = params.strokeRightWeight;
        this.strokeJoin = params.strokeJoin;
        this.strokeAlign = params.strokeAlign;

        this.rotation = params.rotation;

        this.horizontal = params.horizontal;
        this.vertical = params.vertical;

        this.effects = params.effects;
    }
}

declare type RectangleType = "FRAME" | "SCROLLINGFRAME" | "VIEWPORTFRAME";

declare type FigmaObjectParameters<OBJECTTYPE> = {
        name: string;

        figmaObjectType: OBJECTTYPE,

        cornerRadius?: number | undefined,
        topLeftRadius?: number,
        topRightRadius?: number,
        bottomLeftRadius?: number,
        bottomRightRadius?: number,

        visible?: boolean,
        opacity?: number,
        
        x?: number,
        y?: number,
        
        width?: number,
        height?: number,
        minWidth?: number,
        maxWidth?: number,
        minHeight?: number,
        maxHeight?: number,
        
        fills?: Colors,
        
        strokes?: Colors,
        strokeWeight?: number,
        strokeTopWeight?: number,
        strokeBottomWeight?: number,
        strokeLeftWeight?: number,
        strokeRightWeight?: number,
        strokeJoin?: StrokeJoin,
        strokeAlign?: "CENTER" | "INSIDE" | "OUTSIDE",
        
        rotation?: number,
        
        horizontal?: ConstraintType,
        vertical?: ConstraintType,

        effects?: Effects,
};

declare type GroupType = "GROUP";

export class FigmaGroup extends FigmaObject<GroupType> {
    constructor(params: FigmaObjectParameters<GroupType>) {
        super({
            name: params.name,

            figmaObjectType: params.figmaObjectType,

            cornerRadius: params.cornerRadius,
            topLeftRadius: params.topLeftRadius,
            topRightRadius: params.topRightRadius,
            bottomLeftRadius: params.bottomLeftRadius,
            bottomRightRadius: params.bottomRightRadius,
            
            visible: params.visible ?? true,
            opacity: params.opacity ?? 1,
            
            x: params.x ?? 0,
            y: params.y ?? 0,
            
            width: params.width ?? 100,
            height: params.height ?? 100,
            minWidth: params.minWidth,
            maxWidth: params.maxWidth,
            minHeight: params.minHeight,
            maxHeight: params.maxHeight,
            
            fills: params.fills ?? [new MonoColor({})],
            
            strokes: params.strokes ?? [],
            strokeWeight: params.strokeWeight,
            strokeTopWeight: params.strokeTopWeight,
            strokeBottomWeight: params.strokeBottomWeight,
            strokeLeftWeight: params.strokeLeftWeight,
            strokeRightWeight: params.strokeRightWeight,
            strokeJoin: params.strokeJoin ?? "MITER",
            strokeAlign: params.strokeAlign ?? "CENTER",
            
            rotation: params.rotation ?? 0,
        
            horizontal: params.horizontal ?? "CENTER",
            vertical: params.vertical ?? "CENTER",
            
            effects: params.effects ?? [],
        });
    }
}

export class FigmaRectangle extends FigmaObject<RectangleType> {
    constructor(params: FigmaObjectParameters<RectangleType>) {
        super({
            name: params.name,

            figmaObjectType: params.figmaObjectType,
            
            cornerRadius: params.cornerRadius,
            topLeftRadius: params.topLeftRadius,
            topRightRadius: params.topRightRadius,
            bottomLeftRadius: params.bottomLeftRadius,
            bottomRightRadius: params.bottomRightRadius,
            
            visible: params.visible ?? true,
            opacity: params.opacity ?? 1,
            
            x: params.x ?? 0,
            y: params.y ?? 0,
            
            width: params.width ?? 100,
            height: params.height ?? 100,
            minWidth: params.minWidth,
            maxWidth: params.maxWidth,
            minHeight: params.minHeight,
            maxHeight: params.maxHeight,
            
            fills: params.fills ?? [new MonoColor({})],
            
            strokes: params.strokes ?? [],
            strokeWeight: params.strokeWeight,
            strokeTopWeight: params.strokeTopWeight,
            strokeBottomWeight: params.strokeBottomWeight,
            strokeLeftWeight: params.strokeLeftWeight,
            strokeRightWeight: params.strokeRightWeight,
            strokeJoin: params.strokeJoin ?? "MITER",
            strokeAlign: params.strokeAlign ?? "CENTER",
            
            rotation: params.rotation ?? 0,
            
            horizontal: params.horizontal ?? "CENTER",
            vertical: params.vertical ?? "CENTER",
            
            effects: params.effects ?? [],
        });
    }
}

declare type EllipseType = "FRAME" | "TEXTBUTTON";

export class FigmaEllipse extends FigmaObject<EllipseType> {
    constructor(params: FigmaObjectParameters<EllipseType>) {
        super({
            name: params.name,

            figmaObjectType: params.figmaObjectType,

            cornerRadius: params.cornerRadius,
            topLeftRadius: params.topLeftRadius,
            topRightRadius: params.topRightRadius,
            bottomLeftRadius: params.bottomLeftRadius,
            bottomRightRadius: params.bottomRightRadius,
            
            visible: params.visible ?? true,
            opacity: params.opacity ?? 1,
            
            x: params.x ?? 0,
            y: params.y ?? 0,
            
            width: params.width ?? 100,
            height: params.height ?? 100,
            minWidth: params.minWidth,
            maxWidth: params.maxWidth,
            minHeight: params.minHeight,
            maxHeight: params.maxHeight,
            
            fills: params.fills ?? [new MonoColor({})],
            
            strokes: params.strokes ?? [],
            strokeWeight: params.strokeWeight,
            strokeTopWeight: params.strokeTopWeight,
            strokeBottomWeight: params.strokeBottomWeight,
            strokeLeftWeight: params.strokeLeftWeight,
            strokeRightWeight: params.strokeRightWeight,
            strokeJoin: params.strokeJoin ?? "MITER",
            strokeAlign: params.strokeAlign ?? "CENTER",
            
            rotation: params.rotation ?? 0,
        
            horizontal: params.horizontal ?? "CENTER",
            vertical: params.vertical ?? "CENTER",
            
            effects: params.effects ?? [],
        });
    }

    get isACircle(): boolean {
        return this.width == this.height;
    }
}

declare type TextType = "TEXTLABEL" | "TEXTBUTTON" | "TEXTBOX";

export declare type TextAlignHorizontal = 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED';

export declare type TextAlignVertical = 'TOP' | 'CENTER' | 'BOTTOM';

export class Alignment {
    horizontal: TextAlignHorizontal;
    vertical: TextAlignVertical;
    
    constructor(params: {
        horizontal?: TextAlignHorizontal,
        vertical?: TextAlignVertical,
    }) {
        this.horizontal = params.horizontal ?? "CENTER";
        this.vertical = params.vertical ?? "CENTER";
    }
}

export declare type TextAutoResize = 'NONE' | 'WIDTH_AND_HEIGHT' | 'HEIGHT' | 'TRUNCATE';

export declare type TextTruncation = 'DISABLED' | 'ENDING';

class FigmaFont implements FontName {
    fontSize: number;
    fontWeight: number;
    family: string;
    style: string;

    constructor(params: {
        fontSize?: number,
        fontWeight?: number,
        family?: string,
        style?: string,
    }) {
        this.fontSize = params.fontSize ?? 12;
        this.fontWeight = params.fontWeight ?? 300;
        this.family = params.family ?? "Inter";
        this.style = params.style ?? "Regular";
    }
}

export class TextStyle {
    truncation: TextTruncation;
    maxLines: number | null;
    paragraphIndent: number;
    paragraphSpacing: number;
    listSpacing: number;
    hangingPunctuation: boolean;
    hangingList: boolean;
    case: TextCase;
    decoration: TextDecoration;
    letterSpacing: LetterSpacing;
    lineHeight: LineHeight;

    constructor(params: {
        truncation?: TextTruncation,
        maxLines?: number | null,
        paragraphIndent?: number,
        paragraphSpacing?: number,
        listSpacing?: number,
        hangingPunctuation?: boolean,
        hangingList?: boolean,
        case?: TextCase,
        decoration?: TextDecoration,
        letterSpacing?: LetterSpacing,
        lineHeight?: LineHeight,
        richText?: boolean,
    }) {
        this.truncation = params.truncation ?? "DISABLED";
        this.maxLines = params.maxLines ?? null;
        this.paragraphIndent = params.paragraphIndent ?? 0;
        this.paragraphSpacing = params.paragraphSpacing ?? 0;
        this.listSpacing = params.listSpacing ?? 0;
        this.hangingPunctuation = params.hangingPunctuation ?? false;
        this.hangingList = params.hangingList ?? false;
        this.case = params.case ?? "ORIGINAL";
        this.decoration = params.decoration ?? "NONE";
        this.letterSpacing = params.letterSpacing ?? {
            unit: "PERCENT",
            value: 0,
        };
        this.lineHeight = params.lineHeight ?? {unit: "PIXELS", value: 0};
    }
}

interface TextObject {
    alignment: Alignment;
    autoResize: TextAutoResize;
    text: string;
    font: FigmaFont;
    textStyle: TextStyle;

    hasMissinFont(fontName: FontName): Promise<boolean>;
}

declare type FigmaTextParameters = {
    name: string;

    figmaObjectType: TextType,

    alignment?: Alignment,
    autoResize?: TextAutoResize,
    text?: string,
    font?: FigmaFont,
    textStyle?: TextStyle,

    cornerRadius?: number | undefined,
    topLeftRadius?: number | undefined,
    topRightRadius?: number | undefined,
    bottomLeftRadius?: number | undefined,
    bottomRightRadius?: number | undefined,

    visible?: boolean,
    opacity?: number,
    
    x?: number,
    y?: number,
    
    width?: number,
    height?: number,
    minWidth?: number,
    maxWidth?: number,
    minHeight?: number,
    maxHeight?: number,
    
    fills?: Colors,
    
    strokes?: Colors,
    strokeWeight?: number | undefined,
    strokeTopWeight?: number | undefined,
    strokeBottomWeight?: number | undefined,
    strokeLeftWeight?: number | undefined,
    strokeRightWeight?: number | undefined,
    strokeJoin?: StrokeJoin,
    strokeAlign?: "CENTER" | "INSIDE" | "OUTSIDE",
    
    rotation?: number,
    
    horizontal?: ConstraintType,
    vertical?: ConstraintType,

    effects?: Effects,   
};

export class FigmaText extends FigmaObject<TextType> implements TextObject {
    alignment: Alignment;
    autoResize: TextAutoResize;
    text: string;
    font: FigmaFont;
    textStyle: TextStyle;
    
    constructor(params: FigmaTextParameters) {
        super({
            name: params.name,

            figmaObjectType: params.figmaObjectType,

            cornerRadius: params.cornerRadius,
            topLeftRadius: params.topLeftRadius,
            topRightRadius: params.topRightRadius,
            bottomLeftRadius: params.bottomLeftRadius,
            bottomRightRadius: params.bottomRightRadius,
            
            visible: params.visible ?? true,
            opacity: params.opacity ?? 0,
            
            x: params.x ?? 0,
            y: params.y ?? 0,
            
            width: params.width ?? 0,
            height: params.width ?? 15,
            minWidth: params.minWidth,
            maxWidth: params.maxWidth,
            minHeight: params.minHeight,
            maxHeight: params.maxHeight,

            fills: params.fills ?? [],
            
            strokes: params.strokes ?? [],
            strokeWeight: params.strokeWeight,
            strokeTopWeight: params.strokeTopWeight,
            strokeBottomWeight: params.strokeBottomWeight,
            strokeLeftWeight: params.strokeLeftWeight,
            strokeRightWeight: params.strokeRightWeight,
            strokeJoin: params.strokeJoin ?? "MITER",
            strokeAlign: params.strokeAlign ?? "CENTER",
            
            rotation: params.rotation ?? 0,
            
            horizontal: params.horizontal ?? "CENTER",
            vertical: params.vertical ?? "CENTER",
            
            effects: params.effects ?? [],
        });
        this.alignment = params.alignment ?? new Alignment({});
        this.autoResize = params.autoResize ?? "WIDTH_AND_HEIGHT";
        this.text = params.text ?? "";
        this.font = params.font ?? new FigmaFont({});
        this.textStyle = params.textStyle ?? new TextStyle({});
    }

    async hasMissinFont(fontName: FontName): Promise<boolean> {
        await figma.loadFontAsync(fontName).then((_) => {
            return new Promise<boolean>(() => true);
        });
        return new Promise<boolean>((_) => false);
    }
}

declare type ImageType = "IMAGELABEL" | "IMAGEBUTTON";

interface ImageObject {
    hash: string;
}

declare type FigmaObjectAssetParameters<OBJECTTYPE> = {
    hash?: string;

    name: string;

    figmaObjectType: OBJECTTYPE,

    alignment?: Alignment,
    autoResize?: TextAutoResize,
    text?: string,
    font?: FigmaFont,
    textStyle?: TextStyle,

    cornerRadius?: number | undefined,
    topLeftRadius?: number | undefined,
    topRightRadius?: number | undefined,
    bottomLeftRadius?: number | undefined,
    bottomRightRadius?: number | undefined,

    visible?: boolean,
    opacity?: number,
    
    x?: number,
    y?: number,
    
    width?: number,
    height?: number,
    minWidth?: number,
    maxWidth?: number,
    minHeight?: number,
    maxHeight?: number,
    
    fills?: Colors,
    
    strokes?: Colors,
    strokeWeight?: number | undefined,
    strokeTopWeight?: number | undefined,
    strokeBottomWeight?: number | undefined,
    strokeLeftWeight?: number | undefined,
    strokeRightWeight?: number | undefined,
    strokeJoin?: StrokeJoin,
    strokeAlign?: "CENTER" | "INSIDE" | "OUTSIDE",
    
    rotation?: number,
    
    horizontal?: ConstraintType,
    vertical?: ConstraintType,

    effects?: Effects,
};

export class FigmaImage extends FigmaObject<ImageType> implements ImageObject {
    hash: string;

    constructor(params: FigmaObjectAssetParameters<ImageType>) {
        super({
            name: params.name,

            figmaObjectType: params.figmaObjectType,

            cornerRadius: params.cornerRadius,
            topLeftRadius: params.topLeftRadius,
            topRightRadius: params.topRightRadius,
            bottomLeftRadius: params.bottomLeftRadius,
            bottomRightRadius: params.bottomRightRadius,
            
            visible: params.visible ?? true,
            opacity: params.opacity ?? 0,
            
            x: params.x ?? 0,
            y: params.y ?? 0,
            
            width: params.width ?? 0,
            height: params.width ?? 15,
            minWidth: params.minWidth,
            maxWidth: params.maxWidth,
            minHeight: params.minHeight,
            maxHeight: params.maxHeight,

            fills: params.fills ?? [],
            
            strokes: params.strokes ?? [],
            strokeWeight: params.strokeWeight,
            strokeTopWeight: params.strokeTopWeight,
            strokeBottomWeight: params.strokeBottomWeight,
            strokeLeftWeight: params.strokeLeftWeight,
            strokeRightWeight: params.strokeRightWeight,
            strokeJoin: params.strokeJoin ?? "MITER",
            strokeAlign: params.strokeAlign ?? "CENTER",
            
            rotation: params.rotation ?? 0,
            
            horizontal: params.horizontal ?? "CENTER",
            vertical: params.vertical ?? "CENTER",
            
            effects: params.effects ?? [],
        });
        this.hash = params.hash ?? "";
    }

    async assignSize(image: Image, setAsMinimumSize: boolean): Promise<void> {
        assert(this.hash == image.hash);
        const size = await image.getSizeAsync();
        this.width = size.width;
        this.height = size.height;
        if (setAsMinimumSize) {
            this.minWidth = size.width;
            this.minHeight = size.height;
        }
    }
}

declare type VideoType = "VIDEOFRAME";

interface VideoObject {
    hash: string;
}

export class FigmaVideo extends FigmaObject<VideoType> implements VideoObject {
    hash: string;

    constructor(params: FigmaObjectAssetParameters<VideoType>) {
        super({
            name: params.name,

            figmaObjectType: "VIDEOFRAME",

            cornerRadius: params.cornerRadius,
            topLeftRadius: params.topLeftRadius,
            topRightRadius: params.topRightRadius,
            bottomLeftRadius: params.bottomLeftRadius,
            bottomRightRadius: params.bottomRightRadius,
            
            visible: params.visible ?? true,
            opacity: params.opacity ?? 0,
            
            x: params.x ?? 0,
            y: params.y ?? 0,
            
            width: params.width ?? 0,
            height: params.width ?? 15,
            minWidth: params.minWidth,
            maxWidth: params.maxWidth,
            minHeight: params.minHeight,
            maxHeight: params.maxHeight,

            fills: params.fills ?? [],
            
            strokes: params.strokes ?? [],
            strokeWeight: params.strokeWeight,
            strokeTopWeight: params.strokeTopWeight,
            strokeBottomWeight: params.strokeBottomWeight,
            strokeLeftWeight: params.strokeLeftWeight,
            strokeRightWeight: params.strokeRightWeight,
            strokeJoin: params.strokeJoin ?? "MITER",
            strokeAlign: params.strokeAlign ?? "CENTER",
            
            rotation: params.rotation ?? 0,
            
            horizontal: params.horizontal ?? "CENTER",
            vertical: params.vertical ?? "CENTER",
            
            effects: params.effects ?? [],
        });
        this.hash = params.hash ?? "";
    }
}

declare type FrameType = "SCROLLINGFRAME";

export class FigmaFrame extends FigmaObject<FrameType> {
    constructor(params: FigmaObjectParameters<FrameType>) {
        super({
            name: params.name,

            figmaObjectType: params.figmaObjectType,

            cornerRadius: params.cornerRadius,
            topLeftRadius: params.topLeftRadius,
            topRightRadius: params.topRightRadius,
            bottomLeftRadius: params.bottomLeftRadius,
            bottomRightRadius: params.bottomRightRadius,
            
            visible: params.visible ?? true,
            opacity: params.opacity ?? 1,
            
            x: params.x ?? 0,
            y: params.y ?? 0,
            
            width: params.width ?? 100,
            height: params.height ?? 100,
            minWidth: params.minWidth,
            maxWidth: params.maxWidth,
            minHeight: params.minHeight,
            maxHeight: params.maxHeight,
            
            fills: params.fills ?? [new MonoColor({})],
            
            strokes: params.strokes ?? [],
            strokeWeight: params.strokeWeight,
            strokeTopWeight: params.strokeTopWeight,
            strokeBottomWeight: params.strokeBottomWeight,
            strokeLeftWeight: params.strokeLeftWeight,
            strokeRightWeight: params.strokeRightWeight,
            strokeJoin: params.strokeJoin ?? "MITER",
            strokeAlign: params.strokeAlign ?? "CENTER",
            
            rotation: params.rotation ?? 0,
        
            horizontal: params.horizontal ?? "CENTER",
            vertical: params.vertical ?? "CENTER",
            
            effects: params.effects ?? [],
        });
    }
}

//

interface RobloxConstraintWrapper {}

interface WholeRobloxConstraintWrapper extends RobloxConstraintWrapper {
    aspectRatio?: UIAspectRatioConstraint;
    corner?: UICorner;
    flexItem?: UIFlexItem;
    gradient?: UIGradient;
    padding?: UIPadding;
    scale?: UIScale;
    size?: UISizeConstraint;
    stroke?: UIStroke;
    textSize?: UITextSizeConstraint;
}

interface RobloxUIGridStyleWrapper<LAYOUT extends UIGridLayout | UIListLayout | UIPageLayout | UITableLayout> extends RobloxConstraintWrapper {
    layout: LAYOUT;
}

export declare type RobloxUIType = RectangleType | EllipseType | TextType;

//

export const keyProperties: Array<string> = [
    // Instance
    "NAME",
    "PARENT",
    // GuiObject
    "BACKGROUNDCOLOR3",
    "BACKGROUNDTRANSPARENCY",
    "CLIPDESCENDANTS",
    "POSTION",
    "ROTATION",
    "SIZE",
    "VISIBLE",
    // ScrollingFrame
    "CANVASIZE",
    // VideoFrame
    "VIDEO",
    // ViewportFrame
    "IMAGECOLOR3",
    "IMAGETRANSPARENCY",
    // ImageLabel & ImageButton
    "IMAGE",
    // TextLabel
    "FONTFACE",
    "LINEHEIGHT",
    "TEXT",
    "TEXTCOLOR3",
    "TEXTSIZE",
    "TEXTTRANSPARENCY",
    "TEXTTRUNCATE",
    "TEXTXALLIGNMENT",
    "TEXTYALLIGNMENT",
];

export const ignorableProperties: Array<string> = [
    // GuiBase
    "AUTOLOCALIZE",
    "ROOTLOCALIZATIONTABLE",
    "SELECTIONBEHAVIORDOWN",
    "SELECTIONBEHAVIORLEFT",
    "SELECTIONBEHAVIORRIGHT",
    "SELECTIONBEHAVIORUP",
    "SELECTIONGROUP",
    // GuiObject
    "ACTIVE",
    "ANCHORPOINT",
    "AUTOMATICSIZE",
    "BORDERCOLOR3",
    "BORDERMODE",
    "BORDERSIZEPIXEL",
    "INTERACTABLE",
    "LAYOUTORDER",
    "NEXTSELECTIONDOWN",
    "NEXTSELECTIONLEFT",
    "NEXTSELECTIONRIGHT",
    "NEXTSELECTIONUP",
    "SELECTABLE",
    "SELECTIONIMAGEOBJECT",
    "SELECTIONORDER",
    "SIZECONSTRAINT",
    "ZINDEX",
    // GuiButton
    "AUTOBUTTONCOLOR",
    "MODAL",
    "SELECTED",
    "STYLE",
    // Frame
    "FRAMESTYLE",
    // ScrollingFrame
    "AUTOMATICCANVASSIZE",
    "BOTTOMIMAGE",
    "CANVASPOSTION",
    "ELASTICBEHAVIOR",
    "HORIZONTALSCROLLBARINSET",
    "MIDIMAGE",
    "SCROLLBARIMAGECOLOR3",
    "SCROLLBARIMAGETRANSPARENCY",
    "SCROLLBARTHICKNESS",
    "SCROLLINGDIRECTION",
    "SCROLLINGENABLED",
    "TOPIMAGE",
    "VERTICALSCROLLBARINSET",
    "VERTICALSCROLLBARPOSITION",
    // VideoFrame
    "LOOPED",
    "PLAYING",
    "TIMEPOSITION",
    "VOLUME",
    // ViewportFrame
    "AMBIENT",
    "CURRENTCAMERA",
    "LIGHTCOLOR",
    "LIGHTDIRECTION",
    // ImageLabel & ImageButton
    "IMAGERECTOFFSET",
    "IMAGERECTSIZE",
    "RESAMPLEMODE",
    "SCALETYPE",
    "SLICECENTER",
    "SLICESCALE",
    "TILESIZE",
    // ImageButton
    "HOVERIMAGE",
    "PRESSEDIMAGE",
    // TextLabel & TextButton
    "MAXVISIBLEGRAPHEMES",
    "OPENTYPEFEATURES",
    "RICHTEXT",
    "TEXTDIRECTION",
    "TEXTSCALED",
    "TEXTSTROKECOLOR",
    "TEXTSTROKETRANSPARENCY",
    "TEXTWRAPPED",
    // TextBox
    "CLEARTEXTFOCUS",
    "CURSORPOSITION",
    "MULTILINE",
    "PLACEHOLDERCOLOR3",
    "PLACEHOLDERTEXT",
    "SELECTIONSTART",
    "SHOWNATIVEINPUT",
    "TEXTEDITABLE",
];

abstract class ParsableConverterObject<T> {
    propertyName: string;
    propertyValue: T;

    constructor(params: {propertyName: string, propertyValue: T}) {
        this.propertyName = params.propertyName;
        this.propertyValue = params.propertyValue;
    }
}

class ParsableRobloxProperty<T> extends ParsableConverterObject<T> {
    constructor(params: {
        propertyName: string, 
        propertyValue: T,  
    }) {
        super({
            propertyName: params.propertyName,
            propertyValue: params.propertyValue,
        });
    }
}

declare type Parsable = any;

class RobloxPropertyParser {
    private static instance: RobloxPropertyParser | null = null;

    public static getInstance(): RobloxPropertyParser {
        if (!RobloxPropertyParser.instance) {
            RobloxPropertyParser.instance = new RobloxPropertyParser();
        }
        return RobloxPropertyParser.instance;
    }

    private constructor() {}

    parse(obj: Parsable): any {

    }
}

declare type FigmaColors = Paint;


export function toRobloxColor(figmaColor: FigmaColors): Color3 | ColorSequence {
    switch (figmaColor.type) {
        case "SOLID":
            const color: RGB = figmaColor.color;
            return new Color3(color.r, color.g, color.b);
        case "GRADIENT_LINEAR":
            const linearStops: ColorSequenceKeypoint[] = [];
            for (const stop of figmaColor.gradientStops) {
                const stopColor = stop.color;
                const keypoint = new ColorSequenceKeypoint(stop.position, new Color3(stopColor.r, stopColor.g, stopColor.b));
                linearStops.push(keypoint);
            }
            linearStops.sort((prev, current) => prev.time - current.time);
            return new ColorSequence(linearStops);
        default:
            throw Error("Unimplemented Figma paint type");
    }
}

declare type ImageNode = { type: "IMAGE", data: Uint8Array };

declare type VideoNode = { type: "VIDEO", data: Uint8Array };

declare type FigmaObjectType = RectangleNode | EllipseNode | TextNode | ImageNode | VideoNode | FrameNode | GroupNode;

declare type FigmaObjectReturnType = FigmaRectangle | FigmaEllipse | FigmaText | FigmaImage | FigmaVideo | FigmaGroup | FigmaFrame; 

export async function convertFigmaToFigmaObject(node: FigmaObjectType, typeValue?: ImageType | VideoType): Promise<FigmaObjectReturnType> {
    switch (node.type) {
        case "RECTANGLE":
            const rectangleClone: RectangleNode = (node as RectangleNode).clone();
            const rectangleComponent: ComponentNode = figma.createComponentFromNode(rectangleClone);
            return new FigmaRectangle({
                name: rectangleClone.name,

                figmaObjectType: rectangleComponent.componentPropertyDefinitions["FIGMAOBJECTTYPE"].defaultValue as RectangleType,
                
                cornerRadius: rectangleClone.cornerRadius as number,
                topLeftRadius: rectangleClone.topLeftRadius,
                topRightRadius: rectangleClone.topRightRadius,
                bottomLeftRadius: rectangleClone.bottomLeftRadius,
                bottomRightRadius: rectangleClone.bottomRightRadius,
                
                visible: rectangleClone.visible,
                opacity: rectangleClone.opacity,

                x: rectangleClone.x,
                y: rectangleClone.y,

                width: rectangleClone.width,
                height: rectangleClone.height,
                minWidth: rectangleClone.minWidth ?? undefined,
                maxWidth: rectangleClone.maxWidth ?? undefined,
                minHeight: rectangleClone.minHeight ?? undefined,
                maxHeight: rectangleClone.maxHeight ?? undefined,

                fills: rectangleClone.fills as readonly Paint[],

                strokes: rectangleClone.strokes,
                strokeTopWeight: rectangleClone.strokeTopWeight,
                strokeBottomWeight: rectangleClone.strokeBottomWeight,
                strokeLeftWeight: rectangleClone.strokeLeftWeight,
                strokeRightWeight: rectangleClone.strokeRightWeight,
                strokeJoin: rectangleClone.strokeJoin as StrokeJoin ?? figma.mixed,
                strokeAlign: rectangleClone.strokeAlign ?? undefined,
                
                rotation: rectangleClone.rotation ?? 0,
                
                horizontal: rectangleClone.constraints.horizontal,
                vertical: rectangleClone.constraints.vertical,
                
                effects: rectangleClone.effects,
            });
        case "ELLIPSE":
            const ellipseClone: EllipseNode = (node as EllipseNode).clone();
            const ellipseComponent: ComponentNode = figma.createComponentFromNode(ellipseClone);
            return new FigmaEllipse({
                name: ellipseClone.name,

                figmaObjectType: ellipseComponent.componentPropertyDefinitions["FIGMAOBJECTTYPE"].defaultValue as EllipseType,
            
                cornerRadius: ellipseClone.cornerRadius as number,
                
                visible: ellipseClone.visible,
                opacity: ellipseClone.opacity,

                x: ellipseClone.x,
                y: ellipseClone.y,

                width: ellipseClone.width,
                height: ellipseClone.height,
                minWidth: ellipseClone.minWidth ?? undefined,
                maxWidth: ellipseClone.maxWidth ?? undefined,
                minHeight: ellipseClone.minHeight ?? undefined,
                maxHeight: ellipseClone.maxHeight ?? undefined,

                fills: ellipseClone.fills as readonly Paint[],

                strokes: ellipseClone.strokes,
                strokeWeight: ellipseClone.strokeWeight as number ?? undefined,
                strokeJoin: ellipseClone.strokeJoin as StrokeJoin ?? figma.mixed,
                strokeAlign: ellipseClone.strokeAlign ?? undefined,
                
                rotation: ellipseClone.rotation ?? 0,
                
                horizontal: ellipseClone.constraints.horizontal,
                vertical: ellipseClone.constraints.vertical,
                
                effects: ellipseClone.effects,
            });
        case "TEXT":
            const textClone: TextNode = (node as TextNode).clone();
            const textComponent: ComponentNode = figma.createComponentFromNode(textClone);
            return new FigmaText({
                name: textClone.name,

                figmaObjectType: textComponent.componentPropertyDefinitions["FIGMAOBJECTTYPE"].defaultValue as TextType,  
                
                alignment: new Alignment({
                    horizontal: textClone.textAlignHorizontal,
                    vertical: textClone.textAlignVertical,
                }),
                autoResize: textClone.textAutoResize,
                text: textClone.characters,
                font: new FigmaFont({
                    fontSize: textClone.fontSize as number,
                    fontWeight: textClone.fontWeight as number,
                    family: (textClone.fontName as FontName).family,
                    style: (textClone.fontName as FontName).style,
                }),
                textStyle: new TextStyle({
                    truncation: textClone.textTruncation,
                    maxLines: textClone.maxLines,
                    paragraphIndent: textClone.paragraphIndent,
                    paragraphSpacing: textClone.paragraphSpacing,
                    listSpacing: textClone.listSpacing,
                    hangingPunctuation: textClone.hangingPunctuation,
                    hangingList: textClone.hangingList,
                    case: textClone.textCase as TextCase,
                    decoration: textClone.textDecoration as TextDecoration,
                    letterSpacing: textClone.letterSpacing as LetterSpacing,
                    lineHeight: textClone.lineHeight as LineHeight,
                }),

                visible: textClone.visible,
                opacity: textClone.opacity,
                
                x: textClone.x,
                y: textClone.y,
                
                width: textClone.width,
                height: textClone.width,
                minWidth: textClone.minWidth ?? undefined,
                maxWidth: textClone.maxWidth ?? undefined,
                minHeight: textClone.minHeight ?? undefined,
                maxHeight: textClone.maxHeight ?? undefined,
    
                fills: textClone.fills as readonly Paint[] ?? undefined,
                
                strokes: textClone.strokes ?? [],
                strokeWeight: textClone.strokeWeight as number ?? undefined,
                strokeJoin: textClone.strokeJoin as StrokeJoin ?? undefined,
                strokeAlign: textClone.strokeAlign,
                
                rotation: textClone.rotation,
                
                horizontal: textClone.constraints.horizontal,
                vertical: textClone.constraints.vertical,

                effects: textClone.effects ?? [],
            });
        case "IMAGE":
            const imageRectangle: RectangleNode = figma.createRectangle();
            const image: Image = figma.createImage(node.data);
            const {width, height} = await image.getSizeAsync();
            imageRectangle.resize(width, height);
            imageRectangle.fills = [
                {
                    type: "IMAGE",
                    imageHash: image.hash,
                    scaleMode: "FILL",
                }
            ]
            const imageComponent: ComponentNode = figma.createComponentFromNode(imageRectangle);
            imageComponent.addComponentProperty("FIGMAOBJECTTYPE", "TEXT", typeValue as ImageType);
            return new FigmaImage({
                name: image.hash,

                figmaObjectType: imageComponent.componentPropertyDefinitions["FIGMAOBJECTTYPE"].defaultValue as ImageType,
                
                cornerRadius: imageRectangle.cornerRadius as number,
                topLeftRadius: imageRectangle.topLeftRadius,
                topRightRadius: imageRectangle.topRightRadius,
                bottomLeftRadius: imageRectangle.bottomLeftRadius,
                bottomRightRadius: imageRectangle.bottomRightRadius,
                
                visible: imageRectangle.visible,
                opacity: imageRectangle.opacity,

                x: imageRectangle.x,
                y: imageRectangle.y,

                width: imageRectangle.width,
                height: imageRectangle.height,
                minWidth: imageRectangle.minWidth ?? undefined,
                maxWidth: imageRectangle.maxWidth ?? undefined,
                minHeight: imageRectangle.minHeight ?? undefined,
                maxHeight: imageRectangle.maxHeight ?? undefined,

                fills: imageRectangle.fills as readonly Paint[],

                strokes: imageRectangle.strokes,
                strokeTopWeight: imageRectangle.strokeTopWeight,
                strokeBottomWeight: imageRectangle.strokeBottomWeight,
                strokeLeftWeight: imageRectangle.strokeLeftWeight,
                strokeRightWeight: imageRectangle.strokeRightWeight,
                strokeJoin: imageRectangle.strokeJoin as StrokeJoin ?? figma.mixed,
                strokeAlign: imageRectangle.strokeAlign ?? undefined,
                
                rotation: imageRectangle.rotation,
                
                horizontal: imageRectangle.constraints.horizontal,
                vertical: imageRectangle.constraints.vertical,
                
                effects: imageRectangle.effects,

                hash: image.hash,
            });
        case "VIDEO":
            const videoRectangle: RectangleNode = figma.createRectangle();
            const video: Video = await figma.createVideoAsync(node.data);
            videoRectangle.fills = [
                {
                    type: "VIDEO",
                    videoHash: video.hash,
                    scaleMode: "FILL",
                }
            ];
            const videoComponent: ComponentNode = figma.createComponentFromNode(videoRectangle);
            videoComponent.addComponentProperty("FIGMAOBJECTTYPE", "TEXT", typeValue as VideoType);
            return new FigmaVideo({
                name: video.hash,

                figmaObjectType: videoComponent.componentPropertyDefinitions["FIGMAOBJECTTYPE"].defaultValue as VideoType,
            
                cornerRadius: videoRectangle.cornerRadius as number,
                topLeftRadius: videoRectangle.topLeftRadius,
                topRightRadius: videoRectangle.topRightRadius,
                bottomLeftRadius: videoRectangle.bottomLeftRadius,
                bottomRightRadius: videoRectangle.bottomRightRadius,
                
                visible: videoRectangle.visible,
                opacity: videoRectangle.opacity,

                x: videoRectangle.x,
                y: videoRectangle.y,

                width: videoRectangle.width,
                height: videoRectangle.height,
                minWidth: videoRectangle.minWidth ?? undefined,
                maxWidth: videoRectangle.maxWidth ?? undefined,
                minHeight: videoRectangle.minHeight ?? undefined,
                maxHeight: videoRectangle.maxHeight ?? undefined,

                fills: videoRectangle.fills as readonly Paint[],

                strokes: videoRectangle.strokes,
                strokeTopWeight: videoRectangle.strokeTopWeight,
                strokeBottomWeight: videoRectangle.strokeBottomWeight,
                strokeLeftWeight: videoRectangle.strokeLeftWeight,
                strokeRightWeight: videoRectangle.strokeRightWeight,
                strokeJoin: videoRectangle.strokeJoin as StrokeJoin ?? figma.mixed,
                strokeAlign: videoRectangle.strokeAlign ?? undefined,
                
                rotation: videoRectangle.rotation,
                
                horizontal: videoRectangle.constraints.horizontal,
                vertical: videoRectangle.constraints.vertical,
                
                effects: videoRectangle.effects,

                hash: video.hash,
            });
        case "FRAME":
            const frameNodeClone: FrameNode = (node as FrameNode).clone();
            return new FigmaFrame({
                name: frameNodeClone.name,

                figmaObjectType: "SCROLLINGFRAME",
            
                cornerRadius: frameNodeClone.cornerRadius as number,
                topLeftRadius: frameNodeClone.topLeftRadius,
                topRightRadius: frameNodeClone.topRightRadius,
                bottomLeftRadius: frameNodeClone.bottomLeftRadius,
                bottomRightRadius: frameNodeClone.bottomRightRadius,
                
                visible: frameNodeClone.visible,
                opacity: frameNodeClone.opacity,

                x: frameNodeClone.x,
                y: frameNodeClone.y,

                width: frameNodeClone.width,
                height: frameNodeClone.height,
                minWidth: frameNodeClone.minWidth ?? undefined,
                maxWidth: frameNodeClone.maxWidth ?? undefined,
                minHeight: frameNodeClone.minHeight ?? undefined,
                maxHeight: frameNodeClone.maxHeight ?? undefined,

                fills: frameNodeClone.fills as readonly Paint[],

                strokes: frameNodeClone.strokes,
                strokeTopWeight: frameNodeClone.strokeTopWeight,
                strokeBottomWeight: frameNodeClone.strokeBottomWeight,
                strokeLeftWeight: frameNodeClone.strokeLeftWeight,
                strokeRightWeight: frameNodeClone.strokeRightWeight,
                strokeJoin: frameNodeClone.strokeJoin as StrokeJoin ?? figma.mixed,
                strokeAlign: frameNodeClone.strokeAlign ?? undefined,
                
                rotation: frameNodeClone.rotation,
                
                horizontal: frameNodeClone.constraints.horizontal,
                vertical: frameNodeClone.constraints.vertical,
                
                effects: frameNodeClone.effects,
            });
        case "GROUP":
            const groupNodeClone: GroupNode = (node as GroupNode).clone();
            return new FigmaGroup({
                name: groupNodeClone.name,

                figmaObjectType: "GROUP",
                
                visible: groupNodeClone.visible,
                opacity: groupNodeClone.opacity,

                x: groupNodeClone.x,
                y: groupNodeClone.y,

                width: groupNodeClone.width,
                height: groupNodeClone.height,
                minWidth: groupNodeClone.minWidth ?? undefined,
                maxWidth: groupNodeClone.maxWidth ?? undefined,
                minHeight: groupNodeClone.minHeight ?? undefined,
                maxHeight: groupNodeClone.maxHeight ?? undefined,
                
                rotation: groupNodeClone.rotation,
                
                effects: groupNodeClone.effects,
            });
    }
}

declare type FigmaObjects = FigmaRectangle | FigmaEllipse | FigmaText | FigmaImage | FigmaVideo | FigmaFrame | FigmaGroup;

export function assembleScreenGui(params: ScreenGuiProperties): ScreenGui {
    return new ScreenGui(params);
}

function truncate(textTruncate: TextTruncation): TextTruncate {
    switch (textTruncate) {
        case "DISABLED":
            return TextTruncate.none;
        case "ENDING":
            return TextTruncate.atEnd;
    }
}

function textXAllignment(textAlignHorizontal: TextAlignHorizontal): TextXAlignment {
    switch (textAlignHorizontal) {
        case "LEFT":
            return TextXAlignment.left;
        case "CENTER":
            return TextXAlignment.center;
        case "RIGHT":
            return TextXAlignment.right;
        case "JUSTIFIED":
            return TextXAlignment.center;
    }
}

function textYAllignment(textAlignVertical: TextAlignVertical): TextYAlignment {
    switch (textAlignVertical) {
        case "TOP":
            return TextYAlignment.top;
        case "CENTER":
            return TextYAlignment.center;
        case "BOTTOM":
            return TextYAlignment.bottom;
    }
}

export function convertFigmaObjectToRobloxObject(figmaObject: FigmaObjects, externalProperties?: ExternalRobloxProperties): GuiBase {
    switch (figmaObject.figmaObjectType) {
        case "FRAME":
            const rectangleFrameObject: FigmaRectangle = (figmaObject as FigmaRectangle);
            const externalFrameProperties = externalProperties as ExternalFrameProperties;
            return new Frame({
                archivable: externalFrameProperties.archivable, 
                //
                autoLocalize: externalFrameProperties.autoLocalize,
                rootLocalizationTable: externalFrameProperties.rootLocalizationTable,
                selectionBehaviorDown: externalFrameProperties.selectionBehaviorDown,
                selectionBehaviorLeft: externalFrameProperties.selectionBehaviorLeft,
                selectionBehaviorRight: externalFrameProperties.selectionBehaviorRight,
                selectionBehaviorUp: externalFrameProperties.selectionBehaviorUp,
                selectionGroup: externalFrameProperties.selectionGroup,
                //
                active: externalFrameProperties.active,
                anchorPoint: externalFrameProperties.anchorPoint,
                automaticSize: externalFrameProperties.automaticSize,
                borderColor3: externalFrameProperties.borderColor3,
                borderMode: externalFrameProperties.borderMode,
                borderSizePixel: externalFrameProperties.borderSizePixel,
                interactable: externalFrameProperties.interactable,
                layoutOrder: externalFrameProperties.layoutOrder,
                nextSelectionDown: externalFrameProperties.nextSelectionDown,
                nextSelectionLeft: externalFrameProperties.nextSelectionLeft,
                nextSelectionRight: externalFrameProperties.nextSelectionRight,
                nextSelectionUp: externalFrameProperties.nextSelectionUp,
                selectable: externalFrameProperties.selectable,
                selectionImageObject: externalFrameProperties.selectionImageObject,
                selectionOrder: externalFrameProperties.selectionOrder,
                sizeConstraint: externalFrameProperties.sizeConstraint,
                zIndex: externalFrameProperties.zIndex,
                //
                style: externalFrameProperties.framestyle,
                //
                name: rectangleFrameObject.name,
                //
                backgroundColor3: toRobloxColor(rectangleFrameObject.fills[0]) as Color3,
                backgroundTransparency: rectangleFrameObject.opacity,
                size: new UDim2(),
                visible: rectangleFrameObject.visible,
            });
        case "SCROLLINGFRAME":
            const scrollingFrameObject: FigmaRectangle = (figmaObject as FigmaRectangle);
            const externalScrollingFrameProperties = externalProperties as ExternalScrollingFrameProperties;
            return new ScrollingFrame({
                archivable: externalScrollingFrameProperties.archivable,
                //
                autoLocalize: externalScrollingFrameProperties.autoLocalize,
                rootLocalizationTable: externalScrollingFrameProperties.rootLocalizationTable,
                selectionBehaviorDown: externalScrollingFrameProperties.selectionBehaviorDown,
                selectionBehaviorLeft: externalScrollingFrameProperties.selectionBehaviorLeft,
                selectionBehaviorRight: externalScrollingFrameProperties.selectionBehaviorRight,
                selectionBehaviorUp: externalScrollingFrameProperties.selectionBehaviorUp,
                selectionGroup: externalScrollingFrameProperties.selectionGroup,
                //
                active: externalScrollingFrameProperties.active,
                anchorPoint: externalScrollingFrameProperties.anchorPoint,
                automaticSize: externalScrollingFrameProperties.automaticSize,
                borderColor3: externalScrollingFrameProperties.borderColor3,
                borderMode: externalScrollingFrameProperties.borderMode,
                borderSizePixel: externalScrollingFrameProperties.borderSizePixel,
                interactable: externalScrollingFrameProperties.interactable,
                layoutOrder: externalScrollingFrameProperties.layoutOrder,
                nextSelectionDown: externalScrollingFrameProperties.nextSelectionDown,
                nextSelectionLeft: externalScrollingFrameProperties.nextSelectionLeft,
                nextSelectionRight: externalScrollingFrameProperties.nextSelectionRight,
                nextSelectionUp: externalScrollingFrameProperties.nextSelectionUp,
                selectable: externalScrollingFrameProperties.selectable,
                selectionImageObject: externalScrollingFrameProperties.selectionImageObject,
                selectionOrder: externalScrollingFrameProperties.selectionOrder,
                sizeConstraint: externalScrollingFrameProperties.sizeConstraint,
                zIndex: externalScrollingFrameProperties.zIndex,
                //
                automaticCanvasSize: externalScrollingFrameProperties.automaticCanvasSize,
                bottomImage: externalScrollingFrameProperties.bottomImage,
                canvasPosition: externalScrollingFrameProperties.canvasPosition,
                elasticBehavior: externalScrollingFrameProperties.elasticBehavior,
                horizontalScrollBarInset: externalScrollingFrameProperties.horizontalScrollBarInset,
                midImage: externalScrollingFrameProperties.midImage,
                scrollBarImageColor3: externalScrollingFrameProperties.scrollBarImageColor3,
                scrollBarImageTransparency: externalScrollingFrameProperties.scrollBarImageTransparency,
                scrollBarThickness: externalScrollingFrameProperties.scrollBarThickness,
                scrollingDirection: externalScrollingFrameProperties.scrollingDirection,
                scrollingEnabled: externalScrollingFrameProperties.scrollingEnabled,
                topImage: externalScrollingFrameProperties.topImage,
                verticalScrollBarInset: externalScrollingFrameProperties.verticalScrollBarInset,
                verticalScrollBarPosition: externalScrollingFrameProperties.verticalScrollBarPosition,
                //
                name: scrollingFrameObject.name,
                //
                backgroundColor3: toRobloxColor(scrollingFrameObject.fills[0]) as Color3,
                backgroundTransparency: scrollingFrameObject.opacity,
                size: new UDim2(),
                visible: scrollingFrameObject.visible,
                //
                canvasSize: new UDim2(),
            });
        case "VIEWPORTFRAME":
            const viewportFrameObject: FigmaRectangle = (figmaObject as FigmaRectangle);
            const externalViewportFrameProperties = externalProperties as ExternalViewportFrameProperties;
            return new ViewportFrame({
                archivable: externalViewportFrameProperties.archivable,
                //
                autoLocalize: externalViewportFrameProperties.autoLocalize,
                rootLocalizationTable: externalViewportFrameProperties.rootLocalizationTable,
                selectionBehaviorDown: externalViewportFrameProperties.selectionBehaviorDown,
                selectionBehaviorLeft: externalViewportFrameProperties.selectionBehaviorLeft,
                selectionBehaviorRight: externalViewportFrameProperties.selectionBehaviorRight,
                selectionBehaviorUp: externalViewportFrameProperties.selectionBehaviorUp,
                selectionGroup: externalViewportFrameProperties.selectionGroup,
                //
                active: externalViewportFrameProperties.active,
                anchorPoint: externalViewportFrameProperties.anchorPoint,
                automaticSize: externalViewportFrameProperties.automaticSize,
                borderColor3: externalViewportFrameProperties.borderColor3,
                borderMode: externalViewportFrameProperties.borderMode,
                borderSizePixel: externalViewportFrameProperties.borderSizePixel,
                interactable: externalViewportFrameProperties.interactable,
                layoutOrder: externalViewportFrameProperties.layoutOrder,
                nextSelectionDown: externalViewportFrameProperties.nextSelectionDown,
                nextSelectionLeft: externalViewportFrameProperties.nextSelectionLeft,
                nextSelectionRight: externalViewportFrameProperties.nextSelectionRight,
                nextSelectionUp: externalViewportFrameProperties.nextSelectionUp,
                selectable: externalViewportFrameProperties.selectable,
                selectionImageObject: externalViewportFrameProperties.selectionImageObject,
                selectionOrder: externalViewportFrameProperties.selectionOrder,
                sizeConstraint: externalViewportFrameProperties.sizeConstraint,
                zIndex: externalViewportFrameProperties.zIndex,
                //
                ambient: externalViewportFrameProperties.ambient,
                currentCamera: externalViewportFrameProperties.currentCamera,
                lightColor: externalViewportFrameProperties.lightColor,
                lightDirection: externalViewportFrameProperties.lightDirection,
                //
                name: viewportFrameObject.name,
                //
                backgroundColor3: toRobloxColor(viewportFrameObject.fills[0]) as Color3,
                backgroundTransparency: viewportFrameObject.opacity,
                size: new UDim2(),
                visible: viewportFrameObject.visible,
                //
                imageColor3: toRobloxColor(viewportFrameObject.fills[0]) as Color3,
                imageTransparency: viewportFrameObject.opacity,
            });
        case "VIDEOFRAME":
            const videoFrameObject: FigmaVideo = (figmaObject as FigmaVideo);
            const externalVideoFrameProperties = externalProperties as ExternalVideoFrameProperties;
            return new VideoFrame({
                archivable: externalVideoFrameProperties.archivable,
                //
                autoLocalize: externalVideoFrameProperties.autoLocalize,
                rootLocalizationTable: externalVideoFrameProperties.rootLocalizationTable,
                selectionBehaviorDown: externalVideoFrameProperties.selectionBehaviorDown,
                selectionBehaviorLeft: externalVideoFrameProperties.selectionBehaviorLeft,
                selectionBehaviorRight: externalVideoFrameProperties.selectionBehaviorRight,
                selectionBehaviorUp: externalVideoFrameProperties.selectionBehaviorUp,
                selectionGroup: externalVideoFrameProperties.selectionGroup,
                //
                active: externalVideoFrameProperties.active,
                anchorPoint: externalVideoFrameProperties.anchorPoint,
                automaticSize: externalVideoFrameProperties.automaticSize,
                borderColor3: externalVideoFrameProperties.borderColor3,
                borderMode: externalVideoFrameProperties.borderMode,
                borderSizePixel: externalVideoFrameProperties.borderSizePixel,
                interactable: externalVideoFrameProperties.interactable,
                layoutOrder: externalVideoFrameProperties.layoutOrder,
                nextSelectionDown: externalVideoFrameProperties.nextSelectionDown,
                nextSelectionLeft: externalVideoFrameProperties.nextSelectionLeft,
                nextSelectionRight: externalVideoFrameProperties.nextSelectionRight,
                nextSelectionUp: externalVideoFrameProperties.nextSelectionUp,
                selectable: externalVideoFrameProperties.selectable,
                selectionImageObject: externalVideoFrameProperties.selectionImageObject,
                selectionOrder: externalVideoFrameProperties.selectionOrder,
                sizeConstraint: externalVideoFrameProperties.sizeConstraint,
                zIndex: externalVideoFrameProperties.zIndex,
                //
                looped: externalVideoFrameProperties.looped,
                playing: externalVideoFrameProperties.playing,
                timePosition: externalVideoFrameProperties.timePosition,
                volume: externalVideoFrameProperties.volume,
                //
                name: videoFrameObject.name,
                //
                backgroundColor3: toRobloxColor(videoFrameObject.fills[0]) as Color3,
                backgroundTransparency: videoFrameObject.opacity,
                size: new UDim2(),
                visible: videoFrameObject.visible,
                //
                video: videoFrameObject.hash,
            });
        case "IMAGELABEL":
            const imageLabelObject: FigmaImage = (figmaObject as FigmaImage);
            const externalImageLabelProperties = externalProperties as ExternalImageLabelProperties;
            return new ImageLabel({
                archivable: externalImageLabelProperties.archivable,
                //
                autoLocalize: externalImageLabelProperties.autoLocalize,
                rootLocalizationTable: externalImageLabelProperties.rootLocalizationTable,
                selectionBehaviorDown: externalImageLabelProperties.selectionBehaviorDown,
                selectionBehaviorLeft: externalImageLabelProperties.selectionBehaviorLeft,
                selectionBehaviorRight: externalImageLabelProperties.selectionBehaviorRight,
                selectionBehaviorUp: externalImageLabelProperties.selectionBehaviorUp,
                selectionGroup: externalImageLabelProperties.selectionGroup,
                //
                active: externalImageLabelProperties.active,
                anchorPoint: externalImageLabelProperties.anchorPoint,
                automaticSize: externalImageLabelProperties.automaticSize,
                borderColor3: externalImageLabelProperties.borderColor3,
                borderMode: externalImageLabelProperties.borderMode,
                borderSizePixel: externalImageLabelProperties.borderSizePixel,
                interactable: externalImageLabelProperties.interactable,
                layoutOrder: externalImageLabelProperties.layoutOrder,
                nextSelectionDown: externalImageLabelProperties.nextSelectionDown,
                nextSelectionLeft: externalImageLabelProperties.nextSelectionLeft,
                nextSelectionRight: externalImageLabelProperties.nextSelectionRight,
                nextSelectionUp: externalImageLabelProperties.nextSelectionUp,
                selectable: externalImageLabelProperties.selectable,
                selectionImageObject: externalImageLabelProperties.selectionImageObject,
                selectionOrder: externalImageLabelProperties.selectionOrder,
                sizeConstraint: externalImageLabelProperties.sizeConstraint,
                zIndex: externalImageLabelProperties.zIndex,
                //
                imageRectOffset: externalImageLabelProperties.imageRectOffset,
                imageRectSize: externalImageLabelProperties.imageRectSize,
                resampleMode: externalImageLabelProperties.resampleMode,
                scaleType: externalImageLabelProperties.scaleType,
                sliceCenter: externalImageLabelProperties.sliceCenter,
                sliceScale: externalImageLabelProperties.sliceScale,
                tileSize: externalImageLabelProperties.tileSize,
                //
                name: imageLabelObject.name,
                //
                backgroundColor3: toRobloxColor(imageLabelObject.fills[0]) as Color3,
                backgroundTransparency: imageLabelObject.opacity,
                size: new UDim2(),
                visible: imageLabelObject.visible,
                //
                image: imageLabelObject.hash,
            });
        case "IMAGEBUTTON":
            const imageButtonObject: FigmaImage = (figmaObject as FigmaImage);
            const externalImageButtonProperties = externalProperties as ExternalImageButtonProperties;
            return new ImageButton({
                archivable: externalImageButtonProperties.archivable,
                //
                autoLocalize: externalImageButtonProperties.autoLocalize,
                rootLocalizationTable: externalImageButtonProperties.rootLocalizationTable,
                selectionBehaviorDown: externalImageButtonProperties.selectionBehaviorDown,
                selectionBehaviorLeft: externalImageButtonProperties.selectionBehaviorLeft,
                selectionBehaviorRight: externalImageButtonProperties.selectionBehaviorRight,
                selectionBehaviorUp: externalImageButtonProperties.selectionBehaviorUp,
                selectionGroup: externalImageButtonProperties.selectionGroup,
                //
                active: externalImageButtonProperties.active,
                anchorPoint: externalImageButtonProperties.anchorPoint,
                automaticSize: externalImageButtonProperties.automaticSize,
                borderColor3: externalImageButtonProperties.borderColor3,
                borderMode: externalImageButtonProperties.borderMode,
                borderSizePixel: externalImageButtonProperties.borderSizePixel,
                interactable: externalImageButtonProperties.interactable,
                layoutOrder: externalImageButtonProperties.layoutOrder,
                nextSelectionDown: externalImageButtonProperties.nextSelectionDown,
                nextSelectionLeft: externalImageButtonProperties.nextSelectionLeft,
                nextSelectionRight: externalImageButtonProperties.nextSelectionRight,
                nextSelectionUp: externalImageButtonProperties.nextSelectionUp,
                selectable: externalImageButtonProperties.selectable,
                selectionImageObject: externalImageButtonProperties.selectionImageObject,
                selectionOrder: externalImageButtonProperties.selectionOrder,
                sizeConstraint: externalImageButtonProperties.sizeConstraint,
                zIndex: externalImageButtonProperties.zIndex,
                //
                autoButtonColor: externalImageButtonProperties.autoButtonColor,
                modal: externalImageButtonProperties.modal,
                selected: externalImageButtonProperties.selected,
                style: externalImageButtonProperties.buttonstyle,
                //
                imageRectOffset: externalImageButtonProperties.imageRectOffset,
                imageRectSize: externalImageButtonProperties.imageRectSize,
                resampleMode: externalImageButtonProperties.resampleMode,
                scaleType: externalImageButtonProperties.scaleType,
                sliceCenter: externalImageButtonProperties.sliceCenter,
                sliceScale: externalImageButtonProperties.sliceScale,
                tileSize: externalImageButtonProperties.tileSize,
                //
                name: imageButtonObject.name,
                //
                backgroundColor3: toRobloxColor(imageButtonObject.fills[0]) as Color3,
                backgroundTransparency: imageButtonObject.opacity,
                size: new UDim2(),
                visible: imageButtonObject.visible,
                //
                image: imageButtonObject.hash,
            });
        case "TEXTBOX":
            const textBoxObject: FigmaText = (figmaObject as FigmaText);
            const textBoxStyle = textBoxObject.textStyle;
            const externalTextBoxProperties = externalProperties as ExternalTextBoxProperties;
            return new TextBox({
                archivable: externalTextBoxProperties.archivable,
                //
                autoLocalize: externalTextBoxProperties.autoLocalize,
                rootLocalizationTable: externalTextBoxProperties.rootLocalizationTable,
                selectionBehaviorDown: externalTextBoxProperties.selectionBehaviorDown,
                selectionBehaviorLeft: externalTextBoxProperties.selectionBehaviorLeft,
                selectionBehaviorRight: externalTextBoxProperties.selectionBehaviorRight,
                selectionBehaviorUp: externalTextBoxProperties.selectionBehaviorUp,
                selectionGroup: externalTextBoxProperties.selectionGroup,
                //
                active: externalTextBoxProperties.active,
                anchorPoint: externalTextBoxProperties.anchorPoint,
                automaticSize: externalTextBoxProperties.automaticSize,
                borderColor3: externalTextBoxProperties.borderColor3,
                borderMode: externalTextBoxProperties.borderMode,
                borderSizePixel: externalTextBoxProperties.borderSizePixel,
                interactable: externalTextBoxProperties.interactable,
                layoutOrder: externalTextBoxProperties.layoutOrder,
                nextSelectionDown: externalTextBoxProperties.nextSelectionDown,
                nextSelectionLeft: externalTextBoxProperties.nextSelectionLeft,
                nextSelectionRight: externalTextBoxProperties.nextSelectionRight,
                nextSelectionUp: externalTextBoxProperties.nextSelectionUp,
                selectable: externalTextBoxProperties.selectable,
                selectionImageObject: externalTextBoxProperties.selectionImageObject,
                selectionOrder: externalTextBoxProperties.selectionOrder,
                sizeConstraint: externalTextBoxProperties.sizeConstraint,
                zIndex: externalTextBoxProperties.zIndex,
                //
                maxVisibleGraphemes: externalTextBoxProperties.maxVisibleGraphemes,
                openTypeFeatures: externalTextBoxProperties.openTypeFeatures,
                richText: externalTextBoxProperties.richText,
                textDirection: externalTextBoxProperties.textDirection,
                textScaled: externalTextBoxProperties.textScaled,
                textStrokeColor: externalTextBoxProperties.textStrokeColor,
                textStrokeTransparency: externalTextBoxProperties.textStrokeTransparency,
                textWrapped: externalTextBoxProperties.textWrapped,
                //
                clearTextFocus: externalTextBoxProperties.clearTextFocus,
                cursorPosition: externalTextBoxProperties.cursorPosition,
                multiLine: externalTextBoxProperties.multiLine,
                placeholderColor3: externalTextBoxProperties.placeholderColor3,
                placeholderText: externalTextBoxProperties.placeholderText,
                selectionStart: externalTextBoxProperties.selectionStart,
                showNativeInput: externalTextBoxProperties.showNativeInput,
                textEditable: externalTextBoxProperties.textEditable,
                //
                name: textBoxObject.name,
                //
                backgroundColor3: toRobloxColor(textBoxObject.fills[0]) as Color3,
                backgroundTransparency: textBoxObject.opacity,
                size: new UDim2(),
                visible: textBoxObject.visible,
                //
                fontFace: new Font(
                    textBoxObject.font.family,
                    textBoxObject.font.fontWeight,
                    textBoxObject.font.style == "Regular" ? FontStyle.normal : FontStyle.italic,
                ),
                lineHeight: 
                    textBoxStyle.lineHeight.unit === "PIXELS" ||
                    textBoxStyle.lineHeight.unit === "PERCENT" ? textBoxStyle.lineHeight.value : 0,
                text: textBoxObject.text,
                textColor: toRobloxColor(textBoxObject.fills[0]) as Color3,
                textSize: textBoxObject.font.fontSize,
                textTransparency: textBoxObject.opacity,
                textTruncate: truncate(textBoxObject.textStyle.truncation),
                textXAlignment: textXAllignment(textBoxObject.alignment.horizontal),
                textYAlignment: textYAllignment(textBoxObject.alignment.vertical), 
            });
        case "TEXTBUTTON":
            const textButtonObject: FigmaText = (figmaObject as FigmaText);
            const textButtonStyle = textButtonObject.textStyle;
            const externalTextButtonProperties = externalProperties as ExternalTextButtonProperties;
            return new TextButton({
                archivable: externalTextButtonProperties.archivable,
                //
                autoLocalize: externalTextButtonProperties.autoLocalize,
                rootLocalizationTable: externalTextButtonProperties.rootLocalizationTable,
                selectionBehaviorDown: externalTextButtonProperties.selectionBehaviorDown,
                selectionBehaviorLeft: externalTextButtonProperties.selectionBehaviorLeft,
                selectionBehaviorRight: externalTextButtonProperties.selectionBehaviorRight,
                selectionBehaviorUp: externalTextButtonProperties.selectionBehaviorUp,
                selectionGroup: externalTextButtonProperties.selectionGroup,
                //
                active: externalTextButtonProperties.active,
                anchorPoint: externalTextButtonProperties.anchorPoint,
                automaticSize: externalTextButtonProperties.automaticSize,
                borderColor3: externalTextButtonProperties.borderColor3,
                borderMode: externalTextButtonProperties.borderMode,
                borderSizePixel: externalTextButtonProperties.borderSizePixel,
                interactable: externalTextButtonProperties.interactable,
                layoutOrder: externalTextButtonProperties.layoutOrder,
                nextSelectionDown: externalTextButtonProperties.nextSelectionDown,
                nextSelectionLeft: externalTextButtonProperties.nextSelectionLeft,
                nextSelectionRight: externalTextButtonProperties.nextSelectionRight,
                nextSelectionUp: externalTextButtonProperties.nextSelectionUp,
                selectable: externalTextButtonProperties.selectable,
                selectionImageObject: externalTextButtonProperties.selectionImageObject,
                selectionOrder: externalTextButtonProperties.selectionOrder,
                sizeConstraint: externalTextButtonProperties.sizeConstraint,
                zIndex: externalTextButtonProperties.zIndex,
                //
                autoButtonColor: externalTextButtonProperties.autoButtonColor,
                modal: externalTextButtonProperties.modal,
                selected: externalTextButtonProperties.selected,
                style: externalTextButtonProperties.buttonstyle,
                //
                maxVisibleGraphemes: externalTextButtonProperties.maxVisibleGraphemes,
                openTypeFeatures: externalTextButtonProperties.openTypeFeatures,
                richText: externalTextButtonProperties.richText,
                textDirection: externalTextButtonProperties.textDirection,
                textScaled: externalTextButtonProperties.textScaled,
                textStrokeColor: externalTextButtonProperties.textStrokeColor,
                textStrokeTransparency: externalTextButtonProperties.textStrokeTransparency,
                textWrapped: externalTextButtonProperties.textWrapped,
                //
                name: textButtonObject.name,
                //
                backgroundColor3: toRobloxColor(textButtonObject.fills[0]) as Color3,
                backgroundTransparency: textButtonObject.opacity,
                size: new UDim2(),
                visible: textButtonObject.visible,
                //
                fontFace: new Font(
                    textButtonObject.font.family,
                    textButtonObject.font.fontWeight,
                    textButtonObject.font.style == "Regular" ? FontStyle.normal : FontStyle.italic,
                ),
                lineHeight: 
                    textButtonStyle.lineHeight.unit === "PIXELS" ||
                    textButtonStyle.lineHeight.unit === "PERCENT" ? textButtonStyle.lineHeight.value : 0,
                text: textButtonObject.text,
                textColor: toRobloxColor(textButtonObject.fills[0]) as Color3,
                textSize: textButtonObject.font.fontSize,
                textTransparency: textButtonObject.opacity,
                textTruncate: truncate(textButtonObject.textStyle.truncation),
                textXAlignment: textXAllignment(textButtonObject.alignment.horizontal),
                textYAlignment: textYAllignment(textButtonObject.alignment.vertical), 
            });
        case "TEXTLABEL":
            const textLabelObject: FigmaText = (figmaObject as FigmaText);
            const textLabelStyle = textLabelObject.textStyle;
            const externalTextLabelProperties = externalProperties as ExternalTextLabelProperties;
            return new TextLabel({
                archivable: externalTextLabelProperties.archivable,
                //
                autoLocalize: externalTextLabelProperties.autoLocalize,
                rootLocalizationTable: externalTextLabelProperties.rootLocalizationTable,
                selectionBehaviorDown: externalTextLabelProperties.selectionBehaviorDown,
                selectionBehaviorLeft: externalTextLabelProperties.selectionBehaviorLeft,
                selectionBehaviorRight: externalTextLabelProperties.selectionBehaviorRight,
                selectionBehaviorUp: externalTextLabelProperties.selectionBehaviorUp,
                selectionGroup: externalTextLabelProperties.selectionGroup,
                //
                active: externalTextLabelProperties.active,
                anchorPoint: externalTextLabelProperties.anchorPoint,
                automaticSize: externalTextLabelProperties.automaticSize,
                borderColor3: externalTextLabelProperties.borderColor3,
                borderMode: externalTextLabelProperties.borderMode,
                borderSizePixel: externalTextLabelProperties.borderSizePixel,
                interactable: externalTextLabelProperties.interactable,
                layoutOrder: externalTextLabelProperties.layoutOrder,
                nextSelectionDown: externalTextLabelProperties.nextSelectionDown,
                nextSelectionLeft: externalTextLabelProperties.nextSelectionLeft,
                nextSelectionRight: externalTextLabelProperties.nextSelectionRight,
                nextSelectionUp: externalTextLabelProperties.nextSelectionUp,
                selectable: externalTextLabelProperties.selectable,
                selectionImageObject: externalTextLabelProperties.selectionImageObject,
                selectionOrder: externalTextLabelProperties.selectionOrder,
                sizeConstraint: externalTextLabelProperties.sizeConstraint,
                zIndex: externalTextLabelProperties.zIndex,
                //
                maxVisibleGraphemes: externalTextLabelProperties.maxVisibleGraphemes,
                openTypeFeatures: externalTextLabelProperties.openTypeFeatures,
                richText: externalTextLabelProperties.richText,
                textDirection: externalTextLabelProperties.textDirection,
                textScaled: externalTextLabelProperties.textScaled,
                textStrokeColor: externalTextLabelProperties.textStrokeColor,
                textStrokeTransparency: externalTextLabelProperties.textStrokeTransparency,
                textWrapped: externalTextLabelProperties.textWrapped,
                //
                name: textLabelObject.name,
                //
                backgroundColor3: toRobloxColor(textLabelObject.fills[0]) as Color3,
                backgroundTransparency: textLabelObject.opacity,
                size: new UDim2(),
                visible: textLabelObject.visible,
                //
                fontFace: new Font(
                    textLabelObject.font.family,
                    textLabelObject.font.fontWeight,
                    textLabelObject.font.style == "Regular" ? FontStyle.normal : FontStyle.italic,
                ),
                lineHeight: 
                    textLabelStyle.lineHeight.unit === "PIXELS" ||
                    textLabelStyle.lineHeight.unit === "PERCENT" ? textLabelStyle.lineHeight.value : 0,
                text: textLabelObject.text,
                textColor: toRobloxColor(textLabelObject.fills[0]) as Color3,
                textSize: textLabelObject.font.fontSize,
                textTransparency: textLabelObject.opacity,
                textTruncate: truncate(textLabelObject.textStyle.truncation),
                textXAlignment: textXAllignment(textLabelObject.alignment.horizontal),
                textYAlignment: textYAllignment(textLabelObject.alignment.vertical), 
            });
        case "GROUP":
            const figmaGroupObject: FigmaGroup = (figmaObject as FigmaGroup);
            const externalFrameAsGroupProperties = externalProperties as ExternalFrameProperties;
            return new Frame({
                archivable: externalFrameAsGroupProperties.archivable,
                //
                autoLocalize: externalFrameAsGroupProperties.autoLocalize,
                rootLocalizationTable: externalFrameAsGroupProperties.rootLocalizationTable,
                selectionBehaviorDown: externalFrameAsGroupProperties.selectionBehaviorDown,
                selectionBehaviorLeft: externalFrameAsGroupProperties.selectionBehaviorLeft,
                selectionBehaviorRight: externalFrameAsGroupProperties.selectionBehaviorRight,
                selectionBehaviorUp: externalFrameAsGroupProperties.selectionBehaviorUp,
                selectionGroup: externalFrameAsGroupProperties.selectionGroup,
                //
                active: externalFrameAsGroupProperties.active,
                anchorPoint: externalFrameAsGroupProperties.anchorPoint,
                automaticSize: externalFrameAsGroupProperties.automaticSize,
                borderColor3: externalFrameAsGroupProperties.borderColor3,
                borderMode: externalFrameAsGroupProperties.borderMode,
                borderSizePixel: externalFrameAsGroupProperties.borderSizePixel,
                interactable: externalFrameAsGroupProperties.interactable,
                layoutOrder: externalFrameAsGroupProperties.layoutOrder,
                nextSelectionDown: externalFrameAsGroupProperties.nextSelectionDown,
                nextSelectionLeft: externalFrameAsGroupProperties.nextSelectionLeft,
                nextSelectionRight: externalFrameAsGroupProperties.nextSelectionRight,
                nextSelectionUp: externalFrameAsGroupProperties.nextSelectionUp,
                selectable: externalFrameAsGroupProperties.selectable,
                selectionImageObject: externalFrameAsGroupProperties.selectionImageObject,
                selectionOrder: externalFrameAsGroupProperties.selectionOrder,
                sizeConstraint: externalFrameAsGroupProperties.sizeConstraint,
                zIndex: externalFrameAsGroupProperties.zIndex,
                //
                name: figmaGroupObject.name,
                //
                backgroundColor3: toRobloxColor(figmaGroupObject.fills[0]) as Color3,
                backgroundTransparency: figmaGroupObject.opacity,
                size: new UDim2(),
                visible: figmaGroupObject.visible,
            });
    }
}

export enum ConvertRunType {
    convertToCode,
    convertToObject,
    generateCode,
}

function checkValidRobloxType(defaultValue: string | boolean): boolean {
    if (typeof defaultValue === "boolean") {
        return false
    } else if (
        (typeof defaultValue === "string") && (
        defaultValue === "VIEWPORTFRAME" ||
        defaultValue === "IMAGEBUTTON" ||
        defaultValue === "TEXTBUTTON" ||
        defaultValue === "TEXTBOX"
    )) {
        return true;
    }
    return false;
}

export async function main(type: ConvertRunType, externalProperties: Map<string, ExternalRobloxProperties>): Promise<CodegenResult[] | void> {
    const robloxObjectContainer: RobloxUI[] = [];
    processNestedNodes(async (nodeMap) => {
        if (nodeMap.type === 'FRAME') {
            const frameNode = nodeMap.affiliatedNode as FrameNode;
            const frameFigmaObject = await convertFigmaToFigmaObject(frameNode) as FigmaFrame;
            const scrollingFrame = convertFigmaObjectToRobloxObject(frameFigmaObject, externalProperties.get(nodeMap.name)) as ScrollingFrame;
            robloxObjectContainer.push(scrollingFrame);
        } else if (nodeMap.type === 'RECTANGLE') {
            const rectangleNode = nodeMap.affiliatedNode as RectangleNode;
            const rectangleFigmaObject = await convertFigmaToFigmaObject(rectangleNode) as FigmaRectangle;
            const frame = convertFigmaObjectToRobloxObject(rectangleFigmaObject, externalProperties.get(nodeMap.name)) as Frame;
            robloxObjectContainer.push(frame);
        } else if (nodeMap.type === 'ELLIPSE') {
            const ellipseNode = nodeMap.affiliatedNode as EllipseNode;
            const ellipseFigmaObject = await convertFigmaToFigmaObject(ellipseNode) as FigmaEllipse;
            const frameAsEllipse = convertFigmaObjectToRobloxObject(ellipseFigmaObject, externalProperties.get(nodeMap.name)) as Frame;
            const uiCorner: UICorner = new UICorner({
                cornerRadius: new UDim(0.5, 0),
            });
            frameAsEllipse.addChild(uiCorner);
            robloxObjectContainer.push(frameAsEllipse);
        } else if (nodeMap.type === 'GROUP') {
            const groupNode = nodeMap.affiliatedNode as GroupNode;
            const groupFigmaObject = await convertFigmaToFigmaObject(groupNode) as FigmaGroup;
            const frameAsGroup = convertFigmaObjectToRobloxObject(groupFigmaObject, externalProperties.get(nodeMap.name)) as Frame;
            robloxObjectContainer.push(frameAsGroup);
        } else if (nodeMap.type === 'COMPONENT') {
            if (nodeMap instanceof SelectedComponentMap) {
                const componentNode = nodeMap.affiliatedNode as ComponentNode;
                const definitions: ComponentPropertyDefinitions = componentNode.componentPropertyDefinitions;
                const robloxType = definitions["ROBLOX_UI_TYPE"];
                assert(robloxType.type === "TEXT");
                assert(checkValidRobloxType(robloxType.defaultValue));
                assert(componentNode.children.length === 1)
                const mainInstance: SceneNode = componentNode.children[0];
                switch (nodeMap.robloxUIType) {
                    case "VIEWPORTFRAME":
                        const viewportFrameRectangleNode = mainInstance as RectangleNode;
                        const componentViewportFrameFigmaObject = await convertFigmaToFigmaObject(viewportFrameRectangleNode) as FigmaFrame;
                        const viewportFrame = convertFigmaObjectToRobloxObject(componentViewportFrameFigmaObject, externalProperties.get(nodeMap.name)) as ViewportFrame;
                        robloxObjectContainer.push(viewportFrame);
                        break;
                    case "IMAGEBUTTON":
                        const imageButtonRectangleNode = mainInstance as RectangleNode;
                        const componentImageButtonFigmaObject = await convertFigmaToFigmaObject(imageButtonRectangleNode) as FigmaFrame;
                        const imageButton = convertFigmaObjectToRobloxObject(componentImageButtonFigmaObject, externalProperties.get(nodeMap.name)) as ImageButton;
                        robloxObjectContainer.push(imageButton);
                        break;
                    case "TEXTBUTTON":
                        const textButtonRectangleNode = mainInstance as TextNode;
                        const componentTextButtonFigmaObject = await convertFigmaToFigmaObject(textButtonRectangleNode) as FigmaVideo;
                        const textButton = convertFigmaObjectToRobloxObject(componentTextButtonFigmaObject, externalProperties.get(nodeMap.name)) as TextButton;
                        robloxObjectContainer.push(textButton);
                        break;
                    case "TEXTBOX":
                        const textBoxRectangleNode = mainInstance as TextNode;
                        const componentTextBoxFigmaObject = await convertFigmaToFigmaObject(textBoxRectangleNode) as FigmaText;
                        const textBox = convertFigmaObjectToRobloxObject(componentTextBoxFigmaObject, externalProperties.get(nodeMap.name)) as TextBox;
                        robloxObjectContainer.push(textBox);
                        break;
                    default:
                        return;
                }
            }
        } 
    });
    switch (type) {
        case ConvertRunType.convertToCode:
            const luaFile = await exportFile(
                ConvertRunType.convertToCode, 
                robloxObjectContainer,
            );
            await luaFile.save(); 
            break;
        case ConvertRunType.convertToObject:
            const objectFile = await exportFile(
                ConvertRunType.convertToObject, 
                robloxObjectContainer,
            );
            await objectFile.save();
            break;
        case ConvertRunType.generateCode:
            const codegenResults: CodegenResult[] = [];
            const buffer: StringBuffer = new StringBuffer();
            robloxObjectContainer.forEach((robloxUI) => {
                buffer.writeLn(
                    robloxUI.toCode(
                        toCamelCase(robloxUI.name)
                    )
                );
            });
            codegenResults.push({
                title: luaCodeTitle,
                language: "PLAINTEXT",
                code: buffer.toString(),
            });
            return codegenResults;
    }
}
