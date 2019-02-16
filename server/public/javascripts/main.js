$(function(){
  $('#search').on('keyup', function(e){
    if(e.keyCode === 13) {
      var parameters = { search: $(this).val() };
        $.get( 'http://localhost:4000/searching', parameters, function(data) {
        $('#results').html(data);
      });
    };
  });
});
