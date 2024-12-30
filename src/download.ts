import { 
    assert
 } from "console";

import { 
    ConvertRunType 
} from "./convert";

import { 
    DownloadError 
} from "./errors";

import { 
    Camera, 
    Frame, 
    ImageButton, 
    ImageLabel, 
    Instance, 
    LocalizationTable, 
    RobloxUI, 
    ScreenGui, 
    ScrollingFrame, 
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
    ViewportFrame 
} from "./lua";

import * as fs from "fs";

import { 
    dialog 
} from "electron";

import { 
    StringBuffer, 
    toCamelCase 
} from "./structure";

class FileParser {
    private codeContentBuffer: StringBuffer = new StringBuffer();

    name: string;
    extension: string;

    constructor(params: {
        starterContent?: string,
        name: string,
        extension: string,
    }) {
        this.codeContentBuffer.write(params.starterContent ?? '');
        this.name = params.name;
        this.extension = params.extension;
    }

    get content() : string {
        return this.codeContentBuffer.toString();
    }

    get fileName(): string {
        return this.name + "." + this.extension;
    }

    parse(contentToAdd: string): void {
        this.codeContentBuffer.writeLn(contentToAdd);
    }

    async save(): Promise<void> {
        const storage = figma.clientStorage;
        await storage.setAsync(this.fileName, this.content);
    }
}

export class LuaFile extends FileParser {
    static luaFileCounter: number = 0;

    constructor(params: {
        starterContent?: string;
        name: string;
    }) {
        super({
            starterContent: params.starterContent,
            name: params.name,
            extension: "lua",
        });
        LuaFile.luaFileCounter++;
    }
}

export function toRBXMX(content: string = ""): string {
    return RBMXMFile.rbxmxHeader + RBMXMFile.rbxmxMetadata + content + RBMXMFile.rbxmxFooter
}

export class RBMXMFile extends FileParser {
    static rbxmxHeader: string = `<roblox 
        xmlns:xmime="http://www.w3.org/2005/05/xmlmime" 
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
        xsi:noNamespaceSchemaLocation="http://www.roblox.com/roblox.xsd" 
        version="4"
    >`.trim();

    static rbxmxMetadata: string = `
        <Meta name="ExplicitAutoJoints">true</Meta>
        <External>null</External>
        <External>nil</External>
    `.trim();

    static rbxmxFooter: string = `</roblox>`;

    static rbmxmCounter: number = 0;

    constructor(params: {
        starterContent?: string;
        name: string;
    }) {
        super({
            starterContent: params.starterContent,
            name: params.name,
            extension: "rbmxm",
        });
        RBMXMFile.rbmxmCounter++;
    }

