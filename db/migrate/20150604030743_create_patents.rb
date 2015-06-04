class CreatePatents < ActiveRecord::Migration
  def change
    create_table :patents do |t|
      t.string :company_full_name
      t.integer :patent_number
      t.integer :year
      t.timestamps null: false
    end
    add_reference :patents, :company, index: true, foreign_key: true
  end
end
