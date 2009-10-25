class GameController < ApplicationController

  def play
    @game = Game.find(params[:id])
    @tiles = @game.tiles
  end

  def list
    @games = Game.find :all, :order => 'id DESC', :limit => 100
  end

  def new
    @game = Game.new
    @game.save

    redirect_to '/game/play/'+@game.id.to_s
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
