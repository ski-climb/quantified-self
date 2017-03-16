var dayList = JSON.parse(localStorage.getItem('days')) || [];

$('document').ready(function() {

  populateFoodsTableIncludingCheckboxes();
  populateAllMealTablesForDay();

  function addFoodToDiaryFoodTable(name, calories, id, visibility) {
    var checkbox = "<td><input type='checkbox'></td>";
    var nameEntry = "<td class='food-name'>" + name + "</td>";
    var caloriesEntry = "<td class='food-calories'>" + calories + "</td>";
    var idEntry = "<td class='food-id hidden'>" + id + "</td>";
    var newRow = "<tr class='food-row " + visibility + "'>" +
      checkbox +
      nameEntry +
      caloriesEntry +
      idEntry +
      "</tr>";
    $('#diary-food-items').prepend(newRow);
  }

  function populateAllMealTablesForDay() {
    var date = $('#date-display').text();
    var day = findDay(date);
    var meals = ["breakfast", "lunch", "dinner", "snack"];

    if (day) {
      for (var i = 0; i < meals.length; i++) {
        if (day[meals[i]]) {
          day[meals[i]].forEach(function(id) {
            var food = findFoodByID(id);
            addFoodToMealTable(food.name, food.calories, food.id, meals[i])
          });
        }
      }
    }
  }

  function findFoodByID(id) {
    return _.find(foodList, function(food) {
      return food.id == id
    });
  }

  function populateFoodsTableIncludingCheckboxes() {
    foodList.forEach(function(food) {
      addFoodToDiaryFoodTable(food.name, food.calories, food.id, food.visibility);
    });
  }

  $("#breakfast, #lunch, #dinner, #snack").on("click", function(){
    var meal = $(this).attr('id');
    var rows = $("input:checked").parents('tr');
    var mealIDs = [];


    $.each(rows, function() {
      var name = $(this).children('.food-name').text();
      var calories = $(this).children('.food-calories').text();
      var id = $(this).children('.food-id').text();
      mealIDs.push(id);

      addFoodToMealTable(name, calories, id, meal);
    })

    var date = $('#date-display').text();
    var mealDay = findDay(date);

    if (mealDay) {
      updateMealDay(mealDay, meal, mealIDs);
    } else {
      mealDay = new Day(date, meal, mealIDs);
      dayList.push(mealDay);
    }

    saveDayListToLocalStorage();
    $("input:checked").prop("checked", false);
  })

  function updateMealDay(mealDay, meal, mealIDs) {
    mealDay[meal] = mealDay[meal] || [];
    for (var i = 0; i < mealIDs.length; i++) {
      mealDay[meal].push(mealIDs[i]);
    }
  }

  function findDay(date) {
    return _.find(dayList, function(day) {
      return day.date == date
    });
  }

  function saveDayListToLocalStorage() {
    localStorage.setItem('days', JSON.stringify(dayList));
  }

  function Day(date, meal, mealIDs) {
    this[meal] = this[meal] || [];
    this.date = date;
    for (var i=0; i<mealIDs.length; i++) {
      this[meal].push(mealIDs[i]);
    }
  };

  function addFoodToMealTable(name, calories, id, meal) {
    var nameEntry = "<td class='food-name'>" + name + "</td>"
    var caloriesEntry = "<td class='food-calories'>" + calories + "</td>"
    var idEntry = "<td class='food-id hidden'>" + id + "</td>"
    var deleteButton = "<td class='food-delete'><button>-</button></td>"
    var newRow = "<tr class='food-row'>" +
                 nameEntry +
                 caloriesEntry +
                 idEntry +
                 deleteButton +
                 "</tr>";

    $("#" + meal + "-items").prepend(newRow);
  }
});
