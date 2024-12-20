import { assert } from "console";
import { bloxUITitle, codeGenerationLanguage, dartTitle, luaCodeTitle } from "./constants";
import { 
    Frame, 
    GuiBase, 
    ImageButton, 
    ImageLabel, 
    Instance,
    LocalizationTable, 
    SafeAreaCompatibility, 
    ScreenGui,
    ScreenGuiProperties,
    ScreenInsets, 
    ScrollingFrame, 
    SelectionBehavior,
    TextBox, 
    TextButton, 
    TextLabel, 
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

abstract class FigmaObject<OBJECTTYPE> implements RadiusObject, VisibleObject, PositionObject, SizeObject, ColorObject, StrokeObject, RotationObject, ConstraintObject, EffectsObject {
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

    constructor(params: FigmaObjectParameters<RectangleType>) {
        super({
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

declare type TextAlignHorizontal = 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED';

declare type TextAlignVertical = 'TOP' | 'CENTER' | 'BOTTOM';

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

declare type TextAutoResize = 'NONE' | 'WIDTH_AND_HEIGHT' | 'HEIGHT' | 'TRUNCATE';

declare type TextTruncation = 'DISABLED' | 'ENDING';

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
        this.lineHeight = params.lineHeight ?? {unit: "AUTO"};
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

declare type ImageNode = { type: "IMAGE", data: Uint8Array };

declare type VideoNode = { type: "VIDEO", data: Uint8Array };

declare type FigmaObjectType = RectangleNode | EllipseNode | TextNode | ImageNode | VideoNode;

declare type FigmaObjectReturnType = FigmaRectangle | FigmaEllipse | FigmaText | FigmaImage | FigmaVideo;

export async function convertFigmaToFigmaObject(node: FigmaObjectType, typeValue?: ImageType | VideoType): Promise<FigmaObjectReturnType> {
    switch (node.type) {
        case "RECTANGLE":
            const rectangleClone: RectangleNode = (node as RectangleNode).clone();
            const rectangleComponent: ComponentNode = figma.createComponentFromNode(rectangleClone);
            return new FigmaRectangle({
                figmaObjectType: rectangleComponent.componentPropertyDefinitions["FIGMAOBJECTTYPE"].defaultValue as RectangleType,
            });
        case "ELLIPSE":
            const ellipseClone: EllipseNode = (node as EllipseNode).clone();
            const ellipseComponent: ComponentNode = figma.createComponentFromNode(ellipseClone);
            return new FigmaEllipse({
                figmaObjectType: ellipseComponent.componentPropertyDefinitions["FIGMAOBJECTTYPE"].defaultValue as EllipseType,
            });
        case "TEXT":
            const textClone: TextNode = (node as TextNode).clone();
            const textComponent: ComponentNode = figma.createComponentFromNode(textClone);
            return new FigmaText({
                figmaObjectType: textComponent.componentPropertyDefinitions["FIGMAOBJECTTYPE"].defaultValue as TextType,  
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
                figmaObjectType: imageComponent.componentPropertyDefinitions["FIGMAOBJECTTYPE"].defaultValue as ImageType,
            });
        case "VIDEO":
            const videoRectangle: RectangleNode = figma.createRectangle();
            const video: Video = await  figma.createVideoAsync(node.data);
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
                figmaObjectType: videoComponent.componentPropertyDefinitions["FIGMAOBJECTTYPE"].defaultValue as VideoType,
            });
    }
}

declare type FigmaObjects = FigmaRectangle | FigmaEllipse | FigmaText | FigmaImage | FigmaVideo;

export function assembleScreenGui(params: ScreenGuiProperties): ScreenGui {
    return new ScreenGui(params);
}

export function convertFigmaObjectToRobloxObject(figmaObject: FigmaObjects, screenGuiProperties: ScreenGuiProperties): GuiBase {
    const screenGui: ScreenGui = new ScreenGui(screenGuiProperties);
    switch (figmaObject.figmaObjectType) {
        case "FRAME":
            const rectangleFrameObject: FigmaRectangle = (figmaObject as FigmaRectangle);
            return new Frame({
                parent: screenGui,
            });
        case "SCROLLINGFRAME":
            return new ScrollingFrame({
                parent: screenGui,
            });
        case "TEXTBOX":
            return new TextBox({
                parent: screenGui,
            });
        case "TEXTBUTTON":
            return new TextButton({
                parent: screenGui,
            });
        case "TEXTLABEL":
            return new TextLabel({
                parent: screenGui,
            });
        case "FRAME":
            return new Frame({
                parent: screenGui,
            });
        case "VIEWPORTFRAME":
            return new ViewportFrame({
                parent: screenGui,
            });
        case "IMAGELABEL":
            return new ImageLabel({
                parent: screenGui,
            });
        case "IMAGEBUTTON":
            return new ImageButton({
                parent: screenGui,
            });
        case "VIDEOFRAME":
            return new VideoFrame({
                parent: screenGui,
            });
    }
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
