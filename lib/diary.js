$('document').ready(function() {

  populateFoodsTableIncludingCheckboxes();

  function addFoodToTable(name, calories, visibility) {
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
      addFoodToTable(element.name, element.calories, element.visibility);
    })
  }

});
