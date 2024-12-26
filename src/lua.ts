import { 
    assert 
} from "console";

import tinycolor from 'tinycolor2';
import { StringBuffer, toCamelCase } from "./structure";
import { RBMXMFile, toRBXMX } from "./download";

abstract class RobloxObject {}

interface RobloxCodeParser {
    toCode(variableName: string): string;
}

interface RBXMXCodeParser {
    toRBXMXCode() : string;
}

export declare type RobloxClassName = 
    | "LocalizationTable"
    | "Camera"
    | "ScreenGui"
    //
    | "UIAspectRatioConstraint"
    | "UICorner"
    | "UIFlexItem"
    | "UIGradient"
    | "UIGridLayout"
    | "UIListLayout"
    | "UIPadding"
    | "UIPageLayout"
    | "UIScale"
    | "UISizeConstraint"
    | "UIStroke"
    | "UITableLayout"
    | "UITextSizeConstraint"
    //
    | "Frame"
    | "ScrollingFrame"
    | "VideoFrame"
    | "ViewportFrame"
    | "ImageLabel"
    | "ImageButton"
    | "TextLabel"
    | "TextButton"
    | "TextBox";

export abstract class Instance extends RobloxObject implements RobloxCodeParser {
    className: RobloxClassName;
    archivable: boolean;
    name: string;
    parent?: Instance;

    constructor(params: {
        className: RobloxClassName,
        archivable?: boolean,
        name?: string,
        parent?: Instance,
    }) {
        super();
        this.className = params.className,
        this.archivable = params.archivable ?? true;
        this.name = params.name ?? 'Instance';
        this.parent = params.parent;
    }

    toCode(variableName: string): string {
        return `
        local ${variableName} = Instance.new("${this.className}")
        ${variableName}.Archivable = ${this.archivable}
        ${variableName}.Parent = ${typeof this.parent === "undefined" ? "nil" : `${toCamelCase(this.parent!.name)}`}
        ${variableName}.Name = "${this.name}"
        `.trim();
    }
}

export class LocalizationTable extends Instance implements RBXMXCodeParser {
    sourceLocaleId: string;

    constructor(params: {
        archivable?: boolean,
        name?: string,
        parent?: Instance,
        //
        sourceLocaleId?: string,
    }) {
        super({
            className: "LocalizationTable",
            archivable: params.archivable,
            name: params.name,
            parent: params.parent,
        });
        this.sourceLocaleId = params.sourceLocaleId ?? "en-us";
    }

    toCode(variableName: string): string {
        return super.toCode(variableName) + `
        ${variableName}.SourceLocaleId ? "${this.sourceLocaleId}"
        `;
    }

    toRBXMXCode(): string {
        return toRBXMX(
            RBMXMFile.instanceRBXMX(this).trim()
        );
    }
}

export enum SelectionBehavior {
    escape,
    stop,
}

interface RobloxGlobalObject {
    toCode(): string;

    toRBXMXCode(propertyName: string): string;
}

export class Color3 implements RobloxGlobalObject {
    r: number;
    g: number;
    b: number;

    constructor(hex: string);

    constructor(r: number | string, g: number, b: number);
    
    constructor(r?: number | string, g?: number, b?: number) {
        if (
            typeof r == "number" &&
            typeof g == "number" && 
            typeof b == "number"
        ) {
            assert(r >= 0 && r <= 255);
            assert(g >= 0 && g <= 255);
            assert(b >= 0 && b <= 255);
            this.r = r;
            this.g = g;
            this.b = b;
        } else if (
            typeof r == "string" &&
            typeof g == "undefined" && 
            typeof b == "undefined"
        ) {
            assert(r.length == 6);
            const resultColor = tinycolor(r).toRgb();
            this.r = resultColor.r;
            this.g = resultColor.g;
            this.b = resultColor.b;
        } else {
            throw Error("Parameter configuration unimplemented")
        }
    }

    toCode(): string {
        return `Color3.fromRGB(${this.r}, ${this.g}, ${this.b})`;
    }

    toRBXMXCode(propertyName: string): string {
        return `
        <Color3 name="${propertyName}">
            <R>${Math.round(this.r/255)}</R>
            <G>${Math.round(this.g/255)}</G>
            <B>${Math.round(this.b/255)}</B>
        </Color3>
        `;
    }
}

interface Vector<VECTOR> {
    get length(): number;

    get unit(): VECTOR;

    get opposite(): VECTOR;

    add(vec: VECTOR): VECTOR;

    subtract(vec: VECTOR): VECTOR;

    factor(factor: number): VECTOR;

    divide(divisor: number): VECTOR;
}

export class Vector2 implements Vector<Vector2>, RobloxGlobalObject{
    static zero: Vector2 = new Vector2(0, 0);
    
    static one: Vector2 = new Vector2(1, 1);

    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    get length(): number {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    get unit(): Vector2 {
        return this.divide(this.length);
    }

    get opposite(): Vector2 {
        return new Vector2(-this.x, -this.y);
    }

    add(vec: Vector2): Vector2 {
        return new Vector2(
            this.x + vec.x,
            this.y + vec.y,
        );
    }
    
    subtract(vec: Vector2): Vector2 {
        return new Vector2(
            this.x - vec.x,
            this.y - vec.y,
        );
    }
    
    factor(factor: number): Vector2 {
        return new Vector2(
            factor * this.x,
            factor * this.y,
        );
    }
    
    divide(divisor: number): Vector2 {
        return new Vector2(
            this.x/divisor,
            this.y/divisor,
        );
    }

    toCode(): string {
        return `Vector.new(${this.x}, ${this.y})`;
    }

    toRBXMXCode(propertyName: string): string {
        return `
        <Vector2 name="${propertyName}">
            <X>${this.x}</X>
            <Y>${this.y}</Y>
        </Vector2>
        `;
    }
}

export enum AutomaticSize {
    none,
    x,
    xy,
    y
}

export enum BorderMode {
    inset,
    middle, 
    outline
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

    toRBXMXCode(propertyName: string): string {
        return `
        <UDim name="${propertyName}">
            <S>${this.scale}</S>
            <O>${this.offset}</O>
        </UDim>
        `;
    }
}

export class UDim2 implements RobloxGlobalObject {
    x: UDim;
    y: UDim;
    width: UDim;
    height: UDim;
    
    constructor();
    constructor(xScale: number, xOffset: number, yScale: number, yOffset: number);
    constructor(x: UDim, y: UDim);
    constructor(xScale: number, yScale: number);

    constructor(
        xS?: number | UDim, 
        xO?: number | UDim, 
        yS?: number, 
        yO?: number
    ) {
        if (
            typeof xS === "undefined" &&
            typeof xO === "undefined" &&
            typeof yS === "undefined" &&
            typeof yO === "undefined"
        ) {
            this.x = new UDim(0, 0);
            this.y = new UDim(0, 0);
            this.width = new UDim(0, 0);
            this.height = new UDim(0, 0);
        } else if (
            typeof xS === "number" &&
            typeof xO === "number" &&
            typeof yS === "number" &&
            typeof yO === "number" 
        ) {
            this.x = new UDim(xS, xO);
            this.y = new UDim(yS, yO);
            this.width = new UDim(xS, xO);
            this.height = new UDim(yS, yO);
        } else if (
            xS instanceof UDim &&
            xO instanceof UDim &&
            typeof yS === "undefined" &&
            typeof yO === "undefined" 
        ) {
            this.x = xS;
            this.y = xO;
            this.width = xS;
            this.height = xO;
        } else if (
            typeof xS === "number" &&
            typeof xO === "number" &&
            typeof yS === "undefined" &&
            typeof yO === "undefined" 
        ) {
            this.x = new UDim(xS, 0);
            this.y = new UDim(xO, 0);
            this.width = new UDim(xS, 0);
            this.height = new UDim(xO, 0);
        } else {
            throw Error("Wrong parameter implementation");
        }
    }

