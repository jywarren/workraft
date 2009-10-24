class AddStatus < ActiveRecord::Migration
  def self.up
    remove_column :tasks, :completed
    add_column :tasks, :state, :string, :default => 'incomplete'
  end

  def self.down
    add_column :tasks, :completed, :boolean, :default => false
    remove_column :tasks, :state
  end
end
