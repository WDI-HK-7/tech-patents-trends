class CreatePatents < ActiveRecord::Migration
  def change
    create_table :patents do |t|
      t.string :company_full_name
      t.integer :yr2014
      t.integer :yr2013
      t.integer :yr2012
      t.integer :yr2011
      t.integer :yr2010
      t.integer :yr2009
      t.integer :yr2008
      t.integer :yr2007
      t.integer :yr2006
      t.integer :yr2005
      t.integer :yr2004
      t.integer :yr2003
      t.integer :yr2002
      t.timestamps null: false
    end
    add_reference :patents, :company, index: true, foreign_key: true
  end
end
