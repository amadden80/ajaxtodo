$(function(){
  function add_node(task){
    var row_list = $('tbody').children()
    for(var i=0; i<row_list.size(); i++){
      node = $(row_list[i]);
      node_desc = node.children('.desc').text();
      task_desc = task.children('.desc').text();
      if(task_desc < node_desc){
        task.insertBefore(node);
        return;
      }else{
        $('tbody').append(task)
      }
    }
  }

  $('#submit').on('click', function(e){
    //prevents the default behavior of the form, i.e. submitting the form
    e.preventDefault();
    
    var settings = {
      task: {
        name: $('#task_name').val(),
        desc: $('#task_desc').val(),
        duedate: $('#task_duedate').val(),
        priority_id: $('#task_priority_id').val()
        }
      }
    
    $.post('/tasks', settings, function(data){

      var task = $('<tr class="task">').css('background-color', data.color);
      task.append($('<td class="name">').text(data.name));
      task.append($('<td class="desc">').text(data.desc));
      task.append($('<td class="duedate">').text(data.duedate));
      // $('#task-list').append(task);
      add_node(task);

      $('#task_name').val('');
      $('#task_desc').val('');
      $('#task_duedate').val('');
    });
  });


  function stort_col(col_name){

    tasks = $('.task').sort(function(x,y){
      if ($($(x).children(col_name)).text() > $($(y).children(col_name)).text()){return -1;}
      else{return 1;}
    })
    for (var i = 0; i<tasks.length; i++){ $('#task-list').prepend($(tasks[i])); }
  }

  // $('#taskcol-name').on('click', function(e){
  //   e.preventDefault();
  //   stort_col('.name')
  // })

  // $('#taskcol-desc').on('click', function(e){
  //   e.preventDefault();
  //   stort_col('.desc')
  // })

  // $('#taskcol-duedate').on('click', function(e){
  //   e.preventDefault();
  //   stort_col('.duedate')
  // })


  function filled_task_table(tasks){
    $('#task-list').empty()
    for (var i = 0; i<tasks.length; i++){ 
      task = $('<tr class="task">').css('background-color', tasks[i].color);
      task.append($('<td class="name">').text(tasks[i].name));
      task.append($('<td class="desc">').text(tasks[i].desc));
      task.append($('<td class="duedate">').text(tasks[i].duedate));
      $('#task-list').append($(task));
    }
  }


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

})
