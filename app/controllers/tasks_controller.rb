class TasksController < ApplicationController

	def new
		# session[:sort_by] = "urgency_index"
		@task = Task.new()
		
		session[:sort_by] = session[:sort_by] || "urgency_index"

		if session[:sort_by] == "urgency_index"			
			@tasks = Task.order(:name)
			@tasks = @tasks.sort{|x, y| x.priority.urgency_index <=> y.priority.urgency_index}
		else
			@tasks = Task.order(session[:sort_by] || '"desc"')
		end

		@priorities = Priority.all
	end


	def sort
		session[:sort_by] = params[:sort_by] || session[:sort_by] || "urgency_index"
		sort_by = '"desc"' if (session[:sort_by] == 'desc')

		if sort_by == "urgency_index"
			tasks = Task.order(:name)
		 	tasks = tasks.sort{|x, y| x.priority.urgency_index <=> y.priority.urgency_index}
		else
			tasks = Task.order(sort_by, :name)
		end

		tasks = tasks.map {|task| {name: task.name, desc: task.desc, duedate: task.duedate, color: task.priority.color} }

		data = {}
		data['current_sort'] = sort_by
		data['tasks'] = tasks
		render json: data
	end


	def create
		task = Task.new(params[:task])
		task.save!

		data = task
		data['current_sort'] = session[:sort_by]
		data['color'] = task.priority.color
		data['urgency_index'] = task.priority.urgency_index
		render json: data
	end

	def index
		@tasks = Task.all
	end
end
