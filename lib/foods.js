var foodList = JSON.parse(localStorage.getItem('foods')) || [];
var originalName;

$('document').ready(function() {

  populateFoodsTable();

  $("#add-food").on('click', function() {

    $('.validation-error').text("");

    var foodName = $('#name-field input').val();
    var foodCalories = $('#calories-field input').val();

    if (foodName.length == 0) {
      $('#name-field .validation-error').html('Please enter a food name');
    }

    if (foodCalories.length == 0) {
      $('#calories-field .validation-error').html('Please enter a calorie amount');
    }

    if (foodName.length != 0 && foodCalories.length != 0) {
      addFoodToTable(foodName, foodCalories);

      var newFood = new Food(foodName, foodCalories);
      foodList.push(newFood);
      localStorage.setItem('foods', JSON.stringify(foodList));

      $('#name-field input').val("");
      $('#calories-field input').val("");
    }
  })

  $('tbody').on("click", ".food-delete", function() {
    $(this).parent().addClass("hidden");
    var name = $(this).siblings(".food-name").text();
    var foodToHide = _.find(foodList, function(food) {
      return food.name == name
    });
    foodToHide.visibility = "hidden"
    localStorage.setItem('foods', JSON.stringify(foodList));
  })

  $("#food-list").on("focus", ".food-name", function() {
    originalName = $(this).text();
  })

  $("#food-list").on("focus", ".food-calories", function() {
    originalName = $(this).siblings(".food-name").text();
  })

  $("#food-list").on('keydown', ".food-name, .food-calories", function(event) {
    if (event.keyCode == 13) {
      var foodToUpdate = _.find(foodList, function(food) {
        return food.name == originalName
      });
      foodToUpdate.name =     $(this).parent().children(".food-name").text();
      foodToUpdate.calories = $(this).parent().children(".food-calories").text();
      localStorage.setItem('foods', JSON.stringify(foodList));
      event.preventDefault();
      this.blur();
    }
  })

  $("#food-list").on('blur', ".food-name, .food-calories", function(event) {
    var foodToUpdate = _.find(foodList, function(food) {
      return food.name == originalName
    });
    foodToUpdate.name =     $(this).parent().children(".food-name").text();
    foodToUpdate.calories = $(this).parent().children(".food-calories").text();
    localStorage.setItem('foods', JSON.stringify(foodList));
  });

  function updateNameAndCalories() {
    var foodToUpdate = _.find(foodList, function(food) {
      return food.name == originalName
    });
    foodToUpdate.name =     $(this).parent().children(".food-name").text();
    foodToUpdate.calories = $(this).parent().children(".food-calories").text();
    localStorage.setItem('foods', JSON.stringify(foodList));
  }

  function addFoodToTable(name, calories, visibility) {
    var foodEntry = "<td contenteditable='true' class='food-name'>" + name + "</td>";
    var caloriesEntry = "<td contenteditable='true' class='food-calories'>" + calories + "</td>";
    var deleteButton = "<td class='food-delete'><button>-</button></td>";
    var newRow = "<tr class='food-row " + visibility + "'>" +
      foodEntry +
      caloriesEntry +
      deleteButton +
      "</tr>";
    $('tbody').prepend(newRow);
  }

  function populateFoodsTable() {
    foodList.forEach(function(element) {
      addFoodToTable(element.name, element.calories, element.visibility);
    })
  }

  function Food(name, calories) {
    this.name = name;
    this.calories = calories;
    this.visibility = "visible";
  }

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
