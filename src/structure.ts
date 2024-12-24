import { assert } from "console";
import { TextAlignHorizontal, TextAlignVertical, TextAutoResize, TextTruncation } from "./convert";

interface Size {
    width: number;
    height: number;
}

export declare type ValidSceneNodeTypes = 
    | 'FRAME' 
    | 'GROUP' 
    | 'COMPONENT' 
    | 'RECTANGLE' 
    | 'ELLIPSE' 
    | 'TEXT'
    | 'INPUT';

export class SelectedNodeMap {
    id: string;
    name: string;
    readonly type?: ValidSceneNodeTypes;
    parent: (BaseNode & ChildrenMixin) | null;
    children?: SelectedNodeMap[];
    backgroundColor3: readonly Paint[];
    backgroundTransparency: number;
    clipDescendants: boolean;
    rotation: number;
    size:Size;
    visible: boolean;
    affiliatedNode?: SceneNode;

    constructor(params: {
        id: string,
        name: string,
        type?: ValidSceneNodeTypes,
        parent: (BaseNode & ChildrenMixin) | null,
        children?: SelectedNodeMap[],
        backgroundColor3?: readonly Paint[],
        backgroundTransparency?: number,
        clipDescendants?: boolean,
        rotation?: number,
        size?: Size,
        visible?: boolean,
        affiliatedNode?: SceneNode,
    }) {
        this.id = params.id;
        this.name = params.name;
        this.type = params.type;
        this.parent = params.parent;
        this.children = params.children;
        this.backgroundColor3 = params.backgroundColor3 ?? [];
        this.backgroundTransparency = params.backgroundTransparency ?? 1;
        this.clipDescendants = params.clipDescendants ?? false;
        this.rotation = params.rotation ?? 0;
        this.size = params.size ?? { width: 0, height: 0};
        this.visible = params.visible ?? false;
        this.affiliatedNode = params.affiliatedNode;
    }
}

export class SelectedComponentMap extends SelectedNodeMap {
    robloxUIType?: string;

    constructor(params: {
        id: string,
        name: string,
        type?: ValidSceneNodeTypes,
        parent: (BaseNode & ChildrenMixin) | null,
        children?: SelectedNodeMap[],
        backgroundColor3?: readonly Paint[],
        backgroundTransparency?: number,
        clipDescendants?: boolean,
        rotation?: number,
        size?: Size,
        visible?: boolean,
        //
        robloxUIType?: string,
        affiliatedNode?: SceneNode,
    }) {
        super({
            id: params.id,
            name: params.name,
            type: params.type,
            parent: params.parent,
            children: params.children,
            backgroundColor3: params.backgroundColor3,
            backgroundTransparency: params.backgroundTransparency,
            clipDescendants: params.clipDescendants,
            rotation: params.rotation,
            size: params.size,
            visible: params.visible,
            affiliatedNode: params.affiliatedNode,
        });
        this.robloxUIType = params.robloxUIType;
    }
}

export class SelectedFrameMap extends SelectedNodeMap {
    constructor(params: {
        id: string,
        name: string,
        type?: ValidSceneNodeTypes,
        parent: (BaseNode & ChildrenMixin) | null,
        children?: SelectedNodeMap[],
        backgroundColor3?: readonly Paint[],
        backgroundTransparency?: number,
        clipDescendants?: boolean,
        rotation?: number,
        size?: Size,
        visible?: boolean,
        affiliatedNode?: SceneNode,
    }) {
        super({
            id: params.id,
            name: params.name,
            type: params.type,
            parent: params.parent,
            children: params.children,
            backgroundColor3: params.backgroundColor3,
            backgroundTransparency: params.backgroundTransparency,
            clipDescendants: params.clipDescendants,
            rotation: params.rotation,
            size: params.size,
            visible: params.visible,
            affiliatedNode: params.affiliatedNode,
        });
    }
}

export class SelectedRectangleMap extends SelectedNodeMap {
    constructor(params: {
        id: string,
        name: string,
        type?: ValidSceneNodeTypes,
        parent: (BaseNode & ChildrenMixin) | null,
        children?: SelectedNodeMap[],
        backgroundColor3?: readonly Paint[],
        backgroundTransparency?: number,
        clipDescendants?: boolean,
        rotation?: number,
        size?: Size,
        visible?: boolean,
        affiliatedNode?: SceneNode,
    }) {
        super({
            id: params.id,
            name: params.name,
            type: params.type,
            parent: params.parent,
            children: params.children,
            backgroundColor3: params.backgroundColor3,
            backgroundTransparency: params.backgroundTransparency,
            clipDescendants: params.clipDescendants,
            rotation: params.rotation,
            size: params.size,
            visible: params.visible,
            affiliatedNode: params.affiliatedNode,
        });
    }
}

