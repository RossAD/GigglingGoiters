var Ingredient = require('../ingredients/ingredientController.js');
var User_Recipe = ('../user_recipe/user_recipeModel.js');
var Recipe = ('./recipeModel.js');
var env = require('../env/env.js');
var api_key = env.api_key;
var request = require('request');
var findByIngredients = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients';
var Q = require('q');

var findUser_Recipe = Q.nbind(User_Recipe.find, User_Recipe);
var createUser_Recipe = Q.nbind(User_Recipe.create, User_Recipe);
var createRecipe = Q.nbind(Recipe.create, Recipe);

module.exports = {
  //Make temp functionality for non-logged in users?
  tempGetRecipes: function(req, res, next) {
    var options = {
      url: findByIngredients,
      headers: {
        'X-Mashape-Key': api_key
      },
      qs: {ingredients: Ingredient.getAllIngredients()}
    };
    request.get(options, function (error, response, body) {
      if (error) {
        console.log("Error with getRecipes request:", error);
      } else {
        res.end(body);
      }
    });
  },

  getRecipes: function (req, res, next) {
    var email = req.user.email;
    Ingredient.getAllIngredients( email, function( cart ){
      var ingredients = cart.ingredients.join();
      var options = {
        url: findByIngredients,
        headers: {
          'X-Mashape-Key': api_key
        },
        qs: {ingredients: ingredients}
      };
      request.get(options, function (error, response, body) {
        if (error) {
          console.log("Error with getRecipes request:", error);
        } else {
          console.log('special recipes for a@a.com cart: ', body);
          res.end(body);
        }
      });
    });
  },

  getSavedRecipes: function( req, res, next ){
    var email = req.user.email;
    findUser_Recipe({email: email})
    .then(function( found ){
      //iterate through found here? It will probably be an array of all fields that include that user email, since a user can have many saved recipes
      console.log('getSavedRecipes returns this =================>>>>>>>>>>>', found);
        //collect all recipe_id fields
      //search recipes collection and return all recipes with matching id's
    });
  },

  saveRecipe: function( req, res, next ) {
    var recipe = req.body.recipe;
    var recipe_id = req.body.recipe.id;
    var user_email = req.user.email;
    //Save recipe to Recipe
    createRecipe(recipe).then(function ( recipe ) {
      //Save user and recipe together in user_recipe join table
      createUser_Recipe({user_email: user_email, recipe_id: recipe_id})
      .then(function ( user_recipe ){
        res.send(200, user_recipe);
      })
      .fail(function ( err ){
        res.send(500, err);
      });
    });
  }

};