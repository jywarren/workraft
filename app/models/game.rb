class Game < ActiveRecord::Base

  def tiles
    tiles = []
    self.map.split(',').each do |row|
      row.each_char do |char|
        tiles << {:image => 'castle.gif',:type => "C"}    if char == "C"
        tiles << {:image => 'farm.gif',:type => "F"}      if char == "F"
        tiles << {:image => 'farm-2.gif',:type => "E"}    if char == "E"
        tiles << {:image => 'gold-mine.gif',:type => "M"}  if char == "M"
        tiles << {:image => 'grass.gif',:type => "G"}     if char == "G"
        tiles << {:image => 'tower.gif',:type => "W"}     if char == "W"
        tiles << {:image => 'town-hall.gif',:type => "H"} if char == "H"
        tiles << {:image => 'trees.gif',:type => "T"}     if char == "T"
        tiles << {:image => 'blank',:type => "X"}         if char == "X"
      end
    end
    tiles
  end
  
  def width
    self.map.split(',')[0].length
  end

end