export class SelectedEllipseMap extends SelectedNodeMap {
    constructor(params: {
        id: string,
        name: string,
        type?: ValidSceneNodeTypes,
        parent: (BaseNode & ChildrenMixin) | null,
        children?: SelectedNodeMap[],
        backgroundColor3?: readonly Paint[],
        backgroundTransparency?: number,
        clipDescendants?: boolean,
        rotation?: number,
        size?: Size,
        visible?: boolean,
        affiliatedNode?: SceneNode,
    }) {
        super({
            id: params.id,
            name: params.name,
            type: params.type,
            parent: params.parent,
            children: params.children,
            backgroundColor3: params.backgroundColor3,
            backgroundTransparency: params.backgroundTransparency,
            clipDescendants: params.clipDescendants,
            rotation: params.rotation,
            size: params.size,
            visible: params.visible,
            affiliatedNode: params.affiliatedNode,
        });
    }
}

export class SelectedGroupMap extends SelectedNodeMap {
    constructor(params: {
        id: string,
        name: string,
        type?: ValidSceneNodeTypes,
        parent: (BaseNode & ChildrenMixin) | null,
        children?: SelectedNodeMap[],
        backgroundColor3?: readonly Paint[],
        backgroundTransparency?: number,
        clipDescendants?: boolean,
        rotation?: number,
        size?: Size,
        visible?: boolean,
        affiliatedNode?: SceneNode,
    }) {
        super({
            id: params.id,
            name: params.name,
            type: params.type,
            parent: params.parent,
            children: params.children,
            backgroundColor3: params.backgroundColor3,
            backgroundTransparency: params.backgroundTransparency,
            clipDescendants: params.clipDescendants,
            rotation: params.rotation,
            size: params.size,
            visible: params.visible,
            affiliatedNode: params.affiliatedNode,
        });
    }
}

export class SelectedTextMap extends SelectedNodeMap {
    robloxType?: string;
    autoResize: TextAutoResize;
    horizontal: ConstraintType;
    vertical: ConstraintType;
    text: string;
    fontSize: number;
    fontWeight: number;
    family: string;
    style: string;
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
        id: string,
        name: string,
        type?: ValidSceneNodeTypes,
        parent: (BaseNode & ChildrenMixin) | null,
        children?: SelectedNodeMap[],
        backgroundColor3?: readonly Paint[],
        backgroundTransparency?: number,
        clipDescendants?: boolean,
        rotation?: number,
        size?: Size,
        visible?: boolean,
        //t
        robloxType?: string,
        autoResize: TextAutoResize,
        horizontal: ConstraintType,
        vertical: ConstraintType,
        text: string,
        fontSize: number,
        fontWeight: number,
        family: string,
        style: string,
        truncation: TextTruncation,
        maxLines: number | null,
        paragraphIndent: number,
        paragraphSpacing: number,
        listSpacing: number,
        hangingPunctuation: boolean,
        hangingList: boolean,
        case: TextCase,
        decoration: TextDecoration,
        letterSpacing: LetterSpacing,
        lineHeight: LineHeight,
        affiliatedNode: SceneNode,
    }) {
        super({
            id: params.id,
            name: params.name,
            type: params.type,
            parent: params.parent,
            children: params.children,
            backgroundColor3: params.backgroundColor3,
            backgroundTransparency: params.backgroundTransparency,
            clipDescendants: params.clipDescendants,
            rotation: params.rotation,
            size: params.size,
            visible: params.visible,
            affiliatedNode: params.affiliatedNode,
        });
        this.robloxType = params.robloxType;
        //
        this.autoResize = params.autoResize;
        this.horizontal = params.horizontal;
        this.vertical = params.vertical;
        this.text = params.text;
        this.fontSize = params.fontSize;
        this.fontWeight = params.fontWeight;
        this.family = params.family;
        this.style = params.style;
        this.truncation = params.truncation;
        this.maxLines = params.maxLines;
        this.paragraphIndent = params.paragraphIndent;
        this.paragraphSpacing = params.paragraphSpacing;
        this.listSpacing = params.listSpacing;
        this.hangingPunctuation = params.hangingPunctuation;
        this.hangingList = params.hangingList;
        this.case = params.case;
        this.decoration = params.decoration;
        this.letterSpacing = params.letterSpacing;
        this.lineHeight = params.lineHeight;
    }
}

