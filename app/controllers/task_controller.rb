class TaskController < ApplicationController

  def create
    task = Task.new({
      :name => params[:name],
      :specs => params[:specs],
      :game_id => params[:game_id]
    })
    task.save
    render :text => task.id
  end

  def list
    @game = Game.find(params[:id])
    @tiles = @game.tiles
    @tasks = Task.find(:all, :conditions => {:state => 'incomplete', :game_id => params[:id]},:order => 'id DESC')
  end
  
  def view
    @task = Task.find(params[:id])
    @game = Game.find(@task.game_id)
    @tiles = @game.tiles
  end
  
  def submit
    task = Task.find_by_id(params[:id])
    puts 'route!!!'
    puts params[:route]
    task.route = params[:route]
    task.state = 'complete'
    task.save
    redirect_to '/task/list/'+task.game_id.to_s
  end

  def fetch
    render :text => 'C2,D2,E2,F2,F3,F4,G4'
  end

end
