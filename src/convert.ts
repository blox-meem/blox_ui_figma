import { assert } from "console";
import { bloxUITitle, codeGenerationLanguage, dartTitle, luaCodeTitle } from "./constants";
import { 
    Color3,
    ColorSequence,
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

export class FigmaRectangle extends FigmaObject<RectangleType> {
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

export const keyProperties: Array<string> = [
    // GuiObject
    "BACKGROUNDCOLOR3",
    "BACKGROUNDTRANSPARENCY",
    "CLIPDESCENDANTS",
    "POSTION",
    "ROTATION",
    "SIZE",
    "VISIBLE",
    // ScrollingFrame
    "CANVASPOSTION",
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
    "RICHTEXT",
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
    // ImageLabel
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
            return new ColorSequence();
        case "GRADIENT_RADIAL":
        case "GRADIENT_ANGULAR":
        case "GRADIENT_DIAMOND":
        case "IMAGE":
        case "VIDEO":
        default:
            throw Error("Unimplemented Figma paint type");
    }
}

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
    }
}

declare type FigmaObjects = FigmaRectangle | FigmaEllipse | FigmaText | FigmaImage | FigmaVideo;

function assembleScreenGui(params: ScreenGuiProperties): ScreenGui {
    return new ScreenGui(params);
}

export function convertFigmaObjectToRobloxObject(figmaObject: FigmaObjects, screenGuiProperties: ScreenGuiProperties): GuiBase {
    const screenGui: ScreenGui = assembleScreenGui(screenGuiProperties);
    switch (figmaObject.figmaObjectType) {
        case "FRAME":
            const rectangleFrameObject: FigmaRectangle = (figmaObject as FigmaRectangle);
            return new Frame({
                parent: screenGui,
                //
                backgroundColor: rectangleFrameObject.fills[0]
            });
        case "SCROLLINGFRAME":
            const scrollingFrameObject: FigmaRectangle = (figmaObject as FigmaRectangle);
            return new ScrollingFrame({
                parent: screenGui,
            });
        case "VIEWPORTFRAME":
            const viewportFrameObject: FigmaRectangle = (figmaObject as FigmaRectangle);
            return new ViewportFrame({
                parent: screenGui,
            });
        case "VIDEOFRAME":
            const videoFrameObject: FigmaVideo = (figmaObject as FigmaVideo);
            return new VideoFrame({
                parent: screenGui,
            });
        case "IMAGELABEL":
            const imageLabelObject: FigmaImage = (figmaObject as FigmaImage);
            return new ImageLabel({
                parent: screenGui,
            });
        case "IMAGEBUTTON":
            const imageButtonObject: FigmaImage = (figmaObject as FigmaImage);
            return new ImageButton({
                parent: screenGui,
            });
        case "TEXTBOX":
            const textBoxObject: FigmaText = (figmaObject as FigmaText);
            return new TextBox({
                parent: screenGui,
            });
        case "TEXTBUTTON":
            const textButtonObject: FigmaText = (figmaObject as FigmaText);
            return new TextButton({
                parent: screenGui,
            });
        case "TEXTLABEL":
            const textLabelObject: FigmaText = (figmaObject as FigmaText);
            return new TextLabel({
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
