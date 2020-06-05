const recipeController = require("../controller/RecipeController");
const auth = require("../middlewares/auth");

const controller = new recipeController();

module.exports = function (app) {
  app.get("/recipes", auth, controller.doListRecipes);
  app.get("/recipes/:id", auth, controller.doListRecipeById);
  app.post("/recipes", auth, controller.doCreateRecipe);
};