export const robloxUITypesAsList: string[] = [
    "FRAME",
    "SCROLLINGFRAME",
    "VIDEOFRAME",
    "VIEWPORTFRAME",
    "IMAGELABEL",
    "IMAGEBUTTON",
    "TEXTLABEL",
    "TEXTBUTTON",
    "TEXTBOX",
];

function checkValidRobloxType(value: string | boolean): boolean {
    if (typeof value === "string") {
        for (const robloxUIType of robloxUITypesAsList) {
            if (robloxUIType === value) {
                return true;
            }
        }
    }
    return false;
}

function selectedMap(node: SceneNode): SelectedComponentMap | undefined {
    switch (node.type) {
        case 'FRAME':
            return new SelectedFrameMap({
                id: node.id,
                name: node.name,
                type: "FRAME",
                parent: node.parent,
                backgroundColor3: node.fills as readonly Paint[],
                backgroundTransparency: node.opacity,
                clipDescendants: node.clipsContent,
                rotation: node.rotation,
                size: {
                    width: node.width,
                    height: node.height,
                },
                visible: node.visible,
                affiliatedNode: node as FrameNode,
            });
        case 'GROUP':
            return new SelectedGroupMap({
                id: node.id,
                name: node.name,
                type: "GROUP",
                parent: node.parent,
                backgroundTransparency: node.opacity,
                rotation: node.rotation,
                size: {
                    width: node.width,
                    height: node.height,
                },
                visible: node.visible,
                affiliatedNode: node as GroupNode,
            });
        case 'COMPONENT':
            const componentNode = node as ComponentNode;
            const definitions: ComponentPropertyDefinitions = componentNode.componentPropertyDefinitions;
            const robloxType = definitions["ROBLOX_UI_TYPE"];
            assert(robloxType.type === "TEXT");
            assert(checkValidRobloxType(robloxType.defaultValue));
            assert(componentNode.children.length === 1)
            const mainInstance: SceneNode = componentNode.children[0];
            switch (robloxType.defaultValue) {
                case "VIEWPORTFRAME":
                    return new SelectedComponentMap({
                        id: node.id,
                        name: node.name,
                        type: "COMPONENT",
                        parent: node.parent,
                        backgroundColor3: node.fills as readonly Paint[],
                        backgroundTransparency: node.opacity,
                        clipDescendants: node.clipsContent,
                        rotation: node.rotation,
                        size: {
                            width: node.width,
                            height: node.height,
                        },
                        visible: node.visible,
                        //
                        robloxUIType: "VIEWPORTFRAME",
                        affiliatedNode: mainInstance as RectangleNode,
                    });
                case "IMAGEBUTTON":
                    return new SelectedComponentMap({
                        id: node.id,
                        name: node.name,
                        type: "COMPONENT",
                        parent: node.parent,
                        backgroundColor3: node.fills as readonly Paint[],
                        backgroundTransparency: node.opacity,
                        clipDescendants: node.clipsContent,
                        rotation: node.rotation,
                        size: {
                            width: node.width,
                            height: node.height,
                        },
                        visible: node.visible,
                        //
                        robloxUIType: "IMAGEBUTTON",
                        affiliatedNode: mainInstance as RectangleNode,
                    });
                case "TEXTBUTTON":
                    return new SelectedComponentMap({
                        id: node.id,
                        name: node.name,
                        type: "COMPONENT",
                        parent: node.parent,
                        backgroundColor3: node.fills as readonly Paint[],
                        backgroundTransparency: node.opacity,
                        clipDescendants: node.clipsContent,
                        rotation: node.rotation,
                        size: {
                            width: node.width,
                            height: node.height,
                        },
                        visible: node.visible,
                        //
                        robloxUIType: "TEXTBUTTON",
                        affiliatedNode: mainInstance as TextNode,
                    });
                case "TEXTBOX":
                    return new SelectedComponentMap({
                        id: node.id,
                        name: node.name,
                        type: "COMPONENT",
                        parent: node.parent,
                        backgroundColor3: node.fills as readonly Paint[],
                        backgroundTransparency: node.opacity,
                        clipDescendants: node.clipsContent,
                        rotation: node.rotation,
                        size: {
                            width: node.width,
                            height: node.height,
                        },
                        visible: node.visible,
                        //
                        robloxUIType: "TEXTBOX",
                        affiliatedNode: mainInstance as TextNode,
                    });
                default:
                    throw new Error();
            }
        case 'RECTANGLE':
            return new SelectedRectangleMap({
                id: node.id,
                name: node.name,
                type: "RECTANGLE",
                parent: node.parent,
                backgroundColor3: node.fills as readonly Paint[],
                backgroundTransparency: node.opacity,
                rotation: node.rotation,
                size: {
                    width: node.width,
                    height: node.height,
                },
                visible: node.visible,
                affiliatedNode: node as RectangleNode
            });
        case 'ELLIPSE':
            return new SelectedEllipseMap({
                id: node.id,
                name: node.name,
                type: "ELLIPSE",
                parent: node.parent,
                backgroundColor3: node.fills as readonly Paint[],
                backgroundTransparency: node.opacity,
                rotation: node.rotation,
                size: {
                    width: node.width,
                    height: node.height,
                },
                visible: node.visible,
                affiliatedNode: node as EllipseNode
            });
        case 'TEXT':
            return new SelectedTextMap({
                id: node.id,
                name: node.name,
                type: "TEXT",
                parent: node.parent,
                backgroundColor3: node.fills as readonly Paint[],
                backgroundTransparency: node.opacity,
                rotation: node.rotation,
                size: {
                    width: node.width,
                    height: node.height,
                },
                visible: node.visible,
                affiliatedNode: node as TextNode,
                robloxType: 'TEXTLABEL',
                autoResize: node.textAutoResize,
                horizontal: node.constraints.horizontal,
                vertical: node.constraints.vertical,
                text: node.characters,
                fontSize: node.fontSize as number,
                fontWeight: node.fontWeight as number,
                family: (node.fontName as FontName).family,
                style: (node.fontName as FontName).style,
                truncation: node.textTruncation,
                maxLines: node.maxLines,
                paragraphIndent: node.paragraphIndent,
                paragraphSpacing: node. paragraphSpacing,
                listSpacing: node.listSpacing,
                hangingPunctuation: node.hangingPunctuation,
                hangingList: node.hangingList,
                case: node.textCase as TextCase,
                decoration: node.textDecoration as TextDecoration,
                letterSpacing: node.letterSpacing as LetterSpacing,
                lineHeight: node.lineHeight as LineHeight,
            });
        default:
            return undefined;
    }
}

