import { assert } from "console";
import { off } from "process";

abstract class RobloxObject {}

interface RobloxCodeParser {
    toCode(variableName: string): string;
}

export abstract class Instance extends RobloxObject implements RobloxCodeParser{
    archivable: boolean;
    name: string;
    parent?: Instance;

    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
    }) {
        super();
        this.archivable = params.archivable ?? true;
        this.name = params.name ?? 'Instance';
        this.parent = params.parent;
    }

    toCode(variableName: string): string {
        return `
        local ${variableName}: Instance = Instance.new();
        ${variableName}.Archivable = ${this.archivable}
        ${variableName}.Name = ${this.name}
        ${variableName}.Parent = ${this.parent?.toCode ?? "nil"}
        `.trim();
    }
}

export class LocalizationTable {
    constructor() {}
}

export enum SelectionBehavior {
    escape,
    stop,
}

interface RobloxGlobalObject {
    toCode(): string;
}

export class Color3 implements RobloxGlobalObject {
    r: number;
    g: number;
    b: number;

    constructor(r: number, g: number, b: number) {
        assert(r >= 0 && r <= 255);
        assert(g >= 0 && g <= 255);
        assert(b >= 0 && b <= 255);
        this.r = r;
        this.g = g;
        this.b = b;
    }

    toCode(): string {
        return `Color3.fromRGB(${this.r}, ${this.g}, ${this.b})`;
    }
}

export class Vector2 implements RobloxGlobalObject {
    static zero: Vector2 = new Vector2(0, 0);
    
    static one: Vector2 = new Vector2(1, 1);

    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    toCode(): string {
        return `Vector.new(${this.x}, ${this.y})`;
    }
}

export enum AutomaticSize {
    none,
    x,
    xy,
    y
}

export enum BorderMode {
    inset, middle, outline
}

export class UDim implements RobloxGlobalObject {
    scale: number;
    offset: number;

    constructor(scale: number, offset: number) {
        this.scale = scale;
        this.offset = offset;
    }

    toCode(): string {
        return `UDim.new(${this.scale}, ${this.offset})`;
    }
}

export class UDim2 implements RobloxGlobalObject {
    x: UDim;
    y: UDim;

    constructor(xScale: number, xOffset: number, yScale: number, yOffset: number) {
        this.x = new UDim(xScale, xOffset);
        this.y = new UDim(yScale, yOffset);
    }

    toCode(): string {
        return `UDIm2.new(${this.x.scale}, ${this.x.offset}, ${this.y.scale}, ${this.y.offset})`;
    }
}

export enum SizeConstraint {
    relativeXX,
    relativeXY,
    relativeYY
}

export enum ButtonStyle {
    custom,
    robloxButtonDefault,
    robloxButton,
    robloxRoundButton,
    robloxRoundDefaultButton,
    robloxRoundDropdownButton
}

export enum FrameStyle {
    custom,
    chatBlue,
    robloxSquare,
    robloxRound,
    chatGreen,
    chatRed,
    dropShadow,
}

export enum ElasticBehavior {
    whenScrollable,
    always,
    never
}

export enum ScrollBarInset {
    none,
    scrollBar,
    always
}

export enum ScrollingDirection {
    x,
    y,
    xy
}

export enum VerticalScrollBarPosition {
    right,
    left
}

export class CFrame {
    identity?: CFrame;
    position?: Vector3;
    rotation?: CFrame;
    x?: number;
    y?: number;
    z?: number;
    lookVector?: Vector3;
    rightVector?: Vector3;
    upVector?: Vector3;
    xVector?: Vector3;
    yVector?: Vector3;
    zVector?: Vector3;

    constructor() {}
}

export enum FieldOfViewMode {
    vertical,
    diagonal,
    maxAxis
}

export class Camera extends Instance {
    cframe: CFrame;
    cameraSubject?: Instance;
    diagonalFieldOfView: number;
    fieldOfView: number;
    fieldOfViewMode: FieldOfViewMode;
    focus: CFrame;
    headLocked: boolean;
    headScale: number;
    maxAxisFieldOfView: number;
    vrTiltAndRollEnabled: boolean;

    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
        //
        cframe?: CFrame,
        cameraSubject?: Instance,
        diagonalFieldOfView?: number,
        fieldOfView?: number,
        fieldOfViewMode?: FieldOfViewMode,
        focus?: CFrame,
        headLocked?: boolean,
        headScale?: number,
        maxAxisFieldOfView?: number,
        vrTiltAndRollEnabled?: boolean,
    }) {
        super({
            archivable: params.archivable,
            name: params.name,
            parent: params.parent,
        });
        this.cframe = params.cframe ?? new CFrame();
        this.cameraSubject = params.cameraSubject;
        this.diagonalFieldOfView = params.diagonalFieldOfView ?? 88.877;
        this.fieldOfView = params.fieldOfView ?? 70;
        this.fieldOfViewMode = params.fieldOfViewMode ?? FieldOfViewMode.vertical;
        this.focus = params.focus ?? new CFrame();
        this.headLocked = params.headLocked ?? true;
        this.headScale = params.headScale ?? 1;
        this.maxAxisFieldOfView = params.maxAxisFieldOfView ?? 70;
        this.vrTiltAndRollEnabled = params.vrTiltAndRollEnabled ?? false;  
    }

    toCode(variableName: string): string {
        return super.toCode(variableName) + `
        ${variableName}.CFrame = ${this.cframe.toCode()}
        ${variableName}.CameraSubject = ${this.cameraSubject?.toCode() ?? "nil"}
        ${variableName}.DiagonalFieldOfView = ${this.diagonalFieldOfView.toCode()}
        ${variableName}.FieldOfView = ${this.fieldOfView.toCode()}
        ${variableName}.FieldOfViewMode = ${toCode(this.fieldOfViewMode)}
        ${variableName}.Focus = ${this.focus.toCode()}
        ${variableName}.HeadLocked = ${this.headLocked}
        ${variableName}.HeadScale = ${this.headScale}
        ${variableName}.MaxAxisFieldOfView = ${this.maxAxisFieldOfView}
        ${variableName}.VRTiltAndRollEnabled = ${this.vrTiltAndRollEnabled}
        `;
    }
}

export class Vector3 implements RobloxGlobalObject {
    static zero = new Vector2(0, 0);
    
    static one = new Vector2(1, 1);

    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    toCode(): string {
        return `Vector3.new(${this.x}, ${this.y}, ${this.z})`;
    }
}

export enum ResamplerMode {
    default,
    pixelated
}

export enum ScaleType {
    stretch,
    slice,
    tile,
    fit,
    crop
}

export class Rect implements RobloxGlobalObject {
    min: Vector2;
    max: Vector2;

    constructor(min: Vector2, max: Vector2) {
        this.min = min;
        this.max = max;
    }

    toCode(): string {
        return `Rect.new(${this.min}, ${this.max})`;
    }
}

export enum TextDirection {
    auto,
    leftToRight,
    rightToLeft
}

export enum TextTruncate {
    none,
    atEnd,
    splitWord
}

export enum TextXAlignment {
    left,
    right,
    center
}

export enum TextYAlignment {
    top,
    center,
    bottom
}

export class Font implements RobloxGlobalObject {
    family: string; 
    weight: FontWeight; 
    style: FontStyle;

    constructor(family: string, weight: FontWeight, style: FontStyle) {
        this.family = family;
        this.weight = weight;
        this.style = style;
    }
    toCode(): string {
        return `Font.new(${this.family}, ${this.weight}, ${this.style})`;
    }
}

export enum FontWeight {
    thin,
    extraLight,
    light,
    regular,
    medium,
    semiBold,
    bold,
    extraBold,
    heavy
}

export enum FontStyle {
    normal,
    italic
}

export enum AspectType {
    fitWithInMaxSize,
    scaleWithParentSize
}

export enum DominantAxis {
    width,
    height
}

export enum UIFlexMode {
    none,
    grow,
    shrink,
    fill,
    custom
}

export enum ItemLineAlignment {
    automatic,
    start,
    center,
    end,
    scretch
}

export class ColorSequenceKeypoint implements RobloxGlobalObject {
    time: number;
    value: Color3;

    constructor(time: number, color: Color3) {
        this.time = time;
        this.value = color;
    }
    toCode(): string {
        return `ColorSequenceKeypoint.new(${this.time}, ${this.value.toCode()})`;
    }
}

export class ColorSequence implements RobloxGlobalObject {
    keypoints: ColorSequenceKeypoint[];

    constructor(keypoints: ColorSequenceKeypoint[]) {
        this.keypoints = keypoints;
    }

    toCode(): string {
        return `ColorSequence.new({${this.keypoints
            .toString()
            .replace("[", "")
            .replace("]", "")
            .trim()
        })}`;
    }
}

export class NumberSequenceKeypoint implements RobloxGlobalObject {
    time: number;
    value: number;
    envelope: number;

    constructor(time: number, value: number, envelope: number) {
        this.time = time;
        this.value = value;
        this.envelope = envelope;
    }

    toCode(): string {
        return `NumberSequenceKeypoint.new(${this.time}, ${this.value}, ${this.envelope})`;
    }
}

export class NumberSequence implements RobloxGlobalObject {
    keypoints: NumberSequenceKeypoint[];

    constructor(keypoints: NumberSequenceKeypoint[]) {
        this.keypoints = keypoints;
    }

    toCode(): string {
        return `NumberSequence.new(${
            this.keypoints
            .toString()
            .replace("[", "")
            .replace("]", "")
            .trim()
        })`;
    }
}

export enum StartCorner {
    topLeft,
    topRight,
    bottomLeft,
    bottomRight
}

export enum FillDirection {
    horizontal,
    vertical
}

export enum HorizontalAlignment {
    center,
    left,
    right
}

export enum SortOrder {
    name,
    custom,
    layoutOrder
}

export enum VerticalAlignment {
    center,
    top,
    bottom
}

export enum UIFlexAlignment {
    none,
    fill,
    spaceAround,
    spaceBetween,
    spaceEvenly
}

export enum EasingDirection {
    in,
    out,
    inOut
}

export enum EasingStyle {
    linear,
    sine,
    back,
    quad,
    quart,
    quint,
    bounce,
    elastic,
    exponential,
    circular,
    cubic
}

export enum ApplyStrokeMode {
    contextual,
    border
}

export enum LineJoinMode {
    round,
    bevel,
    miter
}

export enum TableMajorAxis {
    rowMajor,
    columnMajor
}

export enum ZIndexBehaviour {
   global,
   sibling, 
}

export enum SafeAreaCompatibility {
    none,
    fullscreenExtension,
}

export enum ScreenInsets {
    none,
    deviceSafeInsets,
    coreUISafeInsets,
    topBarSafeInsets,
}

declare type RobloxEnumerations = 
    | SelectionBehavior 
    | AutomaticSize
    | BorderMode
    | SizeConstraint
    | ButtonStyle
    | FrameStyle
    | ElasticBehavior
    | ScrollBarInset
    | ScrollingDirection
    | VerticalScrollBarPosition
    | FieldOfViewMode
    | ResamplerMode
    | ScaleType
    | TextDirection
    | TextTruncate
    | TextXAlignment
    | TextYAlignment
    | FontWeight
    | FontStyle
    | AspectType
    | DominantAxis
    | UIFlexMode
    | ItemLineAlignment
    | StartCorner
    | FillDirection
    | HorizontalAlignment
    | SortOrder
    | VerticalAlignment
    | UIFlexAlignment
    | EasingDirection
    | EasingStyle
    | ApplyStrokeMode
    | LineJoinMode
    | TableMajorAxis
    | ZIndexBehaviour
    | SafeAreaCompatibility
    | ScreenInsets
;

