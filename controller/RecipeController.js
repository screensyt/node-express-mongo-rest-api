const recipeRepo = require("../repository/RecipeRepository");
const Recipe = require("../models/recipe");

class RecipeController {
  constructor() {}

  doListRecipes(req, res) {
    const repo = new recipeRepo();
    repo.allRecipes().then((recipes) => res.status(200).json(recipes));
  }

  doListRecipeById(req, res) {
    const repo = new recipeRepo();
    repo.allRecipesById(req.params.id, (err, recipes) => {
      res.status(200).json(recipes);
    });
  }

  doCreateRecipe(req, res, next) {
    const recipeData = req.body;

    const recipe = new Recipe({
      title: recipeData.title,
      desc: recipeData.desc,
      ingredients: recipeData.ingredients,
      coverImage: recipeData.coverImage,
    });

    const repo = new recipeRepo();
    repo.save(recipe, (mayHaveError) => {
      if (!mayHaveError) {
        res.status(200).json(recipe);
      } else {
        res.status(500).json(mayHaveError.message);
      }
    });
  }
}

module.exports = RecipeController;
