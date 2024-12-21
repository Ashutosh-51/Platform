sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent",
    "sap/m/MessageToast",
  ],
  function (Controller, JSONModel, UIComponent, MessageToast) {
    "use strict";

    return Controller.extend("encore.controller.Login", {
      onInit: function () {
        this.loadInitalData();
      },


      loadInitalData: function () {
        // const oAccountModel = new JSONModel();
        // oAccountModel.loadData("model/account.json");
        // this.getView().setModel(oAccountModel, "account");

        // // view model data
        const oView = this.getView();
        const oModel = new JSONModel({ username: "", password: "" });
        oView.setModel(oModel);
      },
      
      onLoginPress: function () {
        const oView = this.getView();
        const oModel = oView.getModel();
        const oData = oModel.getData(); // Ensure your model contains `username` and `password`
        const oRouter = UIComponent.getRouterFor(this);
      
        // Ensure `username` and `password` exist
        if (!oData.username || !oData.password) {
          MessageToast.show("Please enter both username and password");
          return;
        }
      
        // Perform the authentication fetch
        fetch("api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies with the request
          body: JSON.stringify({
            username: oData.username, // Extract username and password from oData
            password: oData.password,
          }),
        })
          .then((response) => {
            // Check if the response is OK (status code 200-299)
            if (!response.ok) {
              throw new Error(`HTTP status ${response.status}`);  // Throw an error if status is not OK
            }
            return response.json();  // Parse the JSON if status is OK
          })
          .then((resp) => {
            // Handle successful login

            localStorage.setItem("authToken", resp.authToken);
            
            MessageToast.show(resp.message);
            oRouter.navTo("Home");  // Only navigate to Home if login is successful
          })
          .catch((error) => {
            // Handle any errors, including 401 Unauthorized
            if (error.message.includes("401")) {
              MessageToast.show("Invalid username or password. Please try again.");
            } else {
              MessageToast.show("An error occurred during login.");
            }
            console.error("Login error:", error);  // Log the error for debugging
          });
      },
    });
  }
);
