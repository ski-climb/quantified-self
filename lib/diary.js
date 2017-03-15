$('document').ready(function() {

  populateFoodsTableIncludingCheckboxes();

  function addFoodToDiaryFoodTable(name, calories, visibility) {
    var checkbox = "<td><input type='checkbox'></td>";
    var nameEntry = "<td class='food-name'>" + name + "</td>";
    var caloriesEntry = "<td class='food-calories'>" + calories + "</td>";
    var newRow = "<tr class='food-row " + visibility + "'>" +
      checkbox +
      nameEntry +
      caloriesEntry +
      "</tr>";
    $('#diary-food-items').prepend(newRow);
  }



  function populateFoodsTableIncludingCheckboxes() {
    foodList.forEach(function(element) {
      addFoodToDiaryFoodTable(element.name, element.calories, element.visibility);
    })
  }

  $('#add-breakfast').on("click", function(){

    var rows = $("input:checked").parents('tr');
    var name;
    var calories;

    $.each(rows, function(row) {
      name = $(this).children('.food-name').text();
      calories = $(this).children('.food-calories').text();

      addFoodToMealTable(name, calories, "breakfast");


    })
    // Get food from list
    // populate the meal table
    // save foods to meal in local storege
    // clear checkboxes
  })

  function addFoodToMealTable(name, calories, meal) {
    var name = "<td class='food-name'>" + name + "</td>"
    var calories = "<td class='food-calories'>" + calories + "</td>"
    var deleteButton = "<td class='food-delete'><button>-</button></td>"
    var newRow = "<tr class='food-row'>" +
      name +
      calories +
      deleteButton +
      "</tr>";
      $("#breakfast-items").prepend(newRow);
  }

});