export function toCode(enumeration: RobloxEnumerations): string {
    switch (enumeration) {
        // SelectionBehavior
        case SelectionBehavior.escape:
            return `Enum.SelectionBehavior.Escape`;
        case SelectionBehavior.stop:
            return `Enum.SelectionBehavior.Stop`;
        // AutomaticSize
        case AutomaticSize.none:
            return `Enum.AutomaticSize.None`;
        case AutomaticSize.x:
            return `Enum.AutomaticSize.X`;
        case AutomaticSize.y:
            return `Enum.AutomaticSize.Y`;
        case AutomaticSize.xy:
            return `Enum.AutomaticSize.XY`;
        // BorderMode
        case BorderMode.outline:
            return `Enum.BorderMode.Outline`;
        case BorderMode.middle:
            return `Enum.BorderMode.Middle`;
        case BorderMode.inset:
            return `Enum.BorderMode.Inset`;
        // SizeConstraint
        case SizeConstraint.relativeXY:
            return `Enum.SizeConstraint.RelativeXY`;
        case SizeConstraint.relativeXX:
            return `Enum.SizeConstraint.RelativeXX`;
        case SizeConstraint.relativeYY:
            return `Enum.SizeConstraint.RelativeYY`;
        // ButtonStyle
        case ButtonStyle.custom:
            return `Enum.ButtonStyle.Custom`;
        case ButtonStyle.robloxButtonDefault:
            return `Enum.ButtonStyle.RobloxButtonDefault`;
        case ButtonStyle.robloxButton:
            return `Enum.ButtonStyle.RobloxButton`;
        case ButtonStyle.robloxRoundButton:
            return `Enum.ButtonStyle.RobloxRoundButton`;
        case ButtonStyle.robloxRoundDefaultButton:
            return `Enum.ButtonStyle.RobloxRoundDefaultButton`;
        case ButtonStyle.robloxRoundDropdownButton:
            return `Enum.ButtonStyle.RobloxRoundDropdownButton`;
        // FrameStyle
        case FrameStyle.custom:
            return `Enum.FrameStyle.Custom`;
        case FrameStyle.chatBlue:
            return `Enum.FrameStyle.ChatBlue`;
        case FrameStyle.robloxSquare:
            return `Enum.FrameStyle.RobloxSquare`;
        case FrameStyle.robloxRound:
            return `Enum.FrameStyle.RobloxRound`;
        case FrameStyle.chatGreen:
            return `Enum.FrameStyle.ChatGreen`;
        case FrameStyle.chatRed:
            return `Enum.FrameStyle.ChatRed`;  
        case FrameStyle.dropShadow:
            return `Enum.FrameStyle.DropShadow`;
        // ElasticBehavior
        case ElasticBehavior.whenScrollable:
            return `Enum.ElasticBehavior.WhenScrollable`;
        case ElasticBehavior.always:
            return `Enum.ElasticBehavior.Always`;  
        case ElasticBehavior.never:
            return `Enum.ElasticBehavior.Never`;
        // ScrollBarInset
        case ScrollBarInset.none:
            return `Enum.ScrollBarInset.None`;
        case ScrollBarInset.scrollBar:
            return `Enum.ScrollBarInset.ScrollBar`;  
        case ScrollBarInset.always:
            return `Enum.ScrollBarInset.Always`; 
        // ScrollingDirection
        case ScrollingDirection.x:
            return `Enum.ScrollingDirection.X`;
        case ScrollingDirection.y:
            return `Enum.ScrollingDirection.Y`;  
        case ScrollingDirection.xy:
            return `Enum.ScrollingDirection.XY`;   
        // VerticalScrollBarPosition
        case VerticalScrollBarPosition.left:
            return `Enum.VerticalScrollBarPosition.Left`;  
        case VerticalScrollBarPosition.right:
            return `Enum.VerticalScrollBarPosition.Right`; 
        // FieldOfViewMode
        case FieldOfViewMode.vertical:
            return `Enum.FieldOfViewMode.Vertical`;
        case FieldOfViewMode.diagonal:
            return `Enum.FieldOfViewMode.Diagonal`;  
        case FieldOfViewMode.maxAxis:
            return `Enum.FieldOfViewMode.MaxAxis`;
        // ResamplerMode
        case ResamplerMode.default:
            return `Enum.ResamplerMode.Default`;  
        case ResamplerMode.pixelated:
            return `Enum.ResamplerMode.Pixelated`;
        //    
        default: throw new Error();
    }
}

//

export abstract class GuiBase extends Instance {
    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
    }) {
        super({
            archivable: params.archivable, 
            name: params.name ?? 'GuiBase', 
            parent: params.parent
        });
    }
}

abstract class GuiBase2d extends GuiBase {
    autoLocalize: boolean;
    rootLocalizationTable?: LocalizationTable;
    selectionBehaviorDown: SelectionBehavior;
    selectionBehaviorLeft: SelectionBehavior;
    selectionBehaviorRight: SelectionBehavior;
    selectionBehaviorUp: SelectionBehavior;
    selectionGroup: boolean;
    
    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
        //
        autoLocalize?: boolean,
        rootLocalizationTable?: LocalizationTable,
        selectionBehaviorDown?: SelectionBehavior,
        selectionBehaviorLeft?: SelectionBehavior,
        selectionBehaviorRight?: SelectionBehavior,
        selectionBehaviorUp?: SelectionBehavior,
        selectionGroup?: boolean,
    }) {
        super({
            archivable: params.archivable, 
            name: params.name ?? 'GuiBase2d', 
            parent: params.parent
        });
        this.autoLocalize = params.autoLocalize ?? true;
        this.rootLocalizationTable = params.rootLocalizationTable;
        this.selectionBehaviorDown = params.selectionBehaviorDown ?? SelectionBehavior.escape;
        this.selectionBehaviorLeft = params.selectionBehaviorLeft ?? SelectionBehavior.escape;
        this.selectionBehaviorRight = params.selectionBehaviorRight ?? SelectionBehavior.escape;
        this.selectionBehaviorUp = params.selectionBehaviorUp ?? SelectionBehavior.escape;
        this.selectionGroup = params.selectionGroup ?? false;
    }

    toObject(): object {
        return  {
            archivable: this.archivable,
            name: this.name,
            parent: this.parent,
            //
            autoLocalize: this.autoLocalize,
            rootLocalizationTable: this.rootLocalizationTable,
            selectionBehaviorDown: this.selectionBehaviorDown,
            selectionBehaviorLeft: this.selectionBehaviorLeft,
            selectionBehaviorRight: this.selectionBehaviorRight,
            selectionBehaviorUp: this.selectionBehaviorUp,
            selectionGroup: this.selectionGroup,
        };
    }

    toCode(variableName: string): string {
        return super.toCode(variableName) + `
        ${variableName}.AutoLocalize = ${this.autoLocalize}
        ${variableName}.RootLocalizationTable = ${this.rootLocalizationTable ?? 'nil'}
        ${variableName}.SelectionBehaviorDown = ${this.selectionBehaviorDown}
        ${variableName}.SelectionBehaviorLeft = ${this.selectionBehaviorLeft}
        ${variableName}.SelectionBehaviorRight = ${this.selectionBehaviorRight}
        ${variableName}.SelectionBehaviorUp = ${this.selectionBehaviorUp}
        ${variableName}.SelectionGroup = ${this.selectionGroup}
        `;
    }
}

abstract class LayerCollector extends GuiBase2d {
    enabled: boolean;
    resetOnSpawn: boolean;
    zIndexBehavior: ZIndexBehaviour;

    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
        //
        autoLocalize?: boolean,
        rootLocalizationTable?: LocalizationTable,
        selectionBehaviorDown?: SelectionBehavior,
        selectionBehaviorLeft?: SelectionBehavior,
        selectionBehaviorRight?: SelectionBehavior,
        selectionBehaviorUp?: SelectionBehavior,
        selectionGroup?: boolean,
        //
        enabled?: boolean,
        resetOnSpawn?: boolean,
        zIndexBehavior?: ZIndexBehaviour,
    }) {
        super({
            archivable: params.archivable,
            name: params.name,
            parent: params.parent,
            //
            autoLocalize: params.autoLocalize,
            rootLocalizationTable: params.rootLocalizationTable,
            selectionBehaviorDown: params.selectionBehaviorDown,
            selectionBehaviorLeft: params.selectionBehaviorLeft,
            selectionBehaviorRight: params.selectionBehaviorRight,
            selectionBehaviorUp: params.selectionBehaviorUp,
            selectionGroup: params.selectionGroup,
        });
        this.enabled = params.enabled ?? true;
        this.resetOnSpawn = params.resetOnSpawn ?? true;
        this.zIndexBehavior = params.zIndexBehavior ?? ZIndexBehaviour.sibling;
    }
}

export declare type ScreenGuiProperties = {
    archivable?: boolean,
    name?: string,
    parent?: Instance,
    //
    autoLocalize?: boolean,
    rootLocalizationTable?: LocalizationTable,
    selectionBehaviorDown?: SelectionBehavior,
    selectionBehaviorLeft?: SelectionBehavior,
    selectionBehaviorRight?: SelectionBehavior,
    selectionBehaviorUp?: SelectionBehavior,
    selectionGroup?: boolean,
    //
    enabled?: boolean,
    resetOnSpawn?: boolean,
    zIndexBehavior?: ZIndexBehaviour,
    //
    clipToDeviceSafeArea?: boolean,
    displayOrder?: number,
    ignoreGuiInset?: boolean,
    safeAreaCompatibility?: SafeAreaCompatibility,
    screenInsets?: ScreenInsets,
};

export class ScreenGui extends LayerCollector {
    clipToDeviceSafeArea: boolean;
    displayOrder: number;
    ignoreGuiInset: boolean;
    safeAreaCompatibility: SafeAreaCompatibility;
    screenInsets: ScreenInsets;

    constructor(params: ScreenGuiProperties) {
        super({
            archivable: params.archivable,
            name: params.name,
            parent: params.parent,
            //
            autoLocalize: params.autoLocalize,
            rootLocalizationTable: params.rootLocalizationTable,
            selectionBehaviorDown: params.selectionBehaviorDown,
            selectionBehaviorLeft: params.selectionBehaviorLeft,
            selectionBehaviorRight: params.selectionBehaviorRight,
            selectionBehaviorUp: params.selectionBehaviorUp,
            selectionGroup: params.selectionGroup,
            //
            enabled: params.enabled,
            resetOnSpawn: params.resetOnSpawn,
            zIndexBehavior: params.zIndexBehavior,
        });
        this.clipToDeviceSafeArea = params.clipToDeviceSafeArea ?? true;
        this.displayOrder = params.displayOrder ?? 0;
        this.ignoreGuiInset = params.ignoreGuiInset ?? false;
        this.safeAreaCompatibility = params.safeAreaCompatibility ?? SafeAreaCompatibility.fullscreenExtension;
        this.screenInsets = params.screenInsets ?? ScreenInsets.coreUISafeInsets;
    }
}

abstract class GuiBase3d extends GuiBase {
    color3: Color3;
    transparency: number;
    visible: boolean;
    
    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
        //
        color3: Color3,
        transparency: number,
        visible: boolean,
    }) {
        super({
            archivable: params.archivable, 
            name: params.name ?? 'GuiBase3d', 
            parent: params.parent
        });
        this.color3 = params.color3;
        this.transparency = params.transparency;
        this.visible = params.visible;
    }

    toCode(variableName: string): string {
        return super.toCode(variableName) + `
        ${variableName}.Color3 = ${this.color3}
        ${variableName}.Transparency = ${this.transparency}
        ${variableName}.Visible = ${this.visible} 
        `;
    }
}

