import SettingsObject from '@/shared/settings/SettingsObject';


export default class Settings {
    constructor(
        private renderDistance: number,
        private resolutionX: number,
        private resolutionY: number,
    ) {

    }

    public getRenderDistance = () => this.renderDistance;

    public setRenderDistance = (renderDistance: number) => this.renderDistance = renderDistance;

    public getResolutionX = () => this.resolutionX;

    public setResolutionX = (resolutionX: number) => this.resolutionX = resolutionX;

    public getResolutionY = () => this.resolutionY;

    public setResolutionY = (resolutionY: number) => this.resolutionY = resolutionY;

    static fromObject(settings: SettingsObject) {
        return new Settings(
            settings.RENDER_DISTANCE,
            settings.RESOLUTION.X,
            settings.RESOLUTION.Y,
        );
    }

    public toObject(): SettingsObject {
        return {
            RENDER_DISTANCE: this.renderDistance,
            RESOLUTION: {
                X: this.resolutionX,
                Y: this.resolutionY,
            },
        }
    }
}