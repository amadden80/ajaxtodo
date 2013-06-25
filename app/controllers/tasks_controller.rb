class TasksController < ApplicationController

	def new
		@task = Task.new()
		@tasks = Task.order(session[:sort_by] || '"desc"')
		@priorities = Priority.all
	end

	def sort
		session[:sort_by] = params[:sort_by] || session[:sort_by] || '"desc"'
		session[:sort_by] = '"desc"' if (session[:sort_by] == 'desc')
		tasks = Task.order(session[:sort_by])
		tasks = tasks.map {|task| {name: task.name, desc: task.desc, duedate: task.duedate, color: task.priority.color} }
		render json: tasks
	end

	def create
		task = Task.new(params[:task])
		task.save!

		task['color'] = task.priority.color
		render json: task
	end

	def index
		@tasks = Task.all
	end
end
