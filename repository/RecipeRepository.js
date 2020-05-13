const mongoose = require("mongoose");

class RecipeRepository {
  constructor() {}

  save(recipe, cb) {
    recipe.save(function (mayHaveError) {
      cb(mayHaveError);
    });
  }

  allRecipes() {
    return mongoose.model("Recipe").find().exec();
  }

  allRecipesById(id, cb) {
    mongoose.model("Recipe").findById(id, cb);
  }
}

module.exports = RecipeRepository;