abstract class GuiObject extends GuiBase2d {
    active: boolean;
    anchorPoint: Vector2;
    automaticSize: AutomaticSize;
    backgroundColor: Color3;
    backgroundTransparency: number;
    borderColor3: Color3;
    borderMode: BorderMode;
    borderSizePixel: number;
    clipDescendants: boolean;
    interactable: boolean;
    layoutOrder: number;
    nextSelectionDown?: GuiObject;
    nextSelectionLeft?: GuiObject;
    nextSelectionRight?: GuiObject;
    nextSelectionUp?: GuiObject;
    position: UDim2;
    rotation: number;
    selectable: boolean;
    selectionImageObject?: GuiObject;
    selectionOrder: number;
    size: UDim2;
    sizeConstraint: SizeConstraint;
    visible: boolean;
    zIndex: number;

    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
        //
        autoLocalize?: boolean,
        rootLocalizationTable?: LocalizationTable,
        selectionBehaviorDown?: SelectionBehavior,
        selectionBehaviorLeft?: SelectionBehavior,
        selectionBehaviorRight?: SelectionBehavior,
        selectionBehaviorUp?: SelectionBehavior,
        selectionGroup?: boolean,
        //
        active?: boolean,
        anchorPoint?: Vector2,
        automaticSize?: AutomaticSize,
        backgroundColor?: Color3,
        backgroundTransparency?: number,
        borderColor3?: Color3,
        borderMode?: BorderMode,
        borderSizePixel?: number,
        clipDescendants?: boolean,
        interactable?: boolean,
        layoutOrder?: number,
        nextSelectionDown?: GuiObject,
        nextSelectionLeft?: GuiObject,
        nextSelectionRight?: GuiObject,
        nextSelectionUp?: GuiObject,
        position?: UDim2,
        rotation?: number,
        selectable?: boolean,
        selectionImageObject?: GuiObject,
        selectionOrder?: number,
        size?: UDim2,
        sizeConstraint?: SizeConstraint,
        visible?: boolean,
        zIndex?: number,
    }) {
        super({
            archivable: params.archivable,
            name: params.name,
            parent: params.parent,
            //
            autoLocalize: params.autoLocalize,
            rootLocalizationTable: params.rootLocalizationTable,
            selectionBehaviorDown: params.selectionBehaviorDown,
            selectionBehaviorLeft: params.selectionBehaviorLeft,
            selectionBehaviorRight: params.selectionBehaviorRight,
            selectionBehaviorUp: params.selectionBehaviorUp,
            selectionGroup: params.selectionGroup,
        });
        this.active = params.active ?? false;
        this.anchorPoint = params.anchorPoint ?? Vector2.zero;
        this.automaticSize = params.automaticSize ?? AutomaticSize.none;
        this.backgroundColor = params.backgroundColor ?? new Color3(255, 255, 255);
        this.backgroundTransparency = params.backgroundTransparency ?? 0;
        this.borderColor3 = params.borderColor3 ?? new Color3(0, 0, 0);
        this.borderMode = params.borderMode ?? BorderMode.outline;
        this.borderSizePixel = params.borderSizePixel ?? 0;
        this.clipDescendants = params.clipDescendants ?? false;
        this.interactable = params.interactable ?? true;
        this.layoutOrder = params.layoutOrder ?? 0;
        this.nextSelectionDown = params.nextSelectionDown;
        this.nextSelectionLeft = params.nextSelectionLeft;
        this.nextSelectionRight = params.nextSelectionRight;
        this.nextSelectionUp = params.nextSelectionUp;
        this.position = params.position = new UDim2(0, 0, 0, 0);
        this.rotation = params.rotation ?? 0;
        this.selectable = params.selectable ?? false;
        this.selectionImageObject = params.selectionImageObject;
        this.selectionOrder = params.selectionOrder ?? 0;
        this.size = params.size ?? new UDim2(0, 100, 0, 100);
        this.sizeConstraint = params.sizeConstraint ?? SizeConstraint.relativeXY;
        this.visible = params.visible ?? true;
        this.zIndex = params.zIndex ?? 1;
    }  

    toCode(variableName: string): string {
        return super.toCode(variableName) + `
        ${variableName}.Active = ${this.active}
        ${variableName}.AnchorPoint = ${this.anchorPoint}
        ${variableName}.AutomaticSize = ${this.automaticSize}
        ${variableName}.BackgroundColor = ${this.backgroundColor}
        ${variableName}.BackgroundTransparency = ${this.backgroundTransparency}
        ${variableName}.BorderColor3 = ${this.borderColor3}
        ${variableName}.BorderMode = ${this.borderMode}
        ${variableName}.BorderSizePixel = ${this.borderSizePixel}
        ${variableName}.ClipDescendants = ${this.clipDescendants}
        ${variableName}.Interactable = ${this.interactable}
        ${variableName}.LayoutOrder = ${this.layoutOrder}
        ${variableName}.NextSelectionDown = ${this.nextSelectionDown}
        ${variableName}.NextSelectionLeft = ${this.nextSelectionLeft}
        ${variableName}.NextSelectionRight = ${this.nextSelectionRight}
        ${variableName}.NextSelectionUp = ${this.nextSelectionUp}
        ${variableName}.Position = ${this.position}
        ${variableName}.Rotation = ${this.rotation}
        ${variableName}.Selectable = ${this.selectable}
        ${variableName}.SelectionImageObject = ${this.selectionImageObject}
        ${variableName}.SelectionOrder = ${this.selectionOrder}
        ${variableName}.Size = ${this.size}
        ${variableName}.SizeConstraint = ${this.sizeConstraint}
        ${variableName}.Visible = ${this.visible}
        ${variableName}.ZIndex = ${this.zIndex}
        `;
    }
}

abstract class GuiButton extends GuiObject {
    autoButtonColor: boolean;
    modal: boolean;
    selected: boolean;
    style: ButtonStyle;
    
    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
        //
        autoLocalize?: boolean,
        rootLocalizationTable?: LocalizationTable,
        selectionBehaviorDown?: SelectionBehavior,
        selectionBehaviorLeft?: SelectionBehavior,
        selectionBehaviorRight?: SelectionBehavior,
        selectionBehaviorUp?: SelectionBehavior,
        selectionGroup?: boolean,
        //
        active?: boolean,
        anchorPoint?: Vector2,
        automaticSize?: AutomaticSize,
        backgroundColor?: Color3,
        backgroundTransparency?: number,
        borderColor3?: Color3,
        borderMode?: BorderMode,
        borderSizePixel?: number,
        clipDescendants?: boolean,
        interactable?: boolean,
        layoutOrder?: number,
        nextSelectionDown?: GuiObject,
        nextSelectionLeft?: GuiObject,
        nextSelectionRight?: GuiObject,
        nextSelectionUp?: GuiObject,
        position?: UDim2,
        rotation?: number,
        selectable?: boolean,
        selectionImageObject?: GuiObject,
        selectionOrder?: number,
        size?: UDim2,
        sizeConstraint?: SizeConstraint,
        visible?: boolean,
        zIndex?: number,
        //
        autoButtonColor: boolean,
        modal: boolean,
        selected: boolean,
        style: ButtonStyle,
    }) {
        super({
            archivable: params.archivable,
            name: params.name,
            parent: params.parent,
            //
            autoLocalize: params.autoLocalize,
            rootLocalizationTable: params.rootLocalizationTable,
            selectionBehaviorDown: params.selectionBehaviorDown,
            selectionBehaviorLeft: params.selectionBehaviorLeft,
            selectionBehaviorRight: params.selectionBehaviorRight,
            selectionBehaviorUp: params.selectionBehaviorUp,
            selectionGroup: params.selectionGroup,
            //
            active: params.active,
            anchorPoint: params.anchorPoint,
            automaticSize: params.automaticSize,
            backgroundColor: params.backgroundColor,
            backgroundTransparency: params.backgroundTransparency,
            borderColor3: params.borderColor3,
            borderMode: params.borderMode,
            borderSizePixel: params.borderSizePixel,
            clipDescendants: params.clipDescendants,
            interactable: params.interactable,
            layoutOrder: params.layoutOrder,
            nextSelectionDown: params.nextSelectionDown,
            nextSelectionLeft: params.nextSelectionLeft,
            nextSelectionRight: params.nextSelectionRight,
            nextSelectionUp: params.nextSelectionUp,
            position: params.position,
            rotation: params.rotation,
            selectable: params.selectable,
            selectionImageObject: params.selectionImageObject,
            selectionOrder: params.selectionOrder,
            size: params.size,
            sizeConstraint: params.sizeConstraint,
            visible: params.visible,
            zIndex: params.zIndex,
        });
        this.autoButtonColor = params.autoButtonColor ?? true;
        this.modal = params.modal ?? false;
        this.selected = params.selected ?? false;
        this.style = params.style ?? ButtonStyle.custom;
    }

    toCode(variableName: string): string {
        return super.toCode(variableName) + `
        ${variableName}.AutoButtonColor = ${this.autoButtonColor}
        ${variableName}.Modal = ${this.modal}
        ${variableName}.Selected = ${this.selected}
        ${variableName}.Style = ${this.style}
        `;
    }
}

export class Frame extends GuiObject {
    style: FrameStyle;

    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
        //
        autoLocalize?: boolean,
        rootLocalizationTable?: LocalizationTable,
        selectionBehaviorDown?: SelectionBehavior,
        selectionBehaviorLeft?: SelectionBehavior,
        selectionBehaviorRight?: SelectionBehavior,
        selectionBehaviorUp?: SelectionBehavior,
        selectionGroup?: boolean,
        //
        active?: boolean,
        anchorPoint?: Vector2,
        automaticSize?: AutomaticSize,
        backgroundColor?: Color3,
        backgroundTransparency?: number,
        borderColor3?: Color3,
        borderMode?: BorderMode,
        borderSizePixel?: number,
        clipDescendants?: boolean,
        interactable?: boolean,
        layoutOrder?: number,
        nextSelectionDown?: GuiObject,
        nextSelectionLeft?: GuiObject,
        nextSelectionRight?: GuiObject,
        nextSelectionUp?: GuiObject,
        position?: UDim2,
        rotation?: number,
        selectable?: boolean,
        selectionImageObject?: GuiObject,
        selectionOrder?: number,
        size?: UDim2,
        sizeConstraint?: SizeConstraint,
        visible?: boolean,
        zIndex?: number,
        //
        style?: FrameStyle,
    }) {
        super({
            archivable: params.archivable,
            name: params.name,
            parent: params.parent,
            //
            autoLocalize: params.autoLocalize,
            rootLocalizationTable: params.rootLocalizationTable,
            selectionBehaviorDown: params.selectionBehaviorDown,
            selectionBehaviorLeft: params.selectionBehaviorLeft,
            selectionBehaviorRight: params.selectionBehaviorRight,
            selectionBehaviorUp: params.selectionBehaviorUp,
            selectionGroup: params.selectionGroup,
            //
            active: params.active,
            anchorPoint: params.anchorPoint,
            automaticSize: params.automaticSize,
            backgroundColor: params.backgroundColor,
            backgroundTransparency: params.backgroundTransparency,
            borderColor3: params.borderColor3,
            borderMode: params.borderMode,
            borderSizePixel: params.borderSizePixel,
            clipDescendants: params.clipDescendants,
            interactable: params.interactable,
            layoutOrder: params.layoutOrder,
            nextSelectionDown: params.nextSelectionDown,
            nextSelectionLeft: params.nextSelectionLeft,
            nextSelectionRight: params.nextSelectionRight,
            nextSelectionUp: params.nextSelectionUp,
            position: params.position,
            rotation: params.rotation,
            selectable: params.selectable,
            selectionImageObject: params.selectionImageObject,
            selectionOrder: params.selectionOrder,
            size: params.size,
            sizeConstraint: params.sizeConstraint,
            visible: params.visible,
            zIndex: params.zIndex,
        });
        this.style = params.style ?? FrameStyle.custom;
    }

    toCode(variableName: string): string {
        return super.toCode(variableName) + `
        ${variableName}.Style = ${this.style}
        `;
    }
}

