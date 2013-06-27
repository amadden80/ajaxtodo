function bind_delete_button_action_to(link_element){
      link_element.on('click', function(e){
      e.preventDefault();
      var id = parseInt($(this).parent().parent().children('.id').text())

      success = function(data){
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

      $.ajax({type: "DELETE", url: '/tasks/'+id, success: success});
    })

    $('.hidden').hide()
    return link_element;
  }

    //Activates the event handler binding to the delete buttons in table
  function bind_edit_button_action_to(link_element){
    link_element.on('click', function(e){
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
      
      return link_element;
    })
  }

  function bind_uparrow_button_action_to(link_element){
    link_element.on('click', function(e){
      //prevents the default behavior of the form, i.e. submitting the form

      e.preventDefault();
      var row = $(this).parent().parent()
      var id = row.children('.id').text().trim()
      var settings = {
        id: id
      }

      $.ajax({type: "PUT", url: '/tasks/'+id+'/arrowup', data:settings, success: function(data){
          $(row).remove()
          success(data)
        }
      })
    });
  }

  function bind_downarrow_button_action_to(link_element){
    link_element.on('click', function(e){
    //prevents the default behavior of the form, i.e. submitting the form

      e.preventDefault();
      var row = $(this).parent().parent()
      var id = row.children('.id').text().trim()
      var settings = {
        id: id
      }

      $.ajax({type: "PUT", url: '/tasks/'+id+'/arrowdown', data:settings, success: function(data){
          $(row).remove()
          success(data)
        }
      })
    });
  }


  function filled_task_table(data){

    var current_sort = data.current_sort;
    var tasks = data.tasks;

    $('#task-list').empty();

    for (var i = 0; i<tasks.length; i++){ 
      task = $('<tr class="task">').css('background-color', tasks[i].color);
      task.append($('<td class="name">').text(tasks[i].name));
      task.append($('<td class="desc">').text(tasks[i].desc));
      task.append($('<td class="duedate">').text(tasks[i].duedate));
      
      var options_html = "<a href='#', class='general foundicon-edit edit-button'></a>"
      options_html+="<a href='#', class='general foundicon-trash delete-button'></a>"
      options_html+="<a href='#', class='general foundicon-website view-button'></a>"
      task.append($('<td class="options">').html(options_html));
      task.append($('<td class="hidden urgency_index">').text(tasks[i].urgency_index));
      $('#task-list').append($(task));
      $('.hidden').hide()
    }
  }

  success = function(data){
    var task = $('<tr class="task">').css('background-color', data.color);
    var options_html = "<a href='#', class='general foundicon-up-arrow up-button'></a>"
    options_html+="<a href='#', class='general foundicon-down-arrow down-button'></a>"
    task.append($('<td class="options">').html(options_html));

    task.append($('<td class="hidden id">').text(data.id));
    task.append($('<td class="name">').text(data.name));
    task.append($('<td class="desc">').text(data.desc));
    task.append($('<td class="duedate">').text(data.duedate));

    var options_html = "<a href='#', class='general foundicon-edit edit-button'></a>"
    options_html+="<a href='#', class='general foundicon-trash delete-button'></a>"
    task.append($('<td class="options">').html(options_html));
    task.append($('<td class="hidden urgency_index">').text(data.urgency_index));
    task.append($('<td class="hidden priority_id">').text(data.priority_id));

    bind_delete_button_action_to($(task).children('.delete-button'))
    bind_edit_button_action_to($(task).children('.edit-button'))
    bind_uparrow_button_action_to($(task).children('.up-button'))
    bind_downarrow_button_action_to($(task).children('.down-button'))

    add_node(task, data.current_sort);

    $('#task_name').val('');
    $('#task_desc').val('');
    $('#task_duedate').val('');
    $('#edit_id').val('');
    
    $('.hidden').hide()
  }


  function add_node(task, current_sort){
    var current_sort = current_sort || 'name';
    var row_list = $('tbody').children()
    for(var i=0; i<row_list.size(); i++){
      node = $(row_list[i]);
      node_attrib = node.children('.'+current_sort).text();
      task_attrib = task.children('.'+current_sort).text();

      if (current_sort === "urgency_index"){
        node_attrib = parseFloat(node_attrib);
        task_attrib = parseFloat(task_attrib);
        if (task_attrib === node_attrib){
          for(var n=i; n<row_list.size(); n++){
            node = $(row_list[n]);
            node_uig = parseFloat(node.children('.urgency_index').text());
            task_uig = parseFloat(task.children('.urgency_index').text());
            node_attrib = node.children('.name').text();
            task_attrib = task.children('.name').text();
            if (node_uig === task_uig){
              if(task_attrib < node_attrib){
                task.insertBefore(node);
                return;
              }
              else{
                $('tbody').append(task)
              }
            }
            else
            {
              task.insertBefore(node);
            }
          }
        }
      }

      if(task_attrib < node_attrib){
        task.insertBefore(node);
        return;
      }else{
        $('tbody').append(task)
      }
    }
  }




$(function(){

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
        success(data);
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
      success(data)
    });
  });


  $('#taskcol-name').on('click', function(e){
    e.preventDefault();
    $.post('/sort', {sort_by:'name'}, function(tasks){
      filled_task_table(tasks)
    })
  })


  $('#taskcol-desc').on('click', function(e){
    e.preventDefault();
    $.post('/sort', {sort_by:'desc'}, function(tasks){
      filled_task_table(tasks)
    })
  })


  $('#taskcol-duedate').on('click', function(e){
    e.preventDefault();
    $.post('/sort', {sort_by:'duedate'}, function(tasks){
      filled_task_table(tasks)
    })
  })


  bind_delete_button_action_to($('.delete-button'))
  bind_edit_button_action_to($('.edit-button'))
  bind_uparrow_button_action_to($('.up-button'))
  bind_downarrow_button_action_to($('.down-button'))
  
  $('.hidden').hide()
  $('#submit-edit').hide()
  $('body').fadeIn(1000)
})
