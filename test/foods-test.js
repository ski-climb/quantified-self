describe('Manage Foods', function() {
  var $;

  before(function(){
    $ = document.getElementById("foods-frame").contentWindow.$;
  })

  beforeEach(function() {
    $('#food-list tbody').html('');
    $('#create-form input').val('');
    $('.validation-error').html('');
    window.localStorage.clear();
  });

  afterEach(function() {
    window.localStorage.clear();
  });

  context('validations', function() {
    it('will tell me if I fail to enter a name', function() {
      $('#calories-field input').val('35');
      $('#add-food').click();
      var nameValidationContent = $("#name-field .validation-error").text();
      assert.equal(nameValidationContent, "Please enter a food name");
    });

    it('will tell me if I fail to enter calories', function() {
      $('#name-field input').val('Banana');
      $('#add-food').click();
      var caloriesValidationContent = $("#calories-field .validation-error").text();
      assert.equal(caloriesValidationContent, "Please enter a calorie amount");
    });

    it('will be nice to me if I do everything correctly', function() {
      $('#name-field input').val('Banana');
      $('#calories-field input').val('35');
      $('#add-food').click();

      var nameValidationContent = $("#name-field .validation-error").text();
      assert.equal(nameValidationContent, "");

      var caloriesValidationContent = $("#calories-field .validation-error").text();
      assert.equal(caloriesValidationContent, "");
    });
  });

  context('functionality', function() {
    it('can add a food to the foods table', function() {
      $('#name-field input').val('Banana');
      $('#calories-field input').val('35');
      $('#add-food').click();

      var nameContent = $(".food-name").text();
      var calorieContent = $(".food-calories").text();
      assert.equal(nameContent, "Banana");
      assert.equal(calorieContent, "35");
    });

    it('can delete a food from the foods table', function() {
      $('#name-field input').val('Banana');
      $('#calories-field input').val('35');
      $('#add-food').click();
      $('.food-delete').click();

      var nameContent = $(".food-name").text();
      var calorieContent = $(".food-calories").text();

      var deleted = $(".food-name").parents("tr").hasClass("hidden")
      assert.isTrue(deleted)
    });

    it('can filter foods by food name', function() {
      $('#name-field input').val('Banana');
      $('#calories-field input').val('35');
      $('#add-food').click();

      $('#name-field input').val('Apple');
      $('#calories-field input').val('50');
      $('#add-food').click();

      // Try triggering keypress along with value
      $('#food-filter input').val('app');

      var nameContent = $(".food-name").text();
      var calorieContent = $(".food-calories").text();

      assert.equal(nameContent, "Apple");
      assert.equal(calorieContent, "50");
    });
  });


});
