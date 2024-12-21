sap.ui.define([
    "encore/controller/BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("encore.controller.Roles", {

        // Controller-specific initialization logic
        onInit: function () {


            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);

        },

        onNavItemSelect: function(oEvent) {
            var sKey = oEvent.getParameter("item").getKey();
            this._oRouter.navTo(sKey);  // Use the key to navigate
        }
 
    });
});
