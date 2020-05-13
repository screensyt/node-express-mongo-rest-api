const recipeController = require("../controller/RecipeController");

const controller = new recipeController();

module.exports = function (app) {
  app.get("/recipes", controller.doListRecipes);
  app.get("/recipes/:id", controller.doListRecipeById);
  app.post("/recipes", controller.doCreateRecipe);
};
