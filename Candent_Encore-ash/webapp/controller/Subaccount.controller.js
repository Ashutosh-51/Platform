sap.ui.define([
    "encore/controller/BaseController",
], function(BaseController) {
    "use strict";

    return BaseController.extend("encore.controller.Subaccount", {
        
        onInit: function() {     
            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            
            
            const applicationModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(applicationModel, "applicationModel");
            
            this.Application();
        },

        onNavItemSelect: function (oEvent) {
            var sKey = oEvent.getSource().getKey(); // Get the key of the selected item
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
  
            // Navigate to the selected page
            oRouter.navTo(sKey);
  
            // Reset the selection of the navigation list
            this.byId("sideNavigation").setSelectedKey("home");  // Reset to home or any default page
          }, 

        onUserItemPress: function(oEvent) {
            
            const oItem = oEvent.getSource();
            
        },


        onAppNav: function (oEvent) {
            var oTile = oEvent.getSource();
            var oContext = oTile.getBindingContext("applicationModel");
        
            if (oContext) {
                var sUrl = oContext.getProperty("url");
                if (sUrl) {
                    // Ensure the cookies are passed
                    try {
                        // Check if cookies exist
                        var cookies = document.cookie;
                        console.log("Cookies being passed:", cookies);
        
                        // Redirect with cookies intact
                        window.location.href = sUrl;
                    } catch (error) {
                        console.error("Error accessing cookies:", error);
                    }
                } else {
                    console.error("URL is not available for this application.");
                }
            } else {
                console.error("Binding context for 'applicationModel' is undefined.");
            }
        },

        // onTilePress: async function (oEvent) {
        //     // Make a call to the transfer user data endpoint
        //     try {
        //         const response = await fetch('/auth/transfer-user-data', {
        //             method: 'GET',
        //             credentials: 'include', // Include cookies in the request
        //         });
        
        //         if (response.ok) {
        //             const data = await response.json();
        //             console.log('User data transferred successfully:', data);
        
        //             // Redirect to the destination application
        //             const destinationUrl = `http://other-app.com/receive-data?userId=${data.userId}&username=${data.username}`; // Replace with the actual URL
        //             window.location.href = destinationUrl; // Redirect to the other application
        //         } else {
        //             console.error('Failed to transfer user data:', response.status);
        //         }
        //     } catch (error) {
        //         console.error('Error occurred while transferring user data:', error);
        //     }
        // },
    });
});
