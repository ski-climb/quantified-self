var dayList = JSON.parse(localStorage.getItem('days')) || [];

$('document').ready(function() {

  populateFoodsTableIncludingCheckboxes();
  populateAllMealTablesForDay();

  $("#breakfast, #lunch, #dinner, #snack").on("click", function(){
    var meal = $(this).attr('id');
    var mealIDs = [];

    addFoodToMealTable(meal, mealIDs);
    createOrUpdateMealDay(meal, mealIDs);
    saveDayListToLocalStorage();
    clearCheckBoxes();
  })

  $('#nav-left').on('click', function() {
    var date = $('#date-display').text();
    var newDate = moment(date, 'MMMM Do, YYYY').add(-1, 'days');
    var dateDisplay = $('#date-display');
    dateDisplay.html(newDate.format('MMMM Do, YYYY'));
    clearAllMealTablesForDay();
    populateAllMealTablesForDay();
  });


  $('#nav-right').on('click', function() {
    var date = $('#date-display').text();
    var newDate = moment(date, 'MMMM Do, YYYY').add(1, 'days');
    var dateDisplay = $('#date-display');
    dateDisplay.html(newDate.format('MMMM Do, YYYY'));
    clearAllMealTablesForDay();
    populateAllMealTablesForDay();
  });

  $('tbody').on('click', '.meal-row .food-delete', function() {
    var $id = $(this).siblings('.food-id').text();
    var meal = $(this).data('meal');

    var date = $('#date-display').text();
    var day = findDay(date);

    var index = day[meal].indexOf($id);
    day[meal].splice(index, 1);

    saveDayListToLocalStorage();

    $(this).parents('tr').remove();
    updateTotalCalories();
    udpateRemainingCalories();
  });
});

function clearCheckBoxes() {
    $("input:checked").prop("checked", false);
}

function createOrUpdateMealDay(meal, mealIDs) {
  var date = $('#date-display').text();
  var mealDay = findDay(date);

  if (mealDay) {
    updateMealDay(mealDay, meal, mealIDs);
  } else {
    mealDay = new Day(date, meal, mealIDs);
    dayList.push(mealDay);
  }
}

function addFoodToMealTable(meal, mealIDs) {
  var rows = $("input:checked").parents('tr');
  $.each(rows, function() {
    var name = $(this).children('.food-name').text();
    var calories = $(this).children('.food-calories').text();
    var id = $(this).children('.food-id').text();
    mealIDs.push(id);

    generateFoodRowForMeal(name, calories, id, meal);
    updateTotalCalories();
    udpateRemainingCalories();
  })
}

function updateMealDay(mealDay, meal, mealIDs) {
  mealDay[meal] = mealDay[meal] || [];
  for (var i = 0; i < mealIDs.length; i++) {
    mealDay[meal].push(mealIDs[i]);
  }
}

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
          generateFoodRowForMeal(food.name, food.calories, food.id, meals[i])
        });
      }
    }
  }
  updateTotalCalories();
  udpateRemainingCalories();
}

function clearAllMealTablesForDay() {
  $('tr.meal-row').remove();
}

function findDay(date) {
  return _.find(dayList, function(day) {
    return day.date == date
  });
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

function generateFoodRowForMeal(name, calories, id, meal) {
  var nameEntry = "<td class='food-name'>" + name + "</td>"
    var caloriesEntry = "<td class='food-calories'>" + calories + "</td>"
    var idEntry = "<td class='food-id hidden'>" + id + "</td>"
    var deleteButton = "<td class='food-delete' data-meal=" + meal + "><button>-</button></td>"
    var newRow = "<tr class='meal-row'>" +
    nameEntry +
    caloriesEntry +
    idEntry +
    deleteButton +
    "</tr>";

  $("#" + meal + "-items").prepend(newRow);
}

function updateTotalCalories() {
  var $caloriesCalculations = $('.total-calories-calc');
  $.each($caloriesCalculations, function() {
    var totalCalories = 0;
    var $mealCalories = $(this).parent().siblings('.meal-row').children('.food-calories');
    $.each($mealCalories, function() {
      var calories = parseInt($(this).text());
      totalCalories += calories;
    });
    $(this).text(totalCalories);
  });
  totalCaloriesForDay();
}

function udpateRemainingCalories() {
  var $remainingCaloriesCalculations = $('.remaining-calories-calc');
  $.each($remainingCaloriesCalculations, function() {
    var available = $(this).data('calories');
    var used = $(this).parent().siblings().children('.total-calories-calc').text();
    var remaining = available - parseInt(used);
    $(this).text(remaining);
    colorCodeValue($(this), remaining);
  });
  totalRemainingCaloriesForDay();
}

function colorCodeValue(element, value) {
  if (value <= 0) {
    element.removeClass('too-thin');
    element.addClass('well-fed');
  } else {
    element.removeClass('well-fed');
    element.addClass('too-thin');
  }
}

function totalCaloriesForDay() {
  var $caloriesByMeal = $('.total-calories-calc');
  var total = 0;
  $.each($caloriesByMeal, function() {
    var calories = parseInt($(this).text());
    total += calories;
  });
  $('.calories-consumed-calc').text(total);
}

function totalRemainingCaloriesForDay() {
  var goal = $('.goal-calories-calc').text();
  var consumed = $('.calories-consumed-calc').text();
  var remaining = parseInt(goal) - parseInt(consumed);
  var $totalRemaining = $('.total-remaining-calories-calc');
  $totalRemaining.text(remaining);
  colorCodeValue($totalRemaining, remaining);
}
