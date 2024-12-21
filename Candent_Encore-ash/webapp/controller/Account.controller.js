sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("encore.controller.Account", {

        // Controller-specific initialization logic
        onInit: function () {

            // BaseController.prototype.onInit.apply(this, arguments);

            

            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);

        },

        onNavItemSelect: function(oEvent) {
            var sKey = oEvent.getParameter("item").getKey();
            this._oRouter.navTo(sKey);  // Use the key to navigate
        }
    });
});
