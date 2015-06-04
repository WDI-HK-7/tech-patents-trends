class CreateCompanies < ActiveRecord::Migration
  def change
    create_table :companies do |t|
      t.string  :name        
      t.string  :country
      t.string  :industry
      t.integer :employees_num
      t.integer :engineers_num
      t.timestamps null: false
    end
  end
end
