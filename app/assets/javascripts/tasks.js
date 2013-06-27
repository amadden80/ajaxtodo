
  function sort_client_table(current_sort){
    console.log(current_sort)
    $('tbody').append(_.sortBy($('tbody').children(), function(task){
      return parseFloat($(task).children('.' + current_sort).text().trim())
    }))
  }

  function filled_task_table(data){

    var current_sort = data.current_sort;

    var tasks = data.tasks;

    for (var i = 0; i<tasks.length; i++){ 

      var task = $('<tr class="task">').css('background-color', tasks[i].color);
      var options_html = "<a href='#', class='general foundicon-up-arrow up-button'></a>"
      options_html+="<a href='#', class='general foundicon-down-arrow down-button'></a>"
      task.append($('<td class="options">').html(options_html));

      task.append($('<td class="hidden id">').text(tasks[i].id));
      task.append($('<td class="name">').text(tasks[i].name));
      task.append($('<td class="desc">').text(tasks[i].desc));
      task.append($('<td class="duedate">').text(tasks[i].duedate));
      
      var options_html = "<a href='#', class='general foundicon-edit edit-button'></a>"
      options_html+="<a href='#', class='general foundicon-trash delete-button'></a>"
      task.append($('<td class="options">').html(options_html));
      task.append($('<td class="hidden urgency_index">').text(tasks[i].urgency_index));
      $('#task-list').append($(task));
      $('.hidden').hide()
    }
    sort_client_table(current_sort)
  }


  function add_node(input_data){
    data = {}
    data.tasks = [input_data]
    data.current_sort = input_data.current_sort
    filled_task_table(data)
    $('#task_name').val('');
    $('#task_desc').val('');
    $('#task_duedate').val('');
    $('#edit_id').val('');
    $('.hidden').hide()
    sort_client_table(data.current_sort);
  }





  // function add_node(task, current_sort){
  //   var current_sort = current_sort || 'name';
  //   $('tbody').append(task)
  //   sort_client_table(current_sort)
  // }



  function down_arrow(e){
    e.preventDefault();
    var row = $(this).parent().parent()
    var id = row.children('.id').text().trim()
    var settings = {id: id}

    $.ajax({type: "PUT", url: '/tasks/'+id+'/arrowdown', data:settings, success: function(data){
      $(row).fadeOut(500)
      add_node(data)
    }})
  }

  function up_arrow(e){
    e.preventDefault();
    var row = $(this).parent().parent()
    var id = row.children('.id').text().trim()
    var settings = {id: id}

    $.ajax({type: "PUT", url: '/tasks/'+id+'/arrowup', data:settings, success: function(data){
      $(row).fadeOut(500)
      add_node(data)
    }})
  }

  function edit_button(e){
    e.preventDefault();

    var row = $(this).parent().parent()
    var color = $(row).css('backgroundColor')
    var delay_time = 500

    $(row).fadeOut(delay_time)

    _.each(['name', 'desc', 'duedate', 'priority_id'], function(attr_name){
      $('#task_'+attr_name).val(row.children('.'+attr_name).text().trim());
      $('#task_'+attr_name).animate({backgroundColor: color}, delay_time)
      $('#task_'+attr_name).animate({backgroundColor: 'white'}, delay_time);
    })

    $('#edit_id').val(parseInt(row.children('.id').text().trim()))
    $('#task_priority_id option[value=' + row.children('.priority_id').text().trim() +']').prop('selected', true);

    $('#submit').hide()
    $('#submit-edit').show()

    $('.hidden').hide()
  }
  

function delete_button(e){
  e.preventDefault();
  var id = parseInt($(this).parent().parent().children('.id').text())

  del_success = function(data){
    if (data.success){
      id = data.task.id
      var row_list = $('tbody').children()
      for(var i=0; i<row_list.size(); i++){
        node = $(row_list[i]);
        node_attrib = parseInt(node.children('.id').text());
        if (node_attrib === id){
          $(node).fadeOut(1000);
        }
      }
    }
    $('.hidden').hide()
  }

  $.ajax({type: "DELETE", url: '/tasks/'+id, success: del_success});

  $('.hidden').hide()
}




$(function(){

  // $('.new_task').bind('ajax:success', function(event, data, status, xhr) {
  //   filled_task_table(recieved_data)
  // })


  $('#submit-edit').on('click', function(e){
    e.preventDefault();
    
    var settings = {
      task: {
        name: $('#task_name').val().trim(),
        desc: $('#task_desc').val().trim(),
        duedate: $('#task_duedate').val().trim(),
        priority_id: parseInt($('#task_priority_id').val().trim()),
        id: parseInt($('#edit_id').val().trim())
      } 
    } 

    var id= parseInt($('#edit_id').val())
    
    $.ajax({type: "PUT", url: '/tasks/'+id, data:settings, success: function(data){
        add_node(data);
        $('#submit-edit').hide();
        $('#submit').show();
        $('#edit_id').val('')
      }
    })
  })
  

  $('#submit').on('click', function(e){
    //prevents the default behavior of the form, i.e. submitting the form
    e.preventDefault();
    
    var settings = {
      task: {
        name: $('#task_name').val().trim(),
        desc: $('#task_desc').val().trim(),
        duedate: $('#task_duedate').val().trim(),
        priority_id: parseInt($('#task_priority_id').val().trim()),
      }  
    }
    
    $.post('/tasks', settings, function(data){
      filled_task_table(data)
    });
  });


  $('#taskcol-name').on('click', function(e){
    e.preventDefault();
    $.post('/sort', {sort_by:'name'}, function(tasks){
      $('tbody').empty()
      filled_task_table(tasks)
    })
  })


  $('#taskcol-desc').on('click', function(e){
    e.preventDefault();
    $.post('/sort', {sort_by:'desc'}, function(tasks){
      $('tbody').empty()
      filled_task_table(tasks)
    })
  })


  $('#taskcol-duedate').on('click', function(e){
    e.preventDefault();
    $.post('/sort', {sort_by:'duedate'}, function(tasks){
      $('tbody').empty()
      filled_task_table(tasks)
    })
  })


  $('tbody').on('click', '.down-button', down_arrow)
  $('tbody').on('click', '.up-button', up_arrow)
  $('tbody').on('click', '.edit-button', edit_button)
  $('tbody').on('click', '.delete-button', delete_button)

  $('.hidden').hide()
  $('#submit-edit').hide()

  $.post('/sort', {data:'nil  '}, function(tasks){
      $('tbody').empty()
      filled_task_table(tasks)
    })

  $('body').fadeIn(1000)
})
