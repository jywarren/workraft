class TaskController < ApplicationController

  def create
    task = Task.new({
      :name => params[:name],
      :specs => params[:specs],
      :game_id => params[:game_id]
    })
    render :text => task.save
  end

  def list
    @tasks = Task.find :all
    render :text => @tasks
  end
  
  def submit
    task = Task.find_by_id(params[:id])
    
  end

end
