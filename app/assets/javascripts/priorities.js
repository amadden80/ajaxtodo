
$(function(){
  $('#submit').on('click', function(e){
    //prevents the default behavior of the form, i.e. submitting the form
    e.preventDefault();
    var settings = {
      priority: {
        name: $('#priority_name').val(),
        color: $('#priority_color').val(),
        urgency_index: $('#priority_urgency_index').val()
        }
      }
    
    $.post('/priorities', settings, function(data){
      var priority = $('<tr>').css('background-color', settings.priority.color)
      priority.append($('<td>').text(settings.priority.name))
      priority.append($('<td>').text(settings.priority.urgency_index))

      $('#priority-list').append(priority)

      $('#priority_name').val('')
      $('#priority_color').val('')
      $('#priority_urgency_index').val('')
    });
  });

})
