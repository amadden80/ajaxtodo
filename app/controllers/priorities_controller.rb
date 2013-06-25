class PrioritiesController < ApplicationController
  def new
    @priority = Priority.new()
    @priorities = Priority.all
  end

  def create
    priority = Priority.new(params[:priority])
    priority.save!
    render text: priority.name
  end

  def index
    @priorities = Priority.all
  end
end