export class ScrollingFrame extends GuiObject {
    automaticCanvasSize: AutomaticSize;
    bottomImage: string;
    canvasPosition: Vector2;
    canvasSize: UDim2;
    elasticBehavior: ElasticBehavior;
    horizontalScrollBarInset: ScrollBarInset;
    midImage: string;
    scrollBarImageColor3: Color3;
    scrollBarImageTransparency: number;
    scrollBarThickness: number;
    scrollingDirection: ScrollingDirection;
    scrollingEnabled: boolean;
    topImage: string;
    verticalScrollBarInset: ScrollBarInset;
    verticalScrollBarPosition: VerticalScrollBarPosition;

    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
        //
        autoLocalize?: boolean,
        rootLocalizationTable?: LocalizationTable,
        selectionBehaviorDown?: SelectionBehavior,
        selectionBehaviorLeft?: SelectionBehavior,
        selectionBehaviorRight?: SelectionBehavior,
        selectionBehaviorUp?: SelectionBehavior,
        selectionGroup?: boolean,
        //
        active?: boolean,
        anchorPoint?: Vector2,
        automaticSize?: AutomaticSize,
        backgroundColor?: Color3,
        backgroundTransparency?: number,
        borderColor3?: Color3,
        borderMode?: BorderMode,
        borderSizePixel?: number,
        clipDescendants?: boolean,
        interactable?: boolean,
        layoutOrder?: number,
        nextSelectionDown?: GuiObject,
        nextSelectionLeft?: GuiObject,
        nextSelectionRight?: GuiObject,
        nextSelectionUp?: GuiObject,
        position?: UDim2,
        rotation?: number,
        selectable?: boolean,
        selectionImageObject?: GuiObject,
        selectionOrder?: number,
        size?: UDim2,
        sizeConstraint?: SizeConstraint,
        visible?: boolean,
        zIndex?: number,
        //
        automaticCanvasSize?: AutomaticSize,
        bottomImage?: string,
        canvasPosition?: Vector2,
        canvasSize?: UDim2,
        elasticBehavior?: ElasticBehavior,
        horizontalScrollBarInset?: ScrollBarInset,
        midImage?: string,
        scrollBarImageColor3?: Color3,
        scrollBarImageTransparency?: number,
        scrollBarThickness?: number,
        scrollingDirection?: ScrollingDirection,
        scrollingEnabled?: boolean,
        topImage?: string,
        verticalScrollBarInset?: ScrollBarInset,
        verticalScrollBarPosition?: VerticalScrollBarPosition,
    }) {
        super({
            archivable: params.archivable,
            name: params.name,
            parent: params.parent,
            //
            autoLocalize: params.autoLocalize,
            rootLocalizationTable: params.rootLocalizationTable,
            selectionBehaviorDown: params.selectionBehaviorDown,
            selectionBehaviorLeft: params.selectionBehaviorLeft,
            selectionBehaviorRight: params.selectionBehaviorRight,
            selectionBehaviorUp: params.selectionBehaviorUp,
            selectionGroup: params.selectionGroup,
            //
            active: params.active,
            anchorPoint: params.anchorPoint,
            automaticSize: params.automaticSize,
            backgroundColor: params.backgroundColor,
            backgroundTransparency: params.backgroundTransparency,
            borderColor3: params.borderColor3,
            borderMode: params.borderMode,
            borderSizePixel: params.borderSizePixel,
            clipDescendants: params.clipDescendants,
            interactable: params.interactable,
            layoutOrder: params.layoutOrder,
            nextSelectionDown: params.nextSelectionDown,
            nextSelectionLeft: params.nextSelectionLeft,
            nextSelectionRight: params.nextSelectionRight,
            nextSelectionUp: params.nextSelectionUp,
            position: params.position,
            rotation: params.rotation,
            selectable: params.selectable,
            selectionImageObject: params.selectionImageObject,
            selectionOrder: params.selectionOrder,
            size: params.size,
            sizeConstraint: params.sizeConstraint,
            visible: params.visible,
            zIndex: params.zIndex,
        });
        this.automaticCanvasSize = params.automaticCanvasSize ?? AutomaticSize.none;
        this.bottomImage = params.bottomImage ?? 'rbxasset://textures/ui/Scroll/scroll-bottom.png';
        this.canvasPosition = params.canvasPosition ?? Vector2.zero;
        this.canvasSize = params.canvasSize ?? new UDim2(0, 0, 2, 0);
        this.elasticBehavior = params.elasticBehavior ?? ElasticBehavior.whenScrollable;
        this.horizontalScrollBarInset = params.horizontalScrollBarInset ?? ScrollBarInset.none;
        this.midImage = params.midImage ?? 'rbxasset://textures/ui/Scroll/scroll-middle.png';
        this.scrollBarImageColor3 = params.scrollBarImageColor3 ?? new Color3(0, 0, 0);
        this.scrollBarImageTransparency = params.scrollBarImageTransparency ?? 0;
        this.scrollBarThickness = params.scrollBarThickness ?? 12;
        this.scrollingDirection = params.scrollingDirection ?? ScrollingDirection.xy;
        this.scrollingEnabled = params.scrollingEnabled ?? true;
        this.topImage = params.topImage ?? 'rbxasset://textures/ui/Scroll/scroll-top.png';
        this.verticalScrollBarInset = params.verticalScrollBarInset ?? ScrollBarInset.none;
        this.verticalScrollBarPosition = params.verticalScrollBarPosition ?? VerticalScrollBarPosition.right;
    }

    toCode(variableName: string): string {
        return super.toCode(variableName) + `
        ${variableName}.AutomaticCanvasSize = ${this.automaticCanvasSize}
        ${variableName}.BottomImage = ${this.bottomImage}
        ${variableName}.CanvasPosition = ${this.canvasPosition}
        ${variableName}.CanvasSize = ${this.canvasSize}
        ${variableName}.ElasticBehavior = ${this.elasticBehavior}
        ${variableName}.HorizontalScrollBarInset = ${this.horizontalScrollBarInset}
        ${variableName}.MidImage = ${this.midImage}
        ${variableName}.ScrollBarImageColor3 = ${this.scrollBarImageColor3}
        ${variableName}.ScrollBarImageTransparency = ${this.scrollBarImageTransparency}
        ${variableName}.ScrollBarThickness = ${this.scrollBarThickness}
        ${variableName}.ScrollingDirection = ${this.scrollingDirection}
        ${variableName}.ScrollingEnabled = ${this.scrollingEnabled}
        ${variableName}.TopImage = ${this.topImage}
        ${variableName}.VerticalScrollBarInset = ${this.verticalScrollBarInset}
        ${variableName}.VerticalScrollBarPosition = ${this.verticalScrollBarPosition}
        `;
    }
}

export class VideoFrame extends GuiObject {
    looped: boolean;
    playing: boolean;
    timePosition: number;
    video?: string;
    volume: number;

    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
        //
        autoLocalize?: boolean,
        rootLocalizationTable?: LocalizationTable,
        selectionBehaviorDown?: SelectionBehavior,
        selectionBehaviorLeft?: SelectionBehavior,
        selectionBehaviorRight?: SelectionBehavior,
        selectionBehaviorUp?: SelectionBehavior,
        selectionGroup?: boolean,
        //
        active?: boolean,
        anchorPoint?: Vector2,
        automaticSize?: AutomaticSize,
        backgroundColor?: Color3,
        backgroundTransparency?: number,
        borderColor3?: Color3,
        borderMode?: BorderMode,
        borderSizePixel?: number,
        clipDescendants?: boolean,
        interactable?: boolean,
        layoutOrder?: number,
        nextSelectionDown?: GuiObject,
        nextSelectionLeft?: GuiObject,
        nextSelectionRight?: GuiObject,
        nextSelectionUp?: GuiObject,
        position?: UDim2,
        rotation?: number,
        selectable?: boolean,
        selectionImageObject?: GuiObject,
        selectionOrder?: number,
        size?: UDim2,
        sizeConstraint?: SizeConstraint,
        visible?: boolean,
        zIndex?: number,
        //
        looped?: boolean,
        playing?: boolean,
        timePosition?: number,
        video?: string,
        volume?: number,
    }) {
        super({
            archivable: params.archivable,
            name: params.name,
            parent: params.parent,
            //
            autoLocalize: params.autoLocalize,
            rootLocalizationTable: params.rootLocalizationTable,
            selectionBehaviorDown: params.selectionBehaviorDown,
            selectionBehaviorLeft: params.selectionBehaviorLeft,
            selectionBehaviorRight: params.selectionBehaviorRight,
            selectionBehaviorUp: params.selectionBehaviorUp,
            selectionGroup: params.selectionGroup,
            //
            active: params.active,
            anchorPoint: params.anchorPoint,
            automaticSize: params.automaticSize,
            backgroundColor: params.backgroundColor,
            backgroundTransparency: params.backgroundTransparency,
            borderColor3: params.borderColor3,
            borderMode: params.borderMode,
            borderSizePixel: params.borderSizePixel,
            clipDescendants: params.clipDescendants,
            interactable: params.interactable,
            layoutOrder: params.layoutOrder,
            nextSelectionDown: params.nextSelectionDown,
            nextSelectionLeft: params.nextSelectionLeft,
            nextSelectionRight: params.nextSelectionRight,
            nextSelectionUp: params.nextSelectionUp,
            position: params.position,
            rotation: params.rotation,
            selectable: params.selectable,
            selectionImageObject: params.selectionImageObject,
            selectionOrder: params.selectionOrder,
            size: params.size,
            sizeConstraint: params.sizeConstraint,
            visible: params.visible,
            zIndex: params.zIndex,
        });
        this.looped = params.looped ?? false;
        this.playing = params.playing ?? false;
        this.timePosition = params.timePosition ?? 0;
        this.video = params.video;
        this.volume = params.volume ?? 1;
    }

    toCode(variableName: string): string {
        return super.toCode(variableName) + `
        ${variableName}.Looped = ${this.looped}
        ${variableName}.Playing = ${this.playing}
        ${variableName}.TimePosition = ${this.timePosition}
        ${variableName}.Looped = ${this.video ?? ''}
        ${variableName}.Volume = ${this.volume}
        `;
    }
}

export class ViewportFrame extends GuiObject {
    ambient: Color3;
    currentCamera?: Camera;
    imageColor3: Color3;
    imageTransparency: number;
    lightColor: Color3;
    lightDirection: Vector3;

    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
        //
        autoLocalize?: boolean,
        rootLocalizationTable?: LocalizationTable,
        selectionBehaviorDown?: SelectionBehavior,
        selectionBehaviorLeft?: SelectionBehavior,
        selectionBehaviorRight?: SelectionBehavior,
        selectionBehaviorUp?: SelectionBehavior,
        selectionGroup?: boolean,
        //
        active?: boolean,
        anchorPoint?: Vector2,
        automaticSize?: AutomaticSize,
        backgroundColor?: Color3,
        backgroundTransparency?: number,
        borderColor3?: Color3,
        borderMode?: BorderMode,
        borderSizePixel?: number,
        clipDescendants?: boolean,
        interactable?: boolean,
        layoutOrder?: number,
        nextSelectionDown?: GuiObject,
        nextSelectionLeft?: GuiObject,
        nextSelectionRight?: GuiObject,
        nextSelectionUp?: GuiObject,
        position?: UDim2,
        rotation?: number,
        selectable?: boolean,
        selectionImageObject?: GuiObject,
        selectionOrder?: number,
        size?: UDim2,
        sizeConstraint?: SizeConstraint,
        visible?: boolean,
        zIndex?: number,
        //
        ambient?: Color3,
        currentCamera?: Camera,
        imageColor3?: Color3,
        imageTransparency?: number,
        lightColor?: Color3,
        lightDirection?: Vector3,
    }) {
        super({
            archivable: params.archivable,
            name: params.name,
            parent: params.parent,
            //
            autoLocalize: params.autoLocalize,
            rootLocalizationTable: params.rootLocalizationTable,
            selectionBehaviorDown: params.selectionBehaviorDown,
            selectionBehaviorLeft: params.selectionBehaviorLeft,
            selectionBehaviorRight: params.selectionBehaviorRight,
            selectionBehaviorUp: params.selectionBehaviorUp,
            selectionGroup: params.selectionGroup,
            //
            active: params.active,
            anchorPoint: params.anchorPoint,
            automaticSize: params.automaticSize,
            backgroundColor: params.backgroundColor,
            backgroundTransparency: params.backgroundTransparency,
            borderColor3: params.borderColor3,
            borderMode: params.borderMode,
            borderSizePixel: params.borderSizePixel,
            clipDescendants: params.clipDescendants,
            interactable: params.interactable,
            layoutOrder: params.layoutOrder,
            nextSelectionDown: params.nextSelectionDown,
            nextSelectionLeft: params.nextSelectionLeft,
            nextSelectionRight: params.nextSelectionRight,
            nextSelectionUp: params.nextSelectionUp,
            position: params.position,
            rotation: params.rotation,
            selectable: params.selectable,
            selectionImageObject: params.selectionImageObject,
            selectionOrder: params.selectionOrder,
            size: params.size,
            sizeConstraint: params.sizeConstraint,
            visible: params.visible,
            zIndex: params.zIndex,
        });
        this.ambient = params.ambient ?? new Color3(200, 200, 200);
        this.currentCamera = params.currentCamera;
        this.imageColor3 = params.imageColor3 ?? new Color3(255, 255, 255);
        this.imageTransparency = params.imageTransparency ?? 0;
        this.lightColor = params.lightColor ?? new Color3(140, 140, 140);
        this.lightDirection = params.lightDirection ?? new Vector3(-1, -1, -1);
    }

    toCode(variableName: string): string {
        return super.toCode(variableName) + `
        ${variableName}.Ambient = ${this.ambient}
        ${variableName}.CurrentCamera = ${this.currentCamera}
        ${variableName}.ImageColor3 = ${this.imageColor3}
        ${variableName}.ImageTransparency = ${this.imageTransparency}
        ${variableName}.LightColor = ${this.lightColor}
        ${variableName}.LightDirection = ${this.lightDirection}
        `;
    }
}

