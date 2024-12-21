sap.ui.define(
    [
      "encore/controller/BaseController",
      "sap/ui/core/Fragment",
      "sap/ui/core/UIComponent",
      "sap/ui/model/json/JSONModel",
    ],
    function (
      BaseController,
      Fragment,
      UIComponent,
      JSONModel,
    ) {
      "use strict";
  
      return BaseController.extend("encore.controller.Home", {
        onInit() {
          // debugger;
          // this._mDialogs = {}; // Dialog initialization for view settings
          // const oRouter = UIComponent.getRouterFor(this);
          // oRouter.attachRouteMatched(this.fnRouteMatched.bind(this));
          // const oView = this.getView();
  
          // oView.setBusy(true);

          

          // const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          // oRouter.navTo("Home");

          

          this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);

          this.whoami();
          this.Application();
          this.Users();


        },

        getRouter: function () {
          return UIComponent.getRouterFor(this);
      },

      //   onNavItemSelect: function (oEvent) {
      //     const sKey = oEvent.getParameter("item").getKey();
      //     this.getRouter().navTo(sKey);
      // },

      // In your BaseController or the controller managing the SideNavigation
        // onNavItemSelect: function (oEvent) {
        //   var sKey = oEvent.getSource().getKey(); // Get the key of the selected item
        //   var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

        //   // Navigate to the selected page
        //   oRouter.navTo(sKey);

        //   // Reset the selection of the navigation list
        //   this.byId("sideNavigation").setSelectedKey("home");  // Reset to home or any default page
        // },   
       
      //   onNavItemSelect: function (oEvent) {
      //     var oSource = oEvent.getSource();
      //     var sKey = oSource.getText();  // Get the text if key is not available
      //     var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      //     oRouter.navTo(sKey);
      // },

      onNavItemSelect: function(oEvent) {
        var sKey = oEvent.getParameter("item").getKey();
        this._oRouter.navTo(sKey);  // Use the key to navigate
      },
      
      
        
        onTilePress: function(oEvent) {
        
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          
          
          oRouter.navTo("Subaccount");
          
        },
        
    });
  }
);
  