    static instanceRBXMX(guiObject: Instance): string {
        switch (guiObject.className) {
            case "LocalizationTable":
                const localizationTableObject = guiObject as LocalizationTable;
                return `
                    <Item class="LocalizationTable">
                        <Properties>
                            <BinaryString name="AttributesSerialize"></BinaryString>
                            <SecurityCapabilities name="Capabilities">0</SecurityCapabilities>
                            <bool name="DefinesCapabilities">false</bool>
                            <int64 name="SourceAssetId">-1</int64>
                            <BinaryString name="Tags"></BinaryString>
                            
                            <string name="Contents">[]</string>
                            <string name="Name">${localizationTableObject.name}</string>
                            
                            <string name="SourceLocaleId">${localizationTableObject.sourceLocaleId}</string>
                        </Properties>
                    </Item>
                `.trim();
            case "Camera":
                const cameraObject = guiObject as Camera;
                return `
                    <Item class="Camera">
                        <Properties>
                            <BinaryString name="AttributesSerialize"></BinaryString>
                            <SecurityCapabilities name="Capabilities">0</SecurityCapabilities>
                            <bool name="DefinesCapabilities">false</bool>
                            <int64 name="SourceAssetId">-1</int64>
                            <BinaryString name="Tags"></BinaryString>
                        
                            <string name="Name">${cameraObject.name}</string>
                            
                            <Ref name="CameraSubject">${cameraObject.cameraSubject ?? "null"}</Ref>
                            <token>${cameraObject.cameraType}</token>
                            <float name="FieldOfView">${cameraObject.fieldOfView}</float>
                            <token name="FieldOfViewMode">${cameraObject.fieldOfViewMode}</token>
                            ${cameraObject.focus.toRBXMXCode("Focus")}
                            <bool name="HeadLocked">${cameraObject.headLocked}</bool>
			                <float name="HeadScale">${cameraObject.headScale}/float>
                            <bool name="VRTiltAndRollEnabled">${cameraObject.vrTiltAndRollEnabled}</bool>
                        </Properties>
                    </Item>
                `.trim();
            case "ScreenGui":
                const screenGuiObject = guiObject as ScreenGui;
                return `
                    <Item class="ScreenGui">
                        <Properties>
                            <BinaryString name="AttributesSerialize"></BinaryString>
                            <SecurityCapabilities name="Capabilities">0</SecurityCapabilities>
                            <bool name="DefinesCapabilities">false</bool>
                            <int64 name="SourceAssetId">-1</int64>
                            <BinaryString name="Tags"></BinaryString>
                            
                            <string name="Name">${screenGuiObject.name}</string>
                        
                            <bool name="AutoLocalize">${screenGuiObject.autoLocalize}}{</bool>   
                            <bool name="ClipToDeviceSafeArea">${screenGuiObject.clipToDeviceSafeArea}</bool>
                            <int name="DisplayOrder">${screenGuiObject.displayOrder}</int>
                            <bool name="Enabled">${screenGuiObject.enabled}</bool>
                            <bool name="ResetOnSpawn">${screenGuiObject.resetOnSpawn}</bool>
                            <Ref name="RootLocalizationTable">
                                ${screenGuiObject.rootLocalizationTable?.toRBXMXCode() ?? "null"}
                            </Ref>
                            <token name="SafeAreaCompatibility">${screenGuiObject.safeAreaCompatibility}</token>
                            <token name="ScreenInsets">${screenGuiObject.screenInsets}</token>
                            <token name="SelectionBehaviorDown">${screenGuiObject.selectionBehaviorDown}</token>
                            <token name="SelectionBehaviorLeft">${screenGuiObject.selectionBehaviorLeft}</token>
                            <token name="SelectionBehaviorRight">${screenGuiObject.selectionBehaviorRight}</token>
                            <token name="SelectionBehaviorUp">${screenGuiObject.selectionBehaviorUp}</token>
                            <bool name="SelectionGroup">${screenGuiObject.selectionGroup}</bool>
                            <token name="ZIndexBehavior">${screenGuiObject.zIndexBehavior}</token>
                        </Properties>
                    </Item>
                `.trim();
            //
            case "UIAspectRatioConstraint":
                const uiAspectRatioConstraint = guiObject as UIAspectRatioConstraint;
                return `
                    <Item class="UIAspectRatioConstraint">
                        <Properties>
                            <BinaryString name="AttributesSerialize"></BinaryString>
                            <SecurityCapabilities name="Capabilities">0</SecurityCapabilities>
                            <bool name="DefinesCapabilities">false</bool>
                            <int64 name="SourceAssetId">-1</int64>
                            <BinaryString name="Tags"></BinaryString>

                            <string name="Name">${uiAspectRatioConstraint.name}</string>
                            
                            <float name="AspectRatio">${uiAspectRatioConstraint.aspectRatio}</float>
			                <token name="AspectType">${uiAspectRatioConstraint.aspectType}</token>
                            <token name="DominantAxis">${uiAspectRatioConstraint.dominantAxis}</token>
                        </Properties>
                    </Item>
                `.trim();
            case "UICorner":
                const uiCornerObject = guiObject as UICorner;
                return `
                    <Item class="UICorner">
                        <Properties>
                            <BinaryString name="AttributesSerialize"></BinaryString>
                            <SecurityCapabilities name="Capabilities">0</SecurityCapabilities>
                            <bool name="DefinesCapabilities">false</bool>
                            <int64 name="SourceAssetId">-1</int64>
                            <BinaryString name="Tags"></BinaryString>

                            <string name="Name">${uiCornerObject.name}</string>
                            
                            ${uiCornerObject.cornerRadius.toRBXMXCode("CornerRadius")}
                        </Properties>
                    </Item>
                `.trim();
            case "UIFlexItem":
                const uiFlexItemObject = guiObject as UIFlexItem;
                return `
                    <Item class="UIFlexItem">
                        <Properties>
                            <BinaryString name="AttributesSerialize"></BinaryString>
                            <SecurityCapabilities name="Capabilities">0</SecurityCapabilities>
                            <bool name="DefinesCapabilities">false</bool>
                            <int64 name="SourceAssetId">-1</int64>
                            <BinaryString name="Tags"></BinaryString>

                            <string name="Name">${uiFlexItemObject.name}</string>
                            
                            <token name="FlexMode">${uiFlexItemObject.flexMode}</token>
                            <float name="GrowRatio">${uiFlexItemObject.growRatio}</float>
                            <token name="ItemLineAlignment">${uiFlexItemObject.itemLineAlignment}/token>
                            <float name="ShrinkRatio">${uiFlexItemObject.shrinkRatio}</float>
                        </Properties>
                    </Item>
                `.trim();
            case "UIGradient":
                const uiGradientObject = guiObject as UIGradient;
                return `
                    <Item class="UIGradient">
                        <Properties>
                            <BinaryString name="AttributesSerialize"></BinaryString>
                            <SecurityCapabilities name="Capabilities">0</SecurityCapabilities>
                            <bool name="DefinesCapabilities">false</bool>
                            <int64 name="SourceAssetId">-1</int64>
                            <BinaryString name="Tags"></BinaryString>

                            <string name="Name">${uiGradientObject.name}</string>
                            
                            <bool name="Enabled">${uiGradientObject.enabled}</bool>
                            ${uiGradientObject.offset.toRBXMXCode("UIGradient")}
                            <float name="Rotation">${uiGradientObject.rotation}</float>
                            ${uiGradientObject.transparency.toRBXMXCode("Transparency")}
                        </Properties>
                    </Item>
                `.trim();
            case "UIGridLayout":
                const uiGridLayoutObject = guiObject as UIGridLayout;
                return `
                    <Item class="UIGridLayout">
                        <Properties>
                            <BinaryString name="AttributesSerialize"></BinaryString>
                            <SecurityCapabilities name="Capabilities">0</SecurityCapabilities>
                            <bool name="DefinesCapabilities">false</bool>
                            <int64 name="SourceAssetId">-1</int64>
                            <BinaryString name="Tags"></BinaryString>

                            <string name="Name">${uiGridLayoutObject.name}</string>
                            
                            ${uiGridLayoutObject.cellPadding.toRBXMXCode("CellPadding")}
                            ${uiGridLayoutObject.cellSize.toRBXMXCode("CellSize")}
                            <token name="FillDirection">${uiGridLayoutObject.fillDirection}>/token>
                            <int name="FillDirectionMaxCells">${uiGridLayoutObject.fillDirectionMaxCells}</int>
                            <token name="HorizontalAlignment">${uiGridLayoutObject.horizontalAlignment}</token>
                            <token name="SortOrder">${uiGridLayoutObject.sortOrder}</token>
                            <token name="StartCorner">${uiGridLayoutObject.startCorner}</token>
                            <token name="VerticalAlignment">${uiGridLayoutObject.verticalAlignment}</token>
                        </Properties>
                    </Item>
                `.trim();
            case "UIListLayout":
                const uiListLayoutObject = guiObject as UIListLayout;
                return `
                    <Item class="UIListLayout">
                        <Properties>
                            <BinaryString name="AttributesSerialize"></BinaryString>
                            <SecurityCapabilities name="Capabilities">0</SecurityCapabilities>
                            <bool name="DefinesCapabilities">false</bool>
                            <int64 name="SourceAssetId">-1</int64>
                            <BinaryString name="Tags"></BinaryString>

                            <string name="Name">${uiListLayoutObject.name}</string>
                            
                            <token name="FillDirection">${uiListLayoutObject.fillDirection}</token>
                            <token name="HorizontalAlignment">${uiListLayoutObject.horizontalAlignment}</token>
                            <token name="HorizontalFlex">${uiListLayoutObject.horizontalFlex}</token>
                            <token name="ItemLineAlignment">${uiListLayoutObject.itemLineAlignment}</token>
                            ${uiListLayoutObject.padding.toRBXMXCode("Padding")}
                            <token name="SortOrder">${uiListLayoutObject.sortOrder}</token>
                            <token name="VerticalAlignment">${uiListLayoutObject.verticalAlignment}</token>
                            <token name="VerticalFlex">${uiListLayoutObject.verticalFlex}</token>
                            <bool name="Wraps">${uiListLayoutObject.wraps}</bool>
                        </Properties>
                    </Item>
                `.trim();
            case "UIPadding":
                const uiPaddingObject = guiObject as UIPadding;
                return `
                    <Item class="UIPadding">
                        <Properties>
                            <BinaryString name="AttributesSerialize"></BinaryString>
                            <SecurityCapabilities name="Capabilities">0</SecurityCapabilities>
                            <bool name="DefinesCapabilities">false</bool>
                            <int64 name="SourceAssetId">-1</int64>
                            <BinaryString name="Tags"></BinaryString>

                            <string name="Name">${uiPaddingObject.name}</string>
                            
                            ${uiPaddingObject.paddingBottom.toRBXMXCode("PaddingBottom")}
                            ${uiPaddingObject.paddingLeft.toRBXMXCode("PaddingLeft")}
                            ${uiPaddingObject.paddingRight.toRBXMXCode("PaddingRight")}
                            ${uiPaddingObject.paddingTop.toRBXMXCode("PaddingTop")}
                        </Properties>
                    </Item>
                `.trim();
            case "UIPageLayout":
                const uiPageLayoutObject = guiObject as UIPageLayout;
                return `
                    <Item class="UIPageLayout">
                        <Properties>
                            <BinaryString name="AttributesSerialize"></BinaryString>
                            <SecurityCapabilities name="Capabilities">0</SecurityCapabilities>
                            <bool name="DefinesCapabilities">false</bool>
                            <int64 name="SourceAssetId">-1</int64>
                            <BinaryString name="Tags"></BinaryString>

                            <string name="Name">${uiPageLayoutObject.name}</string>
                            
                            <bool name="Animated">${uiPageLayoutObject.animated}</bool>
                            <bool name="Circular">${uiPageLayoutObject.circular}</bool>
                            <token name="EasingDirection">${uiPageLayoutObject.easingDirection}</token>
                            <token name="EasingStyle">${uiPageLayoutObject.easingStyle}</token>
                            <token name="FillDirection">${uiPageLayoutObject.fillDirection}</token>
                            <bool name="GamepadInputEnabled">${uiPageLayoutObject.gamepadInputEnabled}</bool>
                            <token name="HorizontalAlignment">${uiPageLayoutObject.horizontalAlignment}</token>
                            ${uiPageLayoutObject.padding.toRBXMXCode("Padding")}
                            <bool name="ScrollWheelInputEnabled">${uiPageLayoutObject.scrollWheelInputEnabled}</bool>
                            <token name="SortOrder">${uiPageLayoutObject.sortOrder}</token>
                            <bool name="TouchInputEnabled">${uiPageLayoutObject.touchInputEnabled}</bool>
			                <float name="TweenTime">${uiPageLayoutObject.tweenTime}</float>
                            <token name="VerticalAlignment">${uiPageLayoutObject.verticalAlignment}</token>
                        </Properties>
                    </Item>
                `.trim();
            case "UIScale":
                const uiScaleObject = guiObject as UIScale;
                return `
                    <Item class="UIScale">
                        <Properties>
                            <BinaryString name="AttributesSerialize"></BinaryString>
                            <SecurityCapabilities name="Capabilities">0</SecurityCapabilities>
                            <bool name="DefinesCapabilities">false</bool>
                            <int64 name="SourceAssetId">-1</int64>
                            <BinaryString name="Tags"></BinaryString>

                            <string name="Name">${uiScaleObject.name}</string>
                            
                            <float name="Scale">${uiScaleObject.scale}</float>
                        </Properties>
                    </Item>
                `.trim();
            case "UISizeConstraint":
                const uiSizeConstraintObject = guiObject as UISizeConstraint;
                return `
                    <Item class="UISizeConstraint">
                        <Properties>
                            <BinaryString name="AttributesSerialize"></BinaryString>
                            <SecurityCapabilities name="Capabilities">0</SecurityCapabilities>
                            <bool name="DefinesCapabilities">false</bool>
                            <int64 name="SourceAssetId">-1</int64>
                            <BinaryString name="Tags"></BinaryString>

                            <string name="Name">${uiSizeConstraintObject.name}</string>
                            
                            ${uiSizeConstraintObject.minSize.toRBXMXCode("MinSize")}
                            ${uiSizeConstraintObject.maxSize.toRBXMXCode("MaxSize")}
                        </Properties>
                    </Item>
                `.trim();
            case "UIStroke":
                const uiStrokeObject = guiObject as UIStroke;
                return `
                    <Item class="UIStroke">
                        <Properties>
                            <BinaryString name="AttributesSerialize"></BinaryString>
                            <SecurityCapabilities name="Capabilities">0</SecurityCapabilities>
                            <bool name="DefinesCapabilities">false</bool>
                            <int64 name="SourceAssetId">-1</int64>
                            <BinaryString name="Tags"></BinaryString>

                            <string name="Name">${uiStrokeObject.name}</string>
                            
                            <bool name="ApplyStrokeMode">${uiStrokeObject.applyStrokeMode}</bool>
                            ${uiStrokeObject.color.toRBXMXCode("Color")}
                            <bool name="Enabled">${uiStrokeObject.enabled}</bool>
                            <token name="LineJoinMode">${uiStrokeObject.lineJoinMode}</token>
                            <float name="Thickness">${uiStrokeObject.thickness}</float>
			                <float name="Transparency">${uiStrokeObject.transparency}</float>
                        </Properties>
                    </Item>
                `.trim();
            case "UITableLayout":
                const uiTableLayoutObject = guiObject as UITableLayout;
                return `
                    <Item class="UITableLayout">
                        <Properties>
                            <BinaryString name="AttributesSerialize"></BinaryString>
                            <SecurityCapabilities name="Capabilities">0</SecurityCapabilities>
                            <bool name="DefinesCapabilities">false</bool>
                            <int64 name="SourceAssetId">-1</int64>
                            <BinaryString name="Tags"></BinaryString>

                            <string name="Name">${uiTableLayoutObject.name}</string>
                            
                            <token name="FillDirection">${uiTableLayoutObject.fillDirection}</token>
                            <bool name="FillEmptySpaceColumns">${uiTableLayoutObject.fillEmptySpaceColumns}</bool>
                            <bool name="FillEmptySpaceRows">${uiTableLayoutObject.fillEmptySpaceRows}</bool>
                            <token name="HorizontalAlignment">${uiTableLayoutObject.horizontalAlignment}</token>
                            <token name="MajorAxis">${uiTableLayoutObject.majorAxis}</token>
                            <token name="SortOrder">${uiTableLayoutObject.sortOrder}</token>
                            <token name="VerticalAlignment">${uiTableLayoutObject.verticalAlignment}</token>
                        </Properties>
                    </Item>
                `.trim();
            case "UITextSizeConstraint":
                const uiTextSizeConstraintObject = guiObject as UITextSizeConstraint;
                return `
                    <Item class="UITextSizeConstraint">
                        <Properties>
                            <BinaryString name="AttributesSerialize"></BinaryString>
                            <SecurityCapabilities name="Capabilities">0</SecurityCapabilities>
                            <bool name="DefinesCapabilities">false</bool>
                            <int64 name="SourceAssetId">-1</int64>
                            <BinaryString name="Tags"></BinaryString>

                            <string name="Name">${uiTextSizeConstraintObject.name}</string>
                            
                            <int name="MaxTextSize">${uiTextSizeConstraintObject.maxTextSize}</int>
			                <int name="MinTextSize">${uiTextSizeConstraintObject.minTextSize}</int>
                        </Properties>
                    </Item>
                `.trim();
            //    
            case "Frame":
                const frameObject = guiObject as Frame;
                return `
                    <Item class="Frame">
                        <Properties>
                            <BinaryString name="AttributesSerialize"></BinaryString>
                            <SecurityCapabilities name="Capabilities">0</SecurityCapabilities>
                            <bool name="DefinesCapabilities">false</bool>
                            <int64 name="SourceAssetId">-1</int64>
                            <BinaryString name="Tags"></BinaryString>

                            <string name="Name">${frameObject.name}</string>
                            
                            <bool name="Active">${frameObject.active}</bool>
                            ${frameObject.anchorPoint.toRBXMXCode("AnchorPoint")}
                            <bool name="AutoLocalize">${frameObject.autoLocalize}</bool>
                            <token name="AutomaticSize">${frameObject.automaticSize}</token>
                            ${frameObject.backgroundColor3.toRBXMXCode("BackgroundColor3")}
                            <float name="BackgroundTransparency">${frameObject.backgroundTransparency}</float>
                            ${frameObject.borderColor3.toRBXMXCode("BorderColor3")}
                            <token name="BorderMode">${frameObject.borderMode}</token>
                            <float name="BorderSizePixel">${frameObject.borderSizePixel}</float>
                            <bool name="ClipsDescendants">${frameObject.clipDescendants}</bool>
                            <bool name="Draggable">false</bool>
                            <bool name="Interactable">${frameObject.interactable}</bool>
                            <int name="LayoutOrder">${frameObject.layoutOrder}</int>
                            <Ref name="NextSelectionDown">${frameObject.nextSelectionDown ?? "null"}</Ref>
                            <Ref name="NextSelectionLeft">${frameObject.nextSelectionLeft ?? "null"}</Ref>
                            <Ref name="NextSelectionRight">${frameObject.nextSelectionRight ?? "null"}</Ref>
                            <Ref name="NextSelectionUp">${frameObject.nextSelectionUp ?? "null"}</Ref>
                            ${frameObject.position.toRBXMXCode("Position")}
                            <Ref name="RootLocalizationTable">${frameObject.rootLocalizationTable?.toRBXMXCode() ?? "null"}</Ref>
                            <float name="Rotation">${frameObject.rotation}</float>
                            <bool name="Selectable">${frameObject.selectable}</bool>
                            <token name="SelectionBehaviorDown">${frameObject.selectionBehaviorDown}</token>
                            <token name="SelectionBehaviorLeft">${frameObject.selectionBehaviorLeft}</token>
                            <token name="SelectionBehaviorRight">${frameObject.selectionBehaviorRight}</token>
                            <token name="SelectionBehaviorUp">${frameObject.selectionBehaviorUp}</token>
                            <bool name="SelectionGroup">${frameObject.selectionGroup}</bool>
                            <Ref name="SelectionImageObject">${frameObject.selectionImageObject?.toRBXMXCode("SelectionImageObject") ?? "null"}</Ref>
                            <int name="SelectionOrder">${frameObject.selectionOrder}</int>
                            ${frameObject.size.toRBXMXCode("Size")}
                            <token name="SizeConstraint">${frameObject.sizeConstraint}</token>
                            <token name="Style">${frameObject.style}</token>
                            <bool name="Visible">${frameObject.visible}</bool>
			                <int name="ZIndex">${frameObject.zIndex}</int>
                        </Properties>
                    </Item>
                `.trim();
            case "ScrollingFrame":
                const scrollingFrameObject = guiObject as ScrollingFrame;
                return `
                    <Item class="ScrollingFrame">
                        <Properties>
                            <BinaryString name="AttributesSerialize"></BinaryString>
                            <SecurityCapabilities name="Capabilities">0</SecurityCapabilities>
                            <bool name="DefinesCapabilities">false</bool>
                            <int64 name="SourceAssetId">-1</int64>
                            <BinaryString name="Tags"></BinaryString>

                            <string name="Name">${scrollingFrameObject.name}</string>
                            
                            <bool name="Active">${scrollingFrameObject.active}</bool>
                            ${scrollingFrameObject.anchorPoint.toRBXMXCode("AnchorPoint")}
                            <bool name="AutoLocalize">${scrollingFrameObject.autoLocalize}</bool>
                            <token name="AutomaticSize">${scrollingFrameObject.automaticSize}</token>
                            ${scrollingFrameObject.backgroundColor3.toRBXMXCode("BackgroundColor3")}
                            <float name="BackgroundTransparency">${scrollingFrameObject.backgroundTransparency}</float>
                            ${scrollingFrameObject.borderColor3.toRBXMXCode("BorderColor3")}
                            <token name="BorderMode">${scrollingFrameObject.borderMode}</token>
                            <float name="BorderSizePixel">${scrollingFrameObject.borderSizePixel}</float>
                            <bool name="ClipsDescendants">${scrollingFrameObject.clipDescendants}</bool>
                            <bool name="Draggable">false</bool>
                            <bool name="Interactable">${scrollingFrameObject.interactable}</bool>
                            <int name="LayoutOrder">${scrollingFrameObject.layoutOrder}</int>
                            <Ref name="NextSelectionDown">${scrollingFrameObject.nextSelectionDown ?? "null"}</Ref>
                            <Ref name="NextSelectionLeft">${scrollingFrameObject.nextSelectionLeft ?? "null"}</Ref>
                            <Ref name="NextSelectionRight">${scrollingFrameObject.nextSelectionRight ?? "null"}</Ref>
                            <Ref name="NextSelectionUp">${scrollingFrameObject.nextSelectionUp ?? "null"}</Ref>
                            ${scrollingFrameObject.position.toRBXMXCode("Position")}
                            <Ref name="RootLocalizationTable">${scrollingFrameObject.rootLocalizationTable?.toRBXMXCode() ?? "null"}</Ref>
                            <float name="Rotation">${scrollingFrameObject.rotation}</float>
                            <bool name="Selectable">${scrollingFrameObject.selectable}</bool>
                            <token name="SelectionBehaviorDown">${scrollingFrameObject.selectionBehaviorDown}</token>
                            <token name="SelectionBehaviorLeft">${scrollingFrameObject.selectionBehaviorLeft}</token>
                            <token name="SelectionBehaviorRight">${scrollingFrameObject.selectionBehaviorRight}</token>
                            <token name="SelectionBehaviorUp">${scrollingFrameObject.selectionBehaviorUp}</token>
                            <bool name="SelectionGroup">${scrollingFrameObject.selectionGroup}</bool>
                            <Ref name="SelectionImageObject">${scrollingFrameObject.selectionImageObject?.toRBXMXCode("SelectionImageObject") ?? "null"}</Ref>
                            <int name="SelectionOrder">${scrollingFrameObject.selectionOrder}</int>
                            ${scrollingFrameObject.size.toRBXMXCode("Size")}
                            <token name="SizeConstraint">${scrollingFrameObject.sizeConstraint}</token>
                            <bool name="Visible">${scrollingFrameObject.visible}</bool>
			                <int name="ZIndex">${scrollingFrameObject.zIndex}</int>
                            
                            <token name="AutomaticCanvasSize">${scrollingFrameObject.automaticCanvasSize}</token>
                            <Content name="BottomImage"><url>${scrollingFrameObject.bottomImage}</url></Content>
                            <token name="CanvasSize">${scrollingFrameObject.canvasSize}</token> 
                            ${scrollingFrameObject.canvasPosition.toRBXMXCode("CanvasPosition")}
                            ${scrollingFrameObject.canvasSize.toRBXMXCode("CanvasSize")}
                            <token name="ElasticBehavior">${scrollingFrameObject.elasticBehavior}</token>
			                <token name="HorizontalScrollBarInset">${scrollingFrameObject.horizontalScrollBarInset}</token>
                            <Content name="MidImage"><url>${scrollingFrameObject.midImage}</Content>
                            <float name="ScrollBarImageTransparency">${scrollingFrameObject.scrollBarImageTransparency}</float>
                            <int name="ScrollBarThickness">${scrollingFrameObject.scrollBarThickness}</int>
                            <token name="ScrollingDirection">${scrollingFrameObject.scrollingDirection}</token>
                            <bool name="ScrollingEnabled">${scrollingFrameObject.scrollingEnabled}</bool>
                            <token name="VerticalScrollBarInset">${scrollingFrameObject.verticalScrollBarInset}</token>
			                <token name="VerticalScrollBarPosition">${scrollingFrameObject.verticalScrollBarPosition}</token>
                        </Properties>
                    </Item>
                `.trim();
            case "VideoFrame":
                const videoFrameObject = guiObject as VideoFrame;
                return `
                    <Item class="VideoFrame">
                        <Properties>
                            <BinaryString name="AttributesSerialize"></BinaryString>
                            <SecurityCapabilities name="Capabilities">0</SecurityCapabilities>
                            <bool name="DefinesCapabilities">false</bool>
                            <int64 name="SourceAssetId">-1</int64>
                            <BinaryString name="Tags"></BinaryString>

                            <string name="Name">${guiObject.name}</string>

                            <bool name="Active">${videoFrameObject.active}</bool>
                            ${videoFrameObject.anchorPoint.toRBXMXCode("AnchorPoint")}
                            <bool name="AutoLocalize">${videoFrameObject.autoLocalize}</bool>
                            <token name="AutomaticSize">${videoFrameObject.automaticSize}</token>
                            ${videoFrameObject.backgroundColor3.toRBXMXCode("BackgroundColor3")}
                            <float name="BackgroundTransparency">${videoFrameObject.backgroundTransparency}</float>
                            ${videoFrameObject.borderColor3.toRBXMXCode("BorderColor3")}
                            <token name="BorderMode">${videoFrameObject.borderMode}</token>
                            <float name="BorderSizePixel">${videoFrameObject.borderSizePixel}</float>
                            <bool name="ClipsDescendants">${videoFrameObject.clipDescendants}</bool>
                            <bool name="Draggable">false</bool>
                            <bool name="Interactable">${videoFrameObject.interactable}</bool>
                            <int name="LayoutOrder">${videoFrameObject.layoutOrder}</int>
                            <Ref name="NextSelectionDown">${videoFrameObject.nextSelectionDown ?? "null"}</Ref>
                            <Ref name="NextSelectionLeft">${videoFrameObject.nextSelectionLeft ?? "null"}</Ref>
                            <Ref name="NextSelectionRight">${videoFrameObject.nextSelectionRight ?? "null"}</Ref>
                            <Ref name="NextSelectionUp">${videoFrameObject.nextSelectionUp ?? "null"}</Ref>
                            ${videoFrameObject.position.toRBXMXCode("Position")}
                            <Ref name="RootLocalizationTable">${videoFrameObject.rootLocalizationTable?.toRBXMXCode() ?? "null"}</Ref>
                            <float name="Rotation">${videoFrameObject.rotation}</float>
                            <bool name="Selectable">${videoFrameObject.selectable}</bool>
                            <token name="SelectionBehaviorDown">${videoFrameObject.selectionBehaviorDown}</token>
                            <token name="SelectionBehaviorLeft">${videoFrameObject.selectionBehaviorLeft}</token>
                            <token name="SelectionBehaviorRight">${videoFrameObject.selectionBehaviorRight}</token>
                            <token name="SelectionBehaviorUp">${videoFrameObject.selectionBehaviorUp}</token>
                            <bool name="SelectionGroup">${videoFrameObject.selectionGroup}</bool>
                            <Ref name="SelectionImageObject">${videoFrameObject.selectionImageObject?.toRBXMXCode("SelectionImageObject") ?? "null"}</Ref>
                            <int name="SelectionOrder">${videoFrameObject.selectionOrder}</int>
                            ${videoFrameObject.size.toRBXMXCode("Size")}
                            <token name="SizeConstraint">${videoFrameObject.sizeConstraint}</token>
                            <bool name="Visible">${videoFrameObject.visible}</bool>
			                <int name="ZIndex">${videoFrameObject.zIndex}</int>
                            
                            <bool name="Looped">${videoFrameObject.looped}</bool>
                            <bool name="Playing">${videoFrameObject.playing}</bool>
                            <double name="TimePosition">${videoFrameObject.timePosition}</double>
			                <Content name="Video">${videoFrameObject.video?.padStart(5, "<url>").padEnd(6, "</url>") ?? "<null></null>"}</Content>
                            <float name="Volume">${videoFrameObject.volume}</float>
                        </Properties>
                    </Item>
                `.trim();
            case "ViewportFrame":
                const viewportFrameObject = guiObject as ViewportFrame;
                return `
                    <Item class="ViewportFrame">
                        <Properties>
                            <BinaryString name="AttributesSerialize"></BinaryString>
                            <SecurityCapabilities name="Capabilities">0</SecurityCapabilities>
                            <bool name="DefinesCapabilities">false</bool>
                            <int64 name="SourceAssetId">-1</int64>
                            <BinaryString name="Tags"></BinaryString>

                            <string name="Name">${viewportFrameObject.name}</string>

                            <bool name="Active">${viewportFrameObject.active}</bool>
                            ${viewportFrameObject.anchorPoint.toRBXMXCode("AnchorPoint")}
                            <bool name="AutoLocalize">${viewportFrameObject.autoLocalize}</bool>
                            <token name="AutomaticSize">${viewportFrameObject.automaticSize}</token>
                            ${viewportFrameObject.backgroundColor3.toRBXMXCode("BackgroundColor3")}
                            <float name="BackgroundTransparency">${viewportFrameObject.backgroundTransparency}</float>
                            ${viewportFrameObject.borderColor3.toRBXMXCode("BorderColor3")}
                            <token name="BorderMode">${viewportFrameObject.borderMode}</token>
                            <float name="BorderSizePixel">${viewportFrameObject.borderSizePixel}</float>
                            <bool name="ClipsDescendants">${viewportFrameObject.clipDescendants}</bool>
                            <bool name="Draggable">false</bool>
                            <bool name="Interactable">${viewportFrameObject.interactable}</bool>
                            <int name="LayoutOrder">${viewportFrameObject.layoutOrder}</int>
                            <Ref name="NextSelectionDown">${viewportFrameObject.nextSelectionDown ?? "null"}</Ref>
                            <Ref name="NextSelectionLeft">${viewportFrameObject.nextSelectionLeft ?? "null"}</Ref>
                            <Ref name="NextSelectionRight">${viewportFrameObject.nextSelectionRight ?? "null"}</Ref>
                            <Ref name="NextSelectionUp">${viewportFrameObject.nextSelectionUp ?? "null"}</Ref>
                            ${viewportFrameObject.position.toRBXMXCode("Position")}
                            <Ref name="RootLocalizationTable">${viewportFrameObject.rootLocalizationTable?.toRBXMXCode() ?? "null"}</Ref>
                            <float name="Rotation">${viewportFrameObject.rotation}</float>
                            <bool name="Selectable">${viewportFrameObject.selectable}</bool>
                            <token name="SelectionBehaviorDown">${viewportFrameObject.selectionBehaviorDown}</token>
                            <token name="SelectionBehaviorLeft">${viewportFrameObject.selectionBehaviorLeft}</token>
                            <token name="SelectionBehaviorRight">${viewportFrameObject.selectionBehaviorRight}</token>
                            <token name="SelectionBehaviorUp">${viewportFrameObject.selectionBehaviorUp}</token>
                            <bool name="SelectionGroup">${viewportFrameObject.selectionGroup}</bool>
                            <Ref name="SelectionImageObject">${viewportFrameObject.selectionImageObject?.toRBXMXCode("SelectionImageObject") ?? "null"}</Ref>
                            <int name="SelectionOrder">${viewportFrameObject.selectionOrder}</int>
                            ${viewportFrameObject.size.toRBXMXCode("Size")}
                            <token name="SizeConstraint">${viewportFrameObject.sizeConstraint}</token>
                            <bool name="Visible">${viewportFrameObject.visible}</bool>
			                <int name="ZIndex">${viewportFrameObject.zIndex}</int>

                            ${viewportFrameObject.ambient.toRBXMXCode("Ambient")}
                            ${viewportFrameObject.currentCamera?.cframe.toRBXMXCode("CameraCFrame") ?? `
                                <CoordinateFrame name="CameraCFrame">
                                    <X>0</X>
                                    <Y>0</Y>
                                    <Z>0</Z>
                                    <R00>1</R00>
                                    <R01>0</R01>
                                    <R02>0</R02>
                                    <R10>0</R10>
                                    <R11>1</R11>
                                    <R12>0</R12>
                                    <R20>0</R20>
                                    <R21>0</R21>
                                    <R22>1</R22>
                                </CoordinateFrame>
                                `}
                            <float name="CameraFieldOfView">${viewportFrameObject.currentCamera?.fieldOfView ?? "1.22173059"}</float>
                            ${viewportFrameObject.imageColor3.toRBXMXCode("ImageColor3")}
                            <float name="ImageTransparency">${viewportFrameObject.imageTransparency}</float>
                            ${viewportFrameObject.lightColor.toRBXMXCode("LightColor")}
                            <float name="LightDirection">${viewportFrameObject.lightDirection}</float>
                        </Properties>
                    </Item>
                `.trim();
            case "ImageLabel":
                const imageLabelObject = guiObject as ImageLabel;
                return `
                    <Item class="ImageLabel">
                        <Properties>
                            <BinaryString name="AttributesSerialize"></BinaryString>
                            <SecurityCapabilities name="Capabilities">0</SecurityCapabilities>
                            <bool name="DefinesCapabilities">false</bool>
                            <int64 name="SourceAssetId">-1</int64>
                            <BinaryString name="Tags"></BinaryString>

                            <string name="Name">${imageLabelObject.name}</string>

                            <bool name="Active">${imageLabelObject.active}</bool>
                            ${imageLabelObject.anchorPoint.toRBXMXCode("AnchorPoint")}
                            <bool name="AutoLocalize">${imageLabelObject.autoLocalize}</bool>
                            <token name="AutomaticSize">${imageLabelObject.automaticSize}</token>
                            ${imageLabelObject.backgroundColor3.toRBXMXCode("BackgroundColor3")}
                            <float name="BackgroundTransparency">${imageLabelObject.backgroundTransparency}</float>
                            ${imageLabelObject.borderColor3.toRBXMXCode("BorderColor3")}
                            <token name="BorderMode">${imageLabelObject.borderMode}</token>
                            <float name="BorderSizePixel">${imageLabelObject.borderSizePixel}</float>
                            <bool name="ClipsDescendants">${imageLabelObject.clipDescendants}</bool>
                            <bool name="Draggable">false</bool>
                            <bool name="Interactable">${imageLabelObject.interactable}</bool>
                            <int name="LayoutOrder">${imageLabelObject.layoutOrder}</int>
                            <Ref name="NextSelectionDown">${imageLabelObject.nextSelectionDown ?? "null"}</Ref>
                            <Ref name="NextSelectionLeft">${imageLabelObject.nextSelectionLeft ?? "null"}</Ref>
                            <Ref name="NextSelectionRight">${imageLabelObject.nextSelectionRight ?? "null"}</Ref>
                            <Ref name="NextSelectionUp">${imageLabelObject.nextSelectionUp ?? "null"}</Ref>
                            ${imageLabelObject.position.toRBXMXCode("Position")}
                            <Ref name="RootLocalizationTable">${imageLabelObject.rootLocalizationTable?.toRBXMXCode() ?? "null"}</Ref>
                            <float name="Rotation">${imageLabelObject.rotation}</float>
                            <bool name="Selectable">${imageLabelObject.selectable}</bool>
                            <token name="SelectionBehaviorDown">${imageLabelObject.selectionBehaviorDown}</token>
                            <token name="SelectionBehaviorLeft">${imageLabelObject.selectionBehaviorLeft}</token>
                            <token name="SelectionBehaviorRight">${imageLabelObject.selectionBehaviorRight}</token>
                            <token name="SelectionBehaviorUp">${imageLabelObject.selectionBehaviorUp}</token>
                            <bool name="SelectionGroup">${imageLabelObject.selectionGroup}</bool>
                            <Ref name="SelectionImageObject">${imageLabelObject.selectionImageObject?.toRBXMXCode("SelectionImageObject") ?? "null"}</Ref>
                            <int name="SelectionOrder">${imageLabelObject.selectionOrder}</int>
                            ${imageLabelObject.size.toRBXMXCode("Size")}
                            <token name="SizeConstraint">${imageLabelObject.sizeConstraint}</token>
                            <bool name="Visible">${imageLabelObject.visible}</bool>
			                <int name="ZIndex">${imageLabelObject.zIndex}</int>

                            <Content name="Image"><url>${imageLabelObject.image ?? "rbxasset://textures/ui/GuiImagePlaceholder.png"}</url></Content>
                            ${imageLabelObject.imageColor3.toRBXMXCode("ImageColor3")}
                            ${imageLabelObject.imageRectOffset.toRBXMXCode("ImageRectOffset")}
                            ${imageLabelObject.imageRectSize.toRBXMXCode("ImageRectSize")}
                            <float name="ImageTransparency">${imageLabelObject.imageTransparency}</float>
                            <token name="ResampleMode">0${imageLabelObject.resampleMode}</token>
                            <token name="ScaleType">${imageLabelObject.scaleType}</token>
                            ${imageLabelObject.sliceCenter.toRBXMXCode("SliceCenter")}
                            <float name="SliceScale">${imageLabelObject.sliceScale}</float>
                            ${imageLabelObject.tileSize.toRBXMXCode("TileSize")}
                        </Properties>
                    </Item>
                `.trim();
            case "ImageButton":
                const imageButtonObject = guiObject as ImageButton;
                return `
                    <Item class="ImageButton">
                        <Properties>
                            <BinaryString name="AttributesSerialize"></BinaryString>
                            <SecurityCapabilities name="Capabilities">0</SecurityCapabilities>
                            <bool name="DefinesCapabilities">false</bool>
                            <int64 name="SourceAssetId">-1</int64>
                            <BinaryString name="Tags"></BinaryString>

                            <string name="Name">${imageButtonObject.name}</string>

                            <bool name="Active">${imageButtonObject.active}</bool>
                            ${imageButtonObject.anchorPoint.toRBXMXCode("AnchorPoint")}
                            <bool name="AutoLocalize">${imageButtonObject.autoLocalize}</bool>
                            <token name="AutomaticSize">${imageButtonObject.automaticSize}</token>
                            ${imageButtonObject.backgroundColor3.toRBXMXCode("BackgroundColor3")}
                            <float name="BackgroundTransparency">${imageButtonObject.backgroundTransparency}</float>
                            ${imageButtonObject.borderColor3.toRBXMXCode("BorderColor3")}
                            <token name="BorderMode">${imageButtonObject.borderMode}</token>
                            <float name="BorderSizePixel">${imageButtonObject.borderSizePixel}</float>
                            <bool name="ClipsDescendants">${imageButtonObject.clipDescendants}</bool>
                            <bool name="Draggable">false</bool>
                            <bool name="Interactable">${imageButtonObject.interactable}</bool>
                            <int name="LayoutOrder">${imageButtonObject.layoutOrder}</int>
                            <Ref name="NextSelectionDown">${imageButtonObject.nextSelectionDown ?? "null"}</Ref>
                            <Ref name="NextSelectionLeft">${imageButtonObject.nextSelectionLeft ?? "null"}</Ref>
                            <Ref name="NextSelectionRight">${imageButtonObject.nextSelectionRight ?? "null"}</Ref>
                            <Ref name="NextSelectionUp">${imageButtonObject.nextSelectionUp ?? "null"}</Ref>
                            ${imageButtonObject.position.toRBXMXCode("Position")}
                            <Ref name="RootLocalizationTable">${imageButtonObject.rootLocalizationTable?.toRBXMXCode() ?? "null"}</Ref>
                            <float name="Rotation">${imageButtonObject.rotation}</float>
                            <bool name="Selectable">${imageButtonObject.selectable}</bool>
                            <token name="SelectionBehaviorDown">${imageButtonObject.selectionBehaviorDown}</token>
                            <token name="SelectionBehaviorLeft">${imageButtonObject.selectionBehaviorLeft}</token>
                            <token name="SelectionBehaviorRight">${imageButtonObject.selectionBehaviorRight}</token>
                            <token name="SelectionBehaviorUp">${imageButtonObject.selectionBehaviorUp}</token>
                            <bool name="SelectionGroup">${imageButtonObject.selectionGroup}</bool>
                            <Ref name="SelectionImageObject">${imageButtonObject.selectionImageObject?.toRBXMXCode("SelectionImageObject") ?? "null"}</Ref>
                            <int name="SelectionOrder">${imageButtonObject.selectionOrder}</int>
                            ${imageButtonObject.size.toRBXMXCode("Size")}
                            <token name="SizeConstraint">${imageButtonObject.sizeConstraint}</token>
                            <bool name="Visible">${imageButtonObject.visible}</bool>
			                <int name="ZIndex">${imageButtonObject.zIndex}</int>

                            <Content name="Image"><url>${imageButtonObject.image ?? "rbxasset://textures/ui/GuiImagePlaceholder.png"}</url></Content>
                            ${imageButtonObject.imageColor3.toRBXMXCode("ImageColor3")}
                            ${imageButtonObject.imageRectOffset.toRBXMXCode("ImageRectOffset")}
                            ${imageButtonObject.imageRectSize.toRBXMXCode("ImageRectSize")}
                            <float name="ImageTransparency">${imageButtonObject.imageTransparency}</float>
                            <token name="ResampleMode">0${imageButtonObject.resampleMode}</token>
                            <token name="ScaleType">${imageButtonObject.scaleType}</token>
                            ${imageButtonObject.sliceCenter.toRBXMXCode("SliceCenter")}
                            <float name="SliceScale">${imageButtonObject.sliceScale}</float>
                            ${imageButtonObject.tileSize.toRBXMXCode("TileSize")}

                            <bool name="AutoButtonColor">${imageButtonObject.autoButtonColor}</bool>
                            <bool name="Modal">${imageButtonObject.modal}</bool>
                            <bool name="Selected">${imageButtonObject.selected}</bool>
                            <token name="Style">${imageButtonObject.style}</token>

                            <Content name="HoverImage">${imageButtonObject.hoverImage ?? "<null></null>"}</Content>
                            <Content name="PressedImage">${imageButtonObject.pressedImage?.padStart(5, "<url>").padEnd(6, "</url>") ?? "<null></null>"}</Content>
                        </Properties>
                    </Item>
                `.trim();
            case "TextLabel":
                const textLabelObject = guiObject as TextLabel;
                return `
                    <Item class="TextLabel">
                        <Properties>
                            <BinaryString name="AttributesSerialize"></BinaryString>
                            <SecurityCapabilities name="Capabilities">0</SecurityCapabilities>
                            <bool name="DefinesCapabilities">false</bool>
                            <int64 name="SourceAssetId">-1</int64>
                            <BinaryString name="Tags"></BinaryString>

                            <string name="Name">${textLabelObject.name}</string>

                            <bool name="Active">${textLabelObject.active}</bool>
                            ${textLabelObject.anchorPoint.toRBXMXCode("AnchorPoint")}
                            <bool name="AutoLocalize">${textLabelObject.autoLocalize}</bool>
                            <token name="AutomaticSize">${textLabelObject.automaticSize}</token>
                            ${textLabelObject.backgroundColor3.toRBXMXCode("BackgroundColor3")}
                            <float name="BackgroundTransparency">${textLabelObject.backgroundTransparency}</float>
                            ${textLabelObject.borderColor3.toRBXMXCode("BorderColor3")}
                            <token name="BorderMode">${textLabelObject.borderMode}</token>
                            <float name="BorderSizePixel">${textLabelObject.borderSizePixel}</float>
                            <bool name="ClipsDescendants">${textLabelObject.clipDescendants}</bool>
                            <bool name="Draggable">false</bool>
                            <bool name="Interactable">${textLabelObject.interactable}</bool>
                            <int name="LayoutOrder">${textLabelObject.layoutOrder}</int>
                            <Ref name="NextSelectionDown">${textLabelObject.nextSelectionDown ?? "null"}</Ref>
                            <Ref name="NextSelectionLeft">${textLabelObject.nextSelectionLeft ?? "null"}</Ref>
                            <Ref name="NextSelectionRight">${textLabelObject.nextSelectionRight ?? "null"}</Ref>
                            <Ref name="NextSelectionUp">${textLabelObject.nextSelectionUp ?? "null"}</Ref>
                            ${textLabelObject.position.toRBXMXCode("Position")}
                            <Ref name="RootLocalizationTable">${textLabelObject.rootLocalizationTable?.toRBXMXCode() ?? "null"}</Ref>
                            <float name="Rotation">${textLabelObject.rotation}</float>
                            <bool name="Selectable">${textLabelObject.selectable}</bool>
                            <token name="SelectionBehaviorDown">${textLabelObject.selectionBehaviorDown}</token>
                            <token name="SelectionBehaviorLeft">${textLabelObject.selectionBehaviorLeft}</token>
                            <token name="SelectionBehaviorRight">${textLabelObject.selectionBehaviorRight}</token>
                            <token name="SelectionBehaviorUp">${textLabelObject.selectionBehaviorUp}</token>
                            <bool name="SelectionGroup">${textLabelObject.selectionGroup}</bool>
                            <Ref name="SelectionImageObject">${textLabelObject.selectionImageObject?.toRBXMXCode("SelectionImageObject") ?? "null"}</Ref>
                            <int name="SelectionOrder">${textLabelObject.selectionOrder}</int>
                            ${textLabelObject.size.toRBXMXCode("Size")}
                            <token name="SizeConstraint">${textLabelObject.sizeConstraint}</token>
                            <bool name="Visible">${textLabelObject.visible}</bool>
			                <int name="ZIndex">${textLabelObject.zIndex}</int>

                            ${textLabelObject.fontFace.toRBXMXCode("FontFace")}
                            <float name="LineHeight">${textLabelObject.lineHeight}</float>
                            <string name="LocalizationMatchIdentifier"></string>
			                <string name="LocalizationMatchedSourceText"></string>
                            <int name="MaxVisibleGraphemes">${textLabelObject.maxVisibleGraphemes}</int>
                            <string name="OpenTypeFeatures">${textLabelObject.openTypeFeatures}</string>
                            <bool name="RichText">${textLabelObject.richText}</bool>
                            <string name="Text">${textLabelObject.text}</string>
                            ${textLabelObject.textColor.toRBXMXCode("TextColor3")}
                            <token name="TextDirection">${textLabelObject.textDirection}</token>
                            <bool name="TextScaled">${textLabelObject.textScaled}</bool>
                            <float name="TextSize">${textLabelObject.textSize}</float>
                            ${textLabelObject.textStrokeColor.toRBXMXCode("TextStrokeColor3")}
                            <float name="TextStrokeTransparency">${textLabelObject.textStrokeTransparency}</float>
                            <float name="TextTransparency">${textLabelObject.textTransparency}</float>
                            <token name="TextTruncate">${textLabelObject.textTruncate}</token>
                            <bool name="TextWrapped">${textLabelObject.textWrapped}</bool>
                            <token name="TextXAlignment">${textLabelObject.textXAlignment}</token>
                            <token name="TextYAlignment">${textLabelObject.textYAlignment}</token>

                        </Properties>
                    </Item>
                `.trim();
            case "TextButton":
                const textButtonObject = guiObject as TextButton;
                return `
                    <Item class="TextButton">
                        <Properties>
                            <BinaryString name="AttributesSerialize"></BinaryString>
                            <SecurityCapabilities name="Capabilities">0</SecurityCapabilities>
                            <bool name="DefinesCapabilities">false</bool>
                            <int64 name="SourceAssetId">-1</int64>
                            <BinaryString name="Tags"></BinaryString>

                            <string name="Name">${textButtonObject.name}</string>

                            <bool name="Active">${textButtonObject.active}</bool>
                            ${textButtonObject.anchorPoint.toRBXMXCode("AnchorPoint")}
                            <bool name="AutoLocalize">${textButtonObject.autoLocalize}</bool>
                            <token name="AutomaticSize">${textButtonObject.automaticSize}</token>
                            ${textButtonObject.backgroundColor3.toRBXMXCode("BackgroundColor3")}
                            <float name="BackgroundTransparency">${textButtonObject.backgroundTransparency}</float>
                            ${textButtonObject.borderColor3.toRBXMXCode("BorderColor3")}
                            <token name="BorderMode">${textButtonObject.borderMode}</token>
                            <float name="BorderSizePixel">${textButtonObject.borderSizePixel}</float>
                            <bool name="ClipsDescendants">${textButtonObject.clipDescendants}</bool>
                            <bool name="Draggable">false</bool>
                            <bool name="Interactable">${textButtonObject.interactable}</bool>
                            <int name="LayoutOrder">${textButtonObject.layoutOrder}</int>
                            <Ref name="NextSelectionDown">${textButtonObject.nextSelectionDown ?? "null"}</Ref>
                            <Ref name="NextSelectionLeft">${textButtonObject.nextSelectionLeft ?? "null"}</Ref>
                            <Ref name="NextSelectionRight">${textButtonObject.nextSelectionRight ?? "null"}</Ref>
                            <Ref name="NextSelectionUp">${textButtonObject.nextSelectionUp ?? "null"}</Ref>
                            ${textButtonObject.position.toRBXMXCode("Position")}
                            <Ref name="RootLocalizationTable">${textButtonObject.rootLocalizationTable?.toRBXMXCode() ?? "null"}</Ref>
                            <float name="Rotation">${textButtonObject.rotation}</float>
                            <bool name="Selectable">${textButtonObject.selectable}</bool>
                            <token name="SelectionBehaviorDown">${textButtonObject.selectionBehaviorDown}</token>
                            <token name="SelectionBehaviorLeft">${textButtonObject.selectionBehaviorLeft}</token>
                            <token name="SelectionBehaviorRight">${textButtonObject.selectionBehaviorRight}</token>
                            <token name="SelectionBehaviorUp">${textButtonObject.selectionBehaviorUp}</token>
                            <bool name="SelectionGroup">${textButtonObject.selectionGroup}</bool>
                            <Ref name="SelectionImageObject">${textButtonObject.selectionImageObject?.toRBXMXCode("SelectionImageObject") ?? "null"}</Ref>
                            <int name="SelectionOrder">${textButtonObject.selectionOrder}</int>
                            ${textButtonObject.size.toRBXMXCode("Size")}
                            <token name="SizeConstraint">${textButtonObject.sizeConstraint}</token>
                            <bool name="Visible">${textButtonObject.visible}</bool>
			                <int name="ZIndex">${textButtonObject.zIndex}</int>

                            ${textButtonObject.fontFace.toRBXMXCode("FontFace")}
                            <float name="LineHeight">${textButtonObject.lineHeight}</float>
                            <string name="LocalizationMatchIdentifier"></string>
			                <string name="LocalizationMatchedSourceText"></string>
                            <int name="MaxVisibleGraphemes">${textButtonObject.maxVisibleGraphemes}</int>
                            <string name="OpenTypeFeatures">${textButtonObject.openTypeFeatures}</string>
                            <bool name="RichText">${textButtonObject.richText}</bool>
                            <string name="Text">${textButtonObject.text}</string>
                            ${textButtonObject.textColor.toRBXMXCode("TextColor3")}
                            <token name="TextDirection">${textButtonObject.textDirection}</token>
                            <bool name="TextScaled">${textButtonObject.textScaled}</bool>
                            <float name="TextSize">${textButtonObject.textSize}</float>
                            ${textButtonObject.textStrokeColor.toRBXMXCode("TextStrokeColor3")}
                            <float name="TextStrokeTransparency">${textButtonObject.textStrokeTransparency}</float>
                            <float name="TextTransparency">${textButtonObject.textTransparency}</float>
                            <token name="TextTruncate">${textButtonObject.textTruncate}</token>
                            <bool name="TextWrapped">${textButtonObject.textWrapped}</bool>
                            <token name="TextXAlignment">${textButtonObject.textXAlignment}</token>
                            <token name="TextYAlignment">${textButtonObject.textYAlignment}</token>

                            <bool name="AutoButtonColor">${textButtonObject.autoButtonColor}</bool>
                            <bool name="Modal">${textButtonObject.modal}</bool>
                            <bool name="Selected">${textButtonObject.selected}</bool>
                            <token name="Style">${textButtonObject.style}</token>
                        </Properties>
                    </Item>
                `.trim();
            case "TextBox":
                const textBoxObject = guiObject as TextBox;
                return `
                    <Item class="TextBox">
                        <Properties>
                            <BinaryString name="AttributesSerialize"></BinaryString>
                            <SecurityCapabilities name="Capabilities">0</SecurityCapabilities>
                            <bool name="DefinesCapabilities">false</bool>
                            <int64 name="SourceAssetId">-1</int64>
                            <BinaryString name="Tags"></BinaryString>

                            <string name="Name">${textBoxObject.name}</string>

                            <bool name="Active">${textBoxObject.active}</bool>
                            ${textBoxObject.anchorPoint.toRBXMXCode("AnchorPoint")}
                            <bool name="AutoLocalize">${textBoxObject.autoLocalize}</bool>
                            <token name="AutomaticSize">${textBoxObject.automaticSize}</token>
                            ${textBoxObject.backgroundColor3.toRBXMXCode("BackgroundColor3")}
                            <float name="BackgroundTransparency">${textBoxObject.backgroundTransparency}</float>
                            ${textBoxObject.borderColor3.toRBXMXCode("BorderColor3")}
                            <token name="BorderMode">${textBoxObject.borderMode}</token>
                            <float name="BorderSizePixel">${textBoxObject.borderSizePixel}</float>
                            <bool name="ClipsDescendants">${textBoxObject.clipDescendants}</bool>
                            <bool name="Draggable">false</bool>
                            <bool name="Interactable">${textBoxObject.interactable}</bool>
                            <int name="LayoutOrder">${textBoxObject.layoutOrder}</int>
                            <Ref name="NextSelectionDown">${textBoxObject.nextSelectionDown ?? "null"}</Ref>
                            <Ref name="NextSelectionLeft">${textBoxObject.nextSelectionLeft ?? "null"}</Ref>
                            <Ref name="NextSelectionRight">${textBoxObject.nextSelectionRight ?? "null"}</Ref>
                            <Ref name="NextSelectionUp">${textBoxObject.nextSelectionUp ?? "null"}</Ref>
                            ${textBoxObject.position.toRBXMXCode("Position")}
                            <Ref name="RootLocalizationTable">${textBoxObject.rootLocalizationTable?.toRBXMXCode() ?? "null"}</Ref>
                            <float name="Rotation">${textBoxObject.rotation}</float>
                            <bool name="Selectable">${textBoxObject.selectable}</bool>
                            <token name="SelectionBehaviorDown">${textBoxObject.selectionBehaviorDown}</token>
                            <token name="SelectionBehaviorLeft">${textBoxObject.selectionBehaviorLeft}</token>
                            <token name="SelectionBehaviorRight">${textBoxObject.selectionBehaviorRight}</token>
                            <token name="SelectionBehaviorUp">${textBoxObject.selectionBehaviorUp}</token>
                            <bool name="SelectionGroup">${textBoxObject.selectionGroup}</bool>
                            <Ref name="SelectionImageObject">${textBoxObject.selectionImageObject?.toRBXMXCode("SelectionImageObject") ?? "null"}</Ref>
                            <int name="SelectionOrder">${textBoxObject.selectionOrder}</int>
                            ${textBoxObject.size.toRBXMXCode("Size")}
                            <token name="SizeConstraint">${textBoxObject.sizeConstraint}</token>
                            <bool name="Visible">${textBoxObject.visible}</bool>
			                <int name="ZIndex">${textBoxObject.zIndex}</int>

                            ${textBoxObject.fontFace.toRBXMXCode("FontFace")}
                            <float name="LineHeight">${textBoxObject.lineHeight}</float>
                            <string name="LocalizationMatchIdentifier"></string>
			                <string name="LocalizationMatchedSourceText"></string>
                            <int name="MaxVisibleGraphemes">${textBoxObject.maxVisibleGraphemes}</int>
                            <string name="OpenTypeFeatures">${textBoxObject.openTypeFeatures}</string>
                            <bool name="RichText">${textBoxObject.richText}</bool>
                            <string name="Text">${textBoxObject.text}</string>
                            ${textBoxObject.textColor.toRBXMXCode("TextColor3")}
                            <token name="TextDirection">${textBoxObject.textDirection}</token>
                            <bool name="TextScaled">${textBoxObject.textScaled}</bool>
                            <float name="TextSize">${textBoxObject.textSize}</float>
                            ${textBoxObject.textStrokeColor.toRBXMXCode("TextStrokeColor3")}
                            <float name="TextStrokeTransparency">${textBoxObject.textStrokeTransparency}</float>
                            <float name="TextTransparency">${textBoxObject.textTransparency}</float>
                            <token name="TextTruncate">${textBoxObject.textTruncate}</token>
                            <bool name="TextWrapped">${textBoxObject.textWrapped}</bool>
                            <token name="TextXAlignment">${textBoxObject.textXAlignment}</token>
                            <token name="TextYAlignment">${textBoxObject.textYAlignment}</token>

                            <bool name="ClearTextOnFocus">${textBoxObject.clearTextFocus}</bool>
                            <bool name="MultiLine">${textBoxObject.multiLine}</bool>
                            ${textBoxObject.placeholderColor3.toRBXMXCode("PlaceholderColor3")}
                            <string name="PlaceholderText">${textBoxObject.placeholderText}</string>
                            <bool name="ShowNativeInput">${textBoxObject.showNativeInput}</bool>    
                            <bool name="TextEditable">${textBoxObject.textEditable}</bool>
                        </Properties>
                    </Item>
                `.trim();
        }
    }
}

export async function exportFile(runType: ConvertRunType, inputs: RobloxUI[]): Promise<LuaFile> {
    assert(inputs.length > 0)
    switch (runType) {
        case ConvertRunType.convertToCode:
            const luaFile: LuaFile = new LuaFile({
                name: LuaFile.luaFileCounter === 0 ? "blox_ui_lua": `blox_ui_lua_${LuaFile.luaFileCounter}`,
            });
            inputs.forEach(async (robloxUI) => {
                luaFile.parse(
                    robloxUI.toRBXMXCode()
                );
            });
            return luaFile;
        case ConvertRunType.convertToObject:
            const rbxmxFile: RBMXMFile = new RBMXMFile({
                name: RBMXMFile.rbmxmCounter ? "blox_ui_rbxmx" : `blox_ui_rbxmx_${RBMXMFile.rbmxmCounter}`,
            });
            inputs.forEach((robloxUI) => {
                rbxmxFile.parse(
                    robloxUI.toCode(
                        toCamelCase(
                            robloxUI.name,
                        )
                    ),
                );
            });
        case ConvertRunType.generateCode:
            throw new DownloadError();
    }
}
