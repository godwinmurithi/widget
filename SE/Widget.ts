// jIMU (WAB) imports:
/// <amd-dependency path="jimu/BaseWidget" name="BaseWidget" />
declare var BaseWidget: any; // there is no ts definition of BaseWidget (yet!)
// declareDecorator - to enable us to export this module with Dojo's "declare()" syntax so WAB can load it:
import declare from './support/declareDecorator';

// esri imports:
import EsriMap from 'esri/map';
import FeatureLayer from 'esri/layers/FeatureLayer';
import InfoWindow from 'esri/dijit/InfoWindow';
import Popup from 'esri/dijit/Popup';
import Query from 'esri/rest/support/Query';
import request from 'esri/request'


// dojo imports:
// import on from 'dojo/on';

import IConfig from './config';

interface IWidget {
  baseClass: string;
  config?: IConfig;
}

interface ISelectedFeature {
  geometry: any;
  attributes: any;
}

interface MyFeatureLayer extends FeatureLayer {
  createQuery(): Query;
}

@declare(BaseWidget)
class Widget implements IWidget {
  public baseClass: string = 's-e';
  public config: IConfig;

  private map: EsriMap;
  private featureLayer: FeatureLayer;
  private clickHandler: any;


  private postCreate(args: any): void {
    const self: any = this;
    self.inherited(args);
    console.log('SE::postCreate');
    // Retrieve the filter values from the dashboard
    const dashboardUrl = this.config.dashboardUrl;
    const queryParams = new URLSearchParams(window.location.search);
    const filtersJson = queryParams.get('filters');
    const filters = JSON.parse(filtersJson);
  
    // Set up the feature layer
    const featureLayerUrl = this.config.featureLayerUrl;
    this.featureLayer = new FeatureLayer({
      url: featureLayerUrl,
    });
  
    // Set up the query
    const query = this.featureLayer.createQuery();
    query.outFields = ['*'];
    query.where = '1=1';
  
    // Apply the filters to the query
    if (filters) {
      const filterExpressions = filters.map((filter: any) => {
        const fieldName = filter.expr.substring(0, filter.expr.indexOf('=')).trim();
        const value = filter.expr.substring(filter.expr.indexOf('=') + 1).trim();
        return `${fieldName} = '${value}'`;
      });
      query.where = filterExpressions.join(' AND ');
    }
  
    // Run the query and handle the results
    this.featureLayer.queryFeatures(query)
      .then((result: any) => {
        // Process the query results
        console.log(result);
        this.exportJson(result.features);
      })
      .catch((error: any) => {
        console.error(error);
      });
  }
  
  private exportJson(features: any[]): void {
    // Create a new JSON object to hold the features
    const data = {
      features: features.map((feature) => {
        return {
          attributes: feature.attributes,
        };
      }),
    };
  
    // Convert the data to a JSON string
    const jsonString = JSON.stringify(data);
  
    // Send a request to the API to export the JSON file
    request('https://my-api.com/export', {
      responseType: 'json',
      method: 'POST',
      body: {
        data: jsonString,
      },
    }).then((response) => {
      console.log('JSON export complete');
    }).catch((error) => {
      console.error('JSON export error', error);
    });
  }

  
  // private startup(): void {
  //   let self: any = this;
  //   self.inherited(arguments);
  //   console.log('SE::startup');
  // };
  // private onOpen(): void {
  //   console.log('SE::onOpen');
  // };
  // private onClose(): void {
  //   console.log('SE::onClose');
  // };
  // private onMinimize(): void {
  //   console.log('SE::onMinimize');
  // };
  // private onMaximize(): void {
  //   console.log('SE::onMaximize');
  // };
  // private onSignIn(credential): void {
  //   console.log('SE::onSignIn', credential);
  // };
  // private onSignOut(): void {
  //   console.log('SE::onSignOut');
  // };
  // private onPositionChange(): void {
  //   console.log('SE::onPositionChange');
  // };
  // private resize(): void {
  //   console.log('SE::resize');
  // };
}

export = Widget;
