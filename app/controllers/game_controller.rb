class GameController < ApplicationController

  def play
    @game = Game.find(params[:id])
    @tiles = @game.tiles
  end
  
  def update
    tasks = Task.find(:all,:conditions => {:game_id => params[:id], :state => 'complete'})
    tasks.each do |task|
      task.state = 'fetched'
      task.save
    end
    render :json => tasks
  end

end
