define([
  'dojo/_base/declare',
  'jimu/BaseWidget',
  'esri/map',
  'esri/layers/FeatureLayer',
  'esri/dijit/InfoWindow',
  'esri/dijit/Popup',
  'esri/rest/support/Query',
  'esri/request',
  './config'
], function(
  declare,
  BaseWidget,
  EsriMap,
  FeatureLayer,
  InfoWindow,
  Popup,
  Query,
  request,
  IConfig
) {

  var Widget = declare([BaseWidget], {

    baseClass: 's-e',
    config: null,
    map: null,
    featureLayer: null,
    clickHandler: null,

    postCreate: function() {
      this.inherited(arguments);
      console.log('SE::postCreate');

      // Retrieve the filter values from the dashboard
      var dashboardUrl = this.config.dashboardUrl;
      var queryParams = new URLSearchParams(window.location.search);
      var filtersJson = queryParams.get('filters');
      var filters = JSON.parse(filtersJson);

      // Set up the feature layer
      var featureLayerUrl = this.config.featureLayerUrl;
      this.featureLayer = new FeatureLayer({
        url: featureLayerUrl
      });

      // Set up the query
      var query = this.featureLayer.createQuery();
      query.outFields = ['*'];
      query.where = '1=1';

      // Apply the filters to the query
      if (filters) {
        var filterExpressions = filters.map(function(filter) {
          var fieldName = filter.expr.substring(0, filter.expr.indexOf('=')).trim();
          var value = filter.expr.substring(filter.expr.indexOf('=') + 1).trim();
          return fieldName + "='" + value + "'";
        });
        query.where = filterExpressions.join(' AND ');
      }

      // Run the query and handle the results
      this.featureLayer.queryFeatures(query)
        .then(function(result) {
          // Process the query results
          console.log(result);
          this.exportJson(result.features);
        }.bind(this))
        .catch(function(error) {
          console.error(error);
        });
    },

    exportJson: function(features) {
      // Create a new JSON object to hold the features
      var data = {
        features: features.map(function(feature) {
          return {
            attributes: feature.attributes
          };
        })
      };

      // Convert the data to a JSON string
      var jsonString = JSON.stringify(data);

      // Send a request to the API to export the JSON file
      request('https://my-api.com/export', {
        responseType: 'json',
        method: 'POST',
        body: {
          data: jsonString
        }
      }).then(function(response) {
        console.log('JSON export complete');
      }).catch(function(error) {
        console.error('JSON export error', error);
      });
    }

  });

  return Widget;

});


    // startup: function() {
    //   this.inherited(arguments);
    //   console.log('SE00::startup');
    // },

    // onOpen: function(){
    //   console.log('SE00::onOpen');
    // },

    // onClose: function(){
    //   console.log('SE00::onClose');
    // },

    // onMinimize: function(){
    //   console.log('SE00::onMinimize');
    // },

    // onMaximize: function(){
    //   console.log('SE00::onMaximize');
    // },

    // onSignIn: function(credential){
    //   console.log('SE00::onSignIn', credential);
    // },

    // onSignOut: function(){
    //   console.log('SE00::onSignOut');
    // }

    // onPositionChange: function(){
    //   console.log('SE00::onPositionChange');
    // },

    // resize: function(){
    //   console.log('SE00::resize');
    // }

    //methods to communication between widgets: