// JIMU (WAB) imports:

/// <amd-dependency path="jimu/BaseWidgetSetting" name="BaseWidgetSetting" />
declare var BaseWidgetSetting: any; // there is no ts definition of BaseWidgetSetting (yet!)

// DeclareDecorator - to enable us to export this module with Dojo's "declare()" syntax so WAB can load it:
import declare from '../support/declareDecorator';

import IConfig from '../config';

interface ISetting {
  config?: IConfig;
}

@declare(BaseWidgetSetting)
class Setting implements ISetting {
  public baseClass: string = 's-e-setting';
  public config: IConfig;

  private textNode: HTMLInputElement;

  public postCreate(args: any): void {
    const self: any = this;
    self.inherited(arguments);
    this.setConfig(this.config);
  }

  public setConfig(config: IConfig): void {
    this.textNode.value = config.serviceUrl;
  }

  public getConfig(): IConfig {
    // WAB will get config object through this method
    return {
      serviceUrl: this.textNode.value,
      featureLayerUrl: this.textNode.value,
      dashboardUrl: this.textNode.value,
    };
  }
}

export = Setting;
