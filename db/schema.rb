# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20091024153052) do

  create_table "games", :force => true do |t|
    t.string   "map",        :default => "TTTTTTTTTG,GGFGTGTCXG,EGGGGGTXXG,GGTHXGTGGG,GGTXXGGGGG"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "tasks", :force => true do |t|
    t.string   "name",       :default => "Harvest wood"
    t.string   "specs",      :default => "A1:B4"
    t.string   "route",      :default => ""
    t.string   "worker",     :default => "anonymous"
    t.integer  "game_id",    :default => 0
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "state",      :default => "incomplete"
  end

end
