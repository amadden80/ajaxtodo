class TasksController < ApplicationController

	def new
		session[:sort_by] = "urgency_index"
		@task = Task.new()
		
		session[:sort_by] ||= "urgency_index"

		if session[:sort_by] == "urgency_index"			
			@tasks = Task.all.sort_by{|task| [task.priority.urgency_index, task.name]}
		else
			@tasks = Task.order(session[:sort_by] || '"desc"')
		end

		@priorities = Priority.all

		@data = {}
		@data['tasks'] = @tasks
		@data['current_sort'] = session[:sort_by]

	end

	def sort
		session[:sort_by] = params[:sort_by] || session[:sort_by] || "urgency_index"
		sort_by = session[:sort_by]
		sort_by = '"desc"' if (session[:sort_by] == 'desc')

		if sort_by == "urgency_index"
			tasks = Task.all.sort_by{|task| [task.priority.urgency_index, task.name]}
		else
			tasks = Task.order(sort_by)
		end

		tasks = tasks.map {|task| {id: task.id, name: task.name, desc: task.desc, duedate: task.duedate, color: task.priority.color, urgency_index: task.priority.urgency_index} }

		data = {}
		data['current_sort'] = sort_by
		data['tasks'] = tasks
		render json: data
	end


	def create
		data = {}

		task = Task.new(params[:task])
		task.save!

		task['color'] = task.priority.color
		task['urgency_index'] = task.priority.urgency_index
		data['tasks'] = [task]
		data['current_sort'] = session[:sort_by]

		# @data =  data.to_json.html_safe
		# respond_to do |format|
		# 	format.js 
		# end
		# { render :layout => false }
	  render json: data

	end

	def update
		data = {}
		
		task = Task.find(params[:task][:id])  
		
    if task.update_attributes(params[:task])
    	data= task
    	data['success'] = true
    else
    	data=task
    	data['success'] = false
    end

    data['current_sort'] = session[:sort_by]
  	data['color'] = task.priority.color
		data['urgency_index'] = task.priority.urgency_index
		
		render json: data
	end

	def index
		@tasks = Task.all
	end

	def destroy
		data = {}

		task = Task.find(params[:id])
		if task.destroy()
			data = task
			data['success'] = true
		else
			data = task
			data['success'] = false
		end

		render json: data
	end


	def arrow(array_shift)
		data = {}
		id = params[:id]
		task = Task.find(id)
		priorities = Priority.order(:urgency_index)
		urgency_index_array = priorities.map{|p| p.urgency_index}
		urgency_index_array = urgency_index_array.uniq
		priority = task.priority.urgency_index
		index = urgency_index_array.index(priority)
		if (index+array_shift >=0)
			upped = urgency_index_array[index+array_shift]
		else
			upped = false
		end
		
		if upped
			priority = (priorities.select{|p| p.urgency_index == upped})[0]
			task.priority_id = priority.id
			task.save!
			data = task
			data['success'] = true
		else
			data['tasks'] = [task]
			data['success'] = false
		end

		data['color'] = task.priority.color
		data['urgency_index'] = task.priority.urgency_index
		data['current_sort'] = session[:sort_by]
		return data
	end

	def arrowup
		data = arrow(1)
		render json: data
	end

	def arrowdown
		data = arrow(-1)
		render json: data
	end


end