abstract class ImageObject extends GuiObject {
    image?: string;
    imageColor3: Color3;
    imageRectOffset: Vector2;
    imageRectSize: Vector2;
    imageTransparency: number;
    resampleMode: ResamplerMode;
    scaleType: ScaleType;
    sliceCenter: Rect;
    sliceScale: number;
    tileSize: UDim2;

    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
        //
        autoLocalize?: boolean,
        rootLocalizationTable?: LocalizationTable,
        selectionBehaviorDown?: SelectionBehavior,
        selectionBehaviorLeft?: SelectionBehavior,
        selectionBehaviorRight?: SelectionBehavior,
        selectionBehaviorUp?: SelectionBehavior,
        selectionGroup?: boolean,
        //
        active?: boolean,
        anchorPoint?: Vector2,
        automaticSize?: AutomaticSize,
        backgroundColor?: Color3,
        backgroundTransparency?: number,
        borderColor3?: Color3,
        borderMode?: BorderMode,
        borderSizePixel?: number,
        clipDescendants?: boolean,
        interactable?: boolean,
        layoutOrder?: number,
        nextSelectionDown?: GuiObject,
        nextSelectionLeft?: GuiObject,
        nextSelectionRight?: GuiObject,
        nextSelectionUp?: GuiObject,
        position?: UDim2,
        rotation?: number,
        selectable?: boolean,
        selectionImageObject?: GuiObject,
        selectionOrder?: number,
        size?: UDim2,
        sizeConstraint?: SizeConstraint,
        visible?: boolean,
        zIndex?: number,
        //
        image?: string,
        imageColor3?: Color3,
        imageRectOffset?: Vector2,
        imageRectSize?: Vector2,
        imageTransparency?: number,
        resampleMode?: ResamplerMode,
        scaleType?: ScaleType,
        sliceCenter?: Rect,
        sliceScale?: number,
        tileSize?: UDim2,
    }) {
        super({
            archivable: params.archivable,
            name: params.name,
            parent: params.parent,
            //
            autoLocalize: params.autoLocalize,
            rootLocalizationTable: params.rootLocalizationTable,
            selectionBehaviorDown: params.selectionBehaviorDown,
            selectionBehaviorLeft: params.selectionBehaviorLeft,
            selectionBehaviorRight: params.selectionBehaviorRight,
            selectionBehaviorUp: params.selectionBehaviorUp,
            selectionGroup: params.selectionGroup,
            //
            active: params.active,
            anchorPoint: params.anchorPoint,
            automaticSize: params.automaticSize,
            backgroundColor: params.backgroundColor,
            backgroundTransparency: params.backgroundTransparency,
            borderColor3: params.borderColor3,
            borderMode: params.borderMode,
            borderSizePixel: params.borderSizePixel,
            clipDescendants: params.clipDescendants,
            interactable: params.interactable,
            layoutOrder: params.layoutOrder,
            nextSelectionDown: params.nextSelectionDown,
            nextSelectionLeft: params.nextSelectionLeft,
            nextSelectionRight: params.nextSelectionRight,
            nextSelectionUp: params.nextSelectionUp,
            position: params.position,
            rotation: params.rotation,
            selectable: params.selectable,
            selectionImageObject: params.selectionImageObject,
            selectionOrder: params.selectionOrder,
            size: params.size,
            sizeConstraint: params.sizeConstraint,
            visible: params.visible,
            zIndex: params.zIndex,
        });
        this.image = params.image ?? 'rbxasset://textures/ui/GuiImagePlaceholder.png';
        this.imageColor3 = params.imageColor3 ?? new Color3(255, 255, 255);
        this.imageRectOffset = params.imageRectOffset ?? Vector2.zero;
        this.imageRectSize = params.imageRectSize ?? Vector2.zero;
        this.imageTransparency = params.imageTransparency ?? 0;
        this.resampleMode = params.resampleMode ?? ResamplerMode.default;
        this.scaleType = params.scaleType ?? ScaleType.stretch;
        this.sliceCenter = params.sliceCenter ?? new Rect(Vector2.zero, Vector2.zero);
        this.sliceScale = params.sliceScale ?? 1;
        this.tileSize = params.tileSize ?? new UDim2(1, 0, 1, 0);
    }

    toCode(variableName: string): string {
        return super.toCode(variableName) + `
        ${variableName}.Image = ${this.image}
        ${variableName}.ImageColor3 = ${this.imageColor3}
        ${variableName}.ImageRectOffset = ${this.imageRectOffset}
        ${variableName}.ImageRectSize = ${this.imageRectSize}
        ${variableName}.ImageTransparency = ${this.imageTransparency}
        ${variableName}.ResampleMode = ${this.resampleMode}
        ${variableName}.ScaleType = ${this.scaleType}
        ${variableName}.SliceCenter = ${this.sliceCenter}
        ${variableName}.SliceScale = ${this.sliceScale}
        ${variableName}.TileSize = ${this.tileSize}
        `;
    }
}

export class ImageLabel extends ImageObject {
    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
        //
        autoLocalize?: boolean,
        rootLocalizationTable?: LocalizationTable,
        selectionBehaviorDown?: SelectionBehavior,
        selectionBehaviorLeft?: SelectionBehavior,
        selectionBehaviorRight?: SelectionBehavior,
        selectionBehaviorUp?: SelectionBehavior,
        selectionGroup?: boolean,
        //
        active?: boolean,
        anchorPoint?: Vector2,
        automaticSize?: AutomaticSize,
        backgroundColor?: Color3,
        backgroundTransparency?: number,
        borderColor3?: Color3,
        borderMode?: BorderMode,
        borderSizePixel?: number,
        clipDescendants?: boolean,
        interactable?: boolean,
        layoutOrder?: number,
        nextSelectionDown?: GuiObject,
        nextSelectionLeft?: GuiObject,
        nextSelectionRight?: GuiObject,
        nextSelectionUp?: GuiObject,
        position?: UDim2,
        rotation?: number,
        selectable?: boolean,
        selectionImageObject?: GuiObject,
        selectionOrder?: number,
        size?: UDim2,
        sizeConstraint?: SizeConstraint,
        visible?: boolean,
        zIndex?: number,
        //
        image?: string,
        imageColor3?: Color3,
        imageRectOffset?: Vector2,
        imageRectSize?: Vector2,
        imageTransparency?: number,
        resampleMode?: ResamplerMode,
        scaleType?: ScaleType,
        sliceCenter?: Rect,
        sliceScale?: number,
        tileSize?: UDim2,
    }) {
        super({
            archivable: params.archivable,
            name: params.name,
            parent: params.parent,
            //
            autoLocalize: params.autoLocalize,
            rootLocalizationTable: params.rootLocalizationTable,
            selectionBehaviorDown: params.selectionBehaviorDown,
            selectionBehaviorLeft: params.selectionBehaviorLeft,
            selectionBehaviorRight: params.selectionBehaviorRight,
            selectionBehaviorUp: params.selectionBehaviorUp,
            selectionGroup: params.selectionGroup,
            //
            active: params.active,
            anchorPoint: params.anchorPoint,
            automaticSize: params.automaticSize,
            backgroundColor: params.backgroundColor,
            backgroundTransparency: params.backgroundTransparency,
            borderColor3: params.borderColor3,
            borderMode: params.borderMode,
            borderSizePixel: params.borderSizePixel,
            clipDescendants: params.clipDescendants,
            interactable: params.interactable,
            layoutOrder: params.layoutOrder,
            nextSelectionDown: params.nextSelectionDown,
            nextSelectionLeft: params.nextSelectionLeft,
            nextSelectionRight: params.nextSelectionRight,
            nextSelectionUp: params.nextSelectionUp,
            position: params.position,
            rotation: params.rotation,
            selectable: params.selectable,
            selectionImageObject: params.selectionImageObject,
            selectionOrder: params.selectionOrder,
            size: params.size,
            sizeConstraint: params.sizeConstraint,
            visible: params.visible,
            zIndex: params.zIndex,
            //
            image: params.image,
            imageColor3: params.imageColor3,
            imageRectOffset: params.imageRectOffset,
            imageRectSize: params.imageRectSize,
            imageTransparency: params.imageTransparency,
            resampleMode: params.resampleMode,
            scaleType: params.scaleType,
            sliceCenter: params.sliceCenter,
            sliceScale: params.sliceScale,
            tileSize: params.tileSize,
        });
    }
}

export class ImageButton extends ImageObject implements GuiButton {
    autoButtonColor: boolean;
    modal: boolean;
    selected: boolean;
    style: ButtonStyle;
    hoverImage?: string;
    pressedImage?: string;

    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
        //
        autoLocalize?: boolean,
        rootLocalizationTable?: LocalizationTable,
        selectionBehaviorDown?: SelectionBehavior,
        selectionBehaviorLeft?: SelectionBehavior,
        selectionBehaviorRight?: SelectionBehavior,
        selectionBehaviorUp?: SelectionBehavior,
        selectionGroup?: boolean,
        //
        active?: boolean,
        anchorPoint?: Vector2,
        automaticSize?: AutomaticSize,
        backgroundColor?: Color3,
        backgroundTransparency?: number,
        borderColor3?: Color3,
        borderMode?: BorderMode,
        borderSizePixel?: number,
        clipDescendants?: boolean,
        interactable?: boolean,
        layoutOrder?: number,
        nextSelectionDown?: GuiObject,
        nextSelectionLeft?: GuiObject,
        nextSelectionRight?: GuiObject,
        nextSelectionUp?: GuiObject,
        position?: UDim2,
        rotation?: number,
        selectable?: boolean,
        selectionImageObject?: GuiObject,
        selectionOrder?: number,
        size?: UDim2,
        sizeConstraint?: SizeConstraint,
        visible?: boolean,
        zIndex?: number,
        //
        image?: string,
        imageColor3?: Color3,
        imageRectOffset?: Vector2,
        imageRectSize?: Vector2,
        imageTransparency?: number,
        resampleMode?: ResamplerMode,
        scaleType?: ScaleType,
        sliceCenter?: Rect,
        sliceScale?: number,
        tileSize?: UDim2,
        //
        autoButtonColor?: boolean,
        modal?: boolean,
        selected?: boolean,
        style?: ButtonStyle,
        //
        hoverImage?: string,
        pressedImage?: string,
    }) {
        super({
            archivable: params.archivable,
            name: params.name,
            parent: params.parent,
            //
            autoLocalize: params.autoLocalize,
            rootLocalizationTable: params.rootLocalizationTable,
            selectionBehaviorDown: params.selectionBehaviorDown,
            selectionBehaviorLeft: params.selectionBehaviorLeft,
            selectionBehaviorRight: params.selectionBehaviorRight,
            selectionBehaviorUp: params.selectionBehaviorUp,
            selectionGroup: params.selectionGroup,
            //
            active: params.active,
            anchorPoint: params.anchorPoint,
            automaticSize: params.automaticSize,
            backgroundColor: params.backgroundColor,
            backgroundTransparency: params.backgroundTransparency,
            borderColor3: params.borderColor3,
            borderMode: params.borderMode,
            borderSizePixel: params.borderSizePixel,
            clipDescendants: params.clipDescendants,
            interactable: params.interactable,
            layoutOrder: params.layoutOrder,
            nextSelectionDown: params.nextSelectionDown,
            nextSelectionLeft: params.nextSelectionLeft,
            nextSelectionRight: params.nextSelectionRight,
            nextSelectionUp: params.nextSelectionUp,
            position: params.position,
            rotation: params.rotation,
            selectable: params.selectable,
            selectionImageObject: params.selectionImageObject,
            selectionOrder: params.selectionOrder,
            size: params.size,
            sizeConstraint: params.sizeConstraint,
            visible: params.visible,
            zIndex: params.zIndex,
            //
            image: params.image,
            imageColor3: params.imageColor3,
            imageRectOffset: params.imageRectOffset,
            imageRectSize: params.imageRectSize,
            imageTransparency: params.imageTransparency,
            resampleMode: params.resampleMode,
            scaleType: params.scaleType,
            sliceCenter: params.sliceCenter,
            sliceScale: params.sliceScale,
            tileSize: params.tileSize,
        });
        this.autoButtonColor = params.autoButtonColor ?? true;
        this.modal = params.modal ?? false;
        this.selected = params.selected ?? false;
        this.style = params.style ?? ButtonStyle.custom;
        //
        this.hoverImage = params.hoverImage;
        this.pressedImage = params.pressedImage;
    }

    toCode(variableName: string): string {
        return super.toCode(variableName) + `
        ${variableName}.HoverImage = ${this.hoverImage}
        ${variableName}.PressedImage = ${this.pressedImage}
        `;
    }
}

