class CreateTasks < ActiveRecord::Migration
  def self.up
    create_table :tasks do |t|
      t.string :name, :default => 'Harvest wood'
      t.string :specs, :default => 'A1:B4'
      t.string :route, :default => ''
      t.string :worker, :default => 'anonymous'
      t.integer :game_id, :default => 0
      t.timestamps
    end
  end

  def self.down
    drop_table :tasks
  end
end
