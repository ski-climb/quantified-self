
$('document').ready(function() {

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
      var foodEntry = "<td class='food-name'>" + foodName + "</td>";
      var caloriesEntry = "<td class='food-calories'>" + foodCalories + "</td>";
      var deleteButton = "<td class='food-delete'><button>-</button></td>";
      var newRow = "<tr class='food-row'>" +
                    foodEntry +
                    caloriesEntry +
                    deleteButton +
                    "</tr>";
      $('tbody').prepend(newRow);

      $('#name-field input').val("");
      $('#calories-field input').val("");
    }
  })

  $('tbody').on("click", ".food-delete", function() {
    // console.log('clicked');
    $(this).parent().remove();
  })

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

  $(".food-name, .food-calories").on('keydown', function(event){
    if (event.keyCode == 13) {
      event.preventDefault();
      this.blur();
    }

  })

});
