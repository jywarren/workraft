class Task < ActiveRecord::Base
  
  def validate
    if self.state == 'complete'
      # check to be sure the route is sequential
      
      # make sure it doesn't hit any objects, comparing it to the game map record
      
      # if it hits something, truncate it just before it hits the thing
      # let the 'lord' disapprove or deny payment, but don't stand still
      
      
    end
  end

  def first
    self.specs.split(':').first
  end
  
  def last
    self.specs.split(':').last    
  end
  
end