    toCode(): string {
        return `UDim2.new(${this.x.scale}, ${this.x.offset}, ${this.y.scale}, ${this.y.offset})`;
    }

    toRBXMXCode(propertyName: string): string {
        return `
        <UDim2 name="${propertyName}">
            <XS>${this.x.scale}</XS>
            <XO>${this.x.offset}</XO>
            <YS>${this.y.scale}</YS>
            <YO>${this.y.offset}</YO>
        </UDim2>
        `;
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

export enum RotationOrder {
    xyz,
    xzy,
    yzx,
    yxz,
    zxy,
    zyx,
}

declare type CFrameComponents = {
    x: number,
    y: number,
    z: number,
    r00: number,
    r01: number,
    r02: number,
    r10: number,
    r11: number,
    r12: number,
    r20: number,
    r21: number,
    r22: number,
};

declare type Matrix3x3 = [
    [number, number, number],
    [number, number, number],
    [number, number, number]
];

export class CFrame implements RobloxGlobalObject {
    position: Vector3;
    rotation: Matrix3x3;
    x: number;
    y: number;
    z: number;
    lookVector: Vector3;
    rightVector: Vector3;
    upVector: Vector3;
    xVector: Vector3;
    yVector: Vector3;
    zVector: Vector3;

    constructor();

    constructor(pos: Vector3);

    constructor(pos: Vector3, lookAt: Vector3);

    constructor(x: number, y: number, z: number);

    constructor(x: number, y: number, z: number, qX: number, qY: number, qZ: number, qW: number);

    constructor(x: number, y: number, z: number, r00: number, r01: number, r02: number, r10: number, r11: number, r12: number, r20: number, r21: number, r22: number);

    constructor(
        xOrPosition?: number | Vector3,
        yOrLookAt?: number | Vector3,
        zOrQuaternionOrMatrix?: number | Matrix3x3,
        qx?: number,
        qy?: number,
        qz?: number,
        qw?: number
      ) {
        if (xOrPosition === undefined) {
          this.position = new Vector3(0, 0, 0);
          this.rotation = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
          ];
          this.x = this.position.x;
          this.y = this.position.y;
          this.z = this.position.z;
          this.rightVector = new Vector3(
            this.rotation[0][0],
            this.rotation[0][1],
            this.rotation[0][2],
          );
          this.upVector = new Vector3(
            this.rotation[1][0],
            this.rotation[1][1],
            this.rotation[1][2],
          );
          this.lookVector = new Vector3(
            -this.rotation[2][0],
            -this.rotation[2][1],
            -this.rotation[2][2],
          );
          this.xVector = this.rightVector;
          this.yVector = this.upVector;
          this.zVector = this.lookVector.opposite;
        }
        else if (xOrPosition instanceof Vector3 && yOrLookAt instanceof Vector3) {
          const position = xOrPosition; 
            const lookAt = yOrLookAt;
            this.position = position;
            this.rotation = this.calculateLookAtMatrix(position, lookAt);
            this.x = position.x;
            this.y = position.y;
            this.z = position.z;
            this.rightVector = new Vector3(
                this.rotation[0][0],
                this.rotation[0][1],
                this.rotation[0][2],
              );
              this.upVector = new Vector3(
                this.rotation[1][0],
                this.rotation[1][1],
                this.rotation[1][2],
              );
              this.lookVector = new Vector3(
                -this.rotation[2][0],
                -this.rotation[2][1],
                -this.rotation[2][2],
              );
              this.xVector = this.rightVector;
              this.yVector = this.upVector;
              this.zVector = this.lookVector.opposite;
        }
        else if (typeof xOrPosition === "number" && typeof yOrLookAt === "number" && typeof zOrQuaternionOrMatrix === "number") {
          const x = xOrPosition;
          const y = yOrLookAt;
          const z = zOrQuaternionOrMatrix;
          this.position = new Vector3(x, y, z);
          this.x = x;
          this.y = y;
          this.z = z;
          if (qx !== undefined && qy !== undefined && qz !== undefined && qw !== undefined) {
            this.rotation = this.calculateRotationMatrixFromQuaternion(qx, qy, qz, qw);
          }
          else {
            this.rotation = [
              [1, 0, 0],
              [0, 1, 0],
              [0, 0, 1],
            ];
          }
          this.rightVector = new Vector3(
            this.rotation[0][0],
            this.rotation[0][1],
            this.rotation[0][2],
          );
          this.upVector = new Vector3(
            this.rotation[1][0],
            this.rotation[1][1],
            this.rotation[1][2],
          );
          this.lookVector = new Vector3(
            -this.rotation[2][0],
            -this.rotation[2][1],
            -this.rotation[2][2],
          );
          this.xVector = this.rightVector;
          this.yVector = this.upVector;
          this.zVector = this.lookVector.opposite;
        } else {
            throw new Error();
        }
      }

    static lookAt(at: Vector3, lookAt: Vector3, up: Vector3 = new Vector3(0, 1, 0)): CFrame {
        return new CFrame(
            at,
            lookAt,
        );
    }

    static lookAlong(at: Vector3, direction: Vector3, up: Vector3): CFrame {
        throw new Error();
    }

    static fromRotationBetweenVectors(from: Vector3, to: Vector3): CFrame {
        throw new Error();
    }

    static fromEulerAngles(rx: number, ry: number, rz: number, order: RotationOrder): CFrame {
        throw new Error();
    }

    static fromEulerAnglesXYZ(rx: number, ry: number, rz: number): CFrame {
        throw new Error();
    }

    static fromEulerAnglesYXZ(rx: number, ry: number, rz: number): CFrame {
        throw new Error();
    }

    static angles(rx: number, ry: number, rz: number): CFrame {
        throw new Error();
    }

    static fromOrientation(rx: number, ry: number, rz: number): CFrame {
        throw new Error();
    }

    static fromAxisAngle(v: Vector3, r: number): CFrame {
        throw new Error();
    }

    static fromMatrix(pos: Vector3, vX: Vector3, vY: Vector3, vZ: Vector3): CFrame {
        throw new Error();
    } 

    get components(): CFrameComponents {
        return {
            x: this.position.x,
            y: this.position.y,
            z: this.position.z,
            r00: this.xVector.x,
            r10: this.xVector.y,
            r20: this.xVector.z,
            r01: this.yVector.x,
            r11: this.yVector.y,
            r21: this.yVector.z,
            r02: this.zVector.x,
            r12: this.zVector.y,
            r22: this.zVector.z,
        };
    }

  private calculateLookAtMatrix(position: Vector3, lookAt: Vector3): Matrix3x3 {
    const zAxis = position.subtract(lookAt).unit;
    const xAxis = new Vector3(-zAxis.z, 0, zAxis.x).unit;
    const yAxis = xAxis.cross(zAxis);

    return [
      [xAxis.x, xAxis.y, xAxis.z],
      [yAxis.x, yAxis.y, yAxis.z],
      [zAxis.x, zAxis.y, zAxis.z],
    ];
  }

  private calculateRotationMatrixFromQuaternion(qx: number, qy: number, qz: number, qw: number): Matrix3x3 {
    return [
      [
        1 - 2 * qy * qy - 2 * qz * qz,
        2 * qx * qy - 2 * qz * qw,
        2 * qx * qz + 2 * qy * qw,
      ],
      [
        2 * qx * qy + 2 * qz * qw,
        1 - 2 * qx * qx - 2 * qz * qz,
        2 * qy * qz - 2 * qx * qw,
      ],
      [
        2 * qx * qz - 2 * qy * qw,
        2 * qy * qz + 2 * qx * qw,
        1 - 2 * qx * qx - 2 * qy * qy,
      ],
    ];
  }

    toCode(): string {
        return `CFrame.new(${this.x}, ${this.y}, ${this.z})`;
    }

    toRBXMXCode(propertyName: string): string {
        const comps = this.components;
        return `
        <CoordinateFrame name="${propertyName}">
            <X>${comps.x}</X>
            <Y>${comps.y}</Y>
            <Z>${comps.z}</Z>
            <R00>${comps.r00}</R00>
            <R01>${comps.r01}</R01>
            <R02>${comps.r02}</R02>
            <R10>${comps.r10}</R10>
            <R11>${comps.r11}</R11>
            <R12>${comps.r12}</R12>
            <R20>${comps.r20}</R20>
            <R21>${comps.r21}</R21>
            <R22>${comps.r22}</R22>
        </CoordinateFrame>
        `;
    }
}

export enum FieldOfViewMode {
    vertical,
    diagonal,
    maxAxis
}

export enum CameraType {
    fixed,
    attach,
    watch,
    track,
    follow,
    custom,
    scriptable,
    orbital,
}

export class Camera extends Instance implements RBXMXCodeParser {
    cframe: CFrame;
    cameraSubject?: Instance;
    cameraType: CameraType;
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
        cameraType: CameraType,
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
            className: "Camera",
            archivable: params.archivable,
            name: params.name,
            parent: params.parent,
        });
        this.cframe = params.cframe ?? new CFrame();
        this.cameraSubject = params.cameraSubject;
        this.cameraType = params.cameraType ?? CameraType.fixed;
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
        ${typeof this.cameraSubject === "undefined" ? "" : this.cameraSubject?.toCode(variableName + "CameraSubject")}
        ${variableName}.CFrame = ${this.cframe.toCode()}
        ${variableName}.CameraSubject = ${typeof this.cameraSubject === "undefined" ? "nil" : `${variableName + "CameraSubject"}`}
        ${variableName}.DiagonalFieldOfView = ${this.diagonalFieldOfView}
        ${variableName}.FieldOfView = ${this.fieldOfView}
        ${variableName}.FieldOfViewMode = ${toCode(this.fieldOfViewMode)}
        ${variableName}.Focus = ${this.focus.toCode()}
        ${variableName}.HeadLocked = ${this.headLocked}
        ${variableName}.HeadScale = ${this.headScale}
        ${variableName}.MaxAxisFieldOfView = ${this.maxAxisFieldOfView}
        ${variableName}.VRTiltAndRollEnabled = ${this.vrTiltAndRollEnabled}
        `;
    }

    toRBXMXCode(): string {
        return toRBXMX(
            RBMXMFile.instanceRBXMX(this).trim(),
        );
    }
}

export class Vector3 implements Vector<Vector3>, RobloxGlobalObject {
    static zero = new Vector3(0, 0, 0);
    
    static one = new Vector3(1, 1, 1);

    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    cross(other: Vector3): Vector3 {
        return new Vector3(
          this.y * other.z - this.z * other.y,
          this.z * other.x - this.x * other.z,
          this.x * other.y - this.y * other.x
        );
    }

    get length(): number {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
    }
    
    get unit(): Vector3 {
        return this.divide(this.length);
    }
    
    get opposite(): Vector3 {
        return new Vector3(-this.x, -this.y, -this.z);
    }
    
    add(vec: Vector3): Vector3 {
        return new Vector3(
            this.x + vec.x,
            this.y + vec.y,
            this.z + vec.z,
        );
    }
    
    subtract(vec: Vector3): Vector3 {
        return new Vector3(
            this.x - vec.x,
            this.y - vec.y,
            this.z - vec.z,
        );
    }
    
    factor(factor: number): Vector3 {
        return new Vector3(
            factor * this.x,
            factor * this.y,
            factor * this.z,
        );
    }
    
    divide(divisor: number): Vector3 {
        return new Vector3(
            this.x/divisor,
            this.y/divisor,
            this.z/divisor,
        );
    }

    toCode(): string {
        return `Vector3.new(${this.x}, ${this.y}, ${this.z})`;
    }

    toRBXMXCode(propertyName: string): string {
        return `
        <Vector3 name="${propertyName}">
            <X>${this.x}</X>
            <Y>${this.y}</Y>
            <Z>${this.z}</Z>
        </Vector3>
        `;
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

export class RobloxRect implements RobloxGlobalObject {
    width: number;
    height: number;
    min: Vector2;
    max: Vector2;

    constructor();

    constructor(min: Vector2, max: Vector2);

    constructor(minX: number, minY: number, maxX: number, maxY: number);

    constructor(a?: Vector2 | number, b?: Vector2 | number, c?: number, d?: number) {
        if (
            typeof a === "undefined" && 
            typeof b === "undefined" &&
            typeof c === "undefined" &&
            typeof d === "undefined"
        ) {
            this.min = Vector2.zero;
            this.max = Vector2.zero;
            this.width = this.min.x;
            this.height = this.min.y;
        } else if (
            a instanceof Vector2 && 
            b instanceof Vector2 &&
            typeof c === "undefined" &&
            typeof d === "undefined"        
        ) {
            this.min = a;
            this.max = b;
            this.width = a.x;
            this.height = a.y;
        } else if (
            typeof a === "number" && 
            typeof b === "number" &&
            typeof c === "number" &&
            typeof d === "number"
        ) {
            this.min = new Vector2(a, b);
            this.max = new Vector2(c, d);
            this.width = this.min.x;
            this.height = this.min.y;
        } else {
            throw new Error();
        }
    }

    toCode(): string {
        return `Rect.new(${this.min.toCode()}, ${this.max.toCode()})`;
    }

    toRBXMXCode(propertyName: string): string {
        return `
        <Rect2D name="${propertyName}">
            <min>
                <X>${this.min.x}</X>
                <Y>${this.min.y}</Y>
            </min>
            <max>
                <X>${this.max.x}</X>
                <Y>${this.max.y}</Y>
            </max>
        </Rect2D>
        `;
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
        return `Font.new("${this.family}", ${toCode(this.weight)}, ${toCode(this.style)})`;
    }

    toRBXMXCode(propertyName: string): string {
        return `
        <Font name="${propertyName}">
            <Family>
                <url>
                    rbxasset://fonts/families/${this.family}.json
                </url>
            </Family>
            <Weight>
                ${this.weight}
            </Weight>
            <Style>
                ${this.style}
            </Style>
            <CachedFaceId>
                <url>
                    rbxasset://fonts/families/${this.family}-Regular.ttf
                </url>
            </CachedFaceId>
        </Font>
        `;
    }
}

export enum FontWeight {
    thin = 100,
    extraLight = 200,
    light = 300,
    regular = 400,
    medium = 500,
    semiBold = 600,
    bold = 700,
    extraBold = 800,
    heavy = 900,
}

export enum FontStyle {
    normal = "Normal",
    italic = "Italic",
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
    stretch,
}

export class ColorSequenceKeypoint {
    time: number;
    value: Color3;

    constructor(time: number, color: Color3) {
        this.time = time;
        this.value = color;
    }
    
    toCode(): string {
        return `ColorSequenceKeypoint.new(${this.time}, ${this.value.toCode()})`;
    }

    toRBXMXCode(): string {
        return `${this.time} ${this.value.r} ${this.value.g} ${this.value.b} 0`;
    }
}

export class ColorSequence implements RobloxGlobalObject {
    private keypointsBuffer: StringBuffer = new StringBuffer();

    keypoints: ReadonlyArray<ColorSequenceKeypoint>;

    constructor(c: Color3);

    constructor(c0: Color3, c1: Color3);

    constructor(keypoints: ColorSequenceKeypoint[]);
    
    constructor(c0?: Color3 | ColorSequenceKeypoint[], c1?: Color3) {
        if (
            c0 instanceof Color3 &&
            typeof c1 === "undefined"
        ) {
            this.keypoints = [new ColorSequenceKeypoint(0, c0)];
        } else if (
            c0 instanceof Color3 && 
            c1 instanceof Color3 
        ) {
            this.keypoints = [
                new ColorSequenceKeypoint(0, c0),
                new ColorSequenceKeypoint(1, c1),
            ];
        } else if (
            !(c0 instanceof Color3) &&
            typeof c1 === "undefined"    
        ) {
            this.keypoints = c0 as ColorSequenceKeypoint[];
        } else {
            throw Error("Unimplemented parameter configuration");
        }
    }

    get keypointsAsRBXMX(): string {
        for (var i: number = 0; i < this.keypoints.length; i++) {
            if (i == this.keypoints.length - 1) {
                this.keypointsBuffer.write(this.keypoints[i].toRBXMXCode());
            } else {
                this.keypointsBuffer.write(`${this.keypoints[i].toRBXMXCode()} `);
            }
        }
        return this.keypointsBuffer.toString();
    }

    toCode(): string {
        return `ColorSequence.new({${this.keypoints
            .toString()
            .replace("[", "")
            .replace("]", "")
            .trim()
        })}`;
    }

    toRBXMXCode(propertyName: string): string {
        return `
        <ColorSequence name="${propertyName}">
            ${this.keypointsAsRBXMX}
        </ColorSequence>
        `;
    }
}

export class NumberSequenceKeypoint {
    time: number;
    value: number;
    envelope: number;

    constructor(time: number, value: number);

    constructor(time: number, value: number, envelope: number);

    constructor(time: number, value: number, envelope?: number) {
        this.time = time;
        this.value = value;
        this.envelope = envelope ?? 0;
    }

    toCode(): string {
        return `NumberSequenceKeypoint.new(${this.time}, ${this.value}, ${this.envelope})`;
    }

    toRBXMXCode(): string {
        return `${this.time} ${this.value} ${this.envelope}`;
    }
}

export class NumberSequence implements RobloxGlobalObject {
    private keypointsBuffer: StringBuffer = new StringBuffer();

    keypoints: NumberSequenceKeypoint[];

    constructor(keypoints: NumberSequenceKeypoint[]) {
        this.keypoints = keypoints;
    }

    get keypointsAsRBXMX(): string {
        for (var i: number = 0; i < this.keypoints.length; i++) {
            if (i == this.keypoints.length - 1) {
                this.keypointsBuffer.write(this.keypoints[i].toRBXMXCode());
            } else {
                this.keypointsBuffer.write(`${this.keypoints[i].toRBXMXCode()} `);
            }
        }
        return this.keypointsBuffer.toString();
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

    toRBXMXCode(propertyName: string): string {
        return `
        <NumberSequence name="${propertyName}">
            ${this.keypointsAsRBXMX}
        </NumberSequence>
        `;
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
    topbarSafeInsets,
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
        // ScaleType
        case ScaleType.stretch:
            return `Enum.ScaleType.Stretch`;
        case ScaleType.slice:
            return `Enum.ScaleType.Slice`;
        case ScaleType.tile:
            return `Enum.ScaleType.Tile`;
        case ScaleType.fit:
            return `Enum.ScaleType.Fit`;
        case ScaleType.crop:
            return `Enum.ScaleType.Crop`;
        // TextDirection
        case TextDirection.auto:
            return `Enum.TextDirection.Auto`;
        case TextDirection.leftToRight:
            return `Enum.TextDirection.LeftToRight`;
        case TextDirection.rightToLeft:
            return `Enum.TextDirection.RightToLeft`;
        // TextTruncate
        case TextTruncate.none:
            return `Enum.TextTruncate.None`;
        case TextTruncate.atEnd:
            return `Enum.TextTruncate.AtEnd`;
        case TextTruncate.splitWord:
            return `Enum.TextTruncate.SplitWord`; 
        // TextXAlignment
        case TextXAlignment.left:
            return `Enum.TextXAlignment.Left`;
        case TextXAlignment.right:
            return `Enum.TextXAlignment.Right`;
        case TextXAlignment.center:
            return `Enum.TextXAlignment.Center`;
        // TextYAlignment
        case TextYAlignment.top:
            return `Enum.TextYAlignment.Top`;
        case TextYAlignment.center:
            return `Enum.TextYAlignment.Center`;
        case TextYAlignment.bottom:
            return `Enum.TextYAlignment.Bottom`;
        // FontWeight
        case FontWeight.thin:
            return `Enum.FontWeight.Thin`;
        case FontWeight.extraLight:
            return `Enum.FontWeight.ExtraLight`;
        case FontWeight.light:
            return `Enum.FontWeight.Light`;
        case FontWeight.regular:
            return `Enum.FontWeight.Regular`;
        case FontWeight.medium:
            return `Enum.FontWeight.Medium`;
        case FontWeight.semiBold:
            return `Enum.FontWeight.SemiBold`;
        case FontWeight.bold:
            return `Enum.FontWeight.Bold`;
        case FontWeight.extraBold:
            return `Enum.FontWeight.ExtraBold`;
        case FontWeight.heavy:
            return `Enum.FontWeight.Heavy`; 
        // FontStyle
        case FontStyle.normal:
            return `Enum.FontStyle.Normal`;
        case FontStyle.italic:
            return `Enum.FontStyle.Italic`;
        // AspectType
        case AspectType.fitWithInMaxSize:
            return `Enum.AspectType.FitWithinMaxSize`;
        case AspectType.scaleWithParentSize:
            return `Enum.AspectType.ScaleWithParentSize`;
        // DominantAxis
        case DominantAxis.width:
            return `Enum.DominantAxis.Width`;
        case DominantAxis.height:
            return `Enum.DominantAxis.Height`;
        // UIFlexMode
        case UIFlexMode.none:
            return `Enum.UIFlexMode.None`;
        case UIFlexMode.shrink:
            return `Enum.UIFlexMode.Shrink`;
        case UIFlexMode.fill:
            return `Enum.DominantAxis.Fill`;
        case UIFlexMode.custom:
            return `Enum.UIFlexMode.Custom`;
        // ItemLineAlignment
        case ItemLineAlignment.automatic:
            return `Enum.ItemLineAlignment.Automatic`;
        case ItemLineAlignment.start:
            return `Enum.ItemLineAlignment.Start`;
        case ItemLineAlignment.center:
            return `Enum.ItemLineAlignment.Center`;
        case ItemLineAlignment.end:
            return `Enum.ItemLineAlignment.End`;
        case ItemLineAlignment.stretch:
            return `Enum.ItemLineAlignment.Stretch`;   
        // StartCorner
        case StartCorner.topLeft:
            return `Enum.StartCorner.TopLeft`;
        case StartCorner.topRight:
            return `Enum.StartCorner.topRight`;
        case StartCorner.bottomLeft:
            return `Enum.StartCorner.bottomLeft`;
        case StartCorner.bottomRight:
            return `Enum.StartCorner.BottomRight`;
        // FillDirection
        case FillDirection.horizontal:
            return `Enum.FillDirection.Horizontal`;
        case FillDirection.vertical:
            return `Enum.FillDirection.Vertical`; 
        // HorizontalAlignment
        case HorizontalAlignment.center:
            return `Enum.HorizontalAlignment.Center`;
        case HorizontalAlignment.left:
            return `Enum.HorizontalAlignment.Left`;
        case HorizontalAlignment.right:
            return `Enum.HorizontalAlignment.Right`;
        // SortOrder
        case SortOrder.name:
            return `Enum.SortOrder.Name`;
        case SortOrder.layoutOrder:
            return `Enum.SortOrder.LayoutOrder`;
        // VerticalAlignment
        case VerticalAlignment.center:
            return `Enum.VerticalAlignment.Center`;
        case VerticalAlignment.top:
            return `Enum.VerticalAlignment.Top`;
        case VerticalAlignment.bottom:
            return `Enum.VerticalAlignment.Bottom`;
        // UIFlexAlignment
        case UIFlexAlignment.none:
            return `Enum.UIFlexAlignment.None`;
        case UIFlexAlignment.fill:
            return `Enum.UIFlexAlignment.Fill`;
        case UIFlexAlignment.spaceAround:
            return `Enum.UIFlexAlignment.SpaceAround`;
        case UIFlexAlignment.spaceBetween:
            return `Enum.UIFlexAlignment.SpaceBetween`;
        case UIFlexAlignment.spaceEvenly:
            return `Enum.UIFlexAlignment.SpaceEvenly`;
        // EasingDirection
        case EasingDirection.in:
            return `Enum.EasingDirection.In`;
        case EasingDirection.out:
            return `Enum.EasingDirection.Out`;
        case EasingDirection.inOut:
            return `Enum.EasingDirection.InOut`;
        // EasingStyle
        case EasingStyle.linear:
            return `Enum.EasingStyle.Linear`;
        case EasingStyle.sine:
            return `Enum.EasingStyle.Sine`;
        case EasingStyle.back:
            return `Enum.EasingStyle.Back`;
        case EasingStyle.quad:
            return `Enum.EasingStyle.Quad`;
        case EasingStyle.quart:
            return `Enum.EasingStyle.Quart`;
        case EasingStyle.quint:
            return `Enum.EasingStyle.Quint`;
        case EasingStyle.bounce:
            return `Enum.EasingStyle.Bounce`;
        case EasingStyle.elastic:
            return `Enum.EasingStyle.Elastic`;
        case EasingStyle.exponential:
            return `Enum.EasingStyle.Exponential`;
        case EasingStyle.circular:
            return `Enum.EasingStyle.Circular`;
        case EasingStyle.cubic:
            return `Enum.EasingStyle.Cubic`;
        // ApplyStrokeMode
        case ApplyStrokeMode.contextual:
            return `Enum.ApplyStrokeMode.Contextual`;
        case ApplyStrokeMode.border:
            return `Enum.ApplyStrokeMode.Border`; 
        // LineJoinMode
        case LineJoinMode.round:
            return `Enum.LineJoinMode.Round`;
        case LineJoinMode.bevel:
            return `Enum.LineJoinMode.Bevel`;
        case LineJoinMode.miter:
            return `Enum.LineJoinMode.Miter`;
        // TableMajorAxis
        case TableMajorAxis.rowMajor:
            return `Enum.TableMajorAxis.RowMajor`;
        case TableMajorAxis.columnMajor:
            return `Enum.TableMajorAxis.ColumnMajor`;
        // ZIndexBehaviour
        case ZIndexBehaviour.global:
            return `Enum.ZIndexBehaviour.Global`;
        case ZIndexBehaviour.sibling:
            return `Enum.ZIndexBehaviour.Sibling`;
        // SafeAreaCompatibility
        case SafeAreaCompatibility.none:
            return `Enum.SafeAreaCompatibility.None`;
        case SafeAreaCompatibility.fullscreenExtension:
            return `Enum.SafeAreaCompatibility.FullscreenExtension`;
        // ScreenInsets
        case ScreenInsets.none:
            return `Enum.ScreenInsets.None`;
        case ScreenInsets.deviceSafeInsets:
            return `Enum.ScreenInsets.DeviceSafeInsets`;
        case ScreenInsets.coreUISafeInsets:
            return `Enum.ScreenInsets.CoreUISafeInsets`;
        case ScreenInsets.topbarSafeInsets:
            return `Enum.ScreenInsets.TopbarSafeInsets`;
        default: throw new Error(
            "Enumeration or enumeration value not implemented (yet)",
        );
    }
}

//

export abstract class GuiBase extends Instance {
    constructor(params: {
        className: RobloxClassName,
        archivable?: boolean,
        name?: string,
        parent?: Instance,
    }) {
        super({
            className: params.className,
            archivable: params.archivable, 
            name: params.name ?? 'GuiBase', 
            parent: params.parent
        });
    }
}

abstract class GuiBase2d extends GuiBase {
    private _children: Array<Instance> = [];

    autoLocalize: boolean;
    rootLocalizationTable?: LocalizationTable;
    selectionBehaviorDown: SelectionBehavior;
    selectionBehaviorLeft: SelectionBehavior;
    selectionBehaviorRight: SelectionBehavior;
    selectionBehaviorUp: SelectionBehavior;
    selectionGroup: boolean;
    
    constructor(params: {
        className: RobloxClassName,
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
            className: params.className,
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

    get children(): readonly Instance[] {
        return this._children;
    }

    addChild(child: Instance): void {
        if (child.parent != this) {
            child.parent = this;
        }
        this._children.push(child);
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
        ${typeof this.rootLocalizationTable === "undefined" ? "" : this.rootLocalizationTable.toCode(variableName + "LocalizationTable")}
        ${variableName}.AutoLocalize = ${this.autoLocalize}
        ${variableName}.RootLocalizationTable = ${typeof this.rootLocalizationTable === "undefined" ? "nil" : `${variableName + "LocalizationTable"}`}
        ${variableName}.SelectionBehaviorDown = ${toCode(this.selectionBehaviorDown)}
        ${variableName}.SelectionBehaviorLeft = ${toCode(this.selectionBehaviorLeft)}
        ${variableName}.SelectionBehaviorRight = ${toCode(this.selectionBehaviorRight)}
        ${variableName}.SelectionBehaviorUp = ${toCode(this.selectionBehaviorUp)}
        ${variableName}.SelectionGroup = ${this.selectionGroup}
        `;
    }

    toRBXMXCode(name: string): string {
        return `
        
        `;
    }
}