export function selectedNodes(): SelectedNodeMap[] {
    const selectedNodes = figma.currentPage.selection;
    if (selectedNodes.length === 0) {
      throw new Error();
    }
    function mapNodeStructure(node: SceneNode): SelectedNodeMap {
      const nodeMap: SelectedNodeMap | undefined = selectedMap(node);
      if (typeof nodeMap !== "undefined") {
        if ("children" in node) {
            nodeMap.children = node.children.map(child => {
                return mapNodeStructure(child)
            });
          }
      }
      return nodeMap ?? new SelectedNodeMap({
        id: node.id,
        name: node.name,
        parent: node.parent,
        size: {
            width: node.width,
            height: node.height,
        },
        visible: node.visible,
      });
    }
    return selectedNodes.map(mapNodeStructure);
  }

interface ProcessCallback<T> { (item: T): void };

function processNodes(node: SelectedNodeMap, callback?: ProcessCallback<SelectedNodeMap>): void {
  if (typeof callback !== "undefined") {
    callback!(node);
  }
  if (node.children && Array.isArray(node.children)) {
    node.children.forEach(child => processNodes(child, callback));
  }
}

export function processNestedNodes(callback?: ProcessCallback<SelectedNodeMap>): void {
    const nestedStructure = selectedNodes();
    nestedStructure.forEach(node => {
        processNodes(node, callback);
    });
}

export declare type ProcessableNodes = 
    | FrameNode
    | RectangleNode
    | EllipseNode
    | GroupNode
    | ComponentNode
    | TextNode;
