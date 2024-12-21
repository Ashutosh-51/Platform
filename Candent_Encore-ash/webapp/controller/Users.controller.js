sap.ui.define([
    "encore/controller/BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("encore.controller.Users", {

        // Controller-specific initialization logic
        onInit: function () {

            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            const userModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(userModel, "userModel");

            this.Users();

        },
        
        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

        onNavItemSelect: function (oEvent) {
            var sKey = oEvent.getSource().getKey(); // Get the key of the selected item
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
  
            // Navigate to the selected page
            oRouter.navTo(sKey);
  
            // Reset the selection of the navigation list
            this.byId("sideNavigation").setSelectedKey("home");  // Reset to home or any default page
        }, 
        


        onSelectionChange: function(oEvent) {
            var oTable = oEvent.getSource();
            var oSelectedItem = oTable.getSelectedItem();
        
            if (!oSelectedItem) {
                console.error("No user selected.");
                return;
            }
        
            // Get the selected user's binding context
            var oBindingContext = oSelectedItem.getBindingContext("userModel");
            if (!oBindingContext) {
                console.error("No binding context found for the selected item.");
                return;
            }
        
            // Set the selected user in the model
            var oSelectedUser = oBindingContext.getObject();
            this.getView().getModel("userModel").setProperty("/selectedUser", oSelectedUser);
        },

        onCreateUser() {
            if (!this._oCreateUserDialog) {
                this._oCreateUserDialog = sap.ui.xmlfragment("encore.view.fragments.CreateUser", this);
                this.getView().addDependent(this._oCreateUserDialog);
            }
        
            // Initialize a new JSON model for the dialog
            var oCreateUserModel = new sap.ui.model.json.JSONModel({
                firstName: "",
                email: "",
                contact: "",
                createdBy: "",
                updatedBy: "",
                password: "",
            });
            this._oCreateUserDialog.setModel(oCreateUserModel, "createUserModel");
            this._oCreateUserDialog.open();
        },

        onSaveCreateUser: function () {
            var oModel = this._oCreateUserDialog.getModel("createUserModel");
            var oData = oModel.getData();
        
            fetch("api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(oData),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to create user. Status: " + response.status);
                }
                return response.json();
            })
            .then(data => {
                sap.m.MessageToast.show("User created successfully!");
                this._oCreateUserDialog.close();
                this.refreshUserList(); // Refresh user table after creating a user
            })
            .catch(error => {
                console.error("Error creating user:", error);
                sap.m.MessageToast.show("Error creating user.");
            });
        },
        
        onCloseDialog: function() {
            if (this._oCreateUserDialog) {
                this._oCreateUserDialog.close();
            }
        },

        refreshUserList: function () {
            var oUserModel = this.getView().getModel("userModel");
            oUserModel.loadData("api/users");
        },
        
        // onEditUser: function(oEvent) {
        //     // Get selected item from the table
        //     var oContext = this.getView().getModel("userModel").getData();
            
        //     // Check if the selected item exists
        //     if (!oContext) {
        //         sap.m.MessageToast.show("No user selected for editing");
        //         return;
        //     }
        
        //     // Create a JSON model for the dialog if not already created
        //     let oDialogModel = this.getView().getModel("dialogModel");
        //     if (!oDialogModel) {
        //         oDialogModel = new sap.ui.model.json.JSONModel();
        //         this.getView().setModel(oDialogModel, "dialogModel");
        //     }
        
        //     // Set selected user data to the dialog model
        //     oDialogModel.setData(oContext);
        
        //     // Open the dialog
        //     if (!this._oEditDialog) {
        //         this._oEditDialog = sap.ui.xmlfragment(
        //             "encore.view.fragments.EditUser",  // Replace with your dialog fragment path
        //             this
        //         );
        //         this.getView().addDependent(this._oEditDialog);
        //     }
        //     this._oEditDialog.open();
        // },
        
        onEditUser(oEvent) {
            // Get the selected user data from the event or context
            var oUserData = oEvent.getSource().getBindingContext("userModel").getObject();
        
            // Open the edit user dialog if not already created
            if (!this._oEditUserDialog) {
                this._oEditUserDialog = sap.ui.xmlfragment("encore.view.fragments.EditUser", this);
                this.getView().addDependent(this._oEditUserDialog);
            }
        
            // Set the user data into the model
            var oEditUserModel = new sap.ui.model.json.JSONModel(oUserData);
            this._oEditUserDialog.setModel(oEditUserModel, "editUserModel");
        
            // Open the dialog
            this._oEditUserDialog.open();
        },
        
        
        // Save the edited user data
        onSaveEditUser: function () {
            // Get the model from the edit user dialog
            var oModel = this._oEditUserDialog.getModel("editUserModel");
            var oUserData = oModel.getData(); // Get the edited user data
        
            // Make the API call to update the user data
            fetch("api/auth/update/" + oUserData.id, {
                method: "PUT", // Use PUT method to update the existing user
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(oUserData), // Send the updated user data
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to update user. Status: " + response.status);
                }
                return response.json();
            })
            .then(data => {
                sap.m.MessageToast.show("User updated successfully!");
                this._oEditUserDialog.close(); // Close the dialog after successful update
                this.refreshUserList(); // Call method to refresh the user list after update
            })
            .catch(error => {
                console.error("Error updating user:", error);
                sap.m.MessageToast.show("Error updating user.");
            });
        },
        
        // Close the dialog without saving
        onCloseDialog: function () {
            // Close the dialog
            this._oEditUserDialog.close();
        },
        
        refreshUserList: function () {
            // Fetch the updated user list from the backend
            fetch("api/users")
                .then(response => response.json())
                .then(users => {
                    // Assuming you have a model called "userModel" for the user list
                    var oUserModel = new sap.ui.model.json.JSONModel(users);
                    this.getView().setModel(oUserModel, "userModel");
                })
                .catch(error => {
                    console.error("Error fetching user list:", error);
                });
        },

        onDeleteUser: function () {
            var oTable = this.getView().byId("userTable");
            var aSelectedItems = oTable.getSelectedItems();
        
            // Check if any items are selected
            if (aSelectedItems.length === 0) {
                sap.m.MessageToast.show("Please select a user to delete.");
                return;
            }
        
            // Collect the user IDs
            var UserIds = [];
            aSelectedItems.forEach(function (oItem) {
                var oBindingContext = oItem.getBindingContext("userModel");
                if (oBindingContext) {
                    var oData = oBindingContext.getObject();
                    UserIds.push(oData.id); // Assuming 'id' is the field in your model
                }
            });
        
            // Create the custom dialog
            var oDialog = new sap.m.Dialog({
                title: "Confirm Deletion",
                type: sap.m.DialogType.Message,
                content: new sap.m.Text({
                    text: "Are you sure you want to delete the selected user(s)?"
                }),
                beginButton: new sap.m.Button({
                    text: "Yes",
                    press: function () {
                        oDialog.close(); // Close the dialog
        
                        // Perform the delete API call
                        fetch("http://localhost:5000/api/auth/delete/" + UserIds.join(','), {
                            method: "DELETE",
                        })
                            .then(response => {
                                if (!response.ok) {
                                    console.error("Failed to delete user. Status:", response.status);
                                    throw new Error("Failed to delete user. Status: " + response.status);
                                }
                                return response.json();
                            })
                            .then(data => {
                                console.log("User(s) deleted successfully:", data);
                                sap.m.MessageToast.show(data.message || "User(s) deleted successfully!");
                                this.refreshUserList();
                            })
                            .catch(error => {
                                console.error("Error deleting user:", error);
                                sap.m.MessageToast.show("Error deleting user.");
                            });
                    }.bind(this), // Preserve `this` context
                }),
                endButton: new sap.m.Button({
                    text: "No",
                    press: function () {
                        oDialog.close(); // Close the dialog
                    }
                })
            });
        
            // Open the dialog
            oDialog.open();
        },                                    
    });
});
