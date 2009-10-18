class CreateGames < ActiveRecord::Migration
  def self.up
    create_table :games do |t|
      t.string :map, :default => 'TTTTTTTTTG,GGFGTGTCXG,EGGGGGTXXG,GGTHXGTGGG,GGTXXGGGGG'
      t.timestamps
    end
  end

  def self.down
    drop_table :games
  end
end