abstract class TextObject extends GuiObject {
    fontFace: Font;
    lineHeight: number;
    maxVisibleGraphemes: number;
    openTypeFeatures?: string;
    richText: boolean;
    text: string;
    textColor: Color3;
    textDirection: TextDirection;
    textScaled: boolean;
    textSize: number;
    textStrokeColor: Color3;
    textStrokeTransparency: number;
    textTransparency: number;
    textTruncate: TextTruncate;
    textWrapped: boolean;
    textXAlignment: TextXAlignment;
    textYAlignment: TextYAlignment;

    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
        //
        autoLocalize?: boolean,
        rootLocalizationTable?: LocalizationTable,
        selectionBehaviorDown?: SelectionBehavior,
        selectionBehaviorLeft?: SelectionBehavior,
        selectionBehaviorRight?: SelectionBehavior,
        selectionBehaviorUp?: SelectionBehavior,
        selectionGroup?: boolean,
        //
        active?: boolean,
        anchorPoint?: Vector2,
        automaticSize?: AutomaticSize,
        backgroundColor?: Color3,
        backgroundTransparency?: number,
        borderColor3?: Color3,
        borderMode?: BorderMode,
        borderSizePixel?: number,
        clipDescendants?: boolean,
        interactable?: boolean,
        layoutOrder?: number,
        nextSelectionDown?: GuiObject,
        nextSelectionLeft?: GuiObject,
        nextSelectionRight?: GuiObject,
        nextSelectionUp?: GuiObject,
        position?: UDim2,
        rotation?: number,
        selectable?: boolean,
        selectionImageObject?: GuiObject,
        selectionOrder?: number,
        size?: UDim2,
        sizeConstraint?: SizeConstraint,
        visible?: boolean,
        zIndex?: number,
        //
        fontFace?: Font,
        lineHeight?: number,
        maxVisibleGraphemes?: number,
        openTypeFeatures?: string,
        richText?: boolean,
        text?: string,
        textColor?: Color3,
        textDirection?: TextDirection,
        textScaled?: boolean,
        textSize?: number,
        textStrokeColor?: Color3,
        textStrokeTransparency?: number,
        textTransparency?: number,
        textTruncate?: TextTruncate,
        textWrapped?: boolean,
        textXAlignment?: TextXAlignment,
        textYAlignment?: TextYAlignment
    }) {
        super({
            archivable: params.archivable,
            name: params.name,
            parent: params.parent,
            //
            autoLocalize: params.autoLocalize,
            rootLocalizationTable: params.rootLocalizationTable,
            selectionBehaviorDown: params.selectionBehaviorDown,
            selectionBehaviorLeft: params.selectionBehaviorLeft,
            selectionBehaviorRight: params.selectionBehaviorRight,
            selectionBehaviorUp: params.selectionBehaviorUp,
            selectionGroup: params.selectionGroup,
            //
            active: params.active,
            anchorPoint: params.anchorPoint,
            automaticSize: params.automaticSize,
            backgroundColor: params.backgroundColor,
            backgroundTransparency: params.backgroundTransparency,
            borderColor3: params.borderColor3,
            borderMode: params.borderMode,
            borderSizePixel: params.borderSizePixel,
            clipDescendants: params.clipDescendants,
            interactable: params.interactable,
            layoutOrder: params.layoutOrder,
            nextSelectionDown: params.nextSelectionDown,
            nextSelectionLeft: params.nextSelectionLeft,
            nextSelectionRight: params.nextSelectionRight,
            nextSelectionUp: params.nextSelectionUp,
            position: params.position,
            rotation: params.rotation,
            selectable: params.selectable,
            selectionImageObject: params.selectionImageObject,
            selectionOrder: params.selectionOrder,
            size: params.size,
            sizeConstraint: params.sizeConstraint,
            visible: params.visible,
            zIndex: params.zIndex,
        });
        this.fontFace = params.fontFace ?? new Font('rbxasset://fonts/families/SourceSansPro.json', FontWeight.regular, FontStyle.normal);
        this.lineHeight = params.lineHeight ?? 1;
        this.maxVisibleGraphemes = params.maxVisibleGraphemes ?? -1;
        this.openTypeFeatures = params.openTypeFeatures;
        this.richText = params.richText ?? false;
        this.text = params.text ?? 'TextObject';
        this.textColor = params.textColor ?? new Color3(0, 0, 0);
        this.textDirection = params.textDirection ?? TextDirection.auto;
        this.textScaled = params.textScaled ?? false;
        this.textSize = params.textSize ?? 14;
        this.textStrokeColor = params.textStrokeColor ?? new Color3(0, 0, 0);
        this.textStrokeTransparency = params.textStrokeTransparency ?? 1;
        this.textTransparency = params.textTransparency ?? 0;
        this.textTruncate = params.textTruncate ?? TextTruncate.none;
        this.textWrapped = params.textWrapped ?? false;
        this.textXAlignment = params.textXAlignment ?? TextXAlignment.center;
        this.textYAlignment = params.textYAlignment ?? TextYAlignment.center;
    }

    toCode(variableName: string): string {
        return super.toCode(variableName) + `
        ${variableName}.FontFace = ${this.fontFace}
        ${variableName}.LineHeight = ${this.lineHeight}
        ${variableName}.MaxVisibleGraphemes = ${this.maxVisibleGraphemes}
        ${variableName}.OpenTypeFeatures = ${this.openTypeFeatures}
        ${variableName}.RichText = ${this.richText}
        ${variableName}.Text = ${this.text}
        ${variableName}.TextColor = ${this.textColor}
        ${variableName}.TextDirection = ${this.textDirection}
        ${variableName}.TextScaled = ${this.textScaled}
        ${variableName}.TextSize = ${this.textSize}
        ${variableName}.TextStrokeColor = ${this.textStrokeColor}
        ${variableName}.TextStrokeTransparency = ${this.textStrokeTransparency}
        ${variableName}.TextTransparency = ${this.textTransparency}
        ${variableName}.TextTruncate = ${this.textTruncate}
        ${variableName}.TextWrapped = ${this.textWrapped}
        ${variableName}.TextXAlignment = ${this.textXAlignment}
        ${variableName}.TextYAlignment = ${this.textYAlignment}
        `;
    }
}

export class TextLabel extends TextObject {
    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
        //
        autoLocalize?: boolean,
        rootLocalizationTable?: LocalizationTable,
        selectionBehaviorDown?: SelectionBehavior,
        selectionBehaviorLeft?: SelectionBehavior,
        selectionBehaviorRight?: SelectionBehavior,
        selectionBehaviorUp?: SelectionBehavior,
        selectionGroup?: boolean,
        //
        active?: boolean,
        anchorPoint?: Vector2,
        automaticSize?: AutomaticSize,
        backgroundColor?: Color3,
        backgroundTransparency?: number,
        borderColor3?: Color3,
        borderMode?: BorderMode,
        borderSizePixel?: number,
        clipDescendants?: boolean,
        interactable?: boolean,
        layoutOrder?: number,
        nextSelectionDown?: GuiObject,
        nextSelectionLeft?: GuiObject,
        nextSelectionRight?: GuiObject,
        nextSelectionUp?: GuiObject,
        position?: UDim2,
        rotation?: number,
        selectable?: boolean,
        selectionImageObject?: GuiObject,
        selectionOrder?: number,
        size?: UDim2,
        sizeConstraint?: SizeConstraint,
        visible?: boolean,
        zIndex?: number,
        //
        fontFace?: Font,
        lineHeight?: number,
        maxVisibleGraphemes?: number,
        openTypeFeatures?: string,
        richText?: boolean,
        text?: string,
        textColor?: Color3,
        textDirection?: TextDirection,
        textScaled?: boolean,
        textSize?: number,
        textStrokeColor?: Color3,
        textStrokeTransparency?: number,
        textTransparency?: number,
        textTruncate?: TextTruncate,
        textWrapped?: boolean,
        textXAlignment?: TextXAlignment,
        textYAlignment?: TextYAlignment
    }) {
        super({
            archivable: params.archivable,
            name: params.name,
            parent: params.parent,
            //
            autoLocalize: params.autoLocalize,
            rootLocalizationTable: params.rootLocalizationTable,
            selectionBehaviorDown: params.selectionBehaviorDown,
            selectionBehaviorLeft: params.selectionBehaviorLeft,
            selectionBehaviorRight: params.selectionBehaviorRight,
            selectionBehaviorUp: params.selectionBehaviorUp,
            selectionGroup: params.selectionGroup,
            //
            active: params.active,
            anchorPoint: params.anchorPoint,
            automaticSize: params.automaticSize,
            backgroundColor: params.backgroundColor,
            backgroundTransparency: params.backgroundTransparency,
            borderColor3: params.borderColor3,
            borderMode: params.borderMode,
            borderSizePixel: params.borderSizePixel,
            clipDescendants: params.clipDescendants,
            interactable: params.interactable,
            layoutOrder: params.layoutOrder,
            nextSelectionDown: params.nextSelectionDown,
            nextSelectionLeft: params.nextSelectionLeft,
            nextSelectionRight: params.nextSelectionRight,
            nextSelectionUp: params.nextSelectionUp,
            position: params.position,
            rotation: params.rotation,
            selectable: params.selectable,
            selectionImageObject: params.selectionImageObject,
            selectionOrder: params.selectionOrder,
            size: params.size,
            sizeConstraint: params.sizeConstraint,
            visible: params.visible,
            zIndex: params.zIndex,
            //
            fontFace: params.fontFace,
            lineHeight: params.lineHeight,
            maxVisibleGraphemes: params.maxVisibleGraphemes,
            openTypeFeatures: params.openTypeFeatures,
            richText: params.richText,
            text: params.text,
            textColor: params.textColor,
            textDirection: params.textDirection,
            textScaled: params.textScaled,
            textSize: params.textSize,
            textStrokeColor: params.textStrokeColor,
            textStrokeTransparency: params.textStrokeTransparency,
            textTransparency: params.textTransparency,
            textTruncate: params.textTruncate,
            textWrapped: params.textWrapped,
            textXAlignment: params.textXAlignment,
            textYAlignment: params.textYAlignment,
        });
    }
}

export class TextButton extends TextObject implements GuiButton {
    autoButtonColor: boolean;
    modal: boolean;
    selected: boolean;
    style: ButtonStyle;

    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
        //
        autoLocalize?: boolean,
        rootLocalizationTable?: LocalizationTable,
        selectionBehaviorDown?: SelectionBehavior,
        selectionBehaviorLeft?: SelectionBehavior,
        selectionBehaviorRight?: SelectionBehavior,
        selectionBehaviorUp?: SelectionBehavior,
        selectionGroup?: boolean,
        //
        active?: boolean,
        anchorPoint?: Vector2,
        automaticSize?: AutomaticSize,
        backgroundColor?: Color3,
        backgroundTransparency?: number,
        borderColor3?: Color3,
        borderMode?: BorderMode,
        borderSizePixel?: number,
        clipDescendants?: boolean,
        interactable?: boolean,
        layoutOrder?: number,
        nextSelectionDown?: GuiObject,
        nextSelectionLeft?: GuiObject,
        nextSelectionRight?: GuiObject,
        nextSelectionUp?: GuiObject,
        position?: UDim2,
        rotation?: number,
        selectable?: boolean,
        selectionImageObject?: GuiObject,
        selectionOrder?: number,
        size?: UDim2,
        sizeConstraint?: SizeConstraint,
        visible?: boolean,
        zIndex?: number,
        //
        fontFace?: Font,
        lineHeight?: number,
        maxVisibleGraphemes?: number,
        openTypeFeatures?: string,
        richText?: boolean,
        text?: string,
        textColor?: Color3,
        textDirection?: TextDirection,
        textScaled?: boolean,
        textSize?: number,
        textStrokeColor?: Color3,
        textStrokeTransparency?: number,
        textTransparency?: number,
        textTruncate?: TextTruncate,
        textWrapped?: boolean,
        textXAlignment?: TextXAlignment,
        textYAlignment?: TextYAlignment
        //
        autoButtonColor?: boolean,
        modal?: boolean,
        selected?: boolean,
        style?: ButtonStyle,
    }) {
        super({
            archivable: params.archivable,
            name: params.name,
            parent: params.parent,
            //
            autoLocalize: params.autoLocalize,
            rootLocalizationTable: params.rootLocalizationTable,
            selectionBehaviorDown: params.selectionBehaviorDown,
            selectionBehaviorLeft: params.selectionBehaviorLeft,
            selectionBehaviorRight: params.selectionBehaviorRight,
            selectionBehaviorUp: params.selectionBehaviorUp,
            selectionGroup: params.selectionGroup,
            //
            active: params.active,
            anchorPoint: params.anchorPoint,
            automaticSize: params.automaticSize,
            backgroundColor: params.backgroundColor,
            backgroundTransparency: params.backgroundTransparency,
            borderColor3: params.borderColor3,
            borderMode: params.borderMode,
            borderSizePixel: params.borderSizePixel,
            clipDescendants: params.clipDescendants,
            interactable: params.interactable,
            layoutOrder: params.layoutOrder,
            nextSelectionDown: params.nextSelectionDown,
            nextSelectionLeft: params.nextSelectionLeft,
            nextSelectionRight: params.nextSelectionRight,
            nextSelectionUp: params.nextSelectionUp,
            position: params.position,
            rotation: params.rotation,
            selectable: params.selectable,
            selectionImageObject: params.selectionImageObject,
            selectionOrder: params.selectionOrder,
            size: params.size,
            sizeConstraint: params.sizeConstraint,
            visible: params.visible,
            zIndex: params.zIndex,
            //
            fontFace: params.fontFace,
            lineHeight: params.lineHeight,
            maxVisibleGraphemes: params.maxVisibleGraphemes,
            openTypeFeatures: params.openTypeFeatures,
            richText: params.richText,
            text: params.text,
            textColor: params.textColor,
            textDirection: params.textDirection,
            textScaled: params.textScaled,
            textSize: params.textSize,
            textStrokeColor: params.textStrokeColor,
            textStrokeTransparency: params.textStrokeTransparency,
            textTransparency: params.textTransparency,
            textTruncate: params.textTruncate,
            textWrapped: params.textWrapped,
            textXAlignment: params.textXAlignment,
            textYAlignment: params.textYAlignment,
        });
        this.autoButtonColor = params.autoButtonColor ?? true;
        this.modal = params.modal ?? false;
        this.selected = params.selected ?? false;
        this.style = params.style ?? ButtonStyle.custom;
    }
}

