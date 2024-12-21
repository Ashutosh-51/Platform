/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "encore/model/models", // Ensure this path is correct
    "encore/controller/BaseController"
], function (UIComponent, Device, models) {
    "use strict";

    return UIComponent.extend("encore.Component", {
        metadata: {
            manifest: "json"
        },

        /**
         * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
         * @public
         * @override
         */
        init: function () {
            // Call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // Enable routing
            this.getRouter().initialize();
            
            // Set the device model
            this.setModel(models.createDeviceModel(), "device");

            var oRouter = this.getRouter();
            oRouter.attachRouteMatched(this._onRouteMatched, this);
            oRouter.initialize();
            
            // Load account model
            var accountModel = new sap.ui.model.json.JSONModel();
            this.setModel(accountModel, "accountModel");
            // oModel.loadData("./model/account.json"); // Ensure this path is correct
            // this.setModel(oModel, "account");

            // const applicationModel = new JSONModel();
            // sap.ui.getCore().setModel(applicationModel, "applicationModel");

            this.Accounts();
            
        },

        _onRouteMatched: function (oEvent) {
            var sRouteName = oEvent.getParameter("name");
            // var authToken = localStorage.getItem("authToken");

            // Protect specific routes (e.g., Home)
            var protectedRoutes = ["Home", "Subaccount", "Userinfo", "Users"]; 
            if (protectedRoutes.includes(sRouteName) && !authToken) {
                // Redirect to login if not authenticated
                this.getRouter().navTo("Login");
            }
        },

        Accounts: function() {
            fetch("api/account", {  // Adjust the URL to match your server configuration
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // Include credentials if your API requires authentication
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                console.log("Fetched account data:", data);
                // Directly set the data to the "accountModel"
                const accountModel = this.getModel("accountModel");
                accountModel.setData(data);
            })
            .catch(error => {
                console.error("There was a problem with the fetch operation:", error);
            });
        },

    });
});
