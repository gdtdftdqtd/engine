/**
 * @category pipeline
 */

import { Root } from '../root';
import { GFXWindow } from '../gfx/window';
import { Camera } from '../renderer/scene/camera';
import { RenderFlow } from './render-flow';
import { CameraDefaultMask } from './define';
import { indexOf } from '../utils/array';

/**
 * @zh
 * 渲染视图优先级。
 */
export enum RenderViewPriority {
    GENERAL = 100,
}

/**
 * @zh
 * 渲染视图描述信息。
 */
export interface IRenderViewInfo {
    camera: Camera;
    name: string;
    priority: number;
    flows?: string[];
}

/**
 * @zh
 * 渲染目标描述信息。
 */
export interface IRenderTargetInfo {
    width?: number;
    height?: number;
}

/**
 * @zh
 * 渲染视图。
 */
export class RenderView {

    /**
     * @zh
     * 名称。
     */
    public get name () {
        return this._name;
    }

    /**
     * @zh
     * GFX窗口。
     */
    public get window () {
        return this._window;
    }

    public set window (val) {
        this._window = val;
    }

    /**
     * @zh
     * 优先级。
     */
    public get priority () {
        return this._priority;
    }

    public set priority (val: number) {
        this._priority = val;
    }

    /**
     * @zh
     * 可见性。
     */
    public set visibility (vis) {
        this._visibility = vis;
    }
    public get visibility () {
        return this._visibility;
    }

    /**
     * @zh
     * 相机。
     */
    public get camera (): Camera {
        return this._camera!;
    }

    /**
     * @zh
     * 是否启用。
     */
    public get isEnable (): boolean {
        return this._isEnable;
    }

    /**
     * @zh
     * 渲染流程列表。
     */
    public get flows (): RenderFlow[] {
        return this._flows;
    }

    public static registerCreateFunc (root: Root) {
        root._createViewFun = (_root: Root, _camera: Camera): RenderView => new RenderView(_root, _camera);
    }

    /**
     * @zh
     * Root类实例。
     */
    private _root: Root;

    /**
     * @zh
     * 名称。
     */
    private _name: string = '';

    /**
     * @zh
     * GFX窗口。
     */
    private _window: GFXWindow | null = null;

    /**
     * @zh
     * 优先级。
     */
    private _priority: number = 0;

    /**
     * @zh
     * 可见性。
     */
    private _visibility: number = CameraDefaultMask;

    /**
     * @zh
     * 相机。
     */
    private _camera: Camera;

    /**
     * @zh
     * 是否启用。
     */
    private _isEnable: boolean = true;

    /**
     * @zh
     * 渲染流程列表。
     */
    private _flows: RenderFlow[] = [];

    /**
     * 构造函数。<br/>
     * @param root Root类实例。
     * @param camera 相机。
     */
    private constructor (root: Root, camera: Camera) {
        this._root = root;
        this._camera = camera;
    }

    /**
     * @zh
     * 初始化函数。
     * @param info 渲染视图描述信息。
     */
    public initialize (info: IRenderViewInfo): boolean {

        this._name = info.name;
        this.priority = info.priority;
        if (!info.flows) {
            info.flows = ['ForwardFlow', 'ToneMapFlow', 'SMAAFlow'];
        }
        this.setExecuteFlows(info.flows);

        return true;
    }

    /**
     * @zh
     * 销毁函数。
     */
    public destroy () {
        this._window = null;
        this._priority = 0;
    }

    /**
     * @zh
     * 启用该渲染视图。
     */
    public enable (isEnable: boolean) {
        this._isEnable = isEnable;
    }

    public setExecuteFlows (flows: string[]) {
        this.flows.length = 0;
        const pipelineFlows = cc.director.root.pipeline.activeFlows;
        for (const f of pipelineFlows) {
            if (flows.indexOf(f.name) !== -1) {
                this.flows.push(f);
            }
        }
    }
}
