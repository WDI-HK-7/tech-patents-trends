class CreateCompanies < ActiveRecord::Migration
  def change
    create_table :companies do |t|
      t.string  :name        
      t.string  :country
      t.string  :industry
      t.integer :total_employee
      t.integer :engineers
      t.timestamps null: false
    end
  end
end
