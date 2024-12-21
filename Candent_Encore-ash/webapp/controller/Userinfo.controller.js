sap.ui.define([
  "encore/controller/BaseController"
], function (BaseController) {
  "use strict";

  return BaseController.extend("encore.controller.Userinfo", {

      onInit: function () {
          // Router Initialization
          this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);

          // Initialize or fetch userModel
          var oModel = this.getView().getModel("userModel"); // Existing model
          if (!oModel) {
              oModel = new sap.ui.model.json.JSONModel();
              this.getView().setModel(oModel, "userModel");
          }

          var loggedInUserId = localStorage.getItem("loggedInUserId");
          var allUsers = oModel && oModel.getProperty("/users");
          if (allUsers) {
              var filteredUser = allUsers.find(user => user.id === loggedInUserId);
              if (filteredUser) {
                  oModel.setProperty("/currentUser", filteredUser);
              }
          } else {
              console.warn("No users available in the model.");
          }
          
          
          this.Users();
      },

      onNavItemSelect: function (oEvent) {
          var sKey = oEvent.getParameter("item").getKey();
          this._oRouter.navTo(sKey); // Use the key to navigate
      },

      onEditPress: function (oEvent) {
          var oUserData = oEvent.getSource().getBindingContext("userModel").getObject();

          if (!this._oEditDialog) {
              this._oEditDialog = sap.ui.xmlfragment("encore.view.fragments.EditUserDialog", this);
              this.getView().addDependent(this._oEditDialog);
          }

          var oEditUserModel = new sap.ui.model.json.JSONModel(oUserData);
          this._oEditDialog.setModel(oEditUserModel, "editUserModel");
          this._oEditDialog.open();
      },

      onSaveEdit: function () {
          var oModel = this._oEditDialog.getModel("editUserModel").getData();

          fetch("/api/users/update", {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(oModel)
          })
          .then(response => {
              if (!response.ok) {
                  throw new Error("Failed to update user.");
              }
              return response.json();
          })
          .then(data => {
              sap.m.MessageToast.show("User updated successfully.");
              this._oEditDialog.close();
          })
          .catch(error => {
              console.error("Error updating user:", error);
              sap.m.MessageToast.show("Failed to update user.");
          });
      },

      onCancelEdit: function () {
          this._oEditDialog.close();
      }
  });
});
