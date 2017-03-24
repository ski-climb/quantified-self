var foodList = JSON.parse(localStorage.getItem('foods')) || [];
var originalName;
var foodID = localStorage.getItem('foodID') || 0;
var API;

$('document').ready(function() {

  setHostname();
  populateFoodsTable();

  $("#add-food").on('click', function() {

    $('.validation-error').text("");

    var foodName = $('#name-field input').val();
    var foodCalories = $('#calories-field input').val();

    if (foodName.length == 0) {
      showFoodNameError();
    }

    if (foodCalories.length == 0) {
      showFoodCaloriesError();
    }

    if (foodName.length != 0 && foodCalories.length != 0) {
      saveFoodToDatabase(foodName, foodCalories)
      clearFoodAndCalorieInput()
    }
  })

  $('tbody').on("click", ".food-row .food-delete", function() {
    // add hidden class to row
    // ajax update to change visibility of food based on id

    var foodId = $(this).parent().data('id')
    var foodName = $(this).siblings('.food-name').text()
    var foodCalories = $(this).siblings('.food-calories').text()
    var food = {
      id: foodId,
      name: foodName,
      calories: parseInt(foodCalories),
      visibility: "hidden"
    }

    $.ajax({
      url: API + "/api/foods/" + foodId,
      method: 'PUT',
      data: food
    })
    .done(function(data) {
      addFoodToTable(data.id, foodName, foodCalories, food.visibility);
    })
    .fail(function() {
      console.log("fail");
    });

    $(this).parent().addClass("hidden");
  })

  $("#food-list").on("focus", ".food-name", function() {
    originalName = $(this).text();
  })

  $("#food-list").on("focus", ".food-calories", function() {
    originalName = $(this).siblings(".food-name").text();
  })

  $("#food-list").on('keydown', ".food-name, .food-calories", function(event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      this.blur();
    }
  })

  $("#food-list").on('blur', ".food-name, .food-calories", function(event) {
    updateNameAndCalories($(this));
  });

  $("#food-filter input").keyup(function () {
    //split the current value of the search input
    var searchInput = this.value.toUpperCase().split(" ");
    //create a jquery object of the rows
    var rows = $("#food-items").find("tr");
    if (this.value == "") {
      rows.show();
      return;
    }
    //hide all the rows
    rows.hide();

    //Recusively filter the jquery object to get results.
    rows.filter(function () {
      for (var i = 0; i < searchInput.length; ++i) {
        if ($(this).text().toUpperCase().indexOf(searchInput[i]) > -1) {
          return true;
        }
      }
      return false;
    })
    //show the rows that match.
    .show();
  })

});


function showFoodCaloriesError() {
  $('#calories-field .validation-error').html('Please enter a calorie amount');
}

function showFoodNameError() {
  $('#name-field .validation-error').html('Please enter a food name');
}

function populateFoodsTable() {

  $.ajax({
    url: API + "/api/foods",
    method: 'GET'
  })
  .done(function(data) {
    data.forEach(function(element) {
      addFoodToTable(element.id, element.name, element.calories, element.visibility);
    })
  })
  .fail(function() {
    console.log("fail");
  });
}

function Food(name, calories) {
  this.id = nextFoodID();
  this.name = name;
  this.calories = calories;
  this.visibility = "visible";
}

function nextFoodID() {
  foodID += 1;
  saveFoodIDToLocalStorage(foodID);
  return foodID;
}

function saveFoodIDToLocalStorage(foodID) {
  localStorage.setItem('foodID', foodID)
}

function updateNameAndCalories($editedField) {
  var foodToUpdate = findFoodByName(originalName);
  updateFoodName($editedField, foodToUpdate);
  updateFoodCalories($editedField, foodToUpdate);
  saveFoodListToLocalStorage();
}

function saveFoodListToLocalStorage() {
  localStorage.setItem('foods', JSON.stringify(foodList));
}

function updateFoodName($editedField, foodToUpdate) {
  foodToUpdate.name = $editedField.parent().children(".food-name").text();
}

function updateFoodCalories($editedField, foodToUpdate) {
  foodToUpdate.calories = $editedField.parent().children(".food-calories").text();
}

function findFoodByName(name) {
  return _.find(foodList, function(food) {
    return food.name == name
  });
}

function findFoodByID(id) {
  return _.find(foodList, function(food) {
    return food.id == id
  });
}

function addFoodToTable(id, name, calories, visibility) {
  var foodEntry = "<td contenteditable='true' class='food-name'>" + name + "</td>";
  var caloriesEntry = "<td contenteditable='true' class='food-calories'>" + calories + "</td>";
  var deleteButton = "<td class='food-delete'><button>-</button></td>";
  var newRow = "<tr class='food-row " + visibility + "' data-id=" + id + ">" +
    foodEntry +
    caloriesEntry +
    deleteButton +
    "</tr>";
  $('#food-items').prepend(newRow);
}

function saveFoodToDatabase(foodName, foodCalories) {
  var food = {
    name: foodName,
    calories: foodCalories,
    visibility: "visible"
  }

  $.ajax({
    url: API + "/api/foods",
    method: 'POST',
    data: food
  })
  .done(function(data) {
    addFoodToTable(data.id, foodName, foodCalories, food.visibility);
  })
  .fail(function() {
    console.log("fail");
  });
}

function clearFoodAndCalorieInput() {
  $('#name-field input').val("");
  $('#calories-field input').val("");
}

function setHostname() {
  if (window.location.hostname == "ski-climb.github.io") {
    API = "https://hidden-cupcakes.herokuapp.com"
  } else {
    API = "http://localhost:3030"
  }
}