abstract class LayerCollector extends GuiBase2d {
    enabled: boolean;
    resetOnSpawn: boolean;
    zIndexBehavior: ZIndexBehaviour;

    constructor(params: {
        className: RobloxClassName,
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
            className: params.className,
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

    toCode(variableName: string): string {
        return super.toCode(variableName) + `
        ${variableName}.Enabled = ${this.enabled}
        ${variableName}.resetOnSpawn = ${this.resetOnSpawn}
        ${variableName}.ZIndexBehavior = ${toCode(this.zIndexBehavior)}
        `;
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

export class ScreenGui extends LayerCollector implements RBXMXCodeParser {
    clipToDeviceSafeArea: boolean;
    displayOrder: number;
    ignoreGuiInset: boolean;
    safeAreaCompatibility: SafeAreaCompatibility;
    screenInsets: ScreenInsets;

    constructor(params: ScreenGuiProperties) {
        super({
            className: "ScreenGui",
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

    toCode(variableName: string): string {
        return super.toCode(variableName) + `
        ${variableName}.ClipToDeviceSafeArea = ${this.clipToDeviceSafeArea}
        ${variableName}.DisplayOrder = ${this.displayOrder}
        ${variableName}.IgnoreGuiInset = ${this.ignoreGuiInset}
        ${variableName}.SafeAreaCompatibility = ${toCode(this.safeAreaCompatibility)}
        ${variableName}.ScreenInsets = ${toCode(this.screenInsets)}
        `;
    }

    toRBXMXCode(): string {
        return toRBXMX(
            RBMXMFile.instanceRBXMX(this).trim()
        );
    }
}

export abstract class GuiBase3d extends GuiBase {
    color3: Color3;
    transparency: number;
    visible: boolean;
    
    constructor(params: {
        className: RobloxClassName,
        archivable?: boolean,
        name?: string,
        parent?: Instance,
        //
        color3: Color3,
        transparency: number,
        visible: boolean,
    }) {
        super({
            className: params.className,
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
        ${variableName}.Color3 = ${this.color3.toCode()}
        ${variableName}.Transparency = ${this.transparency}
        ${variableName}.Visible = ${this.visible}
        `;
    }
}

export abstract class GuiObject extends GuiBase2d {
    active: boolean;
    anchorPoint: Vector2;
    automaticSize: AutomaticSize;
    backgroundColor3: Color3;
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
        className: RobloxClassName,
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
        backgroundColor3?: Color3,
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
            className: params.className,
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
        this.backgroundColor3 = params.backgroundColor3 ?? new Color3(255, 255, 255);
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
        ${typeof this.nextSelectionDown === "undefined" ? "" : this.nextSelectionDown.toCode(variableName + "NextSelectionDown")}
        ${typeof this.nextSelectionLeft === "undefined" ? "" : this.nextSelectionLeft.toCode(variableName + "NextSelectionLeft")}
        ${typeof this.nextSelectionRight === "undefined" ? "" : this.nextSelectionRight.toCode(variableName + "NextSelectionRight")}
        ${typeof this.nextSelectionUp === "undefined" ? "" : this.nextSelectionUp.toCode(variableName + "NextSelectionUp")}
        ${typeof this.selectionImageObject === "undefined" ? "" : this.selectionImageObject.toCode(variableName + "SelectionImageObject")}

        ${variableName}.Active = ${this.active}
        ${variableName}.AnchorPoint = ${this.anchorPoint.toCode()}
        ${variableName}.AutomaticSize = ${toCode(this.automaticSize)}
        ${variableName}.BackgroundColor3 = ${this.backgroundColor3.toCode()}
        ${variableName}.BackgroundTransparency = ${this.backgroundTransparency}
        ${variableName}.BorderColor3 = ${this.borderColor3.toCode()}
        ${variableName}.BorderMode = ${toCode(this.borderMode)}
        ${variableName}.BorderSizePixel = ${this.borderSizePixel}
        ${variableName}.ClipDescendants = ${this.clipDescendants}
        ${variableName}.Interactable = ${this.interactable}
        ${variableName}.LayoutOrder = ${this.layoutOrder}
        ${variableName}.NextSelectionDown = ${typeof this.nextSelectionDown === "undefined" ? "nil": `${variableName + "NextSelectionDown"}`}
        ${variableName}.NextSelectionLeft = ${typeof this.nextSelectionLeft === "undefined" ? "nil": `${variableName + "NextSelectionLeft"}`}
        ${variableName}.NextSelectionRight = ${typeof this.nextSelectionRight === "undefined" ? "nil": `${variableName + "NextSelectionRight"}`}
        ${variableName}.NextSelectionUp = ${typeof this.nextSelectionUp === "undefined" ? "nil": `${variableName + "NextSelectionUp"}`}
        ${variableName}.Position = ${this.position.toCode()}
        ${variableName}.Rotation = ${this.rotation}
        ${variableName}.Selectable = ${this.selectable}
        ${variableName}.SelectionImageObject = ${typeof this.selectionImageObject === "undefined" ? "nil": `\"${variableName + "SelectionImageObject"}\"`}
        ${variableName}.SelectionOrder = ${this.selectionOrder}
        ${variableName}.Size = ${this.size.toCode()}
        ${variableName}.SizeConstraint = ${toCode(this.sizeConstraint)}
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
        className: RobloxClassName,
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
        backgroundColor3?: Color3,
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
        autoButtonColor?: boolean,
        modal?: boolean,
        selected?: boolean,
        style?: ButtonStyle,
    }) {
        super({
            className: params.className,
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
            backgroundColor3: params.backgroundColor3,
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
        ${variableName}.Style = ${toCode(this.style)}
        `;
    }
}

export class Frame extends GuiObject implements RBXMXCodeParser {
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
        backgroundColor3?: Color3,
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
            className: "Frame",
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
            backgroundColor3: params.backgroundColor3,
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
        ${variableName}.Style = ${toCode(this.style)}
        `;
    }

    toRBXMXCode(): string {
        return toRBXMX(
            RBMXMFile.instanceRBXMX(this).trim(),
        );
    }
}

export class ScrollingFrame extends GuiObject implements RBXMXCodeParser {
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
        backgroundColor3?: Color3,
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
            className: "ScrollingFrame",
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
            backgroundColor3: params.backgroundColor3,
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
        ${variableName}.AutomaticCanvasSize = ${toCode(this.automaticCanvasSize)}
        ${variableName}.BottomImage = "${this.bottomImage}"
        ${variableName}.CanvasPosition = ${this.canvasPosition.toCode()}
        ${variableName}.CanvasSize = ${this.canvasSize.toCode()}
        ${variableName}.ElasticBehavior = ${toCode(this.elasticBehavior)}
        ${variableName}.HorizontalScrollBarInset = ${toCode(this.horizontalScrollBarInset)}
        ${variableName}.MidImage = "${this.midImage}"
        ${variableName}.ScrollBarImageColor3 = ${this.scrollBarImageColor3.toCode}
        ${variableName}.ScrollBarImageTransparency = ${this.scrollBarImageTransparency}
        ${variableName}.ScrollBarThickness = ${this.scrollBarThickness}
        ${variableName}.ScrollingDirection = ${toCode(this.scrollingDirection)}
        ${variableName}.ScrollingEnabled = ${this.scrollingEnabled}
        ${variableName}.TopImage = "${this.topImage}"
        ${variableName}.VerticalScrollBarInset = ${toCode(this.verticalScrollBarInset)}
        ${variableName}.VerticalScrollBarPosition = ${toCode(this.verticalScrollBarPosition)}
        `;
    }

    toRBXMXCode(): string {
        return toRBXMX(
            RBMXMFile.instanceRBXMX(this).trim(),
        );
    }
}

export class VideoFrame extends GuiObject implements RBXMXCodeParser {
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
        backgroundColor3?: Color3,
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
            className: "VideoFrame",
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
            backgroundColor3: params.backgroundColor3,
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
        ${variableName}.Video = ${this.video ?? "\"\""}
        ${variableName}.Playing = ${this.playing}
        ${variableName}.TimePosition = ${this.timePosition}
        ${variableName}.Looped = "${this.video ?? ''}"
        ${variableName}.Volume = ${this.volume}
        `;
    }

    toRBXMXCode(): string {
        return toRBXMX(
            RBMXMFile.instanceRBXMX(this).trim()
        );
    }
}

export class ViewportFrame extends GuiObject implements RBXMXCodeParser {
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
        backgroundColor3?: Color3,
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
            className: "ViewportFrame",
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
            backgroundColor3: params.backgroundColor3,
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
        ${typeof this.currentCamera === "undefined" ? "" : this.currentCamera.toCode(variableName + "CurrentCamera")}

        ${variableName}.Ambient = ${this.ambient.toCode()}
        ${variableName}.CurrentCamera = ${typeof this.currentCamera === "undefined" ? "nil" : `${variableName + "CurrentCamera"}`}
        ${variableName}.ImageColor3 = ${this.imageColor3.toCode()}
        ${variableName}.ImageTransparency = ${this.imageTransparency}
        ${variableName}.LightColor = ${this.lightColor.toCode()}
        ${variableName}.LightDirection = ${this.lightDirection.toCode()}
        `;
    }

    toRBXMXCode(): string {
        return toRBXMX(
            RBMXMFile.instanceRBXMX(this).trim(),
        );
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
    sliceCenter: RobloxRect;
    sliceScale: number;
    tileSize: UDim2;

    constructor(params: {
        className: RobloxClassName,
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
        backgroundColor3?: Color3,
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
        sliceCenter?: RobloxRect,
        sliceScale?: number,
        tileSize?: UDim2,
    }) {
        super({
            className: params.className,
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
            backgroundColor3: params.backgroundColor3,
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
        this.sliceCenter = params.sliceCenter ?? new RobloxRect(Vector2.zero, Vector2.zero);
        this.sliceScale = params.sliceScale ?? 1;
        this.tileSize = params.tileSize ?? new UDim2(1, 0, 1, 0);
    }

    toCode(variableName: string): string {
        return super.toCode(variableName) + `
        ${variableName}.Image = "${this.image}"
        ${variableName}.ImageColor3 = ${this.imageColor3.toCode()}
        ${variableName}.ImageRectOffset = ${this.imageRectOffset.toCode()}
        ${variableName}.ImageRectSize = ${this.imageRectSize.toCode()}
        ${variableName}.ImageTransparency = ${this.imageTransparency}
        ${variableName}.ResampleMode = ${toCode(this.resampleMode)}
        ${variableName}.ScaleType = ${toCode(this.scaleType)}
        ${variableName}.SliceCenter = ${this.sliceCenter.toCode()}
        ${variableName}.SliceScale = ${this.sliceScale}
        ${variableName}.TileSize = ${this.tileSize.toCode()}
        `;
    }
}

export class ImageLabel extends ImageObject implements RBXMXCodeParser{
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
        backgroundColor3?: Color3,
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
        sliceCenter?: RobloxRect,
        sliceScale?: number,
        tileSize?: UDim2,
    }) {
        super({
            className: "ImageLabel",
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
            backgroundColor3: params.backgroundColor3,
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

    toRBXMXCode(): string {
        return toRBXMX(
            RBMXMFile.instanceRBXMX(this).trim(),
        );
    }
}

export class ImageButton extends ImageObject implements GuiButton, RBXMXCodeParser {
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
        backgroundColor3?: Color3,
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
        sliceCenter?: RobloxRect,
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
            className: "ImageButton",
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
            backgroundColor3: params.backgroundColor3,
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
        ${variableName}.AutoButtonColor = ${this.autoButtonColor}
        ${variableName}.Modal = ${this.modal}
        ${variableName}.Selected = ${this.selected}
        ${variableName}.Style = ${toCode(this.style)}
        ${variableName}.HoverImage = "${this.hoverImage ?? ""}"
        ${variableName}.PressedImage = "${this.pressedImage ?? ""}"
        `;
    }

    toRBXMXCode(): string {
        return toRBXMX(
            RBMXMFile.instanceRBXMX(this).trim(),
        );
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
        className: RobloxClassName,
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
        backgroundColor3?: Color3,
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
            className: params.className,
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
            backgroundColor3: params.backgroundColor3,
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
        ${variableName}.FontFace = ${this.fontFace.toCode()}
        ${variableName}.LineHeight = ${this.lineHeight}
        ${variableName}.MaxVisibleGraphemes = ${this.maxVisibleGraphemes}
        ${variableName}.OpenTypeFeatures = "${this.openTypeFeatures ?? "nil"}"
        ${variableName}.RichText = ${this.richText}
        ${variableName}.Text = "${this.text}"
        ${variableName}.TextColor = ${this.textColor.toCode()}
        ${variableName}.TextDirection = ${toCode(this.textDirection)}
        ${variableName}.TextScaled = ${this.textScaled}
        ${variableName}.TextSize = ${this.textSize}
        ${variableName}.TextStrokeColor = ${this.textStrokeColor.toCode()}
        ${variableName}.TextStrokeTransparency = ${this.textStrokeTransparency}
        ${variableName}.TextTransparency = ${this.textTransparency}
        ${variableName}.TextTruncate = ${toCode(this.textTruncate)}
        ${variableName}.TextWrapped = ${this.textWrapped}
        ${variableName}.TextXAlignment = ${toCode(this.textXAlignment)}
        ${variableName}.TextYAlignment = ${toCode(this.textYAlignment)}
        `;
    }
}

export class TextLabel extends TextObject implements RBXMXCodeParser {
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
        backgroundColor3?: Color3,
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
            className: "TextLabel",
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
            backgroundColor3: params.backgroundColor3,
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

    toRBXMXCode(): string {
        return toRBXMX(
            RBMXMFile.instanceRBXMX(this).trim(),
        );
    }
}

export class TextButton extends TextObject implements GuiButton, RBXMXCodeParser {
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
        backgroundColor3?: Color3,
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
            className: "TextButton",
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
            backgroundColor3: params.backgroundColor3,
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

    toCode(variableName: string): string {
        return super.toCode(variableName) + `
        ${variableName}.AutoButtonColor = ${this.autoButtonColor}
        ${variableName}.Modal = ${this.modal}
        ${variableName}.Selected = ${this.selected}
        ${variableName}.Style = ${toCode(this.style)}
        `;
    }

    toRBXMXCode(): string {
        return toRBXMX(
            RBMXMFile.instanceRBXMX(this).trim()
        );
    }
}

export class TextBox extends TextObject implements RBXMXCodeParser {
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
        backgroundColor3?: Color3,
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
            className: "TextBox",
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
            backgroundColor3: params.backgroundColor3,
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
        ${variableName}.PlaceholderColor3 = ${this.placeholderColor3.toCode()}
        ${variableName}.PlaceholderText = "${this.placeholderText}"
        ${variableName}.SelectionStart = ${this.selectionStart}
        ${variableName}.ShowNativeInput = ${this.showNativeInput}
        ${variableName}.TextEditable = ${this.textEditable}
        `;
    }

    toRBXMXCode(): string {
        return toRBXMX(
            RBMXMFile.instanceRBXMX(this).trim(),
        );
    }
}

export declare type RobloxUI = 
    | Frame 
    | ScrollingFrame
    | VideoFrame
    | ViewportFrame
    | ImageLabel
    | ImageButton
    | TextLabel
    | TextButton
    | TextBox;

abstract class UIBase extends Instance {
    constructor(params: {
        className: RobloxClassName,
        archivable?: boolean,
        name?: string,
        parent?: Instance,
    }) {
        super({
            className: params.className,
            archivable: params.archivable, 
            name: params.name ?? 'UIBase', 
            parent: params.parent
        });
    }
}

abstract class UIComponent extends UIBase {
    constructor(params: {
        className: RobloxClassName,
        archivable?: boolean,
        name?: string,
        parent?: Instance,
    }) {
        super({
            className: params.className,
            archivable: params.archivable, 
            name: params.name ?? 'UIComponent', 
            parent: params.parent
        });
    }
}

abstract class UIConstraint extends UIComponent {
    constructor(params: {
        className: RobloxClassName,
        archivable?: boolean,
        name?: string,
        parent?: Instance,
    }) {
        super({
            className: params.className,
            archivable: params.archivable, 
            name: params.name ?? 'UIComponent', 
            parent: params.parent
        });
    }
}

abstract class UILayout extends UIComponent {
    constructor(params: {
        className: RobloxClassName,
        archivable?: boolean,
        name?: string,
        parent?: Instance,
    }) {
        super({
            className: params.className,
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
        className: RobloxClassName,
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
            className: params.className,
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
        ${variableName}.FillDirection = ${toCode(this.fillDirection)}
        ${variableName}.HorizontalAlignment = ${toCode(this.horizontalAlignment)}
        ${variableName}.SortOrder = ${toCode(this.sortOrder)}
        ${variableName}.VerticalAlignment = ${toCode(this.verticalAlignment)}
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
            className: "UIAspectRatioConstraint",
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
        ${variableName}.AspectType = ${toCode(this.aspectType)}
        ${variableName}.DominantAxis = ${toCode(this.dominantAxis)}
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
            className: "UICorner",
            archivable: params.archivable, 
            name: params.name ?? 'UIComponent', 
            parent: params.parent
        });
        this.cornerRadius = params.cornerRadius ?? new UDim(0, 8);
    }

    toCode(variableName: string): string {
        return super.toCode(variableName) + `
        ${variableName}.CornerRadius = ${this.cornerRadius.toCode()}
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
            className: "UIFlexItem",
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
        ${variableName}.FlexMode = ${toCode(this.flexMode)}
        ${variableName}.GrowRatio = ${this.growRatio}
        ${variableName}.ItemLineAlignment = ${toCode(this.itemLineAlignment)}
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
            className: "UIGradient",
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
        ${variableName}.Color = ${this.color.toCode()}
        ${variableName}.Enabled = ${this.enabled}
        ${variableName}.Offset = ${this.offset.toCode()}
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
            className: "UIGridLayout",
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
        ${variableName}.CellPadding = ${this.cellPadding.toCode()}
        ${variableName}.CellSize = ${this.cellSize.toCode()}
        ${variableName}.FillDirectionMaxCells = ${this.fillDirectionMaxCells}
        ${variableName}.StartCorner = ${toCode(this.startCorner)}
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
            className: "UIListLayout",
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
        ${variableName}.HorizontalFlex = ${toCode(this.horizontalFlex)}
        ${variableName}.ItemLineAlignment = ${toCode(this.itemLineAlignment)}
        ${variableName}.Padding = ${this.padding.toCode()}
        ${variableName}.VerticalFlex = ${toCode(this.verticalFlex)}
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
            className: "UIPadding",
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
        ${variableName}.PaddingBottom = ${this.paddingBottom.toCode()}
        ${variableName}.PaddingLeft = ${this.paddingLeft.toCode()}
        ${variableName}.PaddingRight = ${this.paddingRight.toCode()}
        ${variableName}.PaddingTop = ${this.paddingTop.toCode()}
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
            className: "UIPageLayout",
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
        ${variableName}.EasingDirection = ${toCode(this.easingDirection)}
        ${variableName}.EasingStyle = ${toCode(this.easingStyle)}
        ${variableName}.GamepadInputEnabled = ${this.gamepadInputEnabled}
        ${variableName}.Padding = ${this.padding.toCode()}
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
            className: "UIScale",
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
            className: "UISizeConstraint",
            archivable: params.archivable, 
            name: params.name ?? 'UIComponent', 
            parent: params.parent
        });
        this.maxSize = params.maxSize ?? new Vector2(Infinity, Infinity);
        this.minSize = params.minSize ?? Vector2.zero;
    }

    toCode(variableName: string): string {
        return super.toCode(variableName) + `
        ${variableName}.MaxSize = ${this.maxSize.toCode()}
        ${variableName}.MinSize = ${this.minSize.toCode()}
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
            className: "UIStroke",
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
        ${variableName}.ApplyStrokeMode = ${toCode(this.applyStrokeMode)}
        ${variableName}.Color = ${this.color.toCode()}
        ${variableName}.Enabled = ${this.enabled}
        ${variableName}.LineJoinMode = ${toCode(this.lineJoinMode)}
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
            className: "UITableLayout",
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
        ${variableName}.MajorAxis = ${toCode(this.majorAxis)}
        ${variableName}.Padding = ${this.padding.toCode()}
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
            className: "UITextSizeConstraint",
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
