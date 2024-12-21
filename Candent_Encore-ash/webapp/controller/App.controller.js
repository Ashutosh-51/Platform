sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "encore/controller/BaseController"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("encore.controller.App", {
        onInit: function() {

          this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        },
      });
    }
  );
  