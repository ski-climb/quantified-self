describe('index', function() {
  var $;

  before(function(){
    $ = document.getElementById("index-frame").contentWindow.$;
  })

  beforeEach(function() {
    $('tr.meal-row').remove();
    localStorage.setItem('foods','[{"name":"apple","calories":"50","visibility":"visible"},{"name":"banana","calories":"35","visibility":"visible"}]')
  });

  context('functionality', function() {

    it('displays a navigation bar with a date', function() {
      var date = $("#date-display").text();
      assert.equal(date, moment().format('MMMM Do, YYYY'));
    });

    it('displays a breakfast table', function() {
      var table = $('.meal-list.breakfast');
      expect(table).to.exist;
    });

    it('can add a selected food to breakfast', function(){
      var foodItem = $(".food-name:last").text();
      assert.equal(foodItem, "apple");

      $(".food-row.visible input:checkbox").prop("checked", true);
      $('#breakfast').click();
      var mealItem = $('#breakfast-items .meal-row .food-name:first').text();
      assert.equal(mealItem, "banana");
    });

    it('can delete a food from breakfast', function() {
      $(".food-row input:checkbox").prop("checked", true);
      $('#breakfast').click();
      var mealItem = $('#breakfast-items .meal-row .food-name:first')

      $('.food-delete').click();
      expect(mealItem.length).to.eql(0);
    });

    xit('calculates total calories for breakfast', function() {

    });

    xit('calculates remaining calories for breakfast', function() {
    });

    xit('displays remaining breakfast calories in green if zero or positive number', function() {
    });

    xit('displays remaining breakfast calories in red if less than zero', function() {
    });

    it('displays a totals table', function() {
      var table = $('.meal-totals');
      expect(table).to.exist;
    });

    xit('displays total calories in green if zero or positive number', function() {
    });

    xit('displays total calories in red if negative number', function() {
    });

    it('displays a table of created foods', function(){
      var table = $('#diary-food-items');
      expect(table).to.exist;
    });

    xit('can search by food name', function(){
    });

  });
});