export class TextBox extends TextObject {
    clearTextFocus: boolean;
    cursorPosition: number;
    multiLine: boolean;
    placeholderColor3: Color3;
    placeholderText: string;
    selectionStart: number;
    showNativeInput: boolean;
    textEditable: boolean;

    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
        //
        autoLocalize?: boolean,
        rootLocalizationTable?: LocalizationTable,
        selectionBehaviorDown?: SelectionBehavior,
        selectionBehaviorLeft?: SelectionBehavior,
        selectionBehaviorRight?: SelectionBehavior,
        selectionBehaviorUp?: SelectionBehavior,
        selectionGroup?: boolean,
        //
        active?: boolean,
        anchorPoint?: Vector2,
        automaticSize?: AutomaticSize,
        backgroundColor?: Color3,
        backgroundTransparency?: number,
        borderColor3?: Color3,
        borderMode?: BorderMode,
        borderSizePixel?: number,
        clipDescendants?: boolean,
        interactable?: boolean,
        layoutOrder?: number,
        nextSelectionDown?: GuiObject,
        nextSelectionLeft?: GuiObject,
        nextSelectionRight?: GuiObject,
        nextSelectionUp?: GuiObject,
        position?: UDim2,
        rotation?: number,
        selectable?: boolean,
        selectionImageObject?: GuiObject,
        selectionOrder?: number,
        size?: UDim2,
        sizeConstraint?: SizeConstraint,
        visible?: boolean,
        zIndex?: number,
        //
        fontFace?: Font,
        lineHeight?: number,
        maxVisibleGraphemes?: number,
        openTypeFeatures?: string,
        richText?: boolean,
        text?: string,
        textColor?: Color3,
        textDirection?: TextDirection,
        textScaled?: boolean,
        textSize?: number,
        textStrokeColor?: Color3,
        textStrokeTransparency?: number,
        textTransparency?: number,
        textTruncate?: TextTruncate,
        textWrapped?: boolean,
        textXAlignment?: TextXAlignment,
        textYAlignment?: TextYAlignment
        //
        clearTextFocus?: boolean,
        cursorPosition?: number,
        multiLine?: boolean,
        placeholderColor3?: Color3,
        placeholderText?: string,
        richtext?: boolean,
        selectionStart?: number,
        showNativeInput?: boolean,
        textEditable?: boolean,
    }) {
        super({
            archivable: params.archivable,
            name: params.name ?? 'TextBox',
            parent: params.parent,
            //
            autoLocalize: params.autoLocalize,
            rootLocalizationTable: params.rootLocalizationTable,
            selectionBehaviorDown: params.selectionBehaviorDown,
            selectionBehaviorLeft: params.selectionBehaviorLeft,
            selectionBehaviorRight: params.selectionBehaviorRight,
            selectionBehaviorUp: params.selectionBehaviorUp,
            selectionGroup: params.selectionGroup,
            //
            active: params.active,
            anchorPoint: params.anchorPoint,
            automaticSize: params.automaticSize,
            backgroundColor: params.backgroundColor,
            backgroundTransparency: params.backgroundTransparency,
            borderColor3: params.borderColor3,
            borderMode: params.borderMode,
            borderSizePixel: params.borderSizePixel,
            clipDescendants: params.clipDescendants,
            interactable: params.interactable,
            layoutOrder: params.layoutOrder,
            nextSelectionDown: params.nextSelectionDown,
            nextSelectionLeft: params.nextSelectionLeft,
            nextSelectionRight: params.nextSelectionRight,
            nextSelectionUp: params.nextSelectionUp,
            position: params.position,
            rotation: params.rotation,
            selectable: params.selectable,
            selectionImageObject: params.selectionImageObject,
            selectionOrder: params.selectionOrder,
            size: params.size,
            sizeConstraint: params.sizeConstraint,
            visible: params.visible,
            zIndex: params.zIndex,
            //
            fontFace: params.fontFace,
            lineHeight: params.lineHeight,
            maxVisibleGraphemes: params.maxVisibleGraphemes,
            openTypeFeatures: params.openTypeFeatures,
            richText: params.richText,
            text: params.text,
            textColor: params.textColor,
            textDirection: params.textDirection,
            textScaled: params.textScaled,
            textSize: params.textSize,
            textStrokeColor: params.textStrokeColor,
            textStrokeTransparency: params.textStrokeTransparency,
            textTransparency: params.textTransparency,
            textTruncate: params.textTruncate,
            textWrapped: params.textWrapped,
            textXAlignment: params.textXAlignment,
            textYAlignment: params.textYAlignment,
        });
        this.clearTextFocus = params.clearTextFocus ?? true;
        this.cursorPosition = params.cursorPosition ?? 1;
        this.multiLine = params.multiLine ?? false;
        this.placeholderColor3 = params.placeholderColor3 ?? new Color3(178, 178, 178);
        this.placeholderText = params.placeholderText ?? '';
        this.selectionStart = params.selectionStart ?? -1;
        this.showNativeInput = params.showNativeInput ?? true;
        this.textEditable = params.textEditable ?? true;
    }

    toCode(variableName: string): string {
        return super.toCode(variableName) + `
        ${variableName}.ClearTextFocus = ${this.clearTextFocus}
        ${variableName}.CursorPosition = ${this.cursorPosition}
        ${variableName}.MultiLine = ${this.multiLine}
        ${variableName}.PlaceholderColor3 = ${this.placeholderColor3}
        ${variableName}.PlaceholderText = ${this.placeholderText}
        ${variableName}.SelectionStart = ${this.selectionStart}
        ${variableName}.ShowNativeInput = ${this.showNativeInput}
        ${variableName}.TextEditable = ${this.textEditable}
        `;
    }
}

abstract class UIBase extends Instance {
    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
    }) {
        super({
            archivable: params.archivable, 
            name: params.name ?? 'UIBase', 
            parent: params.parent
        });
    }
}

abstract class UIComponent extends UIBase {
    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
    }) {
        super({
            archivable: params.archivable, 
            name: params.name ?? 'UIComponent', 
            parent: params.parent
        });
    }
}

abstract class UIConstraint extends UIComponent {
    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
    }) {
        super({
            archivable: params.archivable, 
            name: params.name ?? 'UIComponent', 
            parent: params.parent
        });
    }
}

abstract class UILayout extends UIComponent {
    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
    }) {
        super({
            archivable: params.archivable, 
            name: params.name ?? 'UIComponent', 
            parent: params.parent
        });
    }
}

abstract class UIGridStyleLayout extends UILayout {
    fillDirection: FillDirection;
    horizontalAlignment: HorizontalAlignment;
    sortOrder: SortOrder;
    verticalAlignment: VerticalAlignment;

    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
        //
        fillDirection?: FillDirection,
        horizontalAlignment?: HorizontalAlignment,
        sortOrder?: SortOrder,
        verticalAlignment?: VerticalAlignment,
    }) {
        super({
            archivable: params.archivable, 
            name: params.name ?? 'UIComponent', 
            parent: params.parent
        });
        this.fillDirection = params.fillDirection ?? FillDirection.horizontal;
        this.horizontalAlignment = params.horizontalAlignment ?? HorizontalAlignment.left;
        this.sortOrder = params.sortOrder ?? SortOrder.layoutOrder;
        this.verticalAlignment = params.verticalAlignment ?? VerticalAlignment.top;
    }

    toCode(variableName: string): string {
        return super.toCode(variableName) + `
        ${variableName}.FillDirection = ${this.fillDirection}
        ${variableName}.HorizontalAlignment = ${this.horizontalAlignment}
        ${variableName}.SortOrder = ${this.sortOrder}
        ${variableName}.VerticalAlignment = ${this.verticalAlignment}
        `;
    }
}

export class UIAspectRatioConstraint extends UIConstraint {
    aspectRatio: number;
    aspectType: AspectType;
    dominantAxis: DominantAxis;

    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
        //
        aspectRatio?: number;
        aspectType?: AspectType;
        dominantAxis?: DominantAxis;
    }) {
        super({
            archivable: params.archivable, 
            name: params.name ?? 'UIComponent', 
            parent: params.parent
        });
        this.aspectRatio = params.aspectRatio ?? 1;
        this.aspectType =  params.aspectType ?? AspectType.fitWithInMaxSize;
        this.dominantAxis = params.dominantAxis ?? DominantAxis.width;
    }

    toCode(variableName: string): string {
        return super.toCode(variableName) + `
        ${variableName}.AspectRatio = ${this.aspectRatio}
        ${variableName}.AspectType = ${this.aspectType}
        ${variableName}.DominantAxis = ${this.dominantAxis}
        `;
    }
}

export class UICorner extends UIConstraint {
    cornerRadius: UDim;

    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
        //
        cornerRadius?: UDim,
    }) {
        super({
            archivable: params.archivable, 
            name: params.name ?? 'UIComponent', 
            parent: params.parent
        });
        this.cornerRadius = params.cornerRadius ?? new UDim(0, 8);
    }

    toCode(variableName: string): string {
        return super.toCode(variableName) + `
        ${variableName}.CornerRadius = ${this.cornerRadius}
        `;
    }
}

export class UIFlexItem extends UIComponent {
    flexMode: UIFlexMode;
    growRatio: number;
    itemLineAlignment: ItemLineAlignment;
    shrinkRatio: number;

    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
        //
        flexMode?: UIFlexMode,
        growRatio?: number,
        itemLineAlignment?: ItemLineAlignment,
        shrinkRatio?: number,
    }) {
        super({
            archivable: params.archivable, 
            name: params.name ?? 'UIComponent', 
            parent: params.parent
        });
        this.flexMode = params.flexMode ?? UIFlexMode.none;
        this.growRatio = params.growRatio ?? 0;
        this.itemLineAlignment = params.itemLineAlignment ?? ItemLineAlignment.automatic;
        this.shrinkRatio = params.shrinkRatio ?? 0;
    }

    toCode(variableName: string): string {
        return super.toCode(variableName) + `
        ${variableName}.FlexMode = ${this.flexMode}
        ${variableName}.GrowRatio = ${this.growRatio}
        ${variableName}.ItemLineAlignment = ${this.itemLineAlignment}
        ${variableName}.ShrinkRatio = ${this.shrinkRatio}
        `;
    }
}

