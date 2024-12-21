sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/UIComponent"],

  function (Controller, UIComponent) {
    "use strict";

    return Controller.extend("encore.controller.BaseController", {
      onInit: function () {
        // const accountModel = new sap.ui.model.json.JSONModel();
        // this.getView().setModel(accountModel, "accountModel");

        //     var authToken = localStorage.getItem("authToken");

        // if (!authToken) {
        //     // If no authToken, redirect to login page
        //     var oRouter = this.getOwnerComponent().getRouter();
        //     oRouter.navTo("Login"); // Ensure "Login" is the correct route name
        // } else {
        //     // Optionally, validate the token with an API call
        //     fetch("http://localhost:8080/api/auth/validate", {
        //         method: "POST",
        //         headers: {
        //             "Authorization": `Bearer ${authToken}`
        //         }
        //     })
        //     .then(response => {
        //         if (!response.ok) {
        //             throw new Error("Session invalid");
        //         }
        //     })
        //     .catch(error => {
        //         console.error("Session validation failed:", error);

        //         // Redirect to login if validation fails
        //         localStorage.clear();
        //         var oRouter = this.getOwnerComponent().getRouter();
        //         oRouter.navTo("Login");
        //     });
        //     }

        const applicationModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(applicationModel, "applicationModel");

        const userModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(userModel, "userModel");

        const oModel = new JSONModel({
          selectedKey: "Home" // Default selected key
        });
        this.getView().setModel(oModel);

        this.whoami();
        this.Users();
        this.onNavItemDeselect();
      },

      /**
       * Get router for navigation
       * @returns {sap.ui.core.routing.Router} Router instance
       */

      getRouter: function () {
        return UIComponent.getRouterFor(this);
      },

      sendIntials: function (username) {
        if (!username) {
          return ""; // Return an empty string if username is null or undefined
        }

        // Split the username into parts (assuming "First Last")
        const parts = username.trim().split(" ");

        // Extract the first letter of the first and last name
        const initials =
          parts[0]?.[0]?.toUpperCase() + (parts[1]?.[0]?.toUpperCase() || "");

        return initials || ""; // Return initials or an empty string if unavailable
      },

      // Get the NavigationList control and call deselectAll()
      onNavItemDeselect: function () {
        var oNavList = this.byId("sideNavigation").getAggregation("items");
        oNavList.forEach(function (item) {
          item.setSelected(false);
        });
      },

      // onCollapsePress: function () {
      //   const oPage = this.byId("layout_page");
      //   const bExpanded = oPage.getSideExpanded();
      //   oPage.setSideExpanded(!bExpanded);
      // },

      onCollapsePress: function () {
        // Logic for collapsing or toggling side navigation
        const oView = this.getView();
        const oSideNavigation = oView.byId("sideNavigation"); // Replace with your side navigation ID

        if (oSideNavigation) {
            const bExpanded = oSideNavigation.getExpanded();
            oSideNavigation.setExpanded(!bExpanded);
        } else {
            console.error("Side navigation not found!");
        }
      },

      onProfilePress: function (oEvent) {
        // Get the Avatar control and the Menu
        var oButton = this.byId("avatarButton");
        var oMenu = this.byId("profileMenu");

        // Open the menu where the avatar is clicked
        oMenu.openBy(oButton);
      },

      whoami: function () {
        fetch("auth/whoami", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .catch((error) => {
            console.error(
              "There was a problem with the fetch operation:",
              error
            );
          });
      },

      Application: function () {
        fetch("api/application", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            const applicationModel =
              this.getView().getModel("applicationModel");

            // Ensure data is in an array format
            const applicationArray = Array.isArray(data) ? data : [data];

            if (applicationModel) {
              applicationModel.setData({ applications: applicationArray });
            } else {
              // console.error("applicationModel is undefined.");
            }
          })
          .catch((error) => {
            console.error(
              "There was a problem with the fetch operation:",
              error
            );
          });
      },

      // Users: function() {
      //     fetch("http://localhost:5000/users", {
      //         method: "GET",
      //         headers: {
      //             "Content-Type": "application/json",
      //         },
      //         credentials: "include"
      //     })
      //     .then(response => {
      //         if (!response.ok) {
      //             throw new Error("Network response was not ok");
      //         }
      //         return response.json();
      //     })
      //     .then(data => {
      //         const userModel = this.getView().getModel("UserModel");

      //         console.log("Fetched account data:", data);

      //         // Ensure data is in an array format
      //         const usersArray = Array.isArray(data) ? data : [data];

      //         if (userModel) {
      //             userModel.setData({ users: usersArray });
      //         } else {
      //             console.error("UserModel is undefined.");
      //         }
      //     })
      //     .catch(error => {
      //         console.error("There was a problem with the fetch operation:", error);
      //     });
      // },

      Users: function () {
        fetch("api/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            const userModel = this.getView().getModel("userModel");

            console.log("Fetched user data:", data);

            // Ensure the response is in the expected format (an object containing a "users" array)
            if (data && Array.isArray(data.users) && data.users.length > 0) {
              if (userModel) {
                userModel.setData(data); // Set the entire "data" object, assuming "users" key exists
              } else {
                // console.error("UserModel is undefined.");
              }
            } else {
              console.error("No user data found or users array is empty.");
              if (userModel) {
                userModel.setData({ users: [] }); // Reset model to an empty array
              }
            }
          })
          .catch((error) => {
            console.error(
              "There was a problem with the fetch operation:",
              error
            );
            const userModel = this.getView().getModel("userModel");
            if (userModel) {
              userModel.setData({ users: [] }); // Reset model to an empty array on error
            }
          });
      },

      onLogoutPress: function () {
        // Clear cookies
        document.cookie.split(";").forEach(function (cookie) {
          var name = cookie.split("=")[0].trim();
          document.cookie =
            name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
        });

        // Clear localStorage and sessionStorage
        localStorage.clear();
        sessionStorage.clear();

        // Perform logout API call
        fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        })
          .then(() => {
            // Redirect to login
            localStorage.removeItem("authToken");
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("Login");
          })
          .catch((error) => console.error("Logout failed:", error));
      },

      onSaveEdit: function () {
        var oUpdatedUser = this._oEditDialog.getModel("editUser").getData();

        // Perform the update operation using a fetch call
        fetch("/auth/users/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(oUpdatedUser),
        })
          .then((response) => response.json())
          .then((data) => {
            // Handle the response from the backend, e.g., refresh the user list
            this._oEditDialog.close();
            sap.m.MessageToast.show("User updated successfully");
            this._refreshUserList();
          })
          .catch((error) => {
            console.error("Error updating user:", error);
            sap.m.MessageToast.show("Failed to update user");
          });
      },

      onNavItemSelect: function (oEvent) {
        // Get selected item's key
        const sSelectedKey = oEvent.getParameter("item").getKey();
        
        // Update the selectedKey in the model
        const oModel = this.getView().getModel();
        oModel.setProperty("/selectedKey", sSelectedKey);

        // Navigate to the respective route
        this.getRouter().navTo(sSelectedKey);
      },

      // onNavItemSelect: function(oEvent) {
      //     var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      //     var oSelectedKey = oEvent.getParameter("item").getKey();

      //     oRouter.navTo("myRoute", {
      //         key: oSelectedKey
      //     });
      // }
      // onNavItemSelect: function(oEvent) {
      //   var sKey = oEvent.getSource().getKey();
      //   var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

      //   oRouter.navTo(sKey);
      //   // this.getOwne?rComponent().getRouter().navTo("Home");
      // },
    });
  }
);
