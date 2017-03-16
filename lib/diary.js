var dayList = JSON.parse(localStorage.getItem('days')) || [];

$('document').ready(function() {

  populateFoodsTableIncludingCheckboxes();

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

  function populateFoodsTableIncludingCheckboxes() {
    foodList.forEach(function(element) {
      addFoodToDiaryFoodTable(element.name, element.calories, element.id, element.visibility);
    })
  }

  $('#add-breakfast').on("click", function(){
    var rows = $("input:checked").parents('tr');
    var name;
    var calories;
    var id;
    var mealIds = [];

    $.each(rows, function(row) {
      name = $(this).children('.food-name').text();
      calories = $(this).children('.food-calories').text();
      id = $(this).children('.food-id').text();
      mealIds.push(id)

      addFoodToMealTable(name, calories, id, "breakfast");
    })

    var date = $('#date-display').text();
    var newDay = new Day(date, "breakfast", mealIds);

    dayList.push(newDay);
    // saveFoodListToLocalStorage();


    // Get food from list
    // populate the meal table

    // save foods to meal in local storege
    // clear checkboxes
  })

  function Day(mealDate, meal, mealIds) {
    debugger
    date: mealDate
    meal: mealIds
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

      $("#breakfast-items").prepend(newRow);
  }

});