export class UIGradient extends UIComponent {
    color: ColorSequence;
    enabled: boolean;
    offset: Vector2;
    rotation: number;
    transparency: NumberSequence;

    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
        //
        color?: ColorSequence,
        enabled?: boolean,
        offset?: Vector2,
        rotation?: number,
        transparency?: NumberSequence,
    }) {
        super({
            archivable: params.archivable, 
            name: params.name ?? 'UIComponent', 
            parent: params.parent
        });
        this.color = params.color ?? new ColorSequence([
            new ColorSequenceKeypoint(0, new Color3(255, 255, 255))
        ]);
        this.enabled = params.enabled ?? true;
        this.offset = params.offset ?? Vector2.zero;
        this.rotation = params.rotation ?? 0;
        this.transparency = params.transparency ?? new NumberSequence([
            new NumberSequenceKeypoint(0, 0, 0),
        ]);
    }

    toCode(variableName: string): string {
        return super.toCode(variableName) + `
        ${variableName}.Color = ${this.color}
        ${variableName}.Enabled = ${this.enabled}
        ${variableName}.Offset = ${this.offset}
        ${variableName}.Rotation = ${this.rotation}
        ${variableName}.Transparency = ${this.transparency}
        `;
    }
}

export class UIGridLayout extends UIGridStyleLayout {
    cellPadding: UDim2;
    cellSize: UDim2;
    fillDirectionMaxCells: number;
    startCorner: StartCorner;

    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
        //
        fillDirection?: FillDirection,
        horizontalAlignment?: HorizontalAlignment,
        sortOrder?: SortOrder,
        verticalAlignment?: VerticalAlignment,
        //
        cellPadding?: UDim2,
        cellSize?: UDim2,
        fillDirectionMaxCells?: number,
        startCorner?: StartCorner,
    }) {
        super({
            archivable: params.archivable, 
            name: params.name ?? 'UIComponent', 
            parent: params.parent,
            //
            fillDirection: params.fillDirection,
            horizontalAlignment: params.horizontalAlignment,
            sortOrder: params.sortOrder,
            verticalAlignment: params.verticalAlignment,
        });
        this.cellPadding = params.cellPadding ?? new UDim2(0, 5, 0, 5);
        this.cellSize = params.cellSize ?? new UDim2(0, 100, 0, 100);
        this.fillDirectionMaxCells = params.fillDirectionMaxCells ?? 0;
        this.startCorner = params.startCorner ?? StartCorner.topLeft;
    }

    toCode(variableName: string): string {
        return super.toCode(variableName) + `
        ${variableName}.CellPadding = ${this.cellPadding}
        ${variableName}.CellSize = ${this.cellSize}
        ${variableName}.FillDirectionMaxCells = ${this.fillDirectionMaxCells}
        ${variableName}.StartCorner = ${this.startCorner}
        `;
    }
}

export class UIListLayout extends UIGridStyleLayout {
    horizontalFlex: UIFlexAlignment;
    itemLineAlignment: ItemLineAlignment;
    padding: UDim;
    verticalFlex: UIFlexAlignment;
    wraps: boolean;
    
    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
        //
        fillDirection?: FillDirection,
        horizontalAlignment?: HorizontalAlignment,
        sortOrder?: SortOrder,
        verticalAlignment?: VerticalAlignment,
        //
        horizontalFlex: UIFlexAlignment,
        itemLineAlignment: ItemLineAlignment,
        padding: UDim,
        verticalFlex: UIFlexAlignment,
        wraps: boolean,
    }) {
        super({
            archivable: params.archivable, 
            name: params.name ?? 'UIComponent', 
            parent: params.parent,
            //
            fillDirection: params.fillDirection,
            horizontalAlignment: params.horizontalAlignment,
            sortOrder: params.sortOrder,
            verticalAlignment: params.verticalAlignment,
        });
        this.horizontalFlex = params.horizontalFlex ?? UIFlexAlignment.none;
        this.itemLineAlignment = params.itemLineAlignment ?? ItemLineAlignment.automatic;
        this.padding = params.padding ?? new UDim(0, 0);
        this.verticalFlex = params.verticalFlex ?? UIFlexAlignment.none;
        this.wraps = params.wraps ?? false;
    }

    toCode(variableName: string): string {
        return super.toCode(variableName) + `
        ${variableName}.HorizontalFlex = ${this.horizontalFlex}
        ${variableName}.ItemLineAlignment = ${this.itemLineAlignment}
        ${variableName}.Padding = ${this.padding}
        ${variableName}.VerticalFlex = ${this.verticalFlex}
        ${variableName}.Wraps = ${this.wraps}
        `;
    }
}

export class UIPadding extends UIComponent {
    paddingBottom: UDim;
    paddingLeft: UDim;
    paddingRight: UDim;
    paddingTop: UDim;

    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
        //
        paddingBottom?: UDim,
        paddingLeft?: UDim,
        paddingRight?: UDim,
        paddingTop?: UDim,
    }) {
        super({
            archivable: params.archivable, 
            name: params.name ?? 'UIComponent', 
            parent: params.parent
        });
        this.paddingBottom = params.paddingBottom ?? new UDim(0, 0);
        this.paddingLeft = params.paddingLeft ?? new UDim(0, 0);
        this.paddingRight = params.paddingRight ?? new UDim(0, 0);
        this.paddingTop = params.paddingTop ?? new UDim(0, 0);
    }

    toCode(variableName: string): string {
        return super.toCode(variableName) + `
        ${variableName}.PaddingBottom = ${this.paddingBottom}
        ${variableName}.PaddingLeft = ${this.paddingLeft}
        ${variableName}.PaddingRight = ${this.paddingRight}
        ${variableName}.PaddingTop = ${this.paddingTop}
        `;
    }
}

export class UIPageLayout extends UIGridStyleLayout {
    animated: boolean;
    circular: boolean;
    easingDirection: EasingDirection;
    easingStyle: EasingStyle;
    gamepadInputEnabled: boolean;
    padding: UDim;
    scrollWheelInputEnabled: boolean;
    touchInputEnabled: boolean;
    tweenTime: number;

    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
        //
        fillDirection?: FillDirection,
        horizontalAlignment?: HorizontalAlignment,
        sortOrder?: SortOrder,
        verticalAlignment?: VerticalAlignment,
        //
        animated?: boolean,
        circular?: boolean,
        easingDirection?: EasingDirection,
        easingStyle?: EasingStyle,
        gamepadInputEnabled?: boolean,
        padding?: UDim,
        scrollWheelInputEnabled?: boolean,
        touchInputEnabled?: boolean,
        tweenTime?: number,
    }) {
        super({
            archivable: params.archivable, 
            name: params.name ?? 'UIComponent', 
            parent: params.parent,
            //
            fillDirection: params.fillDirection,
            horizontalAlignment: params.horizontalAlignment,
            sortOrder: params.sortOrder,
            verticalAlignment: params.verticalAlignment,
        });
        this.animated = params.animated ?? true;
        this.circular = params.circular ?? false;
        this.easingDirection = params.easingDirection ?? EasingDirection.out;
        this.easingStyle = params.easingStyle ?? EasingStyle.back;
        this.gamepadInputEnabled = params.gamepadInputEnabled ?? true;
        this.padding = params.padding ?? new UDim(0, 0);
        this.scrollWheelInputEnabled = params.scrollWheelInputEnabled ?? true;
        this.touchInputEnabled = params.touchInputEnabled ?? true;
        this.tweenTime = params.tweenTime ?? 1;
    }

    toCode(variableName: string): string {
        return super.toCode(variableName) + `
        ${variableName}.Animated = ${this.animated}
        ${variableName}.Circular = ${this.circular}
        ${variableName}.EasingDirection = ${this.easingDirection}
        ${variableName}.EasingStyle = ${this.easingStyle}
        ${variableName}.GamepadInputEnabled = ${this.gamepadInputEnabled}
        ${variableName}.Padding = ${this.padding}
        ${variableName}.ScrollWheelInputEnabled = ${this.scrollWheelInputEnabled}
        ${variableName}.TouchInputEnabled = ${this.touchInputEnabled}
        ${variableName}.TweenTime = ${this.tweenTime}
        `;
    }
}

export class UIScale extends UIComponent {
    scale: number;

    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
        //
        scale?: number,
    }) {
        super({
            archivable: params.archivable, 
            name: params.name ?? 'UIComponent', 
            parent: params.parent
        });
        this.scale = params.scale ?? 1;
    }

    toCode(variableName: string): string {
        return super.toCode(variableName) + `
        ${variableName}.Scale = ${this.scale}
        `;
    }
}

export class UISizeConstraint extends UIConstraint {
    maxSize: Vector2;
    minSize: Vector2;

    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
        //
        maxSize?: Vector2,
        minSize?: Vector2,
    }) {
        super({
            archivable: params.archivable, 
            name: params.name ?? 'UIComponent', 
            parent: params.parent
        });
        this.maxSize = params.maxSize ?? new Vector2(Infinity, Infinity);
        this.minSize = params.minSize ?? Vector2.zero;
    }

    toCode(variableName: string): string {
        return super.toCode(variableName) + `
        ${variableName}.MaxSize = ${this.maxSize}
        ${variableName}.MinSize = ${this.minSize}
        `;
    }
}

export class UIStroke extends UIComponent {
    applyStrokeMode: ApplyStrokeMode;
    color: Color3;
    enabled: boolean;
    lineJoinMode: LineJoinMode;
    thickness: number;
    transparency: number;

    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
        //
        applyStrokeMode?: ApplyStrokeMode,
        color?: Color3,
        enabled?: boolean,
        lineJoinMode?: LineJoinMode,
        thickness?: number,
        transparency?: number,
    }) {
        super({
            archivable: params.archivable, 
            name: params.name ?? 'UIComponent', 
            parent: params.parent
        });
        this.applyStrokeMode = params.applyStrokeMode ?? ApplyStrokeMode.contextual;
        this.color = params.color ?? new Color3(0, 0, 0);
        this.enabled = params.enabled ?? true;
        this.lineJoinMode = params.lineJoinMode ?? LineJoinMode.round;
        this.thickness = params.thickness ?? 1;
        this.transparency = params.transparency ?? 0;
    }

    toCode(variableName: string): string {
        return super.toCode(variableName) + `
        ${variableName}.ApplyStrokeMode = ${this.applyStrokeMode}
        ${variableName}.Color = ${this.color}
        ${variableName}.Enabled = ${this.enabled}
        ${variableName}.LineJoinMode = ${this.lineJoinMode}
        ${variableName}.Thickness = ${this.thickness}
        ${variableName}.Transparency = ${this.transparency}
        `;
    }
}

export class UITableLayout extends UIGridStyleLayout {
    fillEmptySpaceColumns: boolean;
    fillEmptySpaceRows: boolean;
    majorAxis: TableMajorAxis;
    padding: UDim2;

    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
        //
        fillDirection?: FillDirection,
        horizontalAlignment?: HorizontalAlignment,
        sortOrder?: SortOrder,
        verticalAlignment?: VerticalAlignment,
        //
        fillEmptySpaceColumns?: boolean,
        fillEmptySpaceRows?: boolean,
        majorAxis?: TableMajorAxis,
        padding?: UDim2,
    }) {
        super({
            archivable: params.archivable, 
            name: params.name ?? 'UIComponent', 
            parent: params.parent,
            //
            fillDirection: params.fillDirection,
            horizontalAlignment: params.horizontalAlignment,
            sortOrder: params.sortOrder,
            verticalAlignment: params.verticalAlignment,
        });
        this.fillEmptySpaceColumns = params.fillEmptySpaceColumns ?? false;
        this.fillEmptySpaceRows = params.fillEmptySpaceRows ?? false;
        this.majorAxis = params.majorAxis ?? TableMajorAxis.rowMajor;
        this.padding = params.padding ?? new UDim2(0, 0, 0, 0);
    }

    toCode(variableName: string): string {
        return super.toCode(variableName) + `
        ${variableName}.FillEmptySpaceColumns = ${this.fillEmptySpaceColumns}
        ${variableName}.FillEmptySpaceRows = ${this.fillEmptySpaceRows}
        ${variableName}.MajorAxis = ${this.majorAxis}
        ${variableName}.Padding = ${this.padding}
        `;
    }
}

export class UITextSizeConstraint extends UIConstraint {
    maxTextSize: number;
    minTextSize: number;

    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
        //
        maxTextSize?: number,
        minTextSize?: number,    
    }) {
        super({
            archivable: params.archivable, 
            name: params.name ?? 'UIComponent', 
            parent: params.parent
        });
        this.maxTextSize = params.maxTextSize ?? 100;
        this.minTextSize = params.minTextSize ?? 1;
    }

    toCode(variableName: string): string {
        return super.toCode(variableName) + `
        ${variableName}.MaxTextSize = ${this.maxTextSize}
        ${variableName}.MinTextSize = ${this.minTextSize}
        `;
    }
